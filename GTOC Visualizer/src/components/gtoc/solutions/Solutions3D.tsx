"use client";

import React from "react";
import { useSolutions } from "./useSolutions";
import SolutionPath, { HoverPayload } from "./SolutionPath";

export default function Solutions3D({
  currentJD,
  epochZeroJD,
  showShip,
  onHover,
  onUnhover,
}: {
  currentJD: number;
  epochZeroJD: number;
  showShip?: boolean;
  onHover?: (data: HoverPayload, x: number, y: number) => void;
  onUnhover?: () => void;
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
              onHover={onHover}
              onUnhover={onUnhover}
            />
          )
      )}
    </>
  );
}
