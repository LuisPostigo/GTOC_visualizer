"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { HexColorPicker } from "react-colorful";

export default function ColorPickerPortal({
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
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    // Smart positioning
    useEffect(() => {
        const el = anchorRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        // Position to the right of the anchor if possible, or below
        setPos({ x: rect.right + 10, y: rect.top });
    }, [anchorRef]);

    // Close on outside click
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const target = e.target as Node;
            // We need to check if click is outside BOTH the picker AND the anchor button
            if (
                pickerRef.current &&
                !pickerRef.current.contains(target) &&
                anchorRef.current &&
                !anchorRef.current.contains(target)
            ) {
                onClose();
            }
        };
        window.addEventListener("mousedown", handleClick);
        return () => window.removeEventListener("mousedown", handleClick);
    }, [anchorRef, onClose]);

    if (!mounted) return null;

    return createPortal(
        <div
            ref={pickerRef}
            id="gtoc-text-color-picker"
            className="fixed z-[99999] p-3 rounded-lg bg-[#1a1a1a] border border-white/10 shadow-2xl backdrop-blur-md flex flex-col items-center gap-2 color-picker-portal"
            style={{ left: pos.x, top: pos.y }}
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
        >
            <HexColorPicker color={tempColor} onChange={setTempColor} />
            <div className="flex gap-2 w-full">
                <button
                    onClick={() => {
                        onChange(tempColor);
                        onClose();
                    }}
                    className="flex-1 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors"
                >
                    Apply
                </button>
            </div>
        </div>,
        document.body
    );
}
