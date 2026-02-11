"use client";

import React, { useRef, useState } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import type { Body } from "@/components/gtoc/utils/dataLoader";

import { usePlanetStore } from "@/components/gtoc/stores/planetStore";
import { keplerToPositionAU } from "@/components/gtoc/KeplerSolver";
import OrbitPath from "@/components/gtoc/sceneParts/OrbitPath";

export default function BodyPoint({
  body,
  jd,
  showLabel = false,
}: {
  body: Body;
  jd: number;
  showLabel?: boolean;
}) {
  const meshRef = useRef<THREE.Group>(null!);
  const { camera } = useThree();

  const [hovered, setHovered] = useState(false);
  const [pinned, setPinned] = useState(false);

  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const selectedBodies = usePlanetStore((s) => s.selectedBodies);
  const setCenterBody = usePlanetStore((s) => s.setCenterBody);
  const setHoveredContext = usePlanetStore((s) => s.setHoveredContext);

  const idKey = String(body.id);
  const isSelected = selectedBodies.includes(idKey);

  const handlePointerEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setHovered(true);
    setHoveredContext({
      id: String(body.id),
      name: body.name || `Body ${body.id}`,
      type: "planet",
    });
  };

  const handlePointerLeave = () => {
    if (pinned) return;
    hoverTimeoutRef.current = setTimeout(() => {
      setHovered(false);
      setHoveredContext(null);
    }, 2000);
  };

  const displayName = body.name && body.name !== "None" ? body.name : `#${body.id}`;

  const e = Number.isFinite(body.e) ? body.e : 0;
  const a_AU = Number.isFinite(body.a_AU) ? Math.max(1e-6, body.a_AU) : 1;
  const Ω = Number.isFinite(body.Omega) ? body.Omega : 0;
  const i = Number.isFinite(body.inc) ? body.inc : 0;
  const ω = Number.isFinite(body.omega) ? body.omega : 0;
  const M0 = Number.isFinite(body.M0) ? body.M0 : 0;

  useFrame(() => {
    if (!meshRef.current) return;
    const pos = keplerToPositionAU(body, jd);
    meshRef.current.position.copy(pos);
  });

  const distance = camera.position.length();
  const opacity = Math.max(0.6, 1 - distance / 20);

  const bodyColor = body.color ?? "#ffffff";
  const isVisible = hovered || pinned;

  const pinAndCenter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setPinned((prev) => {
      const next = !prev;
      if (next) setCenterBody(body.id);
      return next;
    });
  };

  return (
    <>
      <OrbitPath body={body} visible={isVisible} segments={256} color={bodyColor} />

      <group
        ref={meshRef}
        onPointerOver={handlePointerEnter}
        onPointerOut={handlePointerLeave}
        onClick={(e) => {
          e.stopPropagation();
          pinAndCenter();
        }}
      >
        <mesh frustumCulled={false}>
          <sphereGeometry args={[0.015, 16, 16]} />
          <meshStandardMaterial
            color={bodyColor}
            emissive={isSelected ? "#ffd500" : hovered ? bodyColor : "#000"}
            emissiveIntensity={isSelected ? 0.7 : hovered ? 0.4 : 0}
          />
        </mesh>

        {((showLabel && body.type === "Planet") || isSelected) && !isVisible ? (
          <Html center position={[0, 0.07, 0]} style={{ pointerEvents: "none" }}>
            <div
              className="rounded-md font-semibold select-none"
              style={{
                padding: "3px 6px",
                fontSize: isSelected ? "18px" : "11px",
                color: isSelected ? bodyColor : "#eee",
                background: isSelected ? "rgba(0,0,0,0.45)" : "rgba(0,0,0,0.25)",
                border: "1px solid rgba(255,255,255,0.1)",
                textShadow: `0 0 10px ${bodyColor}88`,
                backdropFilter: "blur(6px)",
                opacity,
              }}
            >
              {displayName}
            </div>
          </Html>
        ) : null}

        {isVisible && (
          <Html position={[0, 0.025, 0]} style={{ pointerEvents: "none" }}>
            <div
              onMouseEnter={handlePointerEnter}
              onMouseLeave={handlePointerLeave}
              className="pointer-events-auto relative p-2 rounded-lg text-[11px] leading-tight text-white backdrop-blur-md bg-black/80 border border-white/20 shadow-lg whitespace-nowrap select-none group"
              style={{
                minWidth: "120px",
                transform: "translate(-50%, -100%)",
                marginTop: "-10px",
              }}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  pinAndCenter();
                }}
                className={`absolute top-1 right-1 p-1 rounded-md transition-colors ${pinned ? "bg-white/20 text-white" : "text-white/40 hover:text-white hover:bg-white/10"
                  }`}
                title={pinned ? "Unpin" : "Pin"}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill={pinned ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4a2 2 0 0 0-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58s1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41s-.23-1.06-.59-1.42z"></path>
                  <circle cx="9" cy="9" r="2"></circle>
                </svg>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCenterBody(body.id);
                }}
                className="absolute top-1 right-6 p-1 rounded-md text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                title="Set as Center"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="16" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                </svg>
              </button>

              <div className="font-semibold text-[#ffd500] pr-6">{displayName}</div>
              <div className="text-gray-300">{body.type}</div>

              <div className="mt-1 text-[10px] text-gray-400">
                a={a_AU.toFixed(3)} AU
                <br />
                e={e.toFixed(3)}
                <br />
                i={((i * 180) / Math.PI).toFixed(2)}°
                <br />
                Ω={((Ω * 180) / Math.PI).toFixed(2)}°
                <br />
                ω={((ω * 180) / Math.PI).toFixed(2)}°
                <br />
                M₀={((M0 * 180) / Math.PI).toFixed(2)}°
              </div>
            </div>
          </Html>
        )}
      </group>
    </>
  );
}
