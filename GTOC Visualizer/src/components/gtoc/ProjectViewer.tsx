"use client";

import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import MainCanvasWrapper from "./MainCanvasWrapper";
import { useProjectStore, updateProjectTime } from "./stores/projectStore";

type Props = {
    projectId: string;
};

export default function ProjectViewer({ projectId }: Props) {
    const router = useRouter();

    // Granular selectors
    const currentProject = useProjectStore((s) => s.currentProject);
    const loadProject = useProjectStore((s) => s.loadProject);
    const isLoading = useProjectStore((s) => s.isLoading);
    const saveCurrentProject = useProjectStore((s) => s.saveCurrentProject);
    const closeProject = useProjectStore((s) => s.closeProject);
    const isSaving = useProjectStore((s) => s.isSaving);

    const loadAttemptedRef = useRef<string | null>(null);

    // Load project on mount / when projectId changes
    useEffect(() => {
        if (projectId && (!currentProject || currentProject.id !== projectId)) {
            if (loadAttemptedRef.current !== projectId) {
                loadAttemptedRef.current = projectId;
                console.log("[ProjectViewer] Loading project:", projectId);
                loadProject(projectId);
            }
        }
    }, [projectId, currentProject, loadProject]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            console.log("[ProjectViewer] Unmounting/Closing project");
            closeProject();
        };
    }, [closeProject]);

    // Auto-save loop
    useEffect(() => {
        const interval = window.setInterval(() => {
            const state = useProjectStore.getState();
            if (state.currentProject && state.currentProject.id === projectId && !state.isLoading) {
                saveCurrentProject();
            }
        }, 5000);

        return () => window.clearInterval(interval);
    }, [projectId, saveCurrentProject]);

    const exitToDashboard = () => {
        console.log("[ProjectViewer] Exit clicked");

        try {
            closeProject();
        } catch { }

        // Next router (dev)
        try {
            router.replace("/");
        } catch { }

        // Hard fallback by scheme
        window.setTimeout(() => {
            const url = window.location.href;

            // If you're running Next dev (http://localhost:3000), DO NOT go to /index.html
            if (url.startsWith("http://") || url.startsWith("https://")) {
                window.location.assign("/");
                return;
            }

            // If you're in Tauri/file export, index.html is meaningful
            // Use relative so it works regardless of base path
            window.location.assign("./index.html");
        }, 50);
    };

    if (isLoading) {
        return (
            <div className="w-full h-screen bg-black flex items-center justify-center text-white/50 space-x-3">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Loading Mission Data...</span>
            </div>
        );
    }

    if (!currentProject || currentProject.id !== projectId) {
        console.warn("[ProjectViewer] mismatch or missing project", {
            current: currentProject?.id,
            expected: projectId,
        });

        return (
            <div className="w-full h-screen bg-black flex flex-col items-center justify-center text-white space-y-4">
                <p className="text-red-500">Failed to load mission data.</p>
                <button
                    onClick={exitToDashboard}
                    className="px-4 py-2 bg-white/10 rounded hover:bg-white/20"
                >
                    Return to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="relative w-full h-screen bg-black fade-in">
            {/* Controls Overlay */}
            <MainCanvasWrapper
                initialTime={currentProject.time}
                onTimeUpdate={(jd: number, isPlaying: boolean, rate: number) =>
                    updateProjectTime(jd, isPlaying, rate)
                }
                onSave={saveCurrentProject}
                onExit={exitToDashboard}
                isSaving={isSaving}
            />
        </div>
    );
}
