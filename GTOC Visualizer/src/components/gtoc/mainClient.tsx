// src/components/gtoc/mainClient.tsx
"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Legend } from "@/components/gtoc/sceneParts/Legend";

/** Dynamically imports the main 3D viewer canvas (client-only, no SSR). */
const ViewerCanvas = dynamic(() => import("./viewerCanvas"), { ssr: false });

/** Renders the main client view containing the 3D viewer and legend overlay. */
export default function MainClient() {
  return (
    <div className="relative w-full h-screen bg-black">
      {/* The viewer manages data loading, simulation clock, and HUD. */}
      <ViewerCanvas />
      <Legend />
    </div>
  );
}
