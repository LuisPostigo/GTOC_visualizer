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
/*  Draggable / Resizable / Deletable Text Box                                 */
/* ──────────────────────────────────────────────────────────────────────────── */

function DraggableTextBox({ item }: { item: import("@/components/gtoc/stores/useMovieStore").TextBoxEntry }) {
    const { updateTextBox, removeTextBox, selectedTextBoxId, selectTextBox, isMovieMode } = useMovieStore();

    // Smart Deselect logic
    useEffect(() => {
        if (!isMovieMode) return;

        const handlePointerDown = (e: PointerEvent) => {
            const path = e.composedPath();
            const isRibbon = path.some(el => (el as HTMLElement).id === 'ribbon-ui');
            const isTextBox = path.some(el => (el as HTMLElement).classList?.contains('text-box-item'));
            const isColorPicker = path.some(el => (el as HTMLElement).classList?.contains('color-picker-portal') || (el as HTMLElement).id === 'gtoc-text-color-picker');

            // If we clicked on the canvas (not ribbon, not text box, not color picker), deselect.
            if (!isRibbon && !isTextBox && !isColorPicker) {
                selectTextBox(null);
            }
        };

        window.addEventListener("pointerdown", handlePointerDown);
        return () => window.removeEventListener("pointerdown", handlePointerDown);
    }, [isMovieMode, selectTextBox]);

    const isSelected = selectedTextBoxId === item.id;
    const [isDragging, setIsDragging] = useState(false);
    const dragStartRef = useRef<{ x: number; y: number; startX: number; startY: number; containerW: number; containerH: number } | null>(null);
    const [resizeMode, setResizeMode] = useState<'scale' | 'width' | 'height' | null>(null);
    const resizeStartRef = useRef<{ x: number; y: number; startScale: number; startWidth: number; startHeight: number; containerW: number; containerH: number } | null>(null);

    const handleMouseDownDrag = (e: React.MouseEvent) => {
        if (e.button !== 0) return;
        e.stopPropagation();

        // Capture container dimensions
        const container = (e.currentTarget as HTMLElement).offsetParent as HTMLElement;
        const rect = container?.getBoundingClientRect() || { width: window.innerWidth, height: window.innerHeight };

        setIsDragging(true);
        dragStartRef.current = {
            x: e.clientX,
            y: e.clientY,
            startX: item.position.x,
            startY: item.position.y,
            containerW: rect.width,
            containerH: rect.height
        };
        selectTextBox(item.id);
    };

    // Dragging
    useEffect(() => {
        if (!isDragging) return;

        const handlePointerMove = (e: PointerEvent) => {
            const startPos = dragStartRef.current;
            if (!startPos) return;

            // Calculate delta in % of container size
            const dx = (e.clientX - startPos.x) / startPos.containerW;
            const dy = (e.clientY - startPos.y) / startPos.containerH;

            // Update position (inverted Y behavior check: dy moves mouse down. 
            // If dragging down, y (bottom%) should decrease.
            // visual Y goes DOWN. bottom% goes UP. So dy > 0 => y decreases.
            // newY = startY - dy.

            updateTextBox(item.id, {
                position: {
                    x: Math.min(1, Math.max(0, startPos.startX + dx)),
                    y: Math.min(1, Math.max(0, startPos.startY - dy)),
                },
            });
        };

        const stop = () => {
            setIsDragging(false);
            dragStartRef.current = null;
        };

        window.addEventListener("pointermove", handlePointerMove);
        window.addEventListener("pointerup", stop);
        window.addEventListener("pointercancel", stop);

        return () => {
            window.removeEventListener("pointermove", handlePointerMove);
            window.removeEventListener("pointerup", stop);
            window.removeEventListener("pointercancel", stop);
        };
    }, [isDragging, item.id, updateTextBox]);

    // Resize
    useEffect(() => {
        if (!resizeMode) return;

        const handlePointerMove = (e: PointerEvent) => {
            const s = resizeStartRef.current;
            if (!s) return;

            const dx = e.clientX - s.x;
            const dy = e.clientY - s.y; // pixels

            if (resizeMode === 'scale') {
                // Corner resize: Scale font/box uniformly
                const dominant = Math.max(dx, -dy);
                const pxPerScaleUnit = 120; // Heuristic
                // Scale factor shouldn't depend on container size necessarily, 
                // but maybe relative scale? Keeping it pixel-based for feel is fine.
                const deltaScale = dominant / pxPerScaleUnit;
                const next = Math.min(10, Math.max(0.2, s.startScale + deltaScale));
                updateTextBox(item.id, { scale: next });
            } else if (resizeMode === 'width') {
                // Width resize: Update width %
                // Convert dx (pixels) to % of CONTAINER width
                const dPct = (dx / s.containerW) * 100;
                const nextW = Math.max(5, (s.startWidth || 20) + dPct); // Min 5% width
                updateTextBox(item.id, { width: nextW });
            } else if (resizeMode === 'height') {
                // Height resize: Update height %
                // But our coordinate system is Y-up?
                // "bottom: y * 100%"
                // If I increase height, does it grow up or down?
                // translate(-50%, 50%) means datum is Bottom-Center of the box?
                // No. translateY(50%) moves element DOWN by 50% of its height.
                // So datum is at the center vertically?
                // Let's re-read rendering: element bottom = item.y. transform translate(0, 50%).
                // So the anchor point (item.y) is at the VERTICAL CENTER of the box.
                // Increasing height expands both up and down from the center.
                // So dragging bottom handle down (dy > 0) should increase height.
                // dy > 0 -> increase height.
                const dH = (dy / s.containerH) * 100;
                const nextH = Math.max(2, (s.startHeight || 10) + dH);
                updateTextBox(item.id, { height: nextH });
            }
        };

        const stop = () => {
            setResizeMode(null);
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
    }, [resizeMode, item.id, updateTextBox]);



    const startResize = (e: React.PointerEvent, mode: 'scale' | 'width' | 'height') => {
        e.preventDefault();
        e.stopPropagation();
        selectTextBox(item.id);
        setResizeMode(mode);

        const container = (e.currentTarget as HTMLElement).offsetParent as HTMLElement;
        const containerRect = container?.getBoundingClientRect() || { width: window.innerWidth, height: window.innerHeight };

        // For initial width/height, we can rely on state or estimate from DOM if 0/auto
        // If state is 0/undefined, it means "auto".
        // If we start resizing width, we should snap to current width first.
        const boxRect = (e.currentTarget.closest('.text-box-item') as HTMLElement)?.getBoundingClientRect();
        const startW = item.width || (boxRect ? (boxRect.width / containerRect.width * 100) : 20);
        const startH = item.height || (boxRect ? (boxRect.height / containerRect.height * 100) : 10);

        resizeStartRef.current = {
            x: e.clientX,
            y: e.clientY,
            startScale: item.scale,
            startWidth: startW,
            startHeight: startH,
            containerW: containerRect.width,
            containerH: containerRect.height
        };
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    }

    const handleDoubleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        const newText = prompt("Edit text:", item.text);
        if (newText !== null) {
            updateTextBox(item.id, { text: newText });
        }
    };

    const effectiveFontSize = `${2 * item.scale * (item.fontSize || 1)}rem`;

    return (
        <div
            id={`textbox-${item.id}`}
            className={`absolute pointer-events-auto cursor-move group text-box-item flex items-center ${item.textAlign === 'left' ? 'justify-start' :
                item.textAlign === 'right' ? 'justify-end' :
                    'justify-center'
                }`}
            style={{
                left: `${item.position.x * 100}%`,
                bottom: `${item.position.y * 100}%`,
                transform: "translate(-50%, 50%)",
                width: item.width ? `${item.width}%` : 'auto',
                height: item.height ? `${item.height}%` : 'auto',
                fontSize: effectiveFontSize,
                whiteSpace: item.width ? "pre-wrap" : "pre", // Wrap if width is fixed
                color: item.color,
                textShadow: "0 2px 4px rgba(0,0,0,0.5)",
                fontFamily: item.fontFamily || "'Inter', 'Outfit', sans-serif",
                fontWeight: item.fontWeight || 700,
                fontStyle: item.isItalic ? 'italic' : 'normal',
                textAlign: item.textAlign || 'center',
                lineHeight: 1.2,
                minWidth: "1em",
                maxWidth: "100%",
            }}
            onMouseDown={handleMouseDownDrag}
            onDoubleClick={handleDoubleClick}
        >
            {item.text}

            {/* Selection border */}
            <div
                className={`absolute -inset-2 border border-dashed rounded-md transition-opacity pointer-events-none ${isSelected || isDragging || resizeMode ? "border-violet-500 opacity-100" : "border-white/60 opacity-0 group-hover:opacity-100"
                    }`}
            />

            {/* Controls Container (Top Right) */}
            <div className={`absolute -top-8 -right-8 flex gap-1 ${isSelected || isDragging ? "opacity-100" : "opacity-0 group-hover:opacity-100"} transition-opacity`}>
                <button
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                        e.stopPropagation();
                        // if (confirm("Remove this text?")) 
                        removeTextBox(item.id);
                    }}
                    className="w-6 h-6 rounded-full bg-red-500/80 hover:bg-red-500 text-white flex items-center justify-center text-xs leading-none cursor-pointer"
                    title="Remove text"
                >
                    ✕
                </button>
            </div>

            {/* Resize Handle: SCALE (Bottom-Right Corner) */}
            <div
                onPointerDown={(e) => startResize(e, 'scale')}
                className={`absolute -right-3 -bottom-3 w-5 h-5 rounded-full bg-emerald-500 border border-white cursor-nwse-resize ${isSelected || isDragging ? "opacity-100" : "opacity-0 group-hover:opacity-100"} transition-opacity z-20`}
                title="Scale Font Size"
            />

            {/* Resize Handle: WIDTH (Right Edge) */}
            <div
                onPointerDown={(e) => startResize(e, 'width')}
                className={`absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-8 rounded bg-white/30 hover:bg-white/80 border border-white/50 cursor-ew-resize ${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"} transition-opacity z-10`}
                title="Resize Width"
            />

            {/* Resize Handle: HEIGHT (Bottom Edge) */}
            <div
                onPointerDown={(e) => startResize(e, 'height')}
                className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-4 rounded bg-white/30 hover:bg-white/80 border border-white/50 cursor-ns-resize ${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"} transition-opacity z-10`}
                title="Resize Height"
            />
        </div>
    );
}

/* ──────────────────────────────────────────────────────────────────────────── */
/*  Main overlay — upload button + all logos                                    */
/* ──────────────────────────────────────────────────────────────────────────── */

export default function MovieOverlay() {
    const {
        isMovieMode,
        logos,
        addLogo,
        textBoxes,
        addTextBox,
        missionName, setMissionName,
        isExporting,
        exportProgress,
        exportFrameInfo,
        setShowExportSettings,
        selectTextBox
    } = useMovieStore();

    if (!isMovieMode) return null;

    // Deselect logic removed per user request for simpler interaction.
    // Selection is now "sticky" until another item is selected or mode is exited.

    return (
        <div
            className="absolute inset-0 z-10 pointer-events-none overflow-hidden" // Changed to pointer-events-auto to catch clicks but pass through if needed? 
        // Actually, we want clicks on background to deselect. But we must allow clicks to pass through to canvas if not hitting UI?
        // "pointer-events-none" on container allows pass through. 
        // To catch background clicks we need a full screen elem behind items but transparent?
        // If we make it auto, we block canvas interaction (OrbitControls). 
        // We can rely on a global listen or just putting a listener on window/document in effect?
        // Or, simpler: The items themselves capture clicks. If you click "nowhere", maybe that's fine to not deselect immediately,
        // OR we can add a listener to the window in this component.
        >
            {/* We'll use a window click listener to deselect if click target is not a text box */}
            {/* Or just let user deselect by clicking something else? 
              User might want to click "nothing" to see clear view. 
              Let's add a global click listener in useEffect to deselect if not clicking a text box.
          */}
            {/* 1. Logos */}
            {logos.map((logo) => (
                <DraggableLogo key={logo.id} logo={logo} />
            ))}

            {/* 2. Text Boxes */}
            {textBoxes.map((tb) => (
                <DraggableTextBox key={tb.id} item={tb} />
            ))}

            {/* 3. Export Status Overlay */}
            {isExporting && (
                <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center pointer-events-auto z-50">
                    <div className="text-2xl font-bold text-white mb-4">Exporting 4K Video...</div>
                    <div className="w-96 h-4 bg-gray-700 rounded-full overflow-hidden mb-2">
                        <div
                            className="h-full bg-violet-500 transition-all duration-300 ease-out"
                            style={{ width: `${exportProgress * 100}%` }}
                        />
                    </div>
                    <div className="text-white/70 font-mono">{exportFrameInfo}</div>
                </div>
            )}

            {/* 4. Controls Sidebar (Left) - REMOVED, moved to Ribbon */}
            {/* {!isExporting && ( ... )} */}
        </div>
    );
}