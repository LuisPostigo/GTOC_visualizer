"use client";
import React from "react";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import { epochSecondsFromJD } from "@/components/gtoc/utils/simClock";
import { JD_EPOCH_0 } from "@/components/gtoc/utils/constants";

export default function ShipMarker({
  positionAU,
  currentJD,
  color = "#00e5ff",
}: {
  positionAU: [number, number, number];
  currentJD: number;
  color?: string;
}) {
  const [hover, setHover] = React.useState(false);
  const pos = new THREE.Vector3(...positionAU);

  const tSec = epochSecondsFromJD(currentJD);
  const tDays = (tSec / 86400).toFixed(3);
  const tYears = (tSec / (86400 * 365.25)).toFixed(3);

  return (
    <group position={pos.toArray() as [number, number, number]}>
      <mesh onPointerOver={() => setHover(true)} onPointerOut={() => setHover(false)}>
        <sphereGeometry args={[0.02, 16, 16]} />
        <meshStandardMaterial color={color} emissive={hover ? color : "#000"} emissiveIntensity={0.5} />
      </mesh>

      {hover && (
        <Html center position={[0, 0.08, 0]} style={{ pointerEvents: "none" }}>
          <div
            className="rounded-md px-2 py-1 text-[11px] leading-tight text-white"
            style={{ background: "rgba(0,0,0,0.65)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(6px)" }}
          >
            <div className="font-semibold" style={{ color }}>{`Spacecraft`}</div>
            <div>epoch: <b>{tSec.toLocaleString()}</b> s</div>
            <div>= {tDays} d ({tYears} yr)</div>
            <div>JD: {currentJD.toFixed(5)} (t₀ JD: {JD_EPOCH_0.toFixed(5)})</div>
          </div>
        </Html>
      )}
    </group>
  );
}
