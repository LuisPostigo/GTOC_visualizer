import React, { useState, useRef, useEffect } from "react";
import { useSolutions } from "@/components/gtoc/solutions/useSolutions";
import { usePlanetStore } from "@/components/gtoc/stores/planetStore";
import type { Solution } from "@/components/gtoc/solutions/types";
import ColorPickerPortal from "./ColorPickerPortal";
import BodyListPanel from "./BodyListPanel";
import { useMovieStore } from "@/components/gtoc/stores/useMovieStore";
import { enterFullscreen, toggleFullscreen, isFullscreen, getDefaultFullscreenTarget } from "@/components/gtoc/utils/fullscreen";

export default function Ribbon({
    onSave,
    onExit,
    onMakeMovie,
    isSaving
}: {
    onSave?: () => void;
    onExit?: () => void;
    onMakeMovie?: () => void;
    isSaving?: boolean;
}) {
    const [activeTab, setActiveTab] = useState<"solutions" | "view" | "movie">("solutions");
    const { isMovieMode, logos, isRecording, aspectRatio, keyframes, nearbyKeyframeId, isPresentationMode } = useMovieStore();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [fullscreenActive, setFullscreenActive] = useState(false);

    // Keep ribbon "out of the way" in fullscreen, but don't force-hide (Esc exits fullscreen).
    useEffect(() => {
        const handleFs = () => {
            const active = isFullscreen();
            setFullscreenActive(active);
            if (active) setIsCollapsed(true);
        };

        handleFs();

        document.addEventListener("fullscreenchange", handleFs as any);
        document.addEventListener("webkitfullscreenchange", handleFs as any);
        document.addEventListener("mozfullscreenchange", handleFs as any);
        document.addEventListener("MSFullscreenChange", handleFs as any);

        return () => {
            document.removeEventListener("fullscreenchange", handleFs as any);
            document.removeEventListener("webkitfullscreenchange", handleFs as any);
            document.removeEventListener("mozfullscreenchange", handleFs as any);
            document.removeEventListener("MSFullscreenChange", handleFs as any);
        };
    }, []);


    // --- Solutions Logic ---
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

    // --- Body Selector Logic ---
    const {
        planets = [],
        selectedBodies = [],
        centerBodyId,
        togglePlanet,
        setPlanets,
        updatePlanetColor,
        updatePlanetTypeColor,
        setCenterBody,
        showOrbits,
        toggleShowOrbits,
        hoveredContext
    } = usePlanetStore();

    const [showBodyPanel, setShowBodyPanel] = useState(false);
    const bodyPanelBtnRef = useRef<HTMLButtonElement>(null);

    // Hide entire Ribbon in presentation mode
    if (isPresentationMode) return null;

    return (
        <div className="pointer-events-auto fixed top-0 left-0 right-0 z-[1000] flex flex-col font-sans select-none">

            {/* --- TOP BAR (Tabs) --- */}
            <div className="h-10 bg-[#0a0a0c]/95 border-b border-white/10 backdrop-blur-md flex items-center justify-between px-4">
                <div className="flex items-center gap-1 h-full">
                    {/* Logo area */}
                    <div className="mr-4 flex items-center gap-2 text-white/50 font-bold tracking-wider text-xs uppercase">
                        VECTRA <span className="text-white/20">|</span>
                    </div>

                    {/* Context Button (Hover Action) */}


                    {/* Tab: Solutions */}
                    <button
                        onClick={() => { setActiveTab("solutions"); setIsCollapsed(false); }}
                        className={`h-full px-4 text-xs font-medium border-b-2 transition-colors ${activeTab === "solutions" && !isCollapsed
                            ? "border-blue-500 text-white"
                            : "border-transparent text-white/60 hover:text-white hover:bg-white/5"
                            }`}
                    >
                        Solutions
                    </button>

                    {/* Tab: View */}
                    <button
                        onClick={() => { setActiveTab("view"); setIsCollapsed(false); }}
                        className={`h-full px-4 text-xs font-medium border-b-2 transition-colors ${activeTab === "view" && !isCollapsed
                            ? "border-emerald-500 text-white"
                            : "border-transparent text-white/60 hover:text-white hover:bg-white/5"
                            }`}
                    >
                        View
                    </button>

                    {/* Tab: Movie */}
                    <button
                        onClick={() => { setActiveTab("movie"); setIsCollapsed(false); }}
                        className={`h-full px-4 text-xs font-medium border-b-2 transition-colors ${activeTab === "movie" && !isCollapsed
                            ? "border-purple-500 text-white"
                            : "border-transparent text-white/60 hover:text-white hover:bg-white/5"
                            }`}
                    >
                        Movie
                    </button>
                </div>

                {/* Collapse Button */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="text-white/40 hover:text-white transition-colors"
                    title={isCollapsed ? "Expand Ribbon" : "Collapse Ribbon"}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""}`}>
                        <path d="M18 15l-6-6-6 6" />
                    </svg>
                </button>
            </div>

            {/* --- RIBBON CONTENT AREA --- */}
            <div className={`overflow-hidden transition-all duration-300 ease-in-out bg-[#0a0a0c]/90 border-b border-white/10 backdrop-blur-xl ${isCollapsed ? "max-h-0 opacity-0" : "max-h-[140px] opacity-100"
                }`}>
                <div className="h-[120px] w-full px-4 py-3 flex gap-6 overflow-x-auto">

                    {/* === SOLUTIONS PANEL === */}
                    {activeTab === "solutions" && (
                        <>
                            {/* Group: Actions */}
                            <div className="flex gap-2 min-w-[100px] border-r border-white/10 pr-6">
                                {/* Import Button */}
                                <label className="flex flex-col items-center justify-center h-[80px] w-[64px] rounded hover:bg-white/10 border border-white/10 cursor-pointer transition-colors group">
                                    <svg className="w-6 h-6 text-blue-400 group-hover:text-blue-300 mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                                    </svg>
                                    <span className="text-[10px] text-white/70">Import</span>
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

                                {/* Save Button */}
                                <button
                                    onClick={onSave}
                                    disabled={isSaving}
                                    className="flex flex-col items-center justify-center h-[80px] w-[64px] rounded hover:bg-white/10 border border-white/10 transition-colors group disabled:opacity-50"
                                >
                                    <svg className={`w-6 h-6 mb-1 ${isSaving ? "text-yellow-400 animate-pulse" : "text-white/80 group-hover:text-white"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                                        <polyline points="17 21 17 13 7 13 7 21"></polyline>
                                        <polyline points="7 3 7 8 15 8"></polyline>
                                    </svg>
                                    <span className="text-[10px] text-white/70">{isSaving ? "Saving..." : "Save"}</span>
                                </button>
                                {/* Fullscreen Button */}
                                <button
                                    onClick={async () => {
                                        // IMPORTANT: must be called from this click handler
                                        const target = getDefaultFullscreenTarget();
                                        await toggleFullscreen(target);
                                    }}
                                    className={`flex flex-col items-center justify-center h-[80px] w-[64px] rounded border transition-colors group
                                        ${fullscreenActive ? "bg-blue-500/15 border-blue-500/35 hover:bg-blue-500/20" : "hover:bg-white/10 border-white/10"}`}
                                    title={fullscreenActive ? "Exit Fullscreen (Esc)" : "Enter Fullscreen"}
                                >
                                    <svg className="w-6 h-6 text-white/80 group-hover:text-white mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path d="M8 3H3v5" />
                                        <path d="M16 3h5v5" />
                                        <path d="M3 16v5h5" />
                                        <path d="M21 16v5h-5" />
                                    </svg>
                                    <span className="text-[10px] text-white/70">{fullscreenActive ? "Fullscreen" : "Fullscreen"}</span>
                                </button>


                                {/* Exit Button */}
                                <button
                                    onClick={onExit}
                                    className="flex flex-col items-center justify-center h-[80px] w-[64px] rounded hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 transition-colors group"
                                >
                                    <svg className="w-6 h-6 text-red-400 group-hover:text-red-300 mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                        <polyline points="16 17 21 12 16 7"></polyline>
                                        <line x1="21" y1="12" x2="9" y2="12"></line>
                                    </svg>
                                    <span className="text-[10px] text-white/70 group-hover:text-red-200">Exit</span>
                                </button>
                            </div>

                            {/* Group: Loaded Solutions */}
                            <div className="flex flex-col gap-2 flex-1 min-w-[200px]">
                                <span className="text-[10px] text-white/30 uppercase tracking-wider font-semibold">Loaded Solutions</span>
                                <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 content-start">
                                    {solutions.map((s: Solution) => (
                                        <div key={s.id} className="flex items-center gap-2 bg-white/5 rounded px-2 py-1.5 border border-white/5 hover:border-white/20 transition-colors">
                                            {/* Color */}
                                            <button
                                                ref={(el) => { btnRefs.current[s.id] = el; }}
                                                onClick={() => setOpenPicker(openPicker === s.id ? null : s.id)}
                                                className="w-3 h-3 rounded-full border border-white/30 shadow-sm"
                                                style={{ backgroundColor: s.color }}
                                            />

                                            {/* Name */}
                                            <span className="text-xs text-white/90 truncate flex-1 font-mono" title={s.name}>{s.name}</span>

                                            {/* Visibility */}
                                            <button onClick={() => toggle(s.id)} className="text-white/40 hover:text-white transition-colors" title="Toggle Visibility">
                                                {visible[s.id] ? (
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                                                ) : (
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22" /></svg>
                                                )}
                                            </button>

                                            {/* Delete */}
                                            <button onClick={() => deleteSolution(s.id)} className="text-white/20 hover:text-red-400 transition-colors" title="Delete">
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                            </button>

                                            {/* Popup Color Picker */}
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
                                        <div className="col-span-full flex items-center justify-center text-white/20 text-xs italic h-full">
                                            No solutions loaded. Import a file to get started.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}


                    {/* === MOVIE PANEL === */}
                    {activeTab === "movie" && (
                        <>
                            {/* Group: Mode Toggle */}
                            <div className="flex flex-col gap-2 min-w-[100px] border-r border-white/10 pr-6">
                                <span className="text-[10px] text-white/30 uppercase tracking-wider font-semibold mb-auto">Mode</span>
                                <button
                                    onClick={() => useMovieStore.getState().toggleMovieMode()}
                                    className={`flex flex-col items-center justify-center h-[64px] w-[64px] rounded border transition-colors
                                    ${isMovieMode
                                            ? "bg-purple-500/20 border-purple-500/50 text-purple-200"
                                            : "hover:bg-white/5 border-white/5 text-white/50 hover:text-white"
                                        }`}
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
                                        <line x1="7" y1="2" x2="7" y2="22"></line>
                                        <line x1="17" y1="2" x2="17" y2="22"></line>
                                        <line x1="2" y1="12" x2="22" y2="12"></line>
                                        <line x1="2" y1="7" x2="7" y2="7"></line>
                                        <line x1="2" y1="17" x2="7" y2="17"></line>
                                        <line x1="17" y1="17" x2="22" y2="17"></line>
                                        <line x1="17" y1="7" x2="22" y2="7"></line>
                                    </svg>
                                    <span className="text-[10px] mt-1">{isMovieMode ? "ON" : "OFF"}</span>
                                </button>
                            </div>

                            {/* Group: Assets */}
                            <div className="flex flex-col gap-2 min-w-[100px] border-r border-white/10 pr-6">
                                <span className="text-[10px] text-white/30 uppercase tracking-wider font-semibold mb-auto">Assets</span>
                                <label className={`flex flex-col items-center justify-center h-[64px] w-[64px] rounded border transition-colors cursor-pointer group
                                    ${logos.length > 0 ? "bg-white/10 border-white/20" : "hover:bg-white/5 border-white/5 text-white/50 hover:text-white"}`}
                                >
                                    {logos.length > 0 ? (
                                        <img src={logos[0].url} className="w-8 h-8 object-contain mb-1" alt="Logo" />
                                    ) : (
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-1">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                                        </svg>
                                    )}
                                    <span className="text-[10px]">{logos.length > 0 ? `Logos (${logos.length})` : "Upload Logo"}</span>
                                    <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                                        const f = e.target.files?.[0];
                                        if (f) {
                                            const reader = new FileReader();
                                            reader.onload = (ev) => {
                                                if (ev.target?.result) useMovieStore.getState().addLogo(ev.target.result as string);
                                            };
                                            reader.readAsDataURL(f);
                                        }
                                        e.target.value = "";
                                    }} />
                                </label>
                            </div>

                            {/* Group: Keyframes */}
                            <div className="flex flex-col gap-2 min-w-[100px] border-r border-white/10 pr-6">
                                <span className="text-[10px] text-white/30 uppercase tracking-wider font-semibold mb-auto">Keyframes</span>
                                <div className="flex gap-2">
                                    {/* Add / Update Button */}
                                    <button
                                        onClick={() => useMovieStore.getState().triggerKeyframeCapture()}
                                        disabled={!isMovieMode}
                                        className={`flex flex-col items-center justify-center h-[64px] w-[64px] rounded border transition-colors 
                                        ${!isMovieMode ? "opacity-30 border-white/5 cursor-not-allowed" :
                                                nearbyKeyframeId ? "border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300"
                                                    : "border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/20"}`}
                                    >
                                        {nearbyKeyframeId ? (
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-1">
                                                <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                                                <path d="M3 3v5h5" />
                                                <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                                                <path d="M16 21h5v-5" />
                                            </svg>
                                        ) : (
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-1">
                                                <circle cx="12" cy="12" r="10" />
                                                <line x1="12" y1="8" x2="12" y2="16" />
                                                <line x1="8" y1="12" x2="16" y2="12" />
                                            </svg>
                                        )}
                                        <div className="flex flex-col items-center -space-y-1">
                                            <span className="text-[9px] text-white/80">{nearbyKeyframeId ? "Update" : "Add"}</span>
                                            <span className="text-[9px] text-white/40">{keyframes.length}</span>
                                        </div>
                                    </button>

                                    {/* Delete / Clear Actions Stack */}
                                    <div className="flex flex-col h-[64px] w-[40px] gap-1">
                                        {/* Delete Current (Top) */}
                                        <button
                                            onClick={() => nearbyKeyframeId && useMovieStore.getState().removeKeyframe(nearbyKeyframeId)}
                                            disabled={!isMovieMode || !nearbyKeyframeId}
                                            className={`flex-1 flex items-center justify-center rounded border transition-colors
                                            ${!isMovieMode || !nearbyKeyframeId ? "border-white/5 text-white/10 cursor-not-allowed" : "border-red-500/20 bg-red-500/5 text-red-400 hover:bg-red-500/20"}`}
                                            title="Delete Selected Keyframe"
                                        >
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                <path d="M18 6L6 18M6 6l12 12" />
                                            </svg>
                                        </button>

                                        {/* Clear All (Bottom) */}
                                        <button
                                            onClick={() => confirm("Clear all keyframes?") && useMovieStore.getState().clearKeyframes()}
                                            disabled={!isMovieMode}
                                            className={`flex-1 flex items-center justify-center rounded border transition-colors
                                            ${!isMovieMode ? "border-white/5 text-white/10 cursor-not-allowed" : "border-white/5 text-white/30 hover:text-red-400 hover:bg-white/5"}`}
                                            title="Clear All Keyframes"
                                        >
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                <path d="M3 6h18" />
                                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Group: Format */}
                            <div className="flex flex-col gap-2 min-w-[100px] border-r border-white/10 pr-6">
                                <span className="text-[10px] text-white/30 uppercase tracking-wider font-semibold mb-auto">Format</span>
                                <div className="grid grid-cols-2 gap-1 h-[64px]">
                                    {[
                                        { label: "16:9", val: 1.7777 },
                                        { label: "4:3", val: 1.3333 },
                                        { label: "2.35", val: 2.35 },
                                        { label: "1:1", val: 1 },
                                    ].map((opt) => (
                                        <button
                                            key={opt.label}
                                            onClick={() => useMovieStore.getState().setAspectRatio(opt.val)}
                                            className={`px-2 py-1 text-[9px] rounded border transition-colors ${Math.abs(aspectRatio - opt.val) < 0.01
                                                ? "bg-white/20 border-white/40 text-white"
                                                : "border-white/5 text-white/40 hover:bg-white/5 hover:text-white"
                                                }`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Group: Action */}
                            <div className="flex flex-col gap-2 min-w-[140px]">
                                <span className="text-[10px] text-white/30 uppercase tracking-wider font-semibold mb-auto">Action</span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={onMakeMovie}
                                        disabled={!isMovieMode}
                                        className={`flex flex-col items-center justify-center h-[64px] px-4 rounded border transition-all
                                    ${isRecording
                                                ? "bg-red-500/20 border-red-500/50 text-red-200 animate-pulse"
                                                : (!isMovieMode ? "opacity-30 cursor-not-allowed border-white/5" : "bg-purple-500/10 border-purple-500/30 text-purple-200 hover:bg-purple-500/20 hover:border-purple-500/50")
                                            }`}
                                    >
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-1">
                                            {isRecording ? (
                                                <rect x="6" y="6" width="12" height="12" fill="currentColor" />
                                            ) : (
                                                <>
                                                    <circle cx="12" cy="12" r="10"></circle>
                                                    <polygon points="10 8 16 12 10 16 10 8"></polygon>
                                                </>
                                            )}
                                        </svg>
                                        <span className="text-[10px]">{isRecording ? "STOP REC" : "Generate 4K Video"}</span>
                                    </button>

                                    {/* Presentation Mode Button */}
                                    <button
                                        onClick={async () => {
                                            // Fullscreen must be initiated from this click handler.
                                            await enterFullscreen(getDefaultFullscreenTarget());
                                            useMovieStore.getState().togglePresentationMode(true);
                                        }}
                                        disabled={!isMovieMode}
                                        className={`flex flex-col items-center justify-center h-[64px] px-4 rounded border transition-all
                                    ${!isMovieMode ? "opacity-30 cursor-not-allowed border-white/5" : "bg-blue-500/10 border-blue-500/30 text-blue-200 hover:bg-blue-500/20 hover:border-blue-500/50"}`}
                                        title="Start Presentation Mode (Fullscreen Loop)"
                                    >
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-1">
                                            <path d="M15 3h6v6" />
                                            <path d="M9 21H3v-6" />
                                            <path d="M21 3l-7 7" />
                                            <path d="M3 21l7-7" />
                                        </svg>
                                        <span className="text-[10px]">Presentation</span>
                                    </button>
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === "view" && (
                        <>
                            {/* Group: Settings */}
                            <div className="flex flex-col gap-2 min-w-[140px] border-r border-white/10 pr-6">
                                <span className="text-[10px] text-white/30 uppercase tracking-wider font-semibold mb-auto">Settings</span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={toggleShowOrbits}
                                        className={`flex flex-col items-center justify-center h-[64px] w-[64px] rounded border transition-colors group
                                    ${showOrbits
                                                ? "bg-white/10 border-white/20 text-white"
                                                : "hover:bg-white/5 border-white/5 text-white/50 hover:text-white/80"
                                            }`}
                                        title={showOrbits ? "Hide Orbits" : "Show Orbits"}
                                    >
                                        <svg className="w-6 h-6 mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                            <circle cx="12" cy="12" r="9" strokeOpacity={showOrbits ? 1 : 0.5} />
                                            <path d="M12 3a9 9 0 0 1 9 9" strokeOpacity={showOrbits ? 1 : 0.5} strokeDasharray="4 4" />
                                        </svg>
                                        <span className="text-[10px]">{showOrbits ? "Orbits: ON" : "Orbits: OFF"}</span>
                                    </button>

                                    {/* Reset Center Button */}
                                    <button
                                        onClick={() => setCenterBody(null)}
                                        disabled={!centerBodyId}
                                        className={`flex flex-col items-center justify-center h-[64px] w-[64px] rounded border transition-colors group
                                        ${centerBodyId
                                                ? "bg-blue-500/10 border-blue-500/30 text-blue-200 hover:bg-blue-500/20"
                                                : "border-transparent bg-white/5 text-white/30 cursor-not-allowed"
                                            }`}
                                        title="Reset Center to Sun"
                                    >
                                        <svg className="w-6 h-6 mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                            <circle cx="12" cy="12" r="4" />
                                            <path d="M3 12h2" /><path d="M19 12h2" />
                                            <path d="M12 3v2" /><path d="M12 19v2" />
                                            <path d="M5.6 5.6l1.4 1.4" /><path d="M17 17l1.4 1.4" />
                                            <path d="M18.4 5.6l-1.4 1.4" /><path d="M7 17l-1.4 1.4" />
                                        </svg>
                                        <span className="text-[10px]">Center: {centerBodyId ? "Body" : "Sun"}</span>
                                    </button>
                                </div>
                            </div>

                            {/* Group: Window/Panels */}
                            <div className="flex flex-col gap-2 min-w-[200px] border-r border-white/10 pr-6">
                                <span className="text-[10px] text-white/30 uppercase tracking-wider font-semibold mb-auto">Panels</span>
                                <div className="flex gap-2">
                                    <button
                                        ref={bodyPanelBtnRef}
                                        onClick={() => setShowBodyPanel(!showBodyPanel)}
                                        className={`flex flex-col items-center justify-center h-[64px] w-[64px] rounded border transition-colors group
                                        ${showBodyPanel || selectedBodies.length > 0
                                                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-200"
                                                : "hover:bg-white/5 border-white/5 text-white/70 hover:text-white"
                                            }`}
                                    >
                                        <svg className="w-6 h-6 mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                            <circle cx="12" cy="12" r="10" />
                                            <path d="M2 12h20" />
                                            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                                        </svg>
                                        <span className="text-[10px]">Bodies</span>
                                    </button>
                                    <button
                                        onClick={() => usePlanetStore.setState({ selectedBodies: [] })}
                                        disabled={selectedBodies.length === 0}
                                        className="flex flex-col items-center justify-center h-[64px] px-2 rounded border border-transparent hover:bg-white/5 hover:border-red-500/20 text-white/40 hover:text-red-300 disabled:opacity-20 transition-all"
                                        title="Clear Selection"
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
                                    </button>
                                </div>
                            </div>

                            {/* Body List Panel Portal */}
                            <BodyListPanel
                                isOpen={showBodyPanel}
                                onClose={() => setShowBodyPanel(false)}
                                anchorRef={bodyPanelBtnRef}
                                planets={planets}
                                selectedBodies={selectedBodies}
                                centerBodyId={centerBodyId}
                                togglePlanet={togglePlanet}
                                updatePlanetColor={updatePlanetColor}
                                updatePlanetTypeColor={updatePlanetTypeColor}
                                setCenterBody={setCenterBody}
                                btnRefs={btnRefs}
                                openPicker={openPicker}
                                setOpenPicker={setOpenPicker}
                            />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
