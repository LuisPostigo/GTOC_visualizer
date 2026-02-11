"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { useMovieStore, LogoEntry } from "@/components/gtoc/stores/useMovieStore";

/* ──────────────────────────────────────────────────────────────────────────── */
/*  Individual draggable / resizable / deletable logo                          */
/* ──────────────────────────────────────────────────────────────────────────── */

function DraggableLogo({ logo }: { logo: LogoEntry }) {
    const { updateLogo, removeLogo } = useMovieStore();

    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const resizeStartRef = useRef<{ x: number; y: number; startScale: number } | null>(null);

    // Drag
    useEffect(() => {
        if (!isDragging) return;

        const handleMouseMove = (e: MouseEvent) => {
            const dx = e.movementX / window.innerWidth;
            const dy = -e.movementY / window.innerHeight;
            updateLogo(logo.id, {
                position: {
                    x: Math.min(1, Math.max(0, logo.position.x + dx)),
                    y: Math.min(1, Math.max(0, logo.position.y + dy)),
                },
            });
        };

        const stop = () => setIsDragging(false);

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", stop);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", stop);
        };
    }, [isDragging, logo.id, logo.position, updateLogo]);

    // Resize
    useEffect(() => {
        if (!isResizing) return;

        const handlePointerMove = (e: PointerEvent) => {
            const s = resizeStartRef.current;
            if (!s) return;

            const dx = e.clientX - s.x;
            const dy = e.clientY - s.y;
            const dominant = Math.max(dx, dy);

            const pxPerScaleUnit = 120;
            const deltaScale = dominant / pxPerScaleUnit;

            const next = Math.min(5, Math.max(0.1, s.startScale + deltaScale));
            updateLogo(logo.id, { scale: next });
        };

        const stop = () => {
            setIsResizing(false);
            resizeStartRef.current = null;
        };

        window.addEventListener("pointermove", handlePointerMove);
        window.addEventListener("pointerup", stop);
        window.addEventListener("pointercancel", stop);

        return () => {
            window.removeEventListener("pointermove", handlePointerMove);
            window.removeEventListener("pointerup", stop);
            window.removeEventListener("pointercancel", stop);
        };
    }, [isResizing, logo.id, updateLogo]);

    const handleMouseDownDrag = (e: React.MouseEvent) => {
        if (isResizing) return;
        e.preventDefault();
        setIsDragging(true);
    };

    const handleResizePointerDown = (e: React.PointerEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsResizing(true);
        resizeStartRef.current = { x: e.clientX, y: e.clientY, startScale: logo.scale };
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    };

    return (
        <div
            className="absolute pointer-events-auto cursor-move group"
            style={{
                left: `${logo.position.x * 100}%`,
                bottom: `${logo.position.y * 100}%`,
                transform: "translate(-50%, 50%)",
                width: `${15 * logo.scale}vh`,
                height: `${15 * logo.scale}vh`,
                background: "transparent",
            }}
            onMouseDown={handleMouseDownDrag}
        >
            <img
                src={logo.url}
                alt="Logo"
                draggable={false}
                className="w-full h-full object-contain select-none pointer-events-none"
            />

            {/* Selection border */}
            <div
                className={`absolute inset-0 border border-dashed border-white/60 rounded-md ${isDragging || isResizing ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    } transition-opacity`}
            />

            {/* Delete button — top-right corner */}
            <button
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                    e.stopPropagation();
                    removeLogo(logo.id);
                }}
                className={`absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500/80 hover:bg-red-500 text-white flex items-center justify-center text-xs leading-none cursor-pointer ${isDragging ? "hidden" : "opacity-0 group-hover:opacity-100"
                    } transition-opacity`}
                title="Remove logo"
            >
                ✕
            </button>

            {/* Resize handle — bottom-right corner */}
            <div
                onPointerDown={handleResizePointerDown}
                className={`absolute -right-2 -bottom-2 w-4 h-4 rounded-sm bg-white/70 hover:bg-white cursor-nwse-resize ${isDragging ? "hidden" : "opacity-0 group-hover:opacity-100"
                    } transition-opacity`}
                style={{ touchAction: "none" }}
                title="Resize"
            />
        </div>
    );
}

