"use client";

import React, { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, GizmoHelper, GizmoViewport } from "@react-three/drei";
import * as THREE from "three";

import { Solutions3D } from "@/components/gtoc/solutions";
import HUD from "@/components/gtoc/sceneParts/HUD";
import InstancedBodies from "@/components/gtoc/sceneParts/InstancedBodies";
import MergedOrbitPaths from "@/components/gtoc/sceneParts/MergedOrbitPaths";
import { Sun, Axes, CameraRig } from "@/components/gtoc/sceneParts/SceneHelpers";
import { KeyframeCameraDriver } from "@/components/gtoc/sceneParts/KeyframeCameraDriver";
import { keplerToPositionAU } from "@/components/gtoc/KeplerSolver";
import {
  TYPE_COLORS,
  JD_EPOCH_0,
  DAYS_PER_YEAR,
} from "@/components/gtoc/utils/constants";
import { useBodiesFromGTOCCSV } from "@/components/gtoc/utils/dataLoader";
import { useSimClock } from "@/components/gtoc/utils/simClock";
import Ribbon from "@/components/gtoc/ui/Ribbon";
import { usePlanetStore } from "@/components/gtoc/stores/planetStore";
import { useSolutions } from "./solutions/useSolutions";
import { getShipPosition } from "./utils/shipUtils";
import { useMovieStore } from "@/components/gtoc/stores/useMovieStore";
import MovieOverlay from "@/components/gtoc/ui/MovieOverlay";
// MovieLogoHUD removed — logo is rendered via HTML overlay (MovieOverlay.tsx)
import { VideoRecorder } from "@/components/gtoc/utils/VideoRecorder";
import PresentationController from "@/components/gtoc/utils/PresentationController";
import PresentationOverlay from "@/components/gtoc/ui/PresentationOverlay";
import ExportOverlay from "@/components/gtoc/ui/ExportOverlay";
import ExportSettingsModal from "@/components/gtoc/ui/ExportSettingsModal";

interface ViewerProps {
  initialTime?: { jd: number; isPlaying: boolean; rate: number };
  onTimeUpdate?: (jd: number, isPlaying: boolean, rate: number) => void;
  bodies?: any[];
  [key: string]: any;
}

// -------------------- CAMERA ANIMATOR --------------------
function useCameraAnimator(controlsRef: React.MutableRefObject<any>) {
  const { camera } = useThree();
  const animRef = useRef<number | null>(null);

  const easeInOut = (t: number) =>
    t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

  const animate = useCallback(
    (toPos: THREE.Vector3, toTarget: THREE.Vector3, durMs: number) => {
      if (animRef.current) cancelAnimationFrame(animRef.current);

      const fromPos = camera.position.clone();
      const fromTarget =
        controlsRef.current?.target?.clone() ?? new THREE.Vector3(0, 0, 0);

      const start = performance.now();
      const dur = Math.max(80, durMs);

      const tick = () => {
        const now = performance.now();
        const t = Math.min(1, (now - start) / dur);
        const k = easeInOut(t);

        camera.position.lerpVectors(fromPos, toPos, k);

        if (controlsRef.current) {
          controlsRef.current.target.lerpVectors(fromTarget, toTarget, k);
          controlsRef.current.update();
        }

        if (t < 1) {
          animRef.current = requestAnimationFrame(tick);
        } else {
          animRef.current = null;
        }
      };

      animRef.current = requestAnimationFrame(tick);
    },
    [camera, controlsRef]
  );

  const moveTowardAxis = useCallback(
    (axis: "x" | "y" | "z" | "-x" | "-y" | "-z", mode: "nudge" | "snap") => {
      if (!controlsRef.current) return;

      const target = controlsRef.current.target.clone();
      const dist = camera.position.distanceTo(target);

      const dir = new THREE.Vector3(
        axis === "x" ? 1 : axis === "-x" ? -1 : 0,
        axis === "y" ? 1 : axis === "-y" ? -1 : 0,
        axis === "z" ? 1 : axis === "-z" ? -1 : 0
      );

      const fullPos = target.clone().add(dir.multiplyScalar(dist));
      const frac = mode === "nudge" ? 0.35 : 1.0;
      const toPos = camera.position.clone().lerp(fullPos, frac);

      animate(toPos, target, mode === "nudge" ? 240 : 650);
    },
    [animate, camera.position, controlsRef]
  );

  return { moveTowardAxis };
}

