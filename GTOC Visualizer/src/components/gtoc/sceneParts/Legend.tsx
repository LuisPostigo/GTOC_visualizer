"use client";

import { TYPE_COLORS, SYSTEM_NAME } from "@/components/gtoc/utils/constants";

export function Legend() {
  const items: Array<{ label: "Planet" | "Asteroid" | "Comet"; color: string }> = [
    { label: "Planet", color: TYPE_COLORS.Planet },
    { label: "Asteroid", color: TYPE_COLORS.Asteroid },
    { label: "Comet", color: TYPE_COLORS.Comet },
  ];

  return (
    <div className="absolute bottom-4 right-4 z-40">
      <div className="backdrop-blur-xl bg-black/40 border border-white/10 rounded-2xl shadow-lg px-4 py-3 text-[11px] text-white/90">
        <div className="flex items-center justify-between gap-4 mb-2">
          <h3 className="text-[12px] font-semibold tracking-wide text-white/80">
            {SYSTEM_NAME} — Object Types
          </h3>
        </div>
        <div className="flex items-center gap-4">
          {items.map((it) => (
            <div key={it.label} className="flex items-center gap-2">
              <span
                className="inline-block w-3 h-3 rounded-full border border-white/20"
                style={{ backgroundColor: it.color }}
              />
              <span className="opacity-80">{it.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