/* ──────────────────────────────────────────────────────────────────────────── */
/*  Main overlay — upload button + all logos                                    */
/* ──────────────────────────────────────────────────────────────────────────── */

export default function MovieOverlay() {
    const { isMovieMode, isPresentationMode, logos, addLogo, missionName, missionNameSize, setMissionName, setMissionNameSize } = useMovieStore();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const f = e.target.files?.[0];
            if (f) addLogo(URL.createObjectURL(f));
            e.target.value = "";
        },
        [addLogo]
    );

    if (!isMovieMode) return null;

    return (
        <div
            className="absolute inset-0 pointer-events-none z-[1100]"
            style={{ background: "transparent" }}
        >
            {/* REC area preview frame + upload — hidden in presentation mode */}
            {!isPresentationMode && (
                <div data-export-ignore>
                    <div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-yellow-500/30 pointer-events-none"
                        style={{ width: "100%", height: "100%", background: "transparent" }}
                    >
                        <div className="absolute top-4 left-4 text-yellow-500/50 text-xs font-mono">
                            REC AREA (Preview)
                        </div>
                    </div>

                    {/* Upload button */}
                    <div className="absolute bottom-20 left-20 pointer-events-auto">
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="px-6 py-4 rounded-lg border-2 border-dashed border-white/30 hover:border-white/60 bg-black/40 text-white/70 hover:text-white transition-all flex flex-col items-center gap-2"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="17 8 12 3 7 8" />
                                <line x1="12" y1="3" x2="12" y2="15" />
                            </svg>
                            <span className="text-sm font-bold">
                                {logos.length > 0 ? "Add Another Logo" : "Upload Mission Logo"}
                            </span>
                            <span className="text-[10px] text-white/40">PNG Recommended</span>
                        </button>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                    </div>
                </div>
            )}

            {/* Render all logos */}
            {logos.map((logo) => (
                <DraggableLogo key={logo.id} logo={logo} />
            ))}

            {/* ─── Mission name overlay (bottom-right) ─── */}
            {(missionName || !isPresentationMode) && (
                <div
                    className="absolute pointer-events-auto"
                    style={{ bottom: "3%", right: "3%" }}
                >
                    {/* Edit controls — hidden in presentation/export mode */}
                    {!isPresentationMode && (
                        <div data-export-ignore className="mb-2 flex flex-col items-end gap-2">
                            <input
                                type="text"
                                placeholder="Mission Name"
                                value={missionName}
                                onChange={(e) => setMissionName(e.target.value)}
                                className="px-3 py-1.5 rounded-md bg-black/60 border border-white/20 text-white text-sm outline-none focus:border-white/50 backdrop-blur-md text-right"
                                style={{ width: "220px" }}
                            />
                            <div className="flex items-center gap-2 text-[10px] text-white/40">
                                <span>Size</span>
                                <input
                                    type="range"
                                    min={16}
                                    max={72}
                                    value={missionNameSize}
                                    onChange={(e) => setMissionNameSize(parseInt(e.target.value))}
                                    className="w-20 accent-violet-500"
                                />
                                <span>{missionNameSize}px</span>
                            </div>
                        </div>
                    )}
                    {/* Rendered mission name */}
                    {missionName && (
                        <div
                            className="text-right select-none"
                            style={{
                                fontSize: `${missionNameSize}px`,
                                fontWeight: 700,
                                fontFamily: "'Inter', 'Outfit', system-ui, sans-serif",
                                letterSpacing: "-0.02em",
                                color: "#ffffff",
                                textShadow: "0 0 20px rgba(139,92,246,0.5), 0 0 60px rgba(139,92,246,0.2), 0 2px 4px rgba(0,0,0,0.8)",
                                lineHeight: 1.1,
                            }}
                        >
                            {missionName}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}