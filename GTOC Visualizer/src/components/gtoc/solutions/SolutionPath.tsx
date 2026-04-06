"use client";

import React, { useMemo, useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { Line, Html, Billboard } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { AU_KM, SECONDS_PER_DAY } from "@/components/gtoc/utils/constants";
import { Solution } from "./types";
import { usePlanetStore } from "@/components/gtoc/stores/planetStore";

export type HoverPayload = {
  solutionName: string;
  color: string;
  legIndex: number;
  fromBody?: number | null;
  toBody?: number | null;
  tofDays: number;
  missionDays: number;
  legDistAU: number;
  kind: "leg" | "ship";
  // Ship-specific live fields
  shipPosition?: [number, number, number];
  shipVelocity?: number; // km/s magnitude
  legProgress?: number;  // 0-1 fraction through current leg
};

type Props = {
  sol: Solution;
  currentJD: number;
  epochZeroJD: number;
  showShip?: boolean;
  onHover?: (data: HoverPayload, x: number, y: number) => void;
  onUnhover?: () => void;
};

function SolutionTooltip({
  data,
  position,
  pinned,
  onTogglePin,
  onMouseEnter,
  onMouseLeave,
  onSetCenter,
}: {
  data: HoverPayload;
  position: THREE.Vector3;
  pinned: boolean;
  onTogglePin: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onSetCenter?: () => void;
}) {
  const { planets } = usePlanetStore();

  const getName = (id?: number | null) => {
    if (id == null) return "?";
    const found = planets.find((p) => String(p.id) === String(id));
    return found?.name || `#${id}`;
  };

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  if (!visible && !pinned) return null;

  const isShip = data.kind === "ship";

  return (
    <Html position={position.clone().add(new THREE.Vector3(0, 0.09, 0))} style={{ pointerEvents: "none" }} zIndexRange={[100, 0]}>
      <div
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className={`pointer-events-auto relative rounded-md p-2 text-[10px] shadow-2xl backdrop-blur-md overflow-hidden transition-all duration-150 ${pinned ? "border-white/40 bg-black/90" : "border-white/10 bg-[#0a0a0c]/85"
          }`}
        style={{ borderWidth: "1px", minWidth: isShip ? "200px" : "190px", transform: "translate(-50%, -100%)", marginTop: "-10px" }}
      >
        <div className="absolute top-0 left-0 h-full w-[2px]" style={{ background: data.color }} />

        <div className="absolute top-1 right-1 flex items-center gap-1 z-50">
          {isShip && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSetCenter?.();
              }}
              className="p-1 rounded-sm text-white/20 hover:text-white hover:bg-white/10 transition-colors"
              title="Set as Center"
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="16" />
                <line x1="8" y1="12" x2="16" y2="12" />
              </svg>
            </button>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              onTogglePin();
            }}
            className={`p-1 rounded-sm transition-colors ${pinned ? "text-yellow-400 bg-white/10" : "text-white/20 hover:text-white hover:bg-white/10"
              }`}
          >
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill={pinned ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4a2 2 0 0 0-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58s1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41s-.23-1.06-.59-1.42z"></path>
              <circle cx="9" cy="9" r="2"></circle>
            </svg>
          </button>
        </div>

        <div className="flex items-center gap-2 mb-1.5 pb-1.5 border-b border-white/10 pl-2 pr-12">
          <span className="font-bold text-white uppercase tracking-tight truncate max-w-[100px]">{data.solutionName}</span>
          <span
            className={`px-1 py-[1px] rounded-[3px] text-[8px] font-mono font-bold ${isShip ? "bg-yellow-500/20 text-yellow-400" : "bg-blue-500/20 text-blue-400"
              }`}
          >
            {isShip ? "SHIP" : `L${data.legIndex}`}
          </span>
        </div>

        {isShip ? (
          /* ---- Ship-specific live info ---- */
          <>
            {data.fromBody != null && data.toBody != null && (
              <div className="flex items-center gap-1.5 mb-1.5 px-2 text-white/80 text-[9px]">
                <span className="text-gray-400 text-[7px] uppercase mr-0.5">Leg {data.legIndex}</span>
                <span className="font-semibold text-white truncate max-w-[50px]">{getName(data.fromBody)}</span>
                <span className="text-gray-500">→</span>
                <span className="font-semibold text-white truncate max-w-[50px]">{getName(data.toBody)}</span>
              </div>
            )}

            {/* Leg progress bar */}
            {data.legProgress != null && (
              <div className="px-2 mb-1.5">
                <div className="w-full h-[3px] rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-100"
                    style={{ width: `${Math.min(100, Math.max(0, data.legProgress * 100))}%`, background: data.color }}
                  />
                </div>
                <div className="text-[7px] text-gray-500 mt-0.5 text-right">{(data.legProgress * 100).toFixed(0)}%</div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-y-1.5 gap-x-2 pl-2 font-mono text-[9px]">
              <div>
                <div className="text-gray-400 uppercase text-[7px] mb-px">MET</div>
                <div className="text-white font-medium">
                  {Number.isFinite(data.missionDays) ? data.missionDays.toFixed(1) : "-"}
                  <span className="text-gray-400 text-[7px] ml-0.5">d</span>
                </div>
              </div>
              <div>
                <div className="text-gray-400 uppercase text-[7px] mb-px">Speed</div>
                <div className="text-white font-medium">
                  {data.shipVelocity != null && Number.isFinite(data.shipVelocity) ? data.shipVelocity.toFixed(1) : "-"}
                  <span className="text-gray-400 text-[7px] ml-0.5">km/s</span>
                </div>
              </div>
            </div>

            {data.shipPosition && (
              <div className="mt-1.5 pl-2">
                <div className="text-gray-400 uppercase text-[7px] mb-px">Position</div>
                <div className="text-white/70 font-mono text-[8px] leading-relaxed">
                  x={data.shipPosition[0].toFixed(3)}{" "}
                  y={data.shipPosition[1].toFixed(3)}{" "}
                  z={data.shipPosition[2].toFixed(3)}
                  <span className="text-gray-500 ml-1">AU</span>
                </div>
              </div>
            )}
          </>
        ) : (
          /* ---- Leg-specific info (unchanged) ---- */
          <>
            {data.fromBody != null && data.toBody != null && (
              <div className="flex items-center gap-1.5 mb-2 px-2 text-white/80 text-[9px]">
                <span className="font-semibold text-white truncate max-w-[60px]">{getName(data.fromBody)}</span>
                <span className="text-gray-500">→</span>
                <span className="font-semibold text-white truncate max-w-[60px]">{getName(data.toBody)}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-y-1.5 gap-x-2 pl-2 font-mono text-[9px]">
              <div>
                <div className="text-gray-400 uppercase text-[7px] mb-px">T-Flight</div>
                <div className="text-white font-medium">
                  {Number.isFinite(data.tofDays) ? data.tofDays.toFixed(1) : "-"}
                  <span className="text-gray-400 text-[7px] ml-0.5">d</span>
                </div>
              </div>
              <div>
                <div className="text-gray-400 uppercase text-[7px] mb-px">MET</div>
                <div className="text-white font-medium">
                  {Number.isFinite(data.missionDays) ? data.missionDays.toFixed(1) : "-"}
                  <span className="text-gray-400 text-[7px] ml-0.5">d</span>
                </div>
              </div>
            </div>

            <div className="mt-1.5 pl-2">
              <div className="text-gray-400 uppercase text-[7px] mb-px">Leg Dist</div>
              <div className="text-white font-medium">
                {Number.isFinite(data.legDistAU) ? data.legDistAU.toFixed(3) : "-"}
                <span className="text-gray-400 text-[7px] ml-1">AU</span>
              </div>
            </div>
          </>
        )}
      </div>
    </Html>
  );
}

export default function SolutionPath({ sol, currentJD, epochZeroJD, showShip, onHover, onUnhover }: Props) {
  const setCenterBody = usePlanetStore(s => s.setCenterBody);
  const setHoveredContext = usePlanetStore(s => s.setHoveredContext);

  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);
  const shipPosRef = useRef<THREE.Vector3>(new THREE.Vector3());

  const [hoveredLeg, setHoveredLeg] = useState<number | null>(null);
  const [hoverState, setHoverState] = useState<{ data: HoverPayload; pos: THREE.Vector3 } | null>(null);
  const [pinnedItems, setPinnedItems] = useState<Array<{ id: string; data: HoverPayload; pos?: THREE.Vector3 }>>([]);

  if (!sol?.samples?.length) return null;

  const baseColor = sol.color || "#66d9e8";

  const SCALE = useMemo(() => {
    const mags = sol.samples.map((s) => Math.hypot(...s.p)).filter(Number.isFinite).sort((a, b) => a - b);
    const medianR = mags[Math.floor(mags.length / 2)] || 1;
    return medianR > 1e3 ? 1 / AU_KM : 1;
  }, [sol.samples]);

  const pts = useMemo(() => sol.samples.map((s) => new THREE.Vector3(s.p[0], s.p[1], s.p[2]).multiplyScalar(SCALE)).filter((v) => Number.isFinite(v.x) && Number.isFinite(v.y) && Number.isFinite(v.z)), [sol.samples, SCALE]);

  if (pts.length < 2) return null;

  const elapsed = (currentJD - epochZeroJD) * SECONDS_PER_DAY;
  const times = useMemo(() => sol.samples.map((s) => s.t), [sol.samples]);
  const solutionStarted = elapsed >= times[0];

  const legs = useMemo(() => {
    const out: any[] = [];
    const scaled = sol.samples.map((s) => ({ t: s.t, body: s.bodyId ?? 0, v: new THREE.Vector3(s.p[0], s.p[1], s.p[2]).multiplyScalar(SCALE) }));
    let cur = { fromBody: scaled[0].body, toBody: scaled[0].body, t0: scaled[0].t, t1: scaled[0].t, pts: [scaled[0].v], dist: 0 };
    for (let i = 1; i < scaled.length; i++) {
      const s = scaled[i];
      const prev = scaled[i - 1];
      cur.pts.push(s.v);
      cur.dist += s.v.distanceTo(prev.v);
      cur.t1 = s.t;
      const nextBody = scaled[i + 1]?.body ?? s.body;
      if (nextBody !== s.body) {
        const toBody = scaled.slice(i + 1).map((p) => p.body).find((b) => b !== s.body) ?? s.body;
        cur.toBody = toBody;
        out.push(cur);
        cur = { fromBody: s.body, toBody, t0: s.t, t1: s.t, pts: [], dist: 0 };
      }
    }
    if (cur.pts.length) out.push(cur);
    return out;
  }, [sol.samples, SCALE]);

  const currentLegIndex = useMemo(() => {
    if (!legs.length) return null;
    const k = legs.findIndex((L) => elapsed >= L.t0 && elapsed <= L.t1);
    if (k >= 0) return k;
    if (elapsed < legs[0].t0) return 0;
    return legs.length - 1;
  }, [elapsed, legs]);

  // Ship position: useFrame mutates refs to avoid React re-renders each frame
  const shipGroupRef = useRef<THREE.Group>(null!);
  const rocketMeshRef = useRef<THREE.Mesh>(null!);

  const rocketTexture = useMemo(() => {
    const size = 128;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;

    const tex = new THREE.CanvasTexture(canvas);
    tex.premultiplyAlpha = true;
    tex.needsUpdate = true;

    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.clearRect(0, 0, size, size);

      // Draw original SVG
      ctx.drawImage(img, 0, 0, size, size);

      // Recolor everything that has alpha to white
      ctx.globalCompositeOperation = "source-in";
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, size, size);

      // Reset
      ctx.globalCompositeOperation = "source-over";

      tex.needsUpdate = true;
    };

    img.src = "/rocket.svg";
    return tex;
  }, []);

  // Compute ship position & orientation via useFrame (no React state changes)
  useFrame(({ camera }) => {
    if (pts.length < 2) return;
    const elapsedNow = (currentJD - epochZeroJD) * SECONDS_PER_DAY;
    const started = elapsedNow >= times[0];

    const pos = shipPosRef.current;
    pos.copy(pts[0]);

    let idx = 0;
    if (started) {
      // Binary search for current segment
      let lo = 0, hi = times.length - 2;
      while (lo < hi) {
        const mid = (lo + hi + 1) >>> 1;
        if (times[mid] <= elapsedNow) lo = mid;
        else hi = mid - 1;
      }
      idx = lo;
      const t0 = times[idx];
      const t1 = times[idx + 1];
      const a = t1 > t0 ? Math.min(1, Math.max(0, (elapsedNow - t0) / (t1 - t0))) : 0;
      pos.copy(pts[idx]).lerp(pts[idx + 1], a);
    }

    if (shipGroupRef.current) {
      shipGroupRef.current.position.copy(pos);
    }

    // Orient rocket in direction of travel, projected onto camera plane
    if (rocketMeshRef.current && started && pts.length > 1) {
      // Travel direction in world space
      const nextIdx = Math.min(idx + 1, pts.length - 1);
      const dir3D = new THREE.Vector3().subVectors(pts[nextIdx], pts[idx]);
      if (dir3D.lengthSq() < 1e-20 && nextIdx + 1 < pts.length) {
        dir3D.subVectors(pts[nextIdx + 1], pts[nextIdx]);
      }

      // Project direction onto camera view plane (screen space)
      const camRight = new THREE.Vector3();
      const camUp = new THREE.Vector3();
      camera.matrixWorld.extractBasis(camRight, camUp, new THREE.Vector3());

      const dx = dir3D.dot(camRight);
      const dy = dir3D.dot(camUp);

      const angle = Math.atan2(dy, dx);
      // The SVG rocket points to the top-right (≈45°), so subtract that base angle
      rocketMeshRef.current.rotation.z = angle - Math.PI / 4;
    }
  });

  // Visible trail: only the portion of the path up to the current time
  const visiblePts = useMemo(() => {
    if (pts.length < 2 || !solutionStarted) return [pts[0]];

    // Binary search for current segment
    let lo = 0, hi = times.length - 2;
    while (lo < hi) {
      const mid = (lo + hi + 1) >>> 1;
      if (times[mid] <= elapsed) lo = mid;
      else hi = mid - 1;
    }
    const idx = lo;
    const t0 = times[idx];
    const t1 = times[idx + 1];
    const a = t1 > t0 ? Math.min(1, Math.max(0, (elapsed - t0) / (t1 - t0))) : 0;

    const interpPt = pts[idx].clone().lerp(pts[idx + 1], a);
    return [...pts.slice(0, idx + 1), interpPt];
  }, [pts, times, elapsed, solutionStarted]);

  const visibleLegPaths = useMemo(() => {
    return legs.map((leg) => {
      if (elapsed < leg.t0 || leg.pts.length < 2) return null;
      if (elapsed >= leg.t1) return leg.pts;

      const legDuration = leg.t1 - leg.t0;
      const progress = legDuration > 0 ? Math.min(1, Math.max(0, (elapsed - leg.t0) / legDuration)) : 1;
      const totalSegments = leg.pts.length - 1;

      if (totalSegments <= 0) return null;

      const segmentFloat = progress * totalSegments;
      const segmentIndex = Math.min(totalSegments - 1, Math.floor(segmentFloat));
      const localProgress = Math.min(1, Math.max(0, segmentFloat - segmentIndex));
      const interpPt = leg.pts[segmentIndex].clone().lerp(leg.pts[segmentIndex + 1], localProgress);

      return [...leg.pts.slice(0, segmentIndex + 1), interpPt];
    });
  }, [elapsed, legs]);

  const clearHoverTimeout = () => { if (hoverTimeout.current) { clearTimeout(hoverTimeout.current); hoverTimeout.current = null; } };

  const handleHover = (payload: HoverPayload, pos: THREE.Vector3) => { clearHoverTimeout(); setHoverState({ data: payload, pos }); onHover?.(payload, 0, 0); };

  const handleUnhover = () => { clearHoverTimeout(); hoverTimeout.current = setTimeout(() => { setHoverState(null); onUnhover?.(); }, 600); };

  const getObjId = (p: HoverPayload) => (p.kind === "ship" ? `ship-${sol.id}` : `leg-${sol.id}-${p.legIndex}`);

  const togglePin = (item: { data: HoverPayload; pos?: THREE.Vector3 }) => {
    const id = getObjId(item.data);
    setPinnedItems((prev) => prev.some((x) => x.id === id) ? prev.filter((x) => x.id !== id) : [...prev, { id, ...item }]);
    if (hoverState && getObjId(hoverState.data) === id) setHoverState(null);
  };

  const shipPayload = useMemo((): HoverPayload => {
    const idx = currentLegIndex ?? 0;
    const leg = legs[idx];
    const pos = shipPosRef.current;

    // Compute velocity from solution samples (interpolated)
    let velocityKmS: number | undefined;
    if (solutionStarted && sol.samples.length > 1) {
      // Binary search for current time in samples
      let lo = 0, hi = sol.samples.length - 2;
      while (lo < hi) {
        const mid = (lo + hi + 1) >>> 1;
        if (sol.samples[mid].t <= elapsed) lo = mid;
        else hi = mid - 1;
      }
      const s0 = sol.samples[lo];
      const s1 = sol.samples[lo + 1];
      if (s0.v && s1.v) {
        const dt = s1.t - s0.t;
        const a = dt > 0 ? Math.min(1, Math.max(0, (elapsed - s0.t) / dt)) : 0;
        const vx = s0.v[0] + (s1.v[0] - s0.v[0]) * a;
        const vy = s0.v[1] + (s1.v[1] - s0.v[1]) * a;
        const vz = s0.v[2] + (s1.v[2] - s0.v[2]) * a;
        velocityKmS = Math.sqrt(vx * vx + vy * vy + vz * vz);
      } else if (s0.v) {
        velocityKmS = Math.sqrt(s0.v[0] ** 2 + s0.v[1] ** 2 + s0.v[2] ** 2);
      }
    }

    // Compute leg progress
    let legProgress: number | undefined;
    if (leg && elapsed >= leg.t0) {
      const legDuration = leg.t1 - leg.t0;
      legProgress = legDuration > 0 ? Math.min(1, Math.max(0, (elapsed - leg.t0) / legDuration)) : 1;
    }

    return {
      solutionName: sol.name,
      color: baseColor,
      legIndex: idx + 1,
      fromBody: leg?.fromBody,
      toBody: leg?.toBody,
      tofDays: leg ? (leg.t1 - leg.t0) / SECONDS_PER_DAY : 0,
      missionDays: (currentJD - epochZeroJD),
      legDistAU: leg?.dist ?? 0,
      kind: "ship",
      shipPosition: [pos.x, pos.y, pos.z],  // pos is already in AU (built from scaled pts[])
      shipVelocity: velocityKmS,
      legProgress,
    };
  }, [baseColor, currentJD, currentLegIndex, epochZeroJD, legs, sol.name, sol.samples, solutionStarted, elapsed, SCALE]);

  // For pinned ship items, check if a ship is pinned
  const isShipPinned = pinnedItems.some((item) => item.data.kind === "ship");

  return (
    <group>
      {hoverState && <SolutionTooltip data={hoverState.data} position={hoverState.pos} pinned={false} onTogglePin={() => togglePin(hoverState)} onSetCenter={() => setCenterBody(`ship-${sol.id}`)} onMouseEnter={clearHoverTimeout} onMouseLeave={handleUnhover} />}

      {pinnedItems.map((item) => (
        <SolutionTooltip
          key={item.id}
          data={item.data.kind === "ship" ? shipPayload : item.data}
          position={item.data.kind === "ship" ? shipPosRef.current : item.pos!}
          pinned
          onTogglePin={() => togglePin(item)}
          onSetCenter={() => setCenterBody(`ship-${sol.id}`)}
        />
      ))}

      {(sol.showPath ?? true) && visiblePts.length >= 2 && <Line points={visiblePts} color={baseColor} dashed={false} lineWidth={sol.lineWidth || 2.8} transparent opacity={0.95} toneMapped={false} />}

      {solutionStarted && showShip && (
        <group ref={shipGroupRef}>
          <mesh
            visible={false}
            onClick={(e) => { e.stopPropagation(); togglePin({ data: shipPayload }); }}
            onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = "pointer"; setHoveredContext({ id: `ship-${sol.id}`, name: sol.name, type: "ship" }); if (currentLegIndex != null) setHoveredLeg(currentLegIndex); handleHover(shipPayload, shipPosRef.current.clone()); }}
            onPointerOut={(e) => { e.stopPropagation(); document.body.style.cursor = "auto"; setHoveredLeg(null); handleUnhover(); setHoveredContext(null); }}
          >
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshBasicMaterial transparent opacity={0} />
          </mesh>

          <Billboard follow lockX={false} lockY={false} lockZ={false}>
            <mesh ref={rocketMeshRef} renderOrder={20}>
              <planeGeometry args={[0.09, 0.09]} />
              <meshBasicMaterial
                map={rocketTexture}
                color="#ffffff"
                transparent
                toneMapped={false}
                depthTest={false}
                depthWrite={false}
                side={THREE.DoubleSide}
              />
            </mesh>
          </Billboard>
        </group>
      )}

      {solutionStarted && legs.map((leg, i) => {
        const visibleLegPts = visibleLegPaths[i];
        if (!visibleLegPts || visibleLegPts.length < 2) return null;

        const isHovered = hoveredLeg === i;
        const tofDays = (leg.t1 - leg.t0) / SECONDS_PER_DAY;
        return (
          <group key={i}>
            {isHovered && <Line points={visibleLegPts} color={baseColor} lineWidth={4.2} transparent opacity={0.9} toneMapped={false} />}
            <Line points={visibleLegPts} color={baseColor} lineWidth={3.5} transparent opacity={0} toneMapped={false} onPointerOver={(e) => { e.stopPropagation(); setHoveredLeg(i); handleHover({ solutionName: sol.name, color: baseColor, legIndex: i + 1, fromBody: leg.fromBody, toBody: leg.toBody, tofDays, missionDays: currentJD - epochZeroJD, legDistAU: leg.dist, kind: "leg" }, e.point.clone()); }} onPointerOut={(e) => { e.stopPropagation(); setHoveredLeg(null); handleUnhover(); }} />
          </group>
        );
      })}
    </group>
  );
}
