"use client";

import { Html } from "@react-three/drei";

/**
 * Displays a clickable label anchored to a 3D object in the scene.
 * Uses drei's <Html> to project a DOM element into 3D space.
 */
export default function PlanetLabel({
  text,
  onFocus,
}: {
  text: string;
  onFocus?: () => void;
}) {
  return (
    <Html center distanceFactor={10} transform occlude>
      <div className="pointer-events-auto">
        <button
          onClick={onFocus}
          className="px-2 py-1 rounded-md bg-black/70 text-white text-xs border border-white/15"
        >
          {text}
        </button>
      </div>
    </Html>
  );
}
