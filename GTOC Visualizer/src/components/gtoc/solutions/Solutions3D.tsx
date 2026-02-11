"use client";

import React from "react";
import { useSolutions } from "./useSolutions";
import SolutionPath, { HoverPayload } from "./SolutionPath";

export default function Solutions3D({
  currentJD,
  epochZeroJD,
  showShip,
}: {
  currentJD: number;
  epochZeroJD: number;
  showShip?: boolean;
}) {
  const { solutions, visible } = useSolutions();

  return (
    <>
      {solutions.map(
        (s) =>
          visible[s.id] && (
            <SolutionPath
              key={s.id}
              sol={s}
              currentJD={currentJD}
              epochZeroJD={epochZeroJD}
              showShip={showShip}
            />
          )
      )}
    </>
  );
}
