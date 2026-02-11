import React, { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useMovieStore, Keyframe } from "../stores/useMovieStore";
import { OrbitControls } from "@react-three/drei";
import { usePlanetStore } from "../stores/planetStore";

interface Props {
    controlsRef: React.MutableRefObject<any>;
    jd: number;
    isPlaying?: boolean;
}

import { keplerToPositionAU } from "@/components/gtoc/KeplerSolver";
import { useSolutions } from "../solutions/useSolutions";

export function KeyframeCameraDriver({ controlsRef, jd, isPlaying = false }: Props) {
    const { camera } = useThree();
    const { keyframes, isMovieMode, isPresentationMode, isRecording, captureKeyframeTrigger, addKeyframe, updateKeyframe, setNearbyKeyframeId, nearbyKeyframeId } = useMovieStore();
    const { centerBodyId, setCenterBody, planets } = usePlanetStore();
    const { solutions } = useSolutions();
    const lastCaptureTrigger = useRef(0);

    // O(1) lookup maps (rebuilt only when data changes)
    const planetMap = React.useMemo(() => {
        const m = new Map<string, any>();
        for (const p of planets) {
            m.set(String(p.id), p);
            if (p.name) m.set(String(p.name), p);
        }
        return m;
    }, [planets]);

    const solutionMap = React.useMemo(() => {
        const m = new Map<string, any>();
        for (const s of solutions) m.set(s.id, s);
        return m;
    }, [solutions]);

    // Scratch vectors — reused across frames, never GC'd
    const _scratchPos = React.useRef(new THREE.Vector3()).current;
    const _p0 = React.useRef(new THREE.Vector3()).current;
    const _p1 = React.useRef(new THREE.Vector3()).current;

    // Helper: Get global position of a body (or Sun origin) at a given JD
    const getGlobalBodyPos = (id: string | null | undefined, tJD: number): THREE.Vector3 => {
        if (!id) return _scratchPos.set(0, 0, 0);

        // Check Planets (O(1) map lookup)
        const planet = planetMap.get(id);
        if (planet) {
            return keplerToPositionAU(planet, tJD, _scratchPos);
        }

        // Check Solutions (Ships)
        const sol = solutionMap.get(id);
        if (sol && sol.samples.length > 0) {
            const samples = sol.samples;
            if (tJD < samples[0].t) return _scratchPos.fromArray(samples[0].p);
            if (tJD > samples[samples.length - 1].t) return _scratchPos.fromArray(samples[samples.length - 1].p);

            // Binary search
            let low = 0, high = samples.length - 1;
            while (low <= high) {
                const mid = (low + high) >>> 1;
                if (samples[mid].t < tJD) low = mid + 1;
                else high = mid - 1;
            }
            const idx = Math.max(0, Math.min(samples.length - 1, low));
            const prev = samples[idx - 1] || samples[0];
            const next = samples[idx];

            if (prev === next) return _scratchPos.fromArray(prev.p);

            const factor = (tJD - prev.t) / (next.t - prev.t);
            _p0.fromArray(prev.p);
            _p1.fromArray(next.p);
            return _scratchPos.copy(_p0).lerp(_p1, factor);
        }

        return _scratchPos.set(0, 0, 0);
    };

    // Track nearby keyframe for UI feedback
    useFrame(() => {
        const NEARBY_THRESHOLD = 0.5; // days
        const nearby = keyframes.find(k => Math.abs(k.jd - jd) < NEARBY_THRESHOLD);
        const newId = nearby ? nearby.id : null;

        // Only update store if changed to avoid renders
        if (newId !== nearbyKeyframeId) {
            // Defer update to avoid "setState during render" conflicts
            setTimeout(() => setNearbyKeyframeId(newId), 0);
        }
    });

    // Capture Effect
    useFrame(() => {
        if (captureKeyframeTrigger > lastCaptureTrigger.current) {
            lastCaptureTrigger.current = captureKeyframeTrigger;
            console.log("Capturing Keyframe at JD", jd);

            if (controlsRef.current) {
                // Check if we are updating the nearby one (preferred) or creating new
                if (nearbyKeyframeId) {
                    console.log("Updating nearby keyframe", nearbyKeyframeId);
                    updateKeyframe(nearbyKeyframeId, {
                        position: camera.position.toArray() as [number, number, number],
                        target: controlsRef.current.target.toArray() as [number, number, number],
                        centerBodyId: centerBodyId // Save current center
                    });
                } else {
                    const k: Keyframe = {
                        id: crypto.randomUUID(),
                        jd,
                        position: camera.position.toArray() as [number, number, number],
                        target: controlsRef.current.target.toArray() as [number, number, number],
                        centerBodyId: centerBodyId // Save current center
                    };
                    addKeyframe(k);
                }
            }
        }
    });

    useFrame(() => {
        if (!(isPresentationMode || isRecording || (isMovieMode && isPlaying)) || keyframes.length < 2) return;

        // Find next keyframe
        const nextIdx = keyframes.findIndex(k => k.jd > jd);

        // If we are before first, snap to first
        if (nextIdx === 0) {
            const k = keyframes[0];
            // Force center
            if (centerBodyId !== k.centerBodyId) {
                setTimeout(() => setCenterBody(k.centerBodyId ?? null), 0);
            }
            lerpCamera(camera, controlsRef.current, k.position, k.target, 1);
            return;
        }

        // If after last, snap to last
        if (nextIdx === -1) {
            const k = keyframes[keyframes.length - 1];
            if (centerBodyId !== k.centerBodyId) {
                setTimeout(() => setCenterBody(k.centerBodyId ?? null), 0);
            }
            lerpCamera(camera, controlsRef.current, k.position, k.target, 1);
            return;
        }

        const prev = keyframes[nextIdx - 1];
        const next = keyframes[nextIdx];

        if (!prev || !next) return;

        // Force Center to Prev Keyframe's Center (Step Function)
        if (centerBodyId !== prev.centerBodyId) {
            setTimeout(() => setCenterBody(prev.centerBodyId ?? null), 0);
            // Note: This might cause a 1-frame jump if the renderer reacts slowly, but usually fine in React loop
        }

        // Interpolation Progress
        const total = next.jd - prev.jd;
        const current = jd - prev.jd;
        const progress = THREE.MathUtils.clamp(current / total, 0, 1);
        const t = THREE.MathUtils.smoothstep(progress, 0, 1);

        // 1. Calculate GLOBAL positions for Prev and Next Camera/Target
        const prevOffset = getGlobalBodyPos(prev.centerBodyId, prev.jd).clone();
        const nextOffset = getGlobalBodyPos(next.centerBodyId, next.jd).clone();

        const prevCamGlobal = new THREE.Vector3().fromArray(prev.position).add(prevOffset);
        const prevTgtGlobal = new THREE.Vector3().fromArray(prev.target).add(prevOffset);

        const nextCamGlobal = new THREE.Vector3().fromArray(next.position).add(nextOffset);
        const nextTgtGlobal = new THREE.Vector3().fromArray(next.target).add(nextOffset);

        // 2. Interpolate in GLOBAL space
        const currentCamGlobal = prevCamGlobal.lerp(nextCamGlobal, t);
        const currentTgtGlobal = prevTgtGlobal.lerp(nextTgtGlobal, t);

        // 3. Convert back to LOCAL frame (determined by prev.centerBodyId at current JD)
        const currentOffset = getGlobalBodyPos(prev.centerBodyId, jd).clone();

        currentCamGlobal.sub(currentOffset);
        currentTgtGlobal.sub(currentOffset);

        // Apply
        camera.position.copy(currentCamGlobal);
        if (controlsRef.current) {
            controlsRef.current.target.copy(currentTgtGlobal);
            controlsRef.current.update();
        }
    });

    return null;
}

function lerpCamera(camera: THREE.Camera, controls: any, posArr: [number, number, number], targetArr: [number, number, number], t: number) {
    const pos = new THREE.Vector3().fromArray(posArr);
    const target = new THREE.Vector3().fromArray(targetArr);

    // Direct set if t=1 (snap)
    camera.position.copy(pos);
    if (controls) {
        controls.target.copy(target);
        controls.update();
    }
}
