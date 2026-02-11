"use client";

import { useMovieStore } from "@/components/gtoc/stores/useMovieStore";

export default function ExportOverlay() {
    const { isExporting, exportProgress, exportFrameInfo, exportStartTime, finishExport, setRecording } = useMovieStore();

    if (!isExporting) return null;

    const pct = Math.min(100, Math.max(0, exportProgress * 100));

    // ETA calculation
    const elapsedMs = Date.now() - exportStartTime;
    const elapsedSec = elapsedMs / 1000;
    let etaStr = "Calculating…";
    if (exportProgress > 0.01 && elapsedSec > 2) {
        const totalEstSec = elapsedSec / exportProgress;
        const remainSec = Math.max(0, totalEstSec - elapsedSec);
        if (remainSec < 60) {
            etaStr = `~${Math.ceil(remainSec)}s remaining`;
        } else {
            const mins = Math.floor(remainSec / 60);
            const secs = Math.ceil(remainSec % 60);
            etaStr = `~${mins}m ${secs}s remaining`;
        }
    }

    const handleCancel = () => {
        // Signal the recording loop to break
        setRecording(false, 0);
        finishExport();
    };

    return (
        <div
            data-export-ignore
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 99999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(0, 0, 0, 0.88)",
                backdropFilter: "blur(8px)",
            }}
        >
            <div
                style={{
                    width: "460px",
                    background: "linear-gradient(145deg, #1a1a2e 0%, #16213e 100%)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "16px",
                    padding: "36px 32px 28px",
                    boxShadow: "0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)",
                }}
            >
                {/* Header */}
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
                    {/* Spinner icon */}
                    <div
                        style={{
                            width: "32px",
                            height: "32px",
                            border: "3px solid rgba(139, 92, 246, 0.2)",
                            borderTopColor: "#8B5CF6",
                            borderRadius: "50%",
                            animation: "exportSpin 1s linear infinite",
                        }}
                    />
                    <div>
                        <div style={{ color: "#fff", fontSize: "16px", fontWeight: 700, letterSpacing: "-0.01em" }}>
                            Exporting 4K Video
                        </div>
                        <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", fontWeight: 500, marginTop: "2px" }}>
                            3840 × 2160 · High Bitrate
                        </div>
                    </div>
                </div>

                {/* Progress bar */}
                <div
                    style={{
                        width: "100%",
                        height: "8px",
                        borderRadius: "4px",
                        background: "rgba(255,255,255,0.06)",
                        overflow: "hidden",
                        marginBottom: "12px",
                    }}
                >
                    <div
                        style={{
                            width: `${pct}%`,
                            height: "100%",
                            borderRadius: "4px",
                            background: "linear-gradient(90deg, #7C3AED, #A78BFA)",
                            transition: "width 0.15s ease-out",
                            boxShadow: "0 0 12px rgba(139, 92, 246, 0.4)",
                        }}
                    />
                </div>

                {/* Stats row */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "24px",
                    }}
                >
                    <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px", fontFamily: "monospace" }}>
                        {exportFrameInfo}
                    </div>
                    <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "13px", fontWeight: 600, fontFamily: "monospace" }}>
                        {pct.toFixed(1)}%
                    </div>
                </div>

                {/* ETA */}
                <div
                    style={{
                        color: "rgba(255,255,255,0.35)",
                        fontSize: "11px",
                        textAlign: "center",
                        marginBottom: "20px",
                        fontStyle: "italic",
                    }}
                >
                    {etaStr}
                </div>

                {/* Cancel button */}
                <button
                    onClick={handleCancel}
                    style={{
                        display: "block",
                        width: "100%",
                        padding: "10px",
                        border: "1px solid rgba(239, 68, 68, 0.3)",
                        borderRadius: "8px",
                        background: "rgba(239, 68, 68, 0.08)",
                        color: "#F87171",
                        fontSize: "13px",
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(239, 68, 68, 0.18)";
                        e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.5)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = "rgba(239, 68, 68, 0.08)";
                        e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.3)";
                    }}
                >
                    Cancel Export
                </button>
            </div>

            {/* CSS animation for spinner */}
            <style>{`
                @keyframes exportSpin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
