import { create } from "zustand";
import { set, get, del, keys } from "idb-keyval";
import type { ProjectData, ProjectMeta } from "@/types/Project";
import { JD_EPOCH_0 } from "@/components/gtoc/utils/constants";

const IDB_PREFIX = "gtoc_proj_";
const META_KEY = "gtoc_projects_meta";

type ProjectStore = {
    // List management (Metadata only)
    projects: ProjectMeta[];
    refreshProjects: () => Promise<void>;
    createProject: (name: string) => Promise<string>;
    deleteProject: (id: string) => Promise<void>;
    renameProject: (id: string, newName: string) => Promise<void>;

    // Active Project
    currentProject: ProjectData | null;
    isLoading: boolean;
    loadProject: (id: string) => Promise<void>;
    closeProject: () => void;

    // Persistence
    saveCurrentProject: () => Promise<void>;
    isSaving: boolean;
};

const isBrowser = () => typeof window !== "undefined";

function safeParse<T>(raw: string | null): T | null {
    if (!raw) return null;
    try {
        return JSON.parse(raw) as T;
    } catch {
        return null;
    }
}

function uuid() {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

export const useProjectStore = create<ProjectStore>((apiSet, apiGet) => ({
    projects: [],
    currentProject: null,
    isLoading: false,
    isSaving: false,

    refreshProjects: async () => {
        if (!isBrowser()) return;

        // First try localStorage meta list (fast)
        try {
            const raw = window.localStorage.getItem(META_KEY);
            const meta = safeParse<ProjectMeta[]>(raw);
            if (meta && Array.isArray(meta)) {
                apiSet({ projects: meta });
                return;
            }
        } catch (e) {
            console.warn("[projectStore] Failed to load project list from localStorage:", e);
        }

        // Recovery: rebuild meta list from IDB keys
        try {
            const allKeys = await keys();
            const projectKeys = allKeys.filter(
                (k) => typeof k === "string" && (k as string).startsWith(IDB_PREFIX)
            ) as string[];

            if (projectKeys.length === 0) {
                apiSet({ projects: [] });
                window.localStorage.setItem(META_KEY, JSON.stringify([]));
                return;
            }

            const metas: ProjectMeta[] = [];
            for (const k of projectKeys) {
                const data = await get<ProjectData>(k);
                if (!data) continue;
                metas.push({
                    id: data.id,
                    name: data.name,
                    createdAt: data.createdAt,
                    modifiedAt: data.modifiedAt,
                    previewColor: data.previewColor,
                    dataset: data.dataset,
                });
            }

            metas.sort((a, b) => b.modifiedAt - a.modifiedAt);
            apiSet({ projects: metas });
            window.localStorage.setItem(META_KEY, JSON.stringify(metas));
        } catch (e) {
            console.warn("[projectStore] Failed to rebuild meta list from IDB:", e);
        }
    },

    createProject: async (name: string) => {
        const id = uuid();
        const now = Date.now();

        const newProject: ProjectData = {
            id,
            name,
            createdAt: now,
            modifiedAt: now,
            dataset: "gtoc13",
            solutions: [],
            solutionVisibility: {},
            selectedBodies: [],
            time: {
                jd: JD_EPOCH_0,
                isPlaying: false,
                rate: 100,
            },
            previewColor: `hsl(${Math.random() * 360}, 70%, 60%)`,
        };

        try {
            await set(IDB_PREFIX + id, newProject);

            const meta: ProjectMeta = {
                id,
                name,
                createdAt: now,
                modifiedAt: now,
                previewColor: newProject.previewColor,
                dataset: "gtoc13",
            };

            const updatedList = [meta, ...apiGet().projects];
            apiSet({ projects: updatedList });

            if (isBrowser()) {
                window.localStorage.setItem(META_KEY, JSON.stringify(updatedList));
            }

            return id;
        } catch (error) {
            console.error("[projectStore] Failed to create project:", error);
            throw error;
        }
    },

    renameProject: async (id: string, newName: string) => {
        const now = Date.now();

        try {
            // 1. Update IDB data
            const project = await get<ProjectData>(IDB_PREFIX + id);
            if (project) {
                const updated = { ...project, name: newName, modifiedAt: now };
                await set(IDB_PREFIX + id, updated);

                // If it's the current project, update state
                if (apiGet().currentProject?.id === id) {
                    apiSet({ currentProject: updated });
                }
            }

            // 2. Update Metadata List
            const updatedList = apiGet().projects.map((p) =>
                p.id === id ? { ...p, name: newName, modifiedAt: now } : p
            );

            apiSet({ projects: updatedList });

            if (isBrowser()) {
                window.localStorage.setItem(META_KEY, JSON.stringify(updatedList));
            }
        } catch (e) {
            console.error("Failed to rename project:", e);
            throw e;
        }
    },

    deleteProject: async (id: string) => {
        await del(IDB_PREFIX + id);

        const updatedList = apiGet().projects.filter((p) => p.id !== id);
        apiSet({ projects: updatedList });

        if (isBrowser()) {
            window.localStorage.setItem(META_KEY, JSON.stringify(updatedList));
        }
    },

    loadProject: async (id: string) => {
        apiSet({ isLoading: true });

        try {
            const data = await get<ProjectData>(IDB_PREFIX + id);
            if (!data) throw new Error("Project not found");

            apiSet({ currentProject: data });

            // Hydrate other stores client-side only (lazy imports prevent hydration crashes)
            if (isBrowser()) {
                const [{ useSolutions }, { usePlanetStore }] = await Promise.all([
                    import("@/components/gtoc/solutions/useSolutions"),
                    import("@/components/gtoc/stores/planetStore"),
                ]);

                useSolutions.setState({
                    solutions: data.solutions ?? [],
                    visible: data.solutionVisibility ?? {},
                });

                console.log("[projectStore] Hydrating Project:", data.id, {
                    pins: data.selectedBodies,
                    center: data.centerBodyId,
                    sols: data.solutions?.length
                });

                usePlanetStore.setState({
                    selectedBodies: data.selectedBodies ?? [],
                    centerBodyId: data.centerBodyId ?? null,
                    customColors: data.customColors ?? {},
                });
            }
        } catch (e) {
            console.error("[projectStore] Failed to load project:", e);
            apiSet({ currentProject: null });
        } finally {
            apiSet({ isLoading: false });
        }
    },

    closeProject: () => {
        apiSet({ currentProject: null });

        // Reset other stores client-side only
        if (!isBrowser()) return;

        void (async () => {
            try {
                // We do NOT want to clear the global "Session State" (persistence) just because a project closed.
                // This allows the user's settings (pins, view) to survive until the next project loads.
                /*
                const [{ useSolutions }, { usePlanetStore }] = await Promise.all([
                    import("@/components/gtoc/solutions/useSolutions"),
                    import("@/components/gtoc/stores/planetStore"),
                ]);

                useSolutions.setState({ solutions: [], visible: {} });
                usePlanetStore.setState({ selectedBodies: [] });
                */
            } catch (e) {
                console.warn("[projectStore] closeProject: failed to reset external stores:", e);
            }
        })();
    },

    saveCurrentProject: async () => {
        const { currentProject } = apiGet();
        if (!currentProject) return;

        apiSet({ isSaving: true });

        try {
            // Default to currentProject values if not in browser
            let solState: any = {
                solutions: currentProject.solutions ?? [],
                visible: currentProject.solutionVisibility ?? {},
            };
            let planetState: any = { selectedBodies: currentProject.selectedBodies ?? [] };

            if (isBrowser()) {
                const [{ useSolutions }, { usePlanetStore }] = await Promise.all([
                    import("@/components/gtoc/solutions/useSolutions"),
                    import("@/components/gtoc/stores/planetStore"),
                ]);

                solState = useSolutions.getState();
                planetState = usePlanetStore.getState();
            }

            const now = Date.now();

            const updatedProject: ProjectData = {
                ...currentProject,
                modifiedAt: now,
                solutions: solState.solutions ?? [],
                solutionVisibility: solState.visible ?? {},
                selectedBodies: planetState.selectedBodies ?? [],
            };

            console.log("[projectStore] Saving Project:", updatedProject.id, {
                pins: updatedProject.selectedBodies,
                sols: updatedProject.solutions.length
            });

            // 1. Persist full data to IDB
            await set(IDB_PREFIX + updatedProject.id, updatedProject);
            apiSet({ currentProject: updatedProject });

            // 2. Update Metadata List safely
            let currentList = apiGet().projects;

            // Guard: If store list is empty (e.g. page refresh), try to hydrate from LocalStorage first
            // to avoid overwriting the valid list with an empty one.
            if (currentList.length === 0 && isBrowser()) {
                try {
                    const raw = window.localStorage.getItem(META_KEY);
                    const meta = safeParse<ProjectMeta[]>(raw);
                    if (meta && Array.isArray(meta)) {
                        currentList = meta;
                    }
                } catch (e) {
                    console.warn("Failed to hydration project list during save:", e);
                }
            }

            const exists = currentList.find((p) => p.id === updatedProject.id);
            let updatedList: ProjectMeta[];

            if (exists) {
                updatedList = currentList.map((p) => (p.id === updatedProject.id ? { ...p, modifiedAt: now } : p));
            } else {
                // Upsert if missing
                const meta: ProjectMeta = {
                    id: updatedProject.id,
                    name: updatedProject.name,
                    createdAt: updatedProject.createdAt,
                    modifiedAt: now,
                    previewColor: updatedProject.previewColor,
                    dataset: updatedProject.dataset,
                };
                updatedList = [meta, ...currentList];
            }

            // Sort by recently modified
            updatedList.sort((a, b) => b.modifiedAt - a.modifiedAt);

            apiSet({ projects: updatedList });

            if (isBrowser()) {
                window.localStorage.setItem(META_KEY, JSON.stringify(updatedList));
            }
        } finally {
            apiSet({ isSaving: false });
        }
    },
}));

/**
 * Helper action to update time in the store (called by the Viewer loop).
 * MUST be idempotent to avoid update-depth loops.
 */
export const updateProjectTime = (jd: number, isPlaying: boolean, rate: number) => {
    useProjectStore.setState((state) => {
        const cp = state.currentProject;
        if (!cp) return {};

        const prev = cp.time;

        // Guard: avoid re-setting same values (breaks feedback loops)
        if (prev && prev.jd === jd && prev.isPlaying === isPlaying && prev.rate === rate) {
            return {};
        }

        return {
            currentProject: {
                ...cp,
                time: { jd, isPlaying, rate },
            },
        };
    });
};