function GizmoCameraDriver({
  controlsRef,
  intentRef,
}: {
  controlsRef: React.MutableRefObject<any>;
  intentRef: React.MutableRefObject<{ axis: any; mode: "nudge" | "snap" } | null>;
}) {
  const { moveTowardAxis } = useCameraAnimator(controlsRef);

  useEffect(() => {
    let raf: number;
    const tick = () => {
      const intent = intentRef.current;
      if (intent) {
        intentRef.current = null;
        moveTowardAxis(intent.axis, intent.mode);
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [intentRef, moveTowardAxis]);

  return null;
}

function CenterTracker({
  controlsRef,
  centerBodyId,
  bodies,
  jd,
}: {
  controlsRef: React.MutableRefObject<any>;
  centerBodyId: string | null;
  bodies: any[];
  jd: number;
}) {
  const { camera } = useThree();
  const previousCenterRef = useRef<string | null>(null);

  const { solutions } = useSolutions();
  const { isPresentationMode, keyframes } = useMovieStore();

  const targetBody = useMemo(() => {
    if (!centerBodyId) return null;
    return bodies?.find((b) => String(b.id) === String(centerBodyId));
  }, [centerBodyId, bodies]);

  const targetShipSol = useMemo(() => {
    if (!centerBodyId) return null;
    if (String(centerBodyId).startsWith("ship-")) {
      const solId = String(centerBodyId).replace("ship-", "");
      return solutions.find((s) => s.id === solId);
    }
    return null;
  }, [centerBodyId, solutions]);

  useFrame(() => {
    if (!controlsRef.current) return;

    // improved: If KeyframeCameraDriver is active (Presentation + valid keyframes),
    // it handles the camera/target fully. CenterTracker should back off to avoid double-application.
    if (isPresentationMode && keyframes.length >= 2) return;

    let targetPos: THREE.Vector3 | null = null;

    if (targetBody) {
      targetPos = keplerToPositionAU(targetBody, jd);
    } else if (targetShipSol) {
      targetPos = getShipPosition(targetShipSol, jd, JD_EPOCH_0);
    }

    if (targetPos) {
      const prevTarget = controlsRef.current.target.clone();

      controlsRef.current.target.copy(targetPos);

      if (previousCenterRef.current === centerBodyId) {
        const delta = new THREE.Vector3().subVectors(targetPos, prevTarget);
        camera.position.add(delta);
      }
    } else if (centerBodyId === null && previousCenterRef.current !== null) {
      const prevTarget = controlsRef.current.target.clone();
      controlsRef.current.target.set(0, 0, 0);
      const delta = new THREE.Vector3().subVectors(
        new THREE.Vector3(0, 0, 0),
        prevTarget
      );
      camera.position.add(delta);
    }

    previousCenterRef.current = centerBodyId;
  });

  return null;
}

// -------------------- MAIN COMPONENT --------------------
export default function ViewerCanvas(props: ViewerProps = {}) {
  const usingExternalClock =
    "jd" in props && "setJD" in props && "isPlaying" in props && "setPlaying" in props;

  const { onSave, onExit, isSaving } = props as any;

  const { jd, setJD, isPlaying, setPlaying, rate, setRate } = usingExternalClock
    ? (props as any)
    : useSimClock({
      jd0: props.initialTime?.jd ?? JD_EPOCH_0,
      jdMin: JD_EPOCH_0,
      jdMax: JD_EPOCH_0 + 200 * DAYS_PER_YEAR,
      rate0: props.initialTime?.rate ?? 50,
      startPlaying: props.initialTime?.isPlaying ?? false,
    });

  const onTimeUpdateRef = useRef<ViewerProps["onTimeUpdate"]>(props.onTimeUpdate);
  useEffect(() => {
    onTimeUpdateRef.current = props.onTimeUpdate;
  }, [props.onTimeUpdate]);

  const latestTimeRef = useRef({ jd, isPlaying, rate });
  useEffect(() => {
    latestTimeRef.current = { jd, isPlaying, rate };
  }, [jd, isPlaying, rate]);

  useEffect(() => {
    if (!onTimeUpdateRef.current) return;
    const interval = window.setInterval(() => {
      const cb = onTimeUpdateRef.current;
      if (!cb) return;
      const t = latestTimeRef.current;
      cb(t.jd, t.isPlaying, t.rate);
    }, 250);
    return () => window.clearInterval(interval);
  }, []);

  const bodiesHook = useBodiesFromGTOCCSV("/data/df_extracted_full.csv", [
    "Planet",
    "Asteroid",
    "Comet",
  ]);
  const bodies = (props as any).bodies ?? bodiesHook.bodies ?? [];
  const hookError = bodiesHook.error;

  const { setPlanets, selectedBodies, planets: storePlanets, showOrbits, customColors } = usePlanetStore();

  useEffect(() => {
    if (bodies && bodies.length > 0) {
      // Sync store if lengths differ (e.g. data loaded)
      // We apply any persisted custom colors here
      if (storePlanets.length !== bodies.length) {

        const mapped = bodies
          .filter((b: any) => b && (b.name || b.id))
          .map((b: any) => {
            const idStr = String(b.id);
            // Use custom color if persisted, else default
            const savedColor = customColors[idStr];
            const defaultColor = b.color ?? TYPE_COLORS[b.type as "Planet" | "Asteroid" | "Comet"] ?? "#ffffff";

            return {
              ...b,
              id: b.id,
              name: b.name || String(b.id),
              type: b.type,
              color: savedColor ?? defaultColor,
            };
          });

        setPlanets(mapped);
      }
    }
  }, [bodies, setPlanets, storePlanets.length, storePlanets, customColors]);

  const colorMap = useMemo(() => {
    const map = new Map<string, string>();
    if (!storePlanets) return map;
    storePlanets.forEach((p) => {
      map.set(String(p.id), p.color);
    });
    return map;
  }, [storePlanets]);

  // Pre-filter + color-map bodies once for instanced rendering
  const validBodies = useMemo(() => {
    if (!bodies) return [];
    return bodies
      .filter((b: any) => b && (b.name || b.id) && b.a_AU && b.e !== undefined)
      .map((b: any) => ({
        ...b,
        color: colorMap.get(String(b.id)) ?? b.color ?? "#ffffff",
      }));
  }, [bodies, colorMap]);

  /* -------------------------------------------------------------------------- */
  /*                                MOVIE LOGIC                                 */
  /* -------------------------------------------------------------------------- */
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const recorderRef = useRef<VideoRecorder | null>(null);
  const glRef = useRef<THREE.WebGLRenderer | null>(null);

  // Subscribe to movie store values for layout + UI only
  const { isRecording, isMovieMode, aspectRatio, isPresentationMode, isExporting } = useMovieStore();

  // Convenience: hide UI when in presentation or exporting
  const hideUI = isPresentationMode || isExporting;

  // Open the settings modal OR cancel if already exporting
  const handleMakeMovie = useCallback(() => {
    const store = useMovieStore.getState();
    if (store.isRecording || store.isExporting) {
      // Cancel
      store.setRecording(false, 0);
      recorderRef.current?.stopRecordingAndDownload(`vectra_movie_${Date.now()}`).catch(console.error);
      store.finishExport();
      setPlaying(false);
      if (glRef.current && canvasRef.current) {
        glRef.current.setPixelRatio(window.devicePixelRatio);
        glRef.current.setSize(window.innerWidth, window.innerHeight);
      }
      window.dispatchEvent(new Event("resize"));
      return;
    }
    // Show settings modal
    store.setShowExportSettings(true);
  }, [setPlaying]);

  // Actual export — called from ExportSettingsModal
  const handleStartExport = useCallback(async (filename: string, exportRate: number) => {
    if (!canvasRef.current || !glRef.current) return;

    const store = useMovieStore.getState();
    store.startExport();

    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

    const TARGET_W = 3840;
    const TARGET_H = 2160;
    const gl = glRef.current;
    const canvas = canvasRef.current;

    // Force drawing buffer to 4K WITHOUT changing CSS layout.
    // Keeping the canvas DOM element at viewport size is critical:
    // drei Html overlays and MovieOverlay logos are positioned in
    // viewport-space, so the DOM layout must remain unchanged for
    // getBoundingClientRect() to return correct coords during compositing.
    const force4K = () => {
      canvas.width = TARGET_W;
      canvas.height = TARGET_H;
      gl.setPixelRatio(1);
      gl.setSize(TARGET_W, TARGET_H, false);
      gl.setViewport(0, 0, TARGET_W, TARGET_H);
    };

    force4K();
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    force4K();

    const recorder = new VideoRecorder(canvas);
    recorderRef.current = recorder;
    setPlaying(false);

    // Compositing canvas for overlaying DOM content onto WebGL
    const compCanvas = recorder.getCompositingCanvas();
    const compCtx = compCanvas.getContext("2d")!;

    // Pre-load logo images from store data
    const logoImages = new Map<string, HTMLImageElement>();
    const logos = useMovieStore.getState().logos;
    for (const logo of logos) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = logo.url;
      try {
        await new Promise<void>((resolve) => {
          img.onload = () => resolve();
          img.onerror = () => resolve();
        });
      } catch { /* ignore */ }
      if (img.complete && img.naturalWidth > 0) logoImages.set(logo.id, img);
    }

    const canvasClientW = canvas.clientWidth || window.innerWidth;
    const canvasClientH = canvas.clientHeight || window.innerHeight;
    const scaleX = TARGET_W / canvasClientW;
    const scaleY = TARGET_H / canvasClientH;

    // Recursive DOM renderer: walks the element tree and draws to Canvas 2D
    const renderElement = (el: HTMLElement, canvasRect: DOMRect) => {
      const cs = window.getComputedStyle(el);
      if (cs.display === "none" || cs.visibility === "hidden") return;
      if (parseFloat(cs.opacity) < 0.01) return;
      if (el.closest("[data-export-ignore]")) return;

      const rect = el.getBoundingClientRect();
      // Skip elements outside canvas
      if (rect.right < canvasRect.left || rect.left > canvasRect.right ||
        rect.bottom < canvasRect.top || rect.top > canvasRect.bottom) return;
      if (rect.width < 1 || rect.height < 1) return;

      const x = (rect.left - canvasRect.left) * scaleX;
      const y = (rect.top - canvasRect.top) * scaleY;
      const w = rect.width * scaleX;
      const h = rect.height * scaleY;

      compCtx.save();
      compCtx.globalAlpha = parseFloat(cs.opacity) || 1;

      // Draw background
      const bg = cs.backgroundColor;
      if (bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent") {
        compCtx.fillStyle = bg;
        const br = parseFloat(cs.borderRadius) * scaleX || 0;
        compCtx.beginPath();
        compCtx.roundRect(x, y, w, h, Math.min(br, w / 2, h / 2));
        compCtx.fill();
      }

      // Draw border
      const bw = parseFloat(cs.borderTopWidth);
      if (bw > 0 && cs.borderTopStyle !== "none") {
        const bc = cs.borderTopColor;
        if (bc && bc !== "rgba(0, 0, 0, 0)" && bc !== "transparent") {
          compCtx.strokeStyle = bc;
          compCtx.lineWidth = bw * scaleX;
          const br = parseFloat(cs.borderRadius) * scaleX || 0;
          compCtx.beginPath();
          compCtx.roundRect(x, y, w, h, Math.min(br, w / 2, h / 2));
          compCtx.stroke();
        }
      }

      // Draw text for leaf text nodes
      for (const child of el.childNodes) {
        if (child.nodeType === Node.TEXT_NODE) {
          const txt = child.textContent?.trim();
          if (!txt) continue;

          const range = document.createRange();
          range.selectNodeContents(child);
          const rects = range.getClientRects();
          if (rects.length === 0) continue;

          for (const tr of rects) {
            const tx = (tr.left + tr.width / 2 - canvasRect.left) * scaleX;
            const ty = (tr.top + tr.height / 2 - canvasRect.top) * scaleY;
            if (tx < 0 || tx > TARGET_W || ty < 0 || ty > TARGET_H) continue;

            const fontSize = parseFloat(cs.fontSize) * scaleX;
            compCtx.font = `${cs.fontWeight} ${Math.max(10, fontSize)}px ${cs.fontFamily || "sans-serif"}`;
            compCtx.fillStyle = cs.color || "#fff";
            compCtx.textAlign = "center";
            compCtx.textBaseline = "middle";
            compCtx.shadowColor = "rgba(0,0,0,0.7)";
            compCtx.shadowBlur = 2 * scaleX;

            compCtx.fillText(txt, tx, ty);
          }
        }
      }

      compCtx.restore();

      // Recurse into children (skip CANVAS, BUTTON, SVG, INPUT elements)
      for (const child of el.children) {
        if (child instanceof HTMLElement) {
          const tag = child.tagName;
          if (tag === "CANVAS" || tag === "SVG" || tag === "BUTTON" || tag === "INPUT" || tag === "STYLE") continue;
          renderElement(child, canvasRect);
        }
      }
    };

    // Composite: WebGL canvas + DOM overlays (direct Canvas 2D rendering)
    const compositeFrame = () => {
      compCtx.clearRect(0, 0, TARGET_W, TARGET_H);
      // 1. Draw the WebGL 4K rendering
      compCtx.drawImage(canvas, 0, 0, TARGET_W, TARGET_H);

      // 2. Render DOM overlays using recursive renderer
      // R3F DOM: sharedParent > [canvasWrapper, dreiOverlay1, dreiOverlay2, ...]
      // Inner container: sharedParent.parentElement > [sharedParent, MovieOverlay, ...]
      const r3fSharedParent = canvas.parentElement?.parentElement;
      const innerContainer = r3fSharedParent?.parentElement;
      const canvasRect = canvas.getBoundingClientRect();

      // Render drei Html overlays (siblings of canvas wrapper in R3F root)
      if (r3fSharedParent) {
        for (const child of r3fSharedParent.children) {
          if (!(child instanceof HTMLElement)) continue;
          if (child.contains(canvas)) continue; // skip canvas wrapper
          renderElement(child, canvasRect);
        }
      }

      // Render MovieOverlay content (sibling of Canvas component in inner container)
      if (innerContainer) {
        for (const child of innerContainer.children) {
          if (!(child instanceof HTMLElement)) continue;
          if (child.contains(canvas)) continue; // skip R3F root
          renderElement(child, canvasRect);
        }
      }

      // 3. Draw logos from store data (guaranteed correct positioning)
      // 3. Draw logos from store data (guaranteed correct positioning)
      const currentLogos = useMovieStore.getState().logos;
      const currentTextBoxes = useMovieStore.getState().textBoxes;

      currentLogos.forEach((logo) => {
        const img = logoImages.get(logo.id);
        if (!img || img.naturalWidth === 0) return;

        const logoSize = TARGET_H * 0.15 * logo.scale;
        const aspect = img.naturalWidth / img.naturalHeight;
        let drawW: number, drawH: number;
        if (aspect > 1) { drawW = logoSize; drawH = logoSize / aspect; }
        else { drawH = logoSize; drawW = logoSize * aspect; }

        const cx = logo.position.x * TARGET_W;
        const cy = (1 - logo.position.y) * TARGET_H;
        compCtx.drawImage(img, cx - drawW / 2, cy - drawH / 2, drawW, drawH);
      });

      // 4. Draw Text Boxes
      currentTextBoxes.forEach((tb) => {
        compCtx.save();
        // Base scale + specific font size multiplier
        // 2rem base approx 0.035 * H (tuned from previous)
        const fontSize = TARGET_H * 0.035 * tb.scale * (tb.fontSize || 1);
        const fontStyle = tb.isItalic ? "italic" : "normal";
        const fontWeight = tb.fontWeight || 700;
        const fontFamily = tb.fontFamily || "Inter, Outfit, sans-serif";

        compCtx.font = `${fontStyle} ${fontWeight} ${fontSize}px '${fontFamily}'`;
        compCtx.fillStyle = tb.color;
        compCtx.textBaseline = "middle";

        // Shadow matches CSS
        compCtx.shadowColor = "rgba(0,0,0,0.5)";
        compCtx.shadowBlur = 4 * scaleX;
        compCtx.shadowOffsetY = 2 * scaleY;

        const cx = tb.position.x * TARGET_W;
        const cy = (1 - tb.position.y) * TARGET_H;

        // Calculate max width in pixels if width is set
        const maxWidth = tb.width ? (tb.width / 100) * TARGET_W : Infinity;

        // Wrap text
        const rawLines = tb.text.split('\n');
        let lines: string[] = [];

        if (maxWidth === Infinity) {
          lines = rawLines;
        } else {
          // Word wrap logic
          rawLines.forEach(paragraph => {
            const words = paragraph.split(' ');
            let currentLine = words[0];

            for (let i = 1; i < words.length; i++) {
              const word = words[i];
              const width = compCtx.measureText(currentLine + " " + word).width;
              if (width < maxWidth) {
                currentLine += " " + word;
              } else {
                lines.push(currentLine);
                currentLine = word;
              }
            }
            lines.push(currentLine);
          });
        }

        const lineHeight = fontSize * 1.2;
        const totalH = lines.length * lineHeight;
        let startY = cy - (totalH / 2) + (lineHeight / 2);

        // Alignment logic to match DOM centering
        let drawX = cx;
        const textAlign = tb.textAlign || 'center';

        compCtx.textAlign = textAlign;

        lines.forEach((line, i) => {
          let x = drawX;
          // Adjust x based on alignment relative to box center
          // If text is centered, cx is center.
          // If left, cx is center of box. startX should be left edge of box?
          // Wait. In DOM:
          // "text-align: left" aligns text to left edge of the container.
          // Container is centered at cx. Width is maxWidth.
          // Left edge is cx - maxWidth/2.
          // Right edge is cx + maxWidth/2.

          if (maxWidth !== Infinity) {
            if (textAlign === 'left') x = cx - (maxWidth / 2);
            if (textAlign === 'right') x = cx + (maxWidth / 2);
          } else {
            // If auto width, we measured closest width previously. 
            // But generally "center" is safe default for auto width text boxes in our UI (DraggableTextBox has textAlign defaults).
            // If textAlign is left/right on auto-width box, it behaves like center relative to position point unless we calculate bounding box.
            // In our code: 
            // if (textAlign === 'left' || textAlign === 'right') { ... measure maxW ... }
            // Let's re-add that logic for auto-width case.

            if (textAlign === 'left' || textAlign === 'right') {
              let maxW = 0;
              lines.forEach(l => {
                const m = compCtx.measureText(l);
                if (m.width > maxW) maxW = m.width;
              });
              if (textAlign === 'left') x = cx - (maxW / 2);
              if (textAlign === 'right') x = cx + (maxW / 2);
            }
          }

          compCtx.fillText(line, x, startY + (i * lineHeight));
        });

        compCtx.restore();
      });

      // 4. Draw mission name from store data
      const store = useMovieStore.getState();
      if (store.missionName) {
        const fontSize = store.missionNameSize * scaleX;
        compCtx.save();
        compCtx.font = `700 ${fontSize}px 'Inter', 'Outfit', system-ui, sans-serif`;
        compCtx.fillStyle = "#ffffff";
        compCtx.textAlign = "right";
        compCtx.textBaseline = "bottom";
        compCtx.shadowColor = "rgba(139,92,246,0.5)";
        compCtx.shadowBlur = 20 * scaleX;
        compCtx.fillText(store.missionName, TARGET_W * 0.97, TARGET_H * 0.97);
        // Second shadow layer for depth
        compCtx.shadowColor = "rgba(0,0,0,0.8)";
        compCtx.shadowBlur = 4 * scaleX;
        compCtx.fillText(store.missionName, TARGET_W * 0.97, TARGET_H * 0.97);
        compCtx.restore();
      }
    };

    const keys = useMovieStore.getState().keyframes;
    // Use timeline range if available, else keyframes, else default
    const { timelineStartJD, timelineEndJD } = useMovieStore.getState();

    let startJD = JD_EPOCH_0;
    let endJD = JD_EPOCH_0 + 60;

    if (timelineStartJD !== null && timelineEndJD !== null) {
      startJD = timelineStartJD;
      endJD = timelineEndJD;
    } else if (keys.length >= 2) {
      startJD = keys[0].jd;
      endJD = keys[keys.length - 1].jd;
    }

    const FPS = 60;
    const dtPerFrame = (exportRate || 50) / FPS;
    const totalFrames = Math.max(1, Math.ceil((endJD - startJD) / dtPerFrame));

    // Fade settings (1.5 seconds)
    const FADE_DURATION_FRAMES = 1.5 * FPS;

    setJD(startJD);
    await new Promise((r) => setTimeout(r, 300));
    force4K();

    try {
      await recorder.startRecording(true, FPS);
      setPlaying(false);

      for (let i = 0; i <= totalFrames; i++) {
        if (!useMovieStore.getState().isRecording) break;

        const t = startJD + i * dtPerFrame;
        setJD(t);

        await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
        await new Promise((r) => requestAnimationFrame(r));

        compositeFrame();

        // Apply Fade In / Fade Out
        let opacity = 0;
        if (i < FADE_DURATION_FRAMES) {
          // Fade In (Black -> Transparent)
          // Opacity starts at 1 (Black), goes to 0 (Transparent)
          opacity = 1 - (i / FADE_DURATION_FRAMES);
        } else if (i > totalFrames - FADE_DURATION_FRAMES) {
          // Fade Out (Transparent -> Black)
          // Opacity starts at 0, goes to 1
          const remaining = totalFrames - i;
          opacity = 1 - (remaining / FADE_DURATION_FRAMES);
        }

        if (opacity > 0) {
          compCtx.save();
          compCtx.fillStyle = `rgba(0, 0, 0, ${Math.min(1, Math.max(0, opacity))})`;
          compCtx.fillRect(0, 0, TARGET_W, TARGET_H);
          compCtx.restore();
        }

        recorder.captureFrame(compCanvas);

        useMovieStore.getState().updateExportProgress(
          i / totalFrames,
          `Frame ${i + 1} / ${totalFrames + 1}`
        );
      }

      if (useMovieStore.getState().isRecording) {
        useMovieStore.getState().updateExportProgress(1, "Finalizing…");
        await recorder.stopRecordingAndDownload(filename || `vectra_4k_${Date.now()}`);
      }
    } catch (e) {
      console.error("Export failed", e);
      alert("Export Failed: " + (e instanceof Error ? e.message : String(e)));
    } finally {
      useMovieStore.getState().finishExport();
      setPlaying(false);
      if (glRef.current && canvasRef.current) {
        glRef.current.setPixelRatio(window.devicePixelRatio);
        glRef.current.setSize(window.innerWidth, window.innerHeight);
      }
      window.dispatchEvent(new Event("resize"));
    }
  }, [setJD, setPlaying]);

  /* -------------------------------------------------------------------------- */
  /*                               VIEW / GIZMO                                 */
  /* -------------------------------------------------------------------------- */
  const [gizmoHot, setGizmoHot] = useState(false);
  const controlsRef = useRef<any>(null);
  const gizmoIntentRef = useRef<{ axis: any; mode: "nudge" | "snap" } | null>(null);

  const axisColors = gizmoHot
    ? (["#ff3b30", "#34c759", "#0a84ff"] as const)
    : (["#6b6b6b", "#6b6b6b", "#6b6b6b"] as const);

  const labelColor = gizmoHot ? "#eaeaea" : "#9a9a9a";

  // Movie Mode "Letterboxing" & Aspect Ratio layout
  const [windowSize, setWindowSize] = useState({ w: 1920, h: 1080 });
  useEffect(() => {
    const onResize = () => setWindowSize({ w: window.innerWidth, h: window.innerHeight });
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const videoLayout = useMemo(() => {
    if (!isMovieMode) return null;

    // Available space to display the movie
    const isFull = isPresentationMode || isExporting;
    const margin = isFull
      ? { top: 0, bottom: 0, left: 0, right: 0 }
      : { top: 110, bottom: 150, left: 20, right: 20 };

    const availW = windowSize.w - margin.left - margin.right;
    const availH = windowSize.h - margin.top - margin.bottom;

    // In presentation mode, fill the entire viewport directly.
    if (isFull) {
      return { w: availW, h: availH };
    }

    // Preview Mode (Editor): fit the chosen aspect ratio into the
    // available editor space using a "contain" strategy — compute
    // actual pixel dimensions rather than using transform: scale(),
    // since CSS transforms don't change layout box size and cause
    // flexbox centering to mis-position the element.
    const targetRatio = aspectRatio || (16 / 9);
    const availRatio = availW / availH;

    let w: number, h: number;
    if (availRatio > targetRatio) {
      // Available space is wider than target → height-constrained
      h = availH;
      w = h * targetRatio;
    } else {
      // Available space is taller than target → width-constrained
      w = availW;
      h = w / targetRatio;
    }

    return { w, h };
  }, [isMovieMode, windowSize, aspectRatio, isPresentationMode, isExporting]);

  return (
    <div className="relative w-full h-screen bg-black flex flex-col overflow-hidden">
      {!hideUI && <Ribbon onSave={onSave} onExit={onExit} isSaving={isSaving} onMakeMovie={handleMakeMovie} />}

      <div className="flex-1 relative flex items-center justify-center overflow-hidden">
        <div
          className={`relative transition-all duration-500 ease-out shadow-2xl overflow-hidden ${isMovieMode ? "bg-black" : "w-full h-full"
            } ${(isMovieMode && !isPresentationMode && !isExporting) ? "border-2 border-yellow-400/40" : ""}`}
          style={
            isMovieMode && videoLayout
              ? {
                width: videoLayout.w,
                height: videoLayout.h,
                flex: "none",
              }
              : {}
          }
        >
          {/* Gizmo Overlay */}
          {!isMovieMode && !hideUI && (
            <div
              className="absolute bottom-[140px] left-[20px] w-[120px] h-[120px] z-[100] pointer-events-none"
              onMouseEnter={() => setGizmoHot(true)}
              onMouseLeave={() => setGizmoHot(false)}
            >
              <button
                type="button"
                className="absolute right-0 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full pointer-events-auto cursor-pointer"
                style={{ background: "transparent" }}
                onClick={() => (gizmoIntentRef.current = { axis: "x", mode: "nudge" })}
                onDoubleClick={() => (gizmoIntentRef.current = { axis: "x", mode: "snap" })}
                aria-label="X axis"
              />

              <button
                type="button"
                className="absolute left-1/2 top-0 -translate-x-1/2 w-14 h-14 rounded-full pointer-events-auto cursor-pointer"
                style={{ background: "transparent" }}
                onClick={() => (gizmoIntentRef.current = { axis: "y", mode: "nudge" })}
                onDoubleClick={() => (gizmoIntentRef.current = { axis: "y", mode: "snap" })}
                aria-label="Y axis"
              />

              <button
                type="button"
                className="absolute left-0 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full pointer-events-auto cursor-pointer"
                style={{ background: "transparent" }}
                onClick={() => (gizmoIntentRef.current = { axis: "z", mode: "nudge" })}
                onDoubleClick={() => (gizmoIntentRef.current = { axis: "z", mode: "snap" })}
                aria-label="Z axis"
              />
            </div>
          )}

          <Canvas
            dpr={isExporting ? 1 : (isRecording ? 1 : [1, 2])}
            camera={{ fov: 65, near: 0.001, far: 1e12, position: [0, 0, 2e6] }}
            onPointerMissed={() => {
              usePlanetStore.getState().setLockedBodyId(null);
            }}
            onCreated={({ gl }) => {
              canvasRef.current = gl.domElement;
              glRef.current = gl;
            }}
          >
            <PresentationController jd={jd} setJD={setJD} setPlaying={setPlaying} />
            <color attach="background" args={["#000"]} />
            <ambientLight intensity={0.6} />
            <pointLight position={[0, 0, 0]} intensity={2.0} color="#fff" />

            <CameraRig />

            <OrbitControls
              ref={controlsRef}
              makeDefault
              enableDamping
              dampingFactor={0.1}
              mouseButtons={{
                LEFT: THREE.MOUSE.ROTATE,
                MIDDLE: THREE.MOUSE.ROTATE,
                RIGHT: THREE.MOUSE.PAN,
              }}
            />

            <Stars radius={100} depth={50} count={1000} factor={2} fade speed={0.5} />

            <GizmoCameraDriver controlsRef={controlsRef} intentRef={gizmoIntentRef} />
            <KeyframeCameraDriver controlsRef={controlsRef} jd={jd} isPlaying={isPlaying} />

            <Sun />
            {!hideUI && <Axes size={1.0} />}

            <group
              onPointerDown={(e) => e.stopPropagation()}
              onPointerUp={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
            >
              {!hideUI && (
                <GizmoHelper alignment="bottom-left" margin={[80, 200]}>
                  <GizmoViewport axisColors={axisColors as any} labelColor={labelColor} />
                </GizmoHelper>
              )}
            </group>

            <CenterTracker
              controlsRef={controlsRef}
              centerBodyId={usePlanetStore((s) => s.centerBodyId)}
              bodies={bodies}
              jd={jd}
            />

            <MergedOrbitPaths
              bodies={validBodies}
              selectedBodies={selectedBodies}
              showOrbits={showOrbits}
              colorMap={colorMap}
            />
            <InstancedBodies bodies={validBodies} jd={jd} />

            <Solutions3D currentJD={jd} epochZeroJD={JD_EPOCH_0} showShip />
          </Canvas>

          {!hideUI && (
            <PortalHUD>
              <div className="pointer-events-auto fixed left-1/2 -translate-x-1/2 bottom-2 z-[999] w-full max-w-[120rem] px-3">
                <HUD
                  jd={jd}
                  setJD={setJD}
                  isPlaying={isPlaying}
                  setPlaying={setPlaying}
                  rate={rate}
                  setRate={setRate}
                  candidates={[]}
                  jdMin={JD_EPOCH_0}
                  jdMax={JD_EPOCH_0 + 200 * DAYS_PER_YEAR}
                  milestonesJD={(props as any).milestonesJD ?? [JD_EPOCH_0]}
                  milestonesISO={(props as any).milestonesISO ?? ["2000-01-01"]}
                />
              </div>
            </PortalHUD>
          )}

          <MovieOverlay />

          <PresentationOverlay />
          <ExportOverlay />
          <ExportSettingsModal onStartExport={handleStartExport} />
        </div>
      </div>

      {hookError && (
        <div className="absolute top-20 right-5 z-[50] text-xs pointer-events-none">
          <div className="px-3 py-2 rounded bg-red-600 text-white shadow">
            {hookError}
          </div>
        </div>
      )}
    </div>
  );
}

function PortalHUD({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return createPortal(children, document.body);
}
