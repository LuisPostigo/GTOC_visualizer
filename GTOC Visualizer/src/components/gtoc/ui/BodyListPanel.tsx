"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import ColorPickerPortal from "./ColorPickerPortal";

// Icons
const TargetIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="16" />
        <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
);

export default function BodyListPanel({
    isOpen,
    onClose,
    anchorRef,
    planets,
    selectedBodies,
    centerBodyId,
    togglePlanet,
    updatePlanetColor,
    updatePlanetTypeColor,
    setCenterBody,
    btnRefs,
    openPicker,
    setOpenPicker
}: {
    isOpen: boolean;
    onClose: () => void;
    anchorRef: React.RefObject<HTMLElement | null>;
    planets: any[];
    selectedBodies: string[];
    centerBodyId: string | null;
    togglePlanet: (id: string) => void;
    updatePlanetColor: (id: string | number, color: string) => void;
    updatePlanetTypeColor: (type: string, color: string) => void;
    setCenterBody: (id: string | null) => void;
    btnRefs: React.MutableRefObject<Record<string, HTMLButtonElement | null>>;
    openPicker: string | null;
    setOpenPicker: (id: string | null) => void;
}) {
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const [bodyQuery, setBodyQuery] = useState("");
    const panelRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    useEffect(() => {
        if (isOpen && anchorRef.current) {
            const rect = anchorRef.current.getBoundingClientRect();
            setPos({ x: rect.left, y: rect.bottom + 8 });
        }
    }, [isOpen, anchorRef]);

    // Close on outside click
    useEffect(() => {
        if (!isOpen) return;
        const handleClick = (e: MouseEvent) => {
            const target = e.target as Node;

            // Don't close if clicking inside panel OR clicking specific elements like color picker
            const isInsidePanel = panelRef.current?.contains(target);
            const isInsideAnchor = anchorRef.current?.contains(target);
            const isInsideColorPicker = (target as Element).closest('.react-colorful'); // Hacky check for color picker

            if (!isInsidePanel && !isInsideAnchor && !isInsideColorPicker) {
                onClose();
            }
        };
        window.addEventListener("mousedown", handleClick);
        return () => window.removeEventListener("mousedown", handleClick);
    }, [isOpen, onClose, anchorRef]);

    const filteredBodies = useMemo(() => {
        const q = bodyQuery.trim().toLowerCase();
        const isNumeric = /^\d+$/.test(q);

        return planets.filter((b) => {
            const name = (b.name || "").toLowerCase();
            const type = (b.type || "").toLowerCase();
            const hasValidName = name && name !== "none" && name !== "";

            if (!q) return type === "planet" && hasValidName;
            if (!isNumeric) return type === "planet" && hasValidName && name.includes(q);
            return String(b.id ?? "").toLowerCase().includes(q);
        });
    }, [planets, bodyQuery]);

    if (!mounted || !isOpen) return null;

    return createPortal(
        <div
            ref={panelRef}
            className="fixed z-[9999] w-[400px] max-h-[50vh] flex flex-col bg-[#0a0a0c]/95 border border-white/10 backdrop-blur-xl rounded-lg shadow-2xl overflow-hidden"
            style={{ left: pos.x, top: pos.y }}
        >
            {/* Header / Search */}
            <div className="p-3 border-b border-white/10 flex flex-col gap-2 bg-white/5">
                <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-white/50">Details</span>
                    <button onClick={onClose} className="text-white/30 hover:text-white"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg></button>
                </div>

                {/* Group Colors */}
                <div className="flex gap-2 mb-1">
                    {["Planet", "Asteroid", "Comet"].map((type) => (
                        <button
                            key={type}
                            ref={(el) => { btnRefs.current[`group-${type}`] = el; }}
                            onClick={(e) => {
                                e.stopPropagation();
                                setOpenPicker(openPicker === `group-${type}` ? null : `group-${type}`);
                            }}
                            className="flex-1 flex items-center justify-center gap-1.5 py-1 rounded bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-[10px] text-white/60"
                            title={`Color All ${type}s`}
                        >
                            <div className="w-2 h-2 rounded-full shadow-sm" style={{ backgroundColor: type === "Planet" ? "#4da6ff" : type === "Asteroid" ? "#888" : "#ffcc00" }} />
                            {type}s
                        </button>
                    ))}
                </div>

                {/* Search */}
                <div className="relative">
                    <input
                        type="text"
                        value={bodyQuery}
                        onChange={(e) => setBodyQuery(e.target.value)}
                        placeholder="Search Name or ID..."
                        className="w-full bg-black/40 border border-white/10 rounded px-3 py-1.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-emerald-500/50"
                        autoFocus
                    />
                    <svg className="absolute right-2.5 top-2 w-3.5 h-3.5 text-white/20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                </div>

                {/* Group Color Portals */}
                {["Planet", "Asteroid", "Comet"].map((type) => (
                    openPicker === `group-${type}` && (
                        <ColorPickerPortal
                            key={type}
                            anchorRef={{ current: btnRefs.current[`group-${type}`] as HTMLElement }}
                            color={"#ffffff"} // Default start color, strictly we could grab avg but white is safe
                            onChange={(c) => updatePlanetTypeColor(type, c)}
                            onClose={() => setOpenPicker(null)}
                        />
                    )
                ))}
            </div>

            {/* List */}
            <div className="overflow-y-auto p-2 grid grid-cols-2 gap-2 content-start">
                {filteredBodies.slice(0, 100).map((body: any, idx: number) => { // Increased limit
                    const identifier = String(body.name && body.name !== "None" ? body.name : body.id);
                    const isChecked = selectedBodies.includes(identifier);
                    const isCenter = centerBodyId === String(body.id);
                    const displayName = (body.name && body.name !== "None") ? `${body.name}` : `#${body.id}`;

                    return (
                        <div
                            key={`${body.id}-${idx}`}
                            className={`flex items-center gap-2 px-2 py-1.5 rounded border transition-all text-xs text-left group
                        ${isChecked
                                    ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-100"
                                    : "bg-white/5 border-transparent text-white/60 hover:bg-white/10 hover:text-white"
                                }`}
                        >
                            {/* Color Picker Trigger */}
                            <button
                                ref={(el) => { btnRefs.current[`body-${body.id}`] = el; }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenPicker(openPicker === `body-${body.id}` ? null : `body-${body.id}`);
                                }}
                                className="w-2.5 h-2.5 rounded-full shadow-[0_0_4px_currentColor] flex-shrink-0 hover:scale-125 transition-transform cursor-pointer border border-white/20"
                                style={{ backgroundColor: body.color || "#888" }}
                                title="Change Color"
                            />

                            {/* Selection Trigger (Name) */}
                            <button
                                onClick={() => togglePlanet(identifier)}
                                className="flex-1 truncate text-left focus:outline-none"
                                title={`ID: ${body.id}`}
                            >
                                {displayName}
                            </button>

                            {/* Target/Center Trigger */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setCenterBody(isCenter ? null : String(body.id));
                                }}
                                className={`p-1 rounded transition-colors ${isCenter
                                    ? "text-blue-400 bg-blue-500/20"
                                    : "text-white/20 hover:text-white hover:bg-white/10"
                                    }`}
                                title={isCenter ? "Current Center (Click to Reset)" : "Set as Visual Center"}
                            >
                                <TargetIcon />
                            </button>

                            {/* Color Portal for this item */}
                            {openPicker === `body-${body.id}` && (
                                <ColorPickerPortal
                                    anchorRef={{ current: btnRefs.current[`body-${body.id}`] as HTMLElement }}
                                    color={body.color || "#ffffff"}
                                    onChange={(c) => updatePlanetColor(body.id, c)}
                                    onClose={() => setOpenPicker(null)}
                                />
                            )}
                        </div>
                    );
                })}
                {filteredBodies.length === 0 && (
                    <span className="col-span-full text-white/30 text-xs italic p-4 text-center">No bodies found.</span>
                )}
            </div>

            <div className="p-2 border-t border-white/5 bg-white/5 text-[10px] text-white/30 flex justify-between">
                <span>{filteredBodies.length} bodies found</span>
                {selectedBodies.length > 0 && <span className="text-emerald-400">{selectedBodies.length} selected</span>}
            </div>
        </div>,
        document.body
    );
}
