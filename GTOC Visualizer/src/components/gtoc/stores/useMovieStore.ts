"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface Keyframe {
    id: string;
    jd: number;
    position: [number, number, number];
    target: [number, number, number];
    centerBodyId?: string | null;
}

export interface LogoEntry {
    id: string;
    url: string;
    position: { x: number; y: number };
    scale: number;
}

interface MovieState {
    isMovieMode: boolean;
    isPresentationMode: boolean;
    isRecording: boolean;
    recordingProgress: number;
    aspectRatio: number;

    // Offline export state (4K)
    isExporting: boolean;
    exportProgress: number;
    exportFrameInfo: string;
    exportStartTime: number;

    logos: LogoEntry[];
    addLogo: (url: string) => void;
    updateLogo: (id: string, patch: Partial<Omit<LogoEntry, "id">>) => void;
    removeLogo: (id: string) => void;

    // Kept for backward compat — delegates to logos[0]
    logoUrl: string | null;
    logoPosition: { x: number; y: number };
    logoScale: number;
    setLogo: (url: string | null) => void;
    setLogoPosition: (pos: { x: number; y: number }) => void;
    setLogoScale: (scale: number) => void;

    toggleMovieMode: (active?: boolean) => void;
    togglePresentationMode: (active?: boolean) => void;

    presentationOpacity: number;
    setPresentationOpacity: (opacity: number) => void;

    setRecording: (isRecording: boolean, progress?: number) => void;
    setRecordingProgress: (progress: number) => void;
    setAspectRatio: (ratio: number) => void;

    showExportSettings: boolean;
    exportFilename: string;
    exportRate: number;
    setShowExportSettings: (show: boolean) => void;
    setExportFilename: (name: string) => void;
    setExportRate: (rate: number) => void;

    // Mission name overlay
    missionName: string;
    missionNameSize: number;
    setMissionName: (name: string) => void;
    setMissionNameSize: (size: number) => void;

    // Export actions
    startExport: () => void;
    updateExportProgress: (progress: number, frameInfo: string) => void;
    finishExport: () => void;

    keyframes: Keyframe[];
    captureKeyframeTrigger: number;
    nearbyKeyframeId: string | null;
    setNearbyKeyframeId: (id: string | null) => void;
    addKeyframe: (k: Keyframe) => void;
    updateKeyframe: (id: string, k: Partial<Keyframe>) => void;
    removeKeyframe: (id: string) => void;
    clearKeyframes: () => void;
    triggerKeyframeCapture: () => void;
}

export const ASPECT_RATIOS = {
    "16:9": 16 / 9,
    "4:3": 4 / 3,
    "1:1": 1,
    "2.35:1": 2.35,
    "9:16": 9 / 16,
};

let _logoCounter = 0;
function nextLogoId() {
    return `logo-${Date.now()}-${_logoCounter++}`;
}

const defaultPersisted = {
    isMovieMode: false,
    logos: [] as LogoEntry[],
    aspectRatio: ASPECT_RATIOS["16:9"],
    keyframes: [] as Keyframe[],
    missionName: "",
    missionNameSize: 32,
};

type PersistedMovieState = typeof defaultPersisted;

