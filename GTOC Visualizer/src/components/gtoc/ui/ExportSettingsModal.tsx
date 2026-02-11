"use client";

import { useState, useMemo } from "react";
import { useMovieStore } from "@/components/gtoc/stores/useMovieStore";
import { JD_EPOCH_0 } from "@/components/gtoc/utils/constants";

interface ExportSettingsModalProps {
    onStartExport: (filename: string, rate: number) => void;
}

export default function ExportSettingsModal({ onStartExport }: ExportSettingsModalProps) {
    const { showExportSettings, setShowExportSettings, exportFilename, setExportFilename, exportRate, setExportRate, keyframes } = useMovieStore();
    const [localFilename, setLocalFilename] = useState(exportFilename);
    const [localRate, setLocalRate] = useState(exportRate);

    // Compute estimated video duration based on keyframes and rate
    const durationInfo = useMemo(() => {
        const startJD = keyframes.length > 0 ? keyframes[0].jd : JD_EPOCH_0;
        const endJD = keyframes.length > 0 ? keyframes[keyframes.length - 1].jd : JD_EPOCH_0 + 60;
        const totalDays = endJD - startJD;
        const FPS = 60;
        const totalFrames = Math.max(1, Math.ceil(totalDays / (localRate / FPS)));
        const durationSec = totalFrames / FPS;

        const min = Math.floor(durationSec / 60);
        const sec = Math.floor(durationSec % 60);
        const formatted = min > 0 ? `${min}m ${sec}s` : `${sec}s`;

        return { totalDays: totalDays.toFixed(1), totalFrames, durationSec: durationSec.toFixed(1), formatted };
    }, [keyframes, localRate]);

    if (!showExportSettings) return null;

    const handleStart = () => {
        setExportFilename(localFilename);
        setExportRate(localRate);
        onStartExport(localFilename, localRate);
    };

    const handleCancel = () => {
        setShowExportSettings(false);
    };

    return (
        <div
            data-export-ignore
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 99998,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(0, 0, 0, 0.75)",
                backdropFilter: "blur(6px)",
            }}
            onClick={(e) => {
                if (e.target === e.currentTarget) handleCancel();
            }}
        >
            <div
                style={{
                    width: "480px",
                    background: "linear-gradient(145deg, #1a1a2e 0%, #16213e 100%)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "16px",
                    padding: "32px",
                    boxShadow: "0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)",
                }}
            >
                {/* Header */}
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px" }}>
                    <div
                        style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "10px",
                            background: "linear-gradient(135deg, #7C3AED, #A78BFA)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="23 7 16 12 23 17 23 7" />
                            <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                        </svg>
                    </div>
                    <div>
                        <div style={{ color: "#fff", fontSize: "17px", fontWeight: 700, letterSpacing: "-0.01em" }}>
                            Export 4K Video
                        </div>
                        <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", fontWeight: 500, marginTop: "1px" }}>
                            3840 × 2160 · H.264 · 60 fps
                        </div>
                    </div>
                </div>

                {/* Filename field */}
                <div style={{ marginBottom: "20px" }}>
                    <label
                        style={{
                            display: "block",
                            color: "rgba(255,255,255,0.6)",
                            fontSize: "12px",
                            fontWeight: 600,
                            marginBottom: "6px",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                        }}
                    >
                        Filename
                    </label>
                    <div style={{ position: "relative" }}>
                        <input
                            type="text"
                            value={localFilename}
                            onChange={(e) => setLocalFilename(e.target.value)}
                            placeholder="vectra_4k_export"
                            style={{
                                width: "100%",
                                padding: "10px 50px 10px 12px",
                                borderRadius: "8px",
                                border: "1px solid rgba(255,255,255,0.12)",
                                background: "rgba(0,0,0,0.3)",
                                color: "#fff",
                                fontSize: "14px",
                                outline: "none",
                                fontFamily: "monospace",
                                boxSizing: "border-box",
                            }}
                            onFocus={(e) => {
                                e.currentTarget.style.borderColor = "rgba(124, 58, 237, 0.5)";
                            }}
                            onBlur={(e) => {
                                e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                            }}
                        />
                        <span
                            style={{
                                position: "absolute",
                                right: "12px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                color: "rgba(255,255,255,0.3)",
                                fontSize: "13px",
                                fontFamily: "monospace",
                            }}
                        >
                            .mp4
                        </span>
                    </div>
                </div>

                {/* Simulation Rate field */}
                <div style={{ marginBottom: "28px" }}>
                    <label
                        style={{
                            display: "block",
                            color: "rgba(255,255,255,0.6)",
                            fontSize: "12px",
                            fontWeight: 600,
                            marginBottom: "6px",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                        }}
                    >
                        Simulation Speed
                    </label>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <input
                            type="range"
                            min={1}
                            max={1500}
                            step={1}
                            value={localRate}
                            onChange={(e) => setLocalRate(parseInt(e.target.value, 10))}
                            style={{
                                flex: 1,
                                accentColor: "#7C3AED",
                                height: "4px",
                            }}
                        />
                        <div
                            style={{
                                display: "flex",
                                alignItems: "baseline",
                                gap: "4px",
                                minWidth: "90px",
                            }}
                        >
                            <input
                                type="number"
                                min={1}
                                max={3650}
                                value={localRate}
                                onChange={(e) => {
                                    const val = Math.max(1, Math.min(3650, parseInt(e.target.value || "1", 10)));
                                    setLocalRate(val);
                                }}
                                style={{
                                    width: "55px",
                                    padding: "6px 8px",
                                    borderRadius: "6px",
                                    border: "1px solid rgba(255,255,255,0.12)",
                                    background: "rgba(0,0,0,0.3)",
                                    color: "#fff",
                                    fontSize: "13px",
                                    textAlign: "right",
                                    outline: "none",
                                    fontFamily: "monospace",
                                }}
                            />
                            <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px" }}>
                                days/s
                            </span>
                        </div>
                    </div>
                    <div
                        style={{
                            marginTop: "10px",
                            padding: "10px 12px",
                            borderRadius: "8px",
                            background: "rgba(124, 58, 237, 0.08)",
                            border: "1px solid rgba(124, 58, 237, 0.15)",
                        }}
                    >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                                Est. Video Duration
                            </span>
                            <span style={{ color: "#A78BFA", fontSize: "16px", fontWeight: 700, fontFamily: "monospace" }}>
                                {durationInfo.formatted}
                            </span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "5px" }}>
                            <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "10px" }}>
                                {durationInfo.totalDays} sim days · {durationInfo.totalFrames.toLocaleString()} frames
                            </span>
                        </div>
                    </div>
                </div>

                {/* Action buttons */}
                <div style={{ display: "flex", gap: "10px" }}>
                    <button
                        onClick={handleCancel}
                        style={{
                            flex: 1,
                            padding: "11px",
                            borderRadius: "8px",
                            border: "1px solid rgba(255,255,255,0.12)",
                            background: "rgba(255,255,255,0.04)",
                            color: "rgba(255,255,255,0.7)",
                            fontSize: "13px",
                            fontWeight: 600,
                            cursor: "pointer",
                            transition: "all 0.15s ease",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleStart}
                        style={{
                            flex: 1,
                            padding: "11px",
                            borderRadius: "8px",
                            border: "none",
                            background: "linear-gradient(135deg, #7C3AED, #6D28D9)",
                            color: "#fff",
                            fontSize: "13px",
                            fontWeight: 700,
                            cursor: "pointer",
                            transition: "all 0.15s ease",
                            boxShadow: "0 4px 15px rgba(124, 58, 237, 0.3)",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-1px)";
                            e.currentTarget.style.boxShadow = "0 6px 20px rgba(124, 58, 237, 0.4)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "0 4px 15px rgba(124, 58, 237, 0.3)";
                        }}
                    >
                        Start Export
                    </button>
                </div>
            </div>
        </div>
    );
}
