"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useProjectStore } from "./stores/projectStore";
import { motion } from "framer-motion";

import LandingBackground from "./LandingBackground";

export default function LandingPage() {
    const router = useRouter();

    const projects = useProjectStore((s) => s.projects);
    const refreshProjects = useProjectStore((s) => s.refreshProjects);
    const createProject = useProjectStore((s) => s.createProject);
    const deleteProject = useProjectStore((s) => s.deleteProject);
    const renameProject = useProjectStore((s) => s.renameProject);

    const [hydrated, setHydrated] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    // Create Modal
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newProjectName, setNewProjectName] = useState("");

    // Rename Modal
    const [showRenameModal, setShowRenameModal] = useState(false);
    const [projectToRename, setProjectToRename] = useState<{ id: string, name: string } | null>(null);
    const [renameName, setRenameName] = useState("");

    // Delete Modal
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

    useEffect(() => {
        refreshProjects();
        setHydrated(true);
    }, [refreshProjects]);

    const openCreateModal = () => {
        setNewProjectName(`Mission ${projects.length + 1}`);
        setShowCreateModal(true);
    };

    const closeCreateModal = () => {
        if (isCreating) return;
        setShowCreateModal(false);
    };

    const handleCreate = async () => {
        if (!newProjectName.trim()) return;

        setIsCreating(true);
        try {
            // Add a timeout to force navigation if it hangs (common in some envs)
            const withTimeout = <T,>(promise: Promise<T>, ms: number) =>
                new Promise<T>((resolve, reject) => {
                    const t = setTimeout(() => reject(new Error("Timeout")), ms);
                    promise.then((v) => {
                        window.clearTimeout(t);
                        resolve(v);
                    }).catch((e) => {
                        window.clearTimeout(t);
                        reject(e);
                    });
                });

            const id = await withTimeout(createProject(newProjectName), 5000);

            console.log("[Landing] Project created, navigating to:", id);

            // Wait a tick for store to update
            await new Promise(r => setTimeout(r, 100));

            // Force navigation
            window.location.href = `/gtoc/project?id=${id}`;
        } catch (error) {
            console.error("Failed to create project:", error);
            alert("Failed to create project. See console.");
        } finally {
            setIsCreating(false);
            setShowCreateModal(false);
        }
    };

    const handleOpen = (id: string) => {
        console.log("[Landing] Opening project:", id);
        // Use window.location for robust navigation in static export
        window.location.href = `/gtoc/project?id=${id}`;
    };

    const openRenameModal = (e: React.MouseEvent, id: string, name: string) => {
        e.preventDefault();
        e.stopPropagation();
        setProjectToRename({ id, name });
        setRenameName(name);
        setShowRenameModal(true);
    };

    const closeRenameModal = () => {
        setShowRenameModal(false);
        setProjectToRename(null);
    };

    const handleRename = async () => {
        if (!projectToRename || !renameName.trim()) return;
        try {
            await renameProject(projectToRename.id, renameName);
            closeRenameModal();
        } catch (e) {
            console.error("Rename failed:", e);
            alert("Failed to rename project");
        }
    };

    const openDeleteModal = (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        e.stopPropagation();
        setProjectToDelete(id);
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setProjectToDelete(null);
    };

    const confirmDelete = async () => {
        if (!projectToDelete) return;
        try {
            await deleteProject(projectToDelete);
            closeDeleteModal();
        } catch (e) {
            console.error("Delete failed:", e);
        }
    };

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        e.stopPropagation();
        console.log("[Landing] Delete requested for:", id);

        if (confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
            console.log("[Landing] Confirmed delete for:", id);
            await deleteProject(id);
        }
    };

    return (
        <div className="min-h-screen relative text-white font-sans selection:bg-purple-500/30 overflow-hidden">
            <LandingBackground />

            <div className="relative z-10 p-8">
                <div className="max-w-6xl mx-auto space-y-12">
                    {/* Header */}
                    <header className="flex items-end justify-between border-b border-white/10 pb-6">
                        <div className="space-y-2">
                            <h1 className="text-4xl font-light tracking-tight flex items-center gap-4">
                                {/* User requested an SVG logo here */}
                                <img src="/vectra.svg" alt="Vectra Logo" className="h-30 w-auto mt-20" />
                            </h1>
                            <p className="text-white/50 text-sm">Select a mission manifest to begin.</p>

                            <p className="text-xs text-white/30 font-mono">
                                Hydrated: {hydrated ? "YES" : "NO"} | Projects: {projects.length}
                            </p>
                        </div>

                        <button
                            type="button"
                            onPointerDown={() => console.log("[Landing] pointerdown on New Project")}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                console.log("[Landing] New Project clicked");
                                openCreateModal();
                            }}
                            disabled={isCreating}
                            className={`relative z-50 bg-white text-black hover:bg-white/90 px-6 py-2.5 rounded-full font-medium transition-colors flex items-center gap-2 text-sm ${isCreating ? "opacity-60 cursor-not-allowed" : ""
                                }`}
                        >
                            <span>+</span> {isCreating ? "Creating..." : "New Project"}
                        </button>
                    </header>

                    {/* Project Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((p) => (
                            <motion.div
                                key={p.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                whileHover={{ scale: 1.01, translateY: -2 }}
                                onClick={() => handleOpen(p.id)}
                                className="group relative bg-[#0a0a0a] border border-white/10 rounded-xl p-6 cursor-pointer hover:border-white/30 transition-all shadow-xl hover:shadow-2xl hover:shadow-purple-900/10 overflow-hidden"
                            >
                                <div
                                    className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-transparent to-white/5 blur-2xl -mr-10 -mt-10 rounded-full"
                                    style={{
                                        background: `radial-gradient(circle at center, ${p.previewColor || "#444"}, transparent 70%)`,
                                    }}
                                />

                                <div className="relative z-10 flex flex-col h-full justify-between gap-8 h-40">
                                    <div>
                                        <h3 className="text-xl font-medium tracking-wide group-hover:text-purple-200 transition-colors">
                                            {p.name}
                                        </h3>
                                        <div className="flex flex-col gap-1 mt-2 text-xs text-white/40 font-mono">
                                            <span>ID: {p.id.slice(0, 8)}</span>
                                            <span>Mod: {new Date(p.modifiedAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-end opacity-60 group-hover:opacity-100 transition-opacity">
                                        <span className="text-xs uppercase tracking-widest text-white/30">
                                            {(p.dataset || "").toUpperCase()}
                                        </span>

                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={(e) => openRenameModal(e, p.id, p.name)}
                                                className="relative z-50 p-2 -m-2 text-white/20 hover:text-blue-400 transition-colors"
                                                title="Rename Project"
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                                </svg>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={(e) => openDeleteModal(e, p.id)}
                                                className="relative z-50 p-2 -m-2 text-white/20 hover:text-red-400 transition-colors"
                                                title="Delete Project"
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="3 6 5 6 21 6"></polyline>
                                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}

                        {projects.length === 0 && (
                            <div
                                onClick={() => openCreateModal()}
                                className="border border-dashed border-white/10 rounded-xl p-6 flex flex-col items-center justify-center text-white/30 gap-4 cursor-pointer hover:bg-white/5 hover:border-white/20 hover:text-white/60 transition-colors min-h-[200px]"
                            >
                                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-2xl">+</div>
                                <p>Create your first project</p>
                            </div>
                        )}
                    </div>

                    {/* Create Project Modal */}
                    {showCreateModal && (
                        <div
                            className="fixed inset-0 z-[999] bg-black/70 flex items-center justify-center p-4"
                            // Only close when clicking the backdrop itself (not the modal content)
                            onClick={(e) => {
                                if (e.target === e.currentTarget) closeCreateModal();
                            }}
                        >
                            <div
                                className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0a0a0a] p-6 shadow-2xl"
                                // Prevent backdrop click close from clicks inside content
                                onClick={(e) => e.stopPropagation()}
                            >
                                <h2 className="text-lg font-medium">New Project</h2>
                                <p className="text-sm text-white/50 mt-1">Enter a project name to create it.</p>

                                <input
                                    autoFocus
                                    value={newProjectName}
                                    onChange={(e) => setNewProjectName(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") handleCreate();
                                        if (e.key === "Escape") closeCreateModal();
                                    }}
                                    className="mt-4 w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm outline-none focus:border-white/30"
                                    placeholder="Mission name"
                                />

                                <div className="mt-5 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={closeCreateModal}
                                        className="px-4 py-2 rounded-full text-sm text-white/70 hover:text-white hover:bg-white/5 transition disabled:opacity-50"
                                        disabled={isCreating}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleCreate}
                                        className="px-4 py-2 rounded-full text-sm bg-white text-black hover:bg-white/90 transition disabled:opacity-60"
                                        disabled={isCreating || !newProjectName.trim()}
                                    >
                                        {isCreating ? "Creating..." : "Create"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* Rename Project Modal */}
                    {showRenameModal && (
                        <div
                            className="fixed inset-0 z-[999] bg-black/70 flex items-center justify-center p-4"
                            onClick={(e) => {
                                if (e.target === e.currentTarget) closeRenameModal();
                            }}
                        >
                            <div
                                className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0a0a0a] p-6 shadow-2xl"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <h2 className="text-lg font-medium">Rename Project</h2>
                                <p className="text-sm text-white/50 mt-1">Enter a new name for your project.</p>

                                <input
                                    autoFocus
                                    value={renameName}
                                    onChange={(e) => setRenameName(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") handleRename();
                                        if (e.key === "Escape") closeRenameModal();
                                    }}
                                    className="mt-4 w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm outline-none focus:border-white/30"
                                    placeholder="Project Name"
                                />

                                <div className="mt-5 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={closeRenameModal}
                                        className="px-4 py-2 rounded-full text-sm text-white/70 hover:text-white hover:bg-white/5 transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleRename}
                                        className="px-4 py-2 rounded-full text-sm bg-white text-black hover:bg-white/90 transition disabled:opacity-60"
                                        disabled={!renameName.trim()}
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Delete Confirmation Modal */}
                    {showDeleteModal && (
                        <div
                            className="fixed inset-0 z-[999] bg-black/70 flex items-center justify-center p-4"
                            onClick={(e) => {
                                if (e.target === e.currentTarget) closeDeleteModal();
                            }}
                        >
                            <div
                                className="w-full max-w-sm rounded-2xl border border-red-500/20 bg-[#0a0a0a] p-6 shadow-2xl shadow-red-900/10"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <h2 className="text-lg font-medium text-red-400 flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                    Delete Project?
                                </h2>
                                <p className="text-sm text-white/60 mt-2">
                                    Are you sure you want to delete this project? This action cannot be undone.
                                </p>

                                <div className="mt-6 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={closeDeleteModal}
                                        className="px-4 py-2 rounded-full text-sm text-white/70 hover:text-white hover:bg-white/5 transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={confirmDelete}
                                        className="px-4 py-2 rounded-full text-sm bg-red-500 text-white hover:bg-red-600 transition"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