export const useMovieStore = create<MovieState>()(
    persist(
        (set, get) => ({
            isMovieMode: false,
            isPresentationMode: false,
            isRecording: false,
            recordingProgress: 0,
            aspectRatio: ASPECT_RATIOS["16:9"],

            logos: [],

            // Derived compat getters are computed via get() in selectors;
            // for the store object we seed these:
            logoUrl: null,
            logoPosition: { x: 0.05, y: 0.05 },
            logoScale: 1,

            keyframes: [],
            captureKeyframeTrigger: 0,
            nearbyKeyframeId: null,

            toggleMovieMode: (active) =>
                set((state) => ({ isMovieMode: active ?? !state.isMovieMode })),
            togglePresentationMode: (active) =>
                set((state) => ({ isPresentationMode: active ?? !state.isPresentationMode })),

            presentationOpacity: 0,
            setPresentationOpacity: (opacity) => set({ presentationOpacity: opacity }),

            // ---- Multi-logo API ----
            addLogo: (url) => {
                const entry: LogoEntry = {
                    id: nextLogoId(),
                    url,
                    position: { x: 0.05, y: 0.05 },
                    scale: 1,
                };
                set((state) => {
                    const logos = [...state.logos, entry];
                    return { logos, logoUrl: logos[0]?.url ?? null };
                });
            },

            updateLogo: (id, patch) =>
                set((state) => {
                    const logos = state.logos.map((l) =>
                        l.id === id ? { ...l, ...patch } : l
                    );
                    return {
                        logos,
                        logoUrl: logos[0]?.url ?? null,
                        logoPosition: logos[0]?.position ?? { x: 0.05, y: 0.05 },
                        logoScale: logos[0]?.scale ?? 1,
                    };
                }),

            removeLogo: (id) =>
                set((state) => {
                    const logos = state.logos.filter((l) => l.id !== id);
                    return {
                        logos,
                        logoUrl: logos[0]?.url ?? null,
                        logoPosition: logos[0]?.position ?? { x: 0.05, y: 0.05 },
                        logoScale: logos[0]?.scale ?? 1,
                    };
                }),

            // ---- Legacy single-logo compat ----
            setLogo: (url) => {
                if (!url) {
                    // Clear all logos
                    set({ logos: [], logoUrl: null, logoPosition: { x: 0.05, y: 0.05 }, logoScale: 1 });
                    return;
                }
                // Add a new logo
                get().addLogo(url);
            },
            setLogoPosition: (pos) => {
                const logos = get().logos;
                if (logos.length > 0) get().updateLogo(logos[0].id, { position: pos });
            },
            setLogoScale: (scale) => {
                const logos = get().logos;
                if (logos.length > 0) get().updateLogo(logos[0].id, { scale });
            },

            setRecording: (isRecording, progress = 0) =>
                set({ isRecording, recordingProgress: progress }),
            setRecordingProgress: (progress) => set({ recordingProgress: progress }),

            // ---- Export settings modal ----
            showExportSettings: false,
            exportFilename: "vectra_4k_export",
            exportRate: 50,
            setShowExportSettings: (show) => set({ showExportSettings: show }),
            setExportFilename: (name) => set({ exportFilename: name }),
            setExportRate: (rate) => set({ exportRate: rate }),

            // ---- Mission name ----
            missionName: "",
            missionNameSize: 32,
            setMissionName: (name) => set({ missionName: name }),
            setMissionNameSize: (size) => set({ missionNameSize: size }),

            // ---- Offline 4K export ----
            isExporting: false,
            exportProgress: 0,
            exportFrameInfo: "",
            exportStartTime: 0,

            startExport: () =>
                set({ isExporting: true, isRecording: true, showExportSettings: false, exportProgress: 0, exportFrameInfo: "Preparing…", exportStartTime: Date.now() }),
            updateExportProgress: (progress, frameInfo) =>
                set({ exportProgress: progress, exportFrameInfo: frameInfo, recordingProgress: progress }),
            finishExport: () =>
                set({ isExporting: false, isRecording: false, exportProgress: 0, exportFrameInfo: "", recordingProgress: 0, exportStartTime: 0 }),
            setAspectRatio: (ratio) => set({ aspectRatio: ratio }),
            setNearbyKeyframeId: (id) => set({ nearbyKeyframeId: id }),

            addKeyframe: (k) =>
                set((state) => ({
                    keyframes: [...state.keyframes, k].sort((a, b) => a.jd - b.jd),
                })),
            updateKeyframe: (id, k) =>
                set((state) => ({
                    keyframes: state.keyframes
                        .map((old) => (old.id === id ? { ...old, ...k } : old))
                        .sort((a, b) => a.jd - b.jd),
                })),
            removeKeyframe: (id) =>
                set((state) => ({ keyframes: state.keyframes.filter((k) => k.id !== id) })),
            clearKeyframes: () => set({ keyframes: [] }),
            triggerKeyframeCapture: () =>
                set((state) => ({ captureKeyframeTrigger: state.captureKeyframeTrigger + 1 })),
        }),
        {
            name: "vectra-movie-store",
            version: 4,
            storage: createJSONStorage(() =>
                typeof window !== "undefined" ? window.localStorage : (undefined as any)
            ),
            migrate: (persisted, fromVersion) => {
                const p = (persisted ?? {}) as any;

                // Migrate from single-logo fields (v3) to logos array (v4)
                if (fromVersion < 4) {
                    const logos: LogoEntry[] = [];
                    if (p.logoUrl && !p.logoUrl.startsWith("blob:")) {
                        logos.push({
                            id: nextLogoId(),
                            url: p.logoUrl,
                            position: p.logoPosition ?? { x: 0.05, y: 0.05 },
                            scale: p.logoScale ?? 1,
                        });
                    }
                    // Remove old fields
                    delete p.logoUrl;
                    delete p.logoPosition;
                    delete p.logoScale;
                    return { ...defaultPersisted, ...p, logos } as PersistedMovieState;
                }

                // Clear stale blob URLs from logos
                if (Array.isArray(p.logos)) {
                    p.logos = p.logos.filter(
                        (l: LogoEntry) => l.url && !l.url.startsWith("blob:")
                    );
                }

                return { ...defaultPersisted, ...p } as PersistedMovieState;
            },
            partialize: (state) => ({
                isMovieMode: state.isMovieMode,
                logos: state.logos
                    .filter((l) => !l.url.startsWith("blob:"))
                    .map(({ id, url, position, scale }) => ({ id, url, position, scale })),
                aspectRatio: state.aspectRatio,
                keyframes: state.keyframes,
            }),
        }
    )
);
