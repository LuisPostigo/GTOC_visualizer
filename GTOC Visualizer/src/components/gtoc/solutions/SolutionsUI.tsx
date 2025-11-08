"use client";

import React, { useState, useRef, useEffect } from "react";
import { HexColorPicker } from "react-colorful";
import { useSolutions } from "./useSolutions";
import type { Solution } from "./types";

/* ---------- Floating color picker portal ---------- */
function ColorPickerPortal({
  anchorRef,
  color,
  onChange,
  onClose,
}: {
  anchorRef: React.RefObject<HTMLElement>;
  color: string;
  onChange: (c: string) => void;
  onClose: () => void;
}) {
  const pickerRef = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [tempColor, setTempColor] = useState(color);

  // 🧭 Smart positioning (prevent offscreen)
  useEffect(() => {
    const el = anchorRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pickerWidth = 200;
    const pickerHeight = 190;
    let x = rect.right + 10;
    let y = rect.top;
    if (x + pickerWidth > window.innerWidth) x = rect.left - pickerWidth - 10;
    if (y + pickerHeight > window.innerHeight)
      y = window.innerHeight - pickerHeight - 10;
    setPos({ x, y });
  }, [anchorRef]);

  // 🖱 Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        !anchorRef.current?.contains(target) &&
        !pickerRef.current?.contains(target)
      ) {
        onClose();
      }
    };
    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, [anchorRef, onClose]);

  return (
    <div
      ref={pickerRef}
      className="fixed z-[9999] p-3 rounded-xl bg-black/90 border border-white/10 shadow-2xl backdrop-blur-sm flex flex-col items-center space-y-2"
      style={{ left: pos.x, top: pos.y }}
    >
      <HexColorPicker color={tempColor} onChange={setTempColor} />
      <div className="flex gap-2 mt-2">
        {/* ✅ Save button — commits and closes after small delay */}
        <button
          onClick={() => {
            onChange(tempColor);
            setTimeout(() => onClose(), 50); // ensures store updates before unmount
          }}
          className="px-3 py-1 rounded bg-green-500/80 hover:bg-green-400 text-white text-xs font-semibold shadow"
        >
          Save
        </button>

        {/* ❌ Cancel button */}
        <button
          onClick={onClose}
          className="px-3 py-1 rounded bg-red-500/60 hover:bg-red-400 text-white text-xs font-semibold shadow"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

/* ---------- Main Solutions UI ---------- */
export default function SolutionsUI() {
  const {
    solutions,
    visible,
    importSolution,
    toggle,
    deleteSolution,
    recolorSolution,
  } = useSolutions() as any;

  const [openPicker, setOpenPicker] = useState<string | null>(null);
  const btnRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  return (
    <div className="absolute top-3 right-3 z-[70] pointer-events-auto bg-black/70 border border-white/10 rounded-xl p-3 w-80 text-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-sm">Solutions</h3>
        <label className="text-xs border border-white/20 rounded px-2 py-1 cursor-pointer hover:bg-white/10">
          Import
          <input
            type="file"
            accept=".txt"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) importSolution(f);
              e.target.value = "";
            }}
          />
        </label>
      </div>

      {/* List */}
      <div className="space-y-1 max-h-[60vh] overflow-y-auto pr-1">
        {solutions.map((s: Solution) => (
          <div
            key={s.id}
            className="flex items-center justify-between border border-white/15 rounded px-2 py-1 text-xs hover:bg-white/5 transition-colors"
          >
            <span className="truncate flex-1">{s.name}</span>

            {/* 🎨 Color button */}
            <button
              ref={(el) => {
                btnRefs.current[s.id] = el;
              }}
              onClick={() =>
                setOpenPicker(openPicker === s.id ? null : s.id)
              }
              className="w-4 h-4 rounded-full border border-white/30 mx-1"
              style={{ backgroundColor: s.color }}
              title="Change color"
            />

            {/* 👁️ Visibility toggle */}
            <button
              onClick={() => toggle(s.id)}
              className={`px-1 rounded border ${
                visible[s.id]
                  ? "border-white/20 hover:bg-white/10"
                  : "border-white/10 text-white/50 hover:bg-white/5"
              }`}
            >
              {visible[s.id] ? "👁" : "🚫"}
            </button>

            {/* 🗑 Delete */}
            <button
              onClick={() => deleteSolution(s.id)}
              className="px-1 rounded border border-red-400/40 text-red-300 hover:bg-red-400/20"
            >
              ✕
            </button>

            {/* 🎨 Floating color picker */}
            {openPicker === s.id && (
              <ColorPickerPortal
                anchorRef={{ current: btnRefs.current[s.id] as HTMLElement }}
                color={s.color}
                onChange={(c) => recolorSolution?.(s.id, c)}
                onClose={() => setOpenPicker(null)}
              />
            )}
          </div>
        ))}

        {solutions.length === 0 && (
          <div className="text-white/50 text-xs">No solutions loaded.</div>
        )}
      </div>
    </div>
  );
}
