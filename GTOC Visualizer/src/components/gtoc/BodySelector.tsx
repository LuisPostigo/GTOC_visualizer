"use client";

import React, { useState, useMemo } from "react";
import { usePlanetStore } from "./stores/planetStore";

export default function BodySelector() {
  const { planets = [], selectedBodies = [], togglePlanet, setPlanets } = usePlanetStore();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  // === helper to clear all selections ===
  const clearAll = () => {
    usePlanetStore.setState({ selectedBodies: [] });
  };

  const isNumericQuery = /^\d+$/.test(query.trim());
  const hasQuery = query.trim().length > 0;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return planets.filter((b) => {
      const name = (b.name || "").toLowerCase();
      const type = (b.type || "").toLowerCase();
      const hasValidName = name && name !== "none" && name !== "";
      if (!hasQuery) return type === "planet" && hasValidName;
      if (!isNumericQuery) return type === "planet" && hasValidName && name.includes(q);
      return String(b.id ?? "").toLowerCase().includes(q);
    });
  }, [planets, query, isNumericQuery, hasQuery]);

  return (
    <div className="fixed top-5 left-5 z-[9999] text-white font-sans pointer-events-auto select-none flex flex-col space-y-2">
      {/* === Menu + Clear buttons === */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setOpen(!open)}
          className={`flex items-center justify-between w-[160px]
                      px-3 py-2 rounded-lg backdrop-blur-md transition-all duration-300
                      border border-white/10 bg-white/5 hover:bg-white/10
                      shadow-[0_0_10px_rgba(255,255,255,0.08)]
                      ${open ? "border-gray-400/30" : "border-gray-700/40"}`}
        >
          <span className="text-[12px] tracking-widest font-semibold text-white/80">
            {open ? "CLOSE" : "BODIES"}
          </span>
          <span
            className={`transition-transform duration-300 text-[12px] text-gray-400 ${
              open ? "rotate-180" : "rotate-0"
            }`}
          >
            ▼
          </span>
        </button>

        {selectedBodies.length > 0 && (
          <button
            onClick={clearAll}
            className="px-3 py-2 rounded-lg text-[11px] font-semibold text-red-300
                       border border-red-400/30 bg-red-500/10 hover:bg-red-500/20
                       backdrop-blur-md shadow-[0_0_8px_rgba(255,0,0,0.3)] transition-all"
          >
            CLEAR
          </button>
        )}
      </div>

      {/* === Drawer panel === */}
      <div
        className={`transition-all duration-500 overflow-hidden origin-top ${
          open ? "max-h-[55vh] opacity-100 mt-1" : "max-h-0 opacity-0 mt-0"
        }`}
      >
        <div
          className="rounded-lg border border-white/10 bg-white/[0.03]
                     backdrop-blur-2xl p-3 shadow-[0_0_20px_rgba(0,0,0,0.3)]
                     max-h-[55vh] overflow-y-auto w-[220px]
                     scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
        >
          {/* === Search bar === */}
          <input
            type="text"
            placeholder="Search planet or ID..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full mb-3 px-2 py-1.5 rounded-md bg-white/5 border border-white/10 
                       text-xs text-white placeholder-gray-400 focus:outline-none
                       focus:border-white/30 focus:bg-white/10 transition-all"
          />

          {/* === Body list === */}
          {filtered.length > 0 ? (
            <div className="flex flex-col space-y-1">
              {filtered.map((body, idx) => {
                const key = `${body.id ?? body.name ?? "unknown"}-${idx}`;
                const identifier = String(body.name && body.name !== "None" ? body.name : body.id);
                const isChecked = selectedBodies.includes(identifier);
                const isPlanet = body.type?.toLowerCase() === "planet";
                const displayLabel =
                  isPlanet && body.name && body.name !== "None" ? body.name : body.id || "Unnamed";

                return (
                  <label
                    key={key}
                    onClick={() => togglePlanet(identifier)}
                    className={`flex items-center justify-between px-2 py-1.5 rounded-md cursor-pointer
                                border transition-all duration-150 text-xs
                                ${
                                  isChecked
                                    ? "border-white/20 bg-white/[0.08]"
                                    : "border-transparent hover:bg-white/[0.03]"
                                }`}
                  >
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-3.5 h-3.5 border rounded-sm flex items-center justify-center
                                    ${
                                      isChecked
                                        ? "border-white bg-white/30"
                                        : "border-gray-500/50"
                                    }`}
                      >
                        {isChecked && <div className="w-1.5 h-1.5 bg-white rounded-sm" />}
                      </div>
                      <span className={isChecked ? "text-white" : "text-gray-300"}>
                        {displayLabel}
                      </span>
                    </div>

                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{
                        background: body.color ?? "#888",
                        boxShadow: `0 0 5px ${
                          body.color ?? "#888"
                        }55, inset 0 0 2px #000`,
                      }}
                    />
                  </label>
                );
              })}
            </div>
          ) : (
            <div className="text-gray-400 text-[11px] italic mt-3">
              {isNumericQuery
                ? "No bodies found with that ID"
                : "No planets found with that name"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
