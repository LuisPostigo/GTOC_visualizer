"use client";

import { useEffect, useState, useRef } from "react";
import { useMovieStore } from "../stores/useMovieStore";
import { exitFullscreen } from "@/components/gtoc/utils/fullscreen";

export default function PresentationOverlay() {
    const { isPresentationMode, togglePresentationMode, presentationOpacity } = useMovieStore();

    // Mouse Idle Logic (for showing/hiding controls)
    const [showControls, setShowControls] = useState(false);
    const idleTimer = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!isPresentationMode) return;

        const onInteract = () => {
            setShowControls(true);
            if (idleTimer.current) clearTimeout(idleTimer.current);
            idleTimer.current = setTimeout(() => setShowControls(false), 3000);
        };

        window.addEventListener("mousemove", onInteract);
        window.addEventListener("mousedown", onInteract);
        window.addEventListener("keydown", onInteract);

        // Initial show
        onInteract();

        return () => {
            window.removeEventListener("mousemove", onInteract);
            window.removeEventListener("mousedown", onInteract);
            window.removeEventListener("keydown", onInteract);
            if (idleTimer.current) clearTimeout(idleTimer.current);
        };
    }, [isPresentationMode]);

    if (!isPresentationMode) return null;

    return (
        <div data-export-ignore style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 10000, pointerEvents: "none" }}>
            {/* Fade overlay */}
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "black",
                    opacity: presentationOpacity,
                    transition: "opacity 1.5s ease-in-out",
                }}
            />

            {/* Minimal Exit Button (Red X) */}
            <div
                style={{
                    position: "absolute",
                    top: 24,
                    left: 24,
                    pointerEvents: "auto",
                    opacity: showControls ? 1 : 0,
                    transition: "opacity 0.3s ease-in-out",
                    zIndex: 10001,
                }}
            >
                <button
                    onClick={() => {
                        togglePresentationMode(false);
                        exitFullscreen();
                    }}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        border: "none",
                        background: "rgba(220, 38, 38, 0.8)",
                        color: "white",
                        cursor: "pointer",
                        backdropFilter: "blur(4px)",
                        boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
                        transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(220, 38, 38, 1)";
                        e.currentTarget.style.transform = "scale(1.1)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = "rgba(220, 38, 38, 0.8)";
                        e.currentTarget.style.transform = "scale(1)";
                    }}
                    title="Exit Presentation"
                >
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
