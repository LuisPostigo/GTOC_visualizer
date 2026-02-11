(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/gtoc/MainCanvasWrapper.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MainCanvasWrapper
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/shared/lib/app-dynamic.js [app-client] (ecmascript)");
;
"use client";
;
;
const ViewerCanvas = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_context__.A("[project]/src/components/gtoc/ViewerCanvas.tsx [app-client] (ecmascript, next/dynamic entry, async loader)"), {
    loadableGenerated: {
        modules: [
            "[project]/src/components/gtoc/ViewerCanvas.tsx [app-client] (ecmascript, next/dynamic entry)"
        ]
    },
    ssr: false
});
_c = ViewerCanvas;
function MainCanvasWrapper(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ViewerCanvas, {
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/gtoc/MainCanvasWrapper.tsx",
        lineNumber: 10,
        columnNumber: 10
    }, this);
}
_c1 = MainCanvasWrapper;
var _c, _c1;
__turbopack_context__.k.register(_c, "ViewerCanvas");
__turbopack_context__.k.register(_c1, "MainCanvasWrapper");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/gtoc/utils/constants.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ALTAIRA_GM",
    ()=>ALTAIRA_GM,
    "AU_KM",
    ()=>AU_KM,
    "BODY_WEIGHTS",
    ()=>BODY_WEIGHTS,
    "COMPETITION",
    ()=>COMPETITION,
    "CONSTANTS",
    ()=>CONSTANTS,
    "DAYS_PER_YEAR",
    ()=>DAYS_PER_YEAR,
    "JD_EPOCH_0",
    ()=>JD_EPOCH_0,
    "JD_SIM_START",
    ()=>JD_SIM_START,
    "MILISECONDS_PER_DAY",
    ()=>MILISECONDS_PER_DAY,
    "SAIL",
    ()=>SAIL,
    "SECONDS_PER_DAY",
    ()=>SECONDS_PER_DAY,
    "SYSTEM_NAME",
    ()=>SYSTEM_NAME,
    "TIME_BONUS",
    ()=>TIME_BONUS,
    "TYPE_COLORS",
    ()=>TYPE_COLORS,
    "UNIX_EPOCH_JD",
    ()=>UNIX_EPOCH_JD
]);
const SYSTEM_NAME = "Altaira System";
const AU_KM = 149_597_870.691; // kilometers per astronomical unit
const SECONDS_PER_DAY = 86_400; // seconds per day
const DAYS_PER_YEAR = 365.25; // mean solar days per year
const ALTAIRA_GM = 139_348_062_043.343; // km³/s² (gravitational parameter)
const JD_EPOCH_0 = 2451545.0;
const JD_SIM_START = JD_EPOCH_0;
const UNIX_EPOCH_JD = 2440587.5;
const MILISECONDS_PER_DAY = 86_400_000;
const SAIL = {
    FLUX_1AU: 5.4026e-6,
    AREA: 15_000,
    MASS: 500
};
const COMPETITION = {
    MAX_YEARS: 200,
    MIN_PERIHELION: 0.01,
    MAX_PERIHELION: 0.05
};
const BODY_WEIGHTS = {
    1: 0.1,
    2: 1,
    3: 2,
    4: 3,
    1000: 5,
    5: 7,
    6: 10,
    7: 15,
    8: 20,
    9: 35,
    10: 50,
    ASTEROIDS: 1,
    COMETS: 3
};
const TIME_BONUS = {
    EARLY: 1.13,
    LATE_SLOPE: -0.005,
    LATE_INTERCEPT: 1.165
};
const TYPE_COLORS = {
    Planet: "#6aa6ff",
    Asteroid: "#bfbfbf",
    Comet: "#a0ffa0"
};
const CONSTANTS = {
    AU_KM,
    SECONDS_PER_DAY,
    DAYS_PER_YEAR,
    ALTAIRA_GM,
    JD_EPOCH_0,
    JD_SIM_START,
    UNIX_EPOCH_JD,
    MILISECONDS_PER_DAY,
    SAIL,
    COMPETITION,
    BODY_WEIGHTS,
    TIME_BONUS
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/gtoc/stores/projectStore.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "updateProjectTime",
    ()=>updateProjectTime,
    "useProjectStore",
    ()=>useProjectStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$idb$2d$keyval$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/idb-keyval/dist/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/gtoc/utils/constants.ts [app-client] (ecmascript)");
;
;
;
const IDB_PREFIX = "gtoc_proj_";
const META_KEY = "gtoc_projects_meta";
const isBrowser = ()=>("TURBOPACK compile-time value", "object") !== "undefined";
function safeParse(raw) {
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch  {
        return null;
    }
}
function uuid() {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c)=>{
        const r = Math.random() * 16 | 0;
        const v = c === "x" ? r : r & 0x3 | 0x8;
        return v.toString(16);
    });
}
const useProjectStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])((apiSet, apiGet)=>({
        projects: [],
        currentProject: null,
        isLoading: false,
        isSaving: false,
        refreshProjects: async ()=>{
            if (!isBrowser()) //TURBOPACK unreachable
            ;
            // First try localStorage meta list (fast)
            try {
                const raw = window.localStorage.getItem(META_KEY);
                const meta = safeParse(raw);
                if (meta && Array.isArray(meta)) {
                    apiSet({
                        projects: meta
                    });
                    return;
                }
            } catch (e) {
                console.warn("[projectStore] Failed to load project list from localStorage:", e);
            }
            // Recovery: rebuild meta list from IDB keys
            try {
                const allKeys = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$idb$2d$keyval$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["keys"])();
                const projectKeys = allKeys.filter((k)=>typeof k === "string" && k.startsWith(IDB_PREFIX));
                if (projectKeys.length === 0) {
                    apiSet({
                        projects: []
                    });
                    window.localStorage.setItem(META_KEY, JSON.stringify([]));
                    return;
                }
                const metas = [];
                for (const k of projectKeys){
                    const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$idb$2d$keyval$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["get"])(k);
                    if (!data) continue;
                    metas.push({
                        id: data.id,
                        name: data.name,
                        createdAt: data.createdAt,
                        modifiedAt: data.modifiedAt,
                        previewColor: data.previewColor,
                        dataset: data.dataset
                    });
                }
                metas.sort((a, b)=>b.modifiedAt - a.modifiedAt);
                apiSet({
                    projects: metas
                });
                window.localStorage.setItem(META_KEY, JSON.stringify(metas));
            } catch (e) {
                console.warn("[projectStore] Failed to rebuild meta list from IDB:", e);
            }
        },
        createProject: async (name)=>{
            const id = uuid();
            const now = Date.now();
            const newProject = {
                id,
                name,
                createdAt: now,
                modifiedAt: now,
                dataset: "gtoc13",
                solutions: [],
                solutionVisibility: {},
                selectedBodies: [],
                time: {
                    jd: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["JD_EPOCH_0"],
                    isPlaying: false,
                    rate: 100
                },
                previewColor: `hsl(${Math.random() * 360}, 70%, 60%)`
            };
            try {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$idb$2d$keyval$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["set"])(IDB_PREFIX + id, newProject);
                const meta = {
                    id,
                    name,
                    createdAt: now,
                    modifiedAt: now,
                    previewColor: newProject.previewColor,
                    dataset: "gtoc13"
                };
                const updatedList = [
                    meta,
                    ...apiGet().projects
                ];
                apiSet({
                    projects: updatedList
                });
                if (isBrowser()) {
                    window.localStorage.setItem(META_KEY, JSON.stringify(updatedList));
                }
                return id;
            } catch (error) {
                console.error("[projectStore] Failed to create project:", error);
                throw error;
            }
        },
        renameProject: async (id, newName)=>{
            const now = Date.now();
            try {
                // 1. Update IDB data
                const project = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$idb$2d$keyval$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["get"])(IDB_PREFIX + id);
                if (project) {
                    const updated = {
                        ...project,
                        name: newName,
                        modifiedAt: now
                    };
                    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$idb$2d$keyval$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["set"])(IDB_PREFIX + id, updated);
                    // If it's the current project, update state
                    if (apiGet().currentProject?.id === id) {
                        apiSet({
                            currentProject: updated
                        });
                    }
                }
                // 2. Update Metadata List
                const updatedList = apiGet().projects.map((p)=>p.id === id ? {
                        ...p,
                        name: newName,
                        modifiedAt: now
                    } : p);
                apiSet({
                    projects: updatedList
                });
                if (isBrowser()) {
                    window.localStorage.setItem(META_KEY, JSON.stringify(updatedList));
                }
            } catch (e) {
                console.error("Failed to rename project:", e);
                throw e;
            }
        },
        deleteProject: async (id)=>{
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$idb$2d$keyval$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["del"])(IDB_PREFIX + id);
            const updatedList = apiGet().projects.filter((p)=>p.id !== id);
            apiSet({
                projects: updatedList
            });
            if (isBrowser()) {
                window.localStorage.setItem(META_KEY, JSON.stringify(updatedList));
            }
        },
        loadProject: async (id)=>{
            apiSet({
                isLoading: true
            });
            try {
                const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$idb$2d$keyval$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["get"])(IDB_PREFIX + id);
                if (!data) throw new Error("Project not found");
                apiSet({
                    currentProject: data
                });
                // Hydrate other stores client-side only (lazy imports prevent hydration crashes)
                if (isBrowser()) {
                    const [{ useSolutions }, { usePlanetStore }] = await Promise.all([
                        __turbopack_context__.A("[project]/src/components/gtoc/solutions/useSolutions.ts [app-client] (ecmascript, async loader)"),
                        __turbopack_context__.A("[project]/src/components/gtoc/stores/planetStore.ts [app-client] (ecmascript, async loader)")
                    ]);
                    useSolutions.setState({
                        solutions: data.solutions ?? [],
                        visible: data.solutionVisibility ?? {}
                    });
                    console.log("[projectStore] Hydrating Project:", data.id, {
                        pins: data.selectedBodies,
                        center: data.centerBodyId,
                        sols: data.solutions?.length
                    });
                    usePlanetStore.setState({
                        selectedBodies: data.selectedBodies ?? [],
                        centerBodyId: data.centerBodyId ?? null,
                        customColors: data.customColors ?? {}
                    });
                }
            } catch (e) {
                console.error("[projectStore] Failed to load project:", e);
                apiSet({
                    currentProject: null
                });
            } finally{
                apiSet({
                    isLoading: false
                });
            }
        },
        closeProject: ()=>{
            apiSet({
                currentProject: null
            });
            // Reset other stores client-side only
            if (!isBrowser()) //TURBOPACK unreachable
            ;
            void (async ()=>{
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
                */ } catch (e) {
                    console.warn("[projectStore] closeProject: failed to reset external stores:", e);
                }
            })();
        },
        saveCurrentProject: async ()=>{
            const { currentProject } = apiGet();
            if (!currentProject) return;
            apiSet({
                isSaving: true
            });
            try {
                // Default to currentProject values if not in browser
                let solState = {
                    solutions: currentProject.solutions ?? [],
                    visible: currentProject.solutionVisibility ?? {}
                };
                let planetState = {
                    selectedBodies: currentProject.selectedBodies ?? []
                };
                if (isBrowser()) {
                    const [{ useSolutions }, { usePlanetStore }] = await Promise.all([
                        __turbopack_context__.A("[project]/src/components/gtoc/solutions/useSolutions.ts [app-client] (ecmascript, async loader)"),
                        __turbopack_context__.A("[project]/src/components/gtoc/stores/planetStore.ts [app-client] (ecmascript, async loader)")
                    ]);
                    solState = useSolutions.getState();
                    planetState = usePlanetStore.getState();
                }
                const now = Date.now();
                const updatedProject = {
                    ...currentProject,
                    modifiedAt: now,
                    solutions: solState.solutions ?? [],
                    solutionVisibility: solState.visible ?? {},
                    selectedBodies: planetState.selectedBodies ?? []
                };
                console.log("[projectStore] Saving Project:", updatedProject.id, {
                    pins: updatedProject.selectedBodies,
                    sols: updatedProject.solutions.length
                });
                // 1. Persist full data to IDB
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$idb$2d$keyval$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["set"])(IDB_PREFIX + updatedProject.id, updatedProject);
                apiSet({
                    currentProject: updatedProject
                });
                // 2. Update Metadata List safely
                let currentList = apiGet().projects;
                // Guard: If store list is empty (e.g. page refresh), try to hydrate from LocalStorage first
                // to avoid overwriting the valid list with an empty one.
                if (currentList.length === 0 && isBrowser()) {
                    try {
                        const raw = window.localStorage.getItem(META_KEY);
                        const meta = safeParse(raw);
                        if (meta && Array.isArray(meta)) {
                            currentList = meta;
                        }
                    } catch (e) {
                        console.warn("Failed to hydration project list during save:", e);
                    }
                }
                const exists = currentList.find((p)=>p.id === updatedProject.id);
                let updatedList;
                if (exists) {
                    updatedList = currentList.map((p)=>p.id === updatedProject.id ? {
                            ...p,
                            modifiedAt: now
                        } : p);
                } else {
                    // Upsert if missing
                    const meta = {
                        id: updatedProject.id,
                        name: updatedProject.name,
                        createdAt: updatedProject.createdAt,
                        modifiedAt: now,
                        previewColor: updatedProject.previewColor,
                        dataset: updatedProject.dataset
                    };
                    updatedList = [
                        meta,
                        ...currentList
                    ];
                }
                // Sort by recently modified
                updatedList.sort((a, b)=>b.modifiedAt - a.modifiedAt);
                apiSet({
                    projects: updatedList
                });
                if (isBrowser()) {
                    window.localStorage.setItem(META_KEY, JSON.stringify(updatedList));
                }
            } finally{
                apiSet({
                    isSaving: false
                });
            }
        }
    }));
const updateProjectTime = (jd, isPlaying, rate)=>{
    useProjectStore.setState((state)=>{
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
                time: {
                    jd,
                    isPlaying,
                    rate
                }
            }
        };
    });
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/gtoc/ProjectViewer.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ProjectViewer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$MainCanvasWrapper$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/gtoc/MainCanvasWrapper.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$projectStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/gtoc/stores/projectStore.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
function ProjectViewer({ projectId }) {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    // Granular selectors
    const currentProject = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$projectStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProjectStore"])({
        "ProjectViewer.useProjectStore[currentProject]": (s)=>s.currentProject
    }["ProjectViewer.useProjectStore[currentProject]"]);
    const loadProject = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$projectStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProjectStore"])({
        "ProjectViewer.useProjectStore[loadProject]": (s)=>s.loadProject
    }["ProjectViewer.useProjectStore[loadProject]"]);
    const isLoading = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$projectStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProjectStore"])({
        "ProjectViewer.useProjectStore[isLoading]": (s)=>s.isLoading
    }["ProjectViewer.useProjectStore[isLoading]"]);
    const saveCurrentProject = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$projectStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProjectStore"])({
        "ProjectViewer.useProjectStore[saveCurrentProject]": (s)=>s.saveCurrentProject
    }["ProjectViewer.useProjectStore[saveCurrentProject]"]);
    const closeProject = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$projectStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProjectStore"])({
        "ProjectViewer.useProjectStore[closeProject]": (s)=>s.closeProject
    }["ProjectViewer.useProjectStore[closeProject]"]);
    const isSaving = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$projectStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProjectStore"])({
        "ProjectViewer.useProjectStore[isSaving]": (s)=>s.isSaving
    }["ProjectViewer.useProjectStore[isSaving]"]);
    const loadAttemptedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Load project on mount / when projectId changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ProjectViewer.useEffect": ()=>{
            if (projectId && (!currentProject || currentProject.id !== projectId)) {
                if (loadAttemptedRef.current !== projectId) {
                    loadAttemptedRef.current = projectId;
                    console.log("[ProjectViewer] Loading project:", projectId);
                    loadProject(projectId);
                }
            }
        }
    }["ProjectViewer.useEffect"], [
        projectId,
        currentProject,
        loadProject
    ]);
    // Cleanup on unmount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ProjectViewer.useEffect": ()=>{
            return ({
                "ProjectViewer.useEffect": ()=>{
                    console.log("[ProjectViewer] Unmounting/Closing project");
                    closeProject();
                }
            })["ProjectViewer.useEffect"];
        }
    }["ProjectViewer.useEffect"], [
        closeProject
    ]);
    // Auto-save loop
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ProjectViewer.useEffect": ()=>{
            const interval = window.setInterval({
                "ProjectViewer.useEffect.interval": ()=>{
                    const state = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$projectStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProjectStore"].getState();
                    if (state.currentProject && state.currentProject.id === projectId && !state.isLoading) {
                        saveCurrentProject();
                    }
                }
            }["ProjectViewer.useEffect.interval"], 5000);
            return ({
                "ProjectViewer.useEffect": ()=>window.clearInterval(interval)
            })["ProjectViewer.useEffect"];
        }
    }["ProjectViewer.useEffect"], [
        projectId,
        saveCurrentProject
    ]);
    const exitToDashboard = ()=>{
        console.log("[ProjectViewer] Exit clicked");
        try {
            closeProject();
        } catch  {}
        // Next router (dev)
        try {
            router.replace("/");
        } catch  {}
        // Hard fallback by scheme
        window.setTimeout(()=>{
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
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-full h-screen bg-black flex items-center justify-center text-white/50 space-x-3",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
                }, void 0, false, {
                    fileName: "[project]/src/components/gtoc/ProjectViewer.tsx",
                    lineNumber: 87,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    children: "Loading Mission Data..."
                }, void 0, false, {
                    fileName: "[project]/src/components/gtoc/ProjectViewer.tsx",
                    lineNumber: 88,
                    columnNumber: 17
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/gtoc/ProjectViewer.tsx",
            lineNumber: 86,
            columnNumber: 13
        }, this);
    }
    if (!currentProject || currentProject.id !== projectId) {
        console.warn("[ProjectViewer] mismatch or missing project", {
            current: currentProject?.id,
            expected: projectId
        });
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-full h-screen bg-black flex flex-col items-center justify-center text-white space-y-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-red-500",
                    children: "Failed to load mission data."
                }, void 0, false, {
                    fileName: "[project]/src/components/gtoc/ProjectViewer.tsx",
                    lineNumber: 101,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: exitToDashboard,
                    className: "px-4 py-2 bg-white/10 rounded hover:bg-white/20",
                    children: "Return to Dashboard"
                }, void 0, false, {
                    fileName: "[project]/src/components/gtoc/ProjectViewer.tsx",
                    lineNumber: 102,
                    columnNumber: 17
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/gtoc/ProjectViewer.tsx",
            lineNumber: 100,
            columnNumber: 13
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative w-full h-screen bg-black fade-in",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$MainCanvasWrapper$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            initialTime: currentProject.time,
            onTimeUpdate: (jd, isPlaying, rate)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$projectStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateProjectTime"])(jd, isPlaying, rate),
            onSave: saveCurrentProject,
            onExit: exitToDashboard,
            isSaving: isSaving
        }, void 0, false, {
            fileName: "[project]/src/components/gtoc/ProjectViewer.tsx",
            lineNumber: 115,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/gtoc/ProjectViewer.tsx",
        lineNumber: 113,
        columnNumber: 9
    }, this);
}
_s(ProjectViewer, "zf+tAnERQl4+6ntRhK/wpZXuEmU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$projectStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProjectStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$projectStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProjectStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$projectStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProjectStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$projectStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProjectStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$projectStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProjectStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$projectStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProjectStore"]
    ];
});
_c = ProjectViewer;
var _c;
__turbopack_context__.k.register(_c, "ProjectViewer");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/gtoc/project/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ProjectPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$ProjectViewer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/gtoc/ProjectViewer.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function ProjectContent() {
    _s();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const id = searchParams.get("id");
    if (!id) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-full h-screen bg-black flex items-center justify-center text-white/50",
            children: "No project ID specified."
        }, void 0, false, {
            fileName: "[project]/src/app/gtoc/project/page.tsx",
            lineNumber: 13,
            columnNumber: 13
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$ProjectViewer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        projectId: id
    }, void 0, false, {
        fileName: "[project]/src/app/gtoc/project/page.tsx",
        lineNumber: 19,
        columnNumber: 12
    }, this);
}
_s(ProjectContent, "a+DZx9DY26Zf8FVy1bxe3vp9l1w=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"]
    ];
});
_c = ProjectContent;
function ProjectPage() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Suspense"], {
        fallback: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-full h-screen bg-black text-white",
            children: "Loading..."
        }, void 0, false, {
            fileName: "[project]/src/app/gtoc/project/page.tsx",
            lineNumber: 24,
            columnNumber: 29
        }, void 0),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ProjectContent, {}, void 0, false, {
            fileName: "[project]/src/app/gtoc/project/page.tsx",
            lineNumber: 25,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/gtoc/project/page.tsx",
        lineNumber: 24,
        columnNumber: 9
    }, this);
}
_c1 = ProjectPage;
var _c, _c1;
__turbopack_context__.k.register(_c, "ProjectContent");
__turbopack_context__.k.register(_c1, "ProjectPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * @license React
 * react-jsx-dev-runtime.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
"use strict";
"production" !== ("TURBOPACK compile-time value", "development") && function() {
    function getComponentNameFromType(type) {
        if (null == type) return null;
        if ("function" === typeof type) return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
        if ("string" === typeof type) return type;
        switch(type){
            case REACT_FRAGMENT_TYPE:
                return "Fragment";
            case REACT_PROFILER_TYPE:
                return "Profiler";
            case REACT_STRICT_MODE_TYPE:
                return "StrictMode";
            case REACT_SUSPENSE_TYPE:
                return "Suspense";
            case REACT_SUSPENSE_LIST_TYPE:
                return "SuspenseList";
            case REACT_ACTIVITY_TYPE:
                return "Activity";
            case REACT_VIEW_TRANSITION_TYPE:
                return "ViewTransition";
        }
        if ("object" === typeof type) switch("number" === typeof type.tag && console.error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), type.$$typeof){
            case REACT_PORTAL_TYPE:
                return "Portal";
            case REACT_CONTEXT_TYPE:
                return type.displayName || "Context";
            case REACT_CONSUMER_TYPE:
                return (type._context.displayName || "Context") + ".Consumer";
            case REACT_FORWARD_REF_TYPE:
                var innerType = type.render;
                type = type.displayName;
                type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
                return type;
            case REACT_MEMO_TYPE:
                return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
            case REACT_LAZY_TYPE:
                innerType = type._payload;
                type = type._init;
                try {
                    return getComponentNameFromType(type(innerType));
                } catch (x) {}
        }
        return null;
    }
    function testStringCoercion(value) {
        return "" + value;
    }
    function checkKeyStringCoercion(value) {
        try {
            testStringCoercion(value);
            var JSCompiler_inline_result = !1;
        } catch (e) {
            JSCompiler_inline_result = !0;
        }
        if (JSCompiler_inline_result) {
            JSCompiler_inline_result = console;
            var JSCompiler_temp_const = JSCompiler_inline_result.error;
            var JSCompiler_inline_result$jscomp$0 = "function" === typeof Symbol && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
            JSCompiler_temp_const.call(JSCompiler_inline_result, "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.", JSCompiler_inline_result$jscomp$0);
            return testStringCoercion(value);
        }
    }
    function getTaskName(type) {
        if (type === REACT_FRAGMENT_TYPE) return "<>";
        if ("object" === typeof type && null !== type && type.$$typeof === REACT_LAZY_TYPE) return "<...>";
        try {
            var name = getComponentNameFromType(type);
            return name ? "<" + name + ">" : "<...>";
        } catch (x) {
            return "<...>";
        }
    }
    function getOwner() {
        var dispatcher = ReactSharedInternals.A;
        return null === dispatcher ? null : dispatcher.getOwner();
    }
    function UnknownOwner() {
        return Error("react-stack-top-frame");
    }
    function hasValidKey(config) {
        if (hasOwnProperty.call(config, "key")) {
            var getter = Object.getOwnPropertyDescriptor(config, "key").get;
            if (getter && getter.isReactWarning) return !1;
        }
        return void 0 !== config.key;
    }
    function defineKeyPropWarningGetter(props, displayName) {
        function warnAboutAccessingKey() {
            specialPropKeyWarningShown || (specialPropKeyWarningShown = !0, console.error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)", displayName));
        }
        warnAboutAccessingKey.isReactWarning = !0;
        Object.defineProperty(props, "key", {
            get: warnAboutAccessingKey,
            configurable: !0
        });
    }
    function elementRefGetterWithDeprecationWarning() {
        var componentName = getComponentNameFromType(this.type);
        didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = !0, console.error("Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."));
        componentName = this.props.ref;
        return void 0 !== componentName ? componentName : null;
    }
    function ReactElement(type, key, props, owner, debugStack, debugTask) {
        var refProp = props.ref;
        type = {
            $$typeof: REACT_ELEMENT_TYPE,
            type: type,
            key: key,
            props: props,
            _owner: owner
        };
        null !== (void 0 !== refProp ? refProp : null) ? Object.defineProperty(type, "ref", {
            enumerable: !1,
            get: elementRefGetterWithDeprecationWarning
        }) : Object.defineProperty(type, "ref", {
            enumerable: !1,
            value: null
        });
        type._store = {};
        Object.defineProperty(type._store, "validated", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: 0
        });
        Object.defineProperty(type, "_debugInfo", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: null
        });
        Object.defineProperty(type, "_debugStack", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugStack
        });
        Object.defineProperty(type, "_debugTask", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugTask
        });
        Object.freeze && (Object.freeze(type.props), Object.freeze(type));
        return type;
    }
    function jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStack, debugTask) {
        var children = config.children;
        if (void 0 !== children) if (isStaticChildren) if (isArrayImpl(children)) {
            for(isStaticChildren = 0; isStaticChildren < children.length; isStaticChildren++)validateChildKeys(children[isStaticChildren]);
            Object.freeze && Object.freeze(children);
        } else console.error("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
        else validateChildKeys(children);
        if (hasOwnProperty.call(config, "key")) {
            children = getComponentNameFromType(type);
            var keys = Object.keys(config).filter(function(k) {
                return "key" !== k;
            });
            isStaticChildren = 0 < keys.length ? "{key: someKey, " + keys.join(": ..., ") + ": ...}" : "{key: someKey}";
            didWarnAboutKeySpread[children + isStaticChildren] || (keys = 0 < keys.length ? "{" + keys.join(": ..., ") + ": ...}" : "{}", console.error('A props object containing a "key" prop is being spread into JSX:\n  let props = %s;\n  <%s {...props} />\nReact keys must be passed directly to JSX without using spread:\n  let props = %s;\n  <%s key={someKey} {...props} />', isStaticChildren, children, keys, children), didWarnAboutKeySpread[children + isStaticChildren] = !0);
        }
        children = null;
        void 0 !== maybeKey && (checkKeyStringCoercion(maybeKey), children = "" + maybeKey);
        hasValidKey(config) && (checkKeyStringCoercion(config.key), children = "" + config.key);
        if ("key" in config) {
            maybeKey = {};
            for(var propName in config)"key" !== propName && (maybeKey[propName] = config[propName]);
        } else maybeKey = config;
        children && defineKeyPropWarningGetter(maybeKey, "function" === typeof type ? type.displayName || type.name || "Unknown" : type);
        return ReactElement(type, children, maybeKey, getOwner(), debugStack, debugTask);
    }
    function validateChildKeys(node) {
        isValidElement(node) ? node._store && (node._store.validated = 1) : "object" === typeof node && null !== node && node.$$typeof === REACT_LAZY_TYPE && ("fulfilled" === node._payload.status ? isValidElement(node._payload.value) && node._payload.value._store && (node._payload.value._store.validated = 1) : node._store && (node._store.validated = 1));
    }
    function isValidElement(object) {
        return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
    }
    var React = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"), REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = Symbol.for("react.memo"), REACT_LAZY_TYPE = Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = Symbol.for("react.activity"), REACT_VIEW_TRANSITION_TYPE = Symbol.for("react.view_transition"), REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference"), ReactSharedInternals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, hasOwnProperty = Object.prototype.hasOwnProperty, isArrayImpl = Array.isArray, createTask = console.createTask ? console.createTask : function() {
        return null;
    };
    React = {
        react_stack_bottom_frame: function(callStackForError) {
            return callStackForError();
        }
    };
    var specialPropKeyWarningShown;
    var didWarnAboutElementRef = {};
    var unknownOwnerDebugStack = React.react_stack_bottom_frame.bind(React, UnknownOwner)();
    var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
    var didWarnAboutKeySpread = {};
    exports.Fragment = REACT_FRAGMENT_TYPE;
    exports.jsxDEV = function(type, config, maybeKey, isStaticChildren) {
        var trackActualOwner = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
        if (trackActualOwner) {
            var previousStackTraceLimit = Error.stackTraceLimit;
            Error.stackTraceLimit = 10;
            var debugStackDEV = Error("react-stack-top-frame");
            Error.stackTraceLimit = previousStackTraceLimit;
        } else debugStackDEV = unknownOwnerDebugStack;
        return jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStackDEV, trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask);
    };
}();
}),
"[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
'use strict';
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)");
}
}),
"[project]/node_modules/next/navigation.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/client/components/navigation.js [app-client] (ecmascript)");
}),
"[project]/node_modules/next/dist/shared/lib/lazy-dynamic/dynamic-bailout-to-csr.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BailoutToCSR", {
    enumerable: true,
    get: function() {
        return BailoutToCSR;
    }
});
const _bailouttocsr = __turbopack_context__.r("[project]/node_modules/next/dist/shared/lib/lazy-dynamic/bailout-to-csr.js [app-client] (ecmascript)");
function BailoutToCSR({ reason, children }) {
    if (typeof window === 'undefined') {
        throw Object.defineProperty(new _bailouttocsr.BailoutToCSRError(reason), "__NEXT_ERROR_CODE", {
            value: "E394",
            enumerable: false,
            configurable: true
        });
    }
    return children;
} //# sourceMappingURL=dynamic-bailout-to-csr.js.map
}),
"[project]/node_modules/next/dist/shared/lib/encode-uri-path.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "encodeURIPath", {
    enumerable: true,
    get: function() {
        return encodeURIPath;
    }
});
function encodeURIPath(file) {
    return file.split('/').map((p)=>encodeURIComponent(p)).join('/');
} //# sourceMappingURL=encode-uri-path.js.map
}),
"[project]/node_modules/next/dist/shared/lib/lazy-dynamic/preload-chunks.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PreloadChunks", {
    enumerable: true,
    get: function() {
        return PreloadChunks;
    }
});
const _jsxruntime = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
const _reactdom = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react-dom/index.js [app-client] (ecmascript)");
const _workasyncstorageexternal = __turbopack_context__.r("[project]/node_modules/next/dist/server/app-render/work-async-storage.external.js [app-client] (ecmascript)");
const _encodeuripath = __turbopack_context__.r("[project]/node_modules/next/dist/shared/lib/encode-uri-path.js [app-client] (ecmascript)");
function PreloadChunks({ moduleIds }) {
    // Early return in client compilation and only load requestStore on server side
    if (typeof window !== 'undefined') {
        return null;
    }
    const workStore = _workasyncstorageexternal.workAsyncStorage.getStore();
    if (workStore === undefined) {
        return null;
    }
    const allFiles = [];
    // Search the current dynamic call unique key id in react loadable manifest,
    // and find the corresponding CSS files to preload
    if (workStore.reactLoadableManifest && moduleIds) {
        const manifest = workStore.reactLoadableManifest;
        for (const key of moduleIds){
            if (!manifest[key]) continue;
            const chunks = manifest[key].files;
            allFiles.push(...chunks);
        }
    }
    if (allFiles.length === 0) {
        return null;
    }
    const dplId = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : '';
    return /*#__PURE__*/ (0, _jsxruntime.jsx)(_jsxruntime.Fragment, {
        children: allFiles.map((chunk)=>{
            const href = `${workStore.assetPrefix}/_next/${(0, _encodeuripath.encodeURIPath)(chunk)}${dplId}`;
            const isCss = chunk.endsWith('.css');
            // If it's stylesheet we use `precedence` o help hoist with React Float.
            // For stylesheets we actually need to render the CSS because nothing else is going to do it so it needs to be part of the component tree.
            // The `preload` for stylesheet is not optional.
            if (isCss) {
                return /*#__PURE__*/ (0, _jsxruntime.jsx)("link", {
                    // @ts-ignore
                    precedence: "dynamic",
                    href: href,
                    rel: "stylesheet",
                    as: "style",
                    nonce: workStore.nonce
                }, chunk);
            } else {
                // If it's script we use ReactDOM.preload to preload the resources
                (0, _reactdom.preload)(href, {
                    as: 'script',
                    fetchPriority: 'low',
                    nonce: workStore.nonce
                });
                return null;
            }
        })
    });
} //# sourceMappingURL=preload-chunks.js.map
}),
"[project]/node_modules/next/dist/shared/lib/lazy-dynamic/loadable.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _jsxruntime = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
const _react = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
const _dynamicbailouttocsr = __turbopack_context__.r("[project]/node_modules/next/dist/shared/lib/lazy-dynamic/dynamic-bailout-to-csr.js [app-client] (ecmascript)");
const _preloadchunks = __turbopack_context__.r("[project]/node_modules/next/dist/shared/lib/lazy-dynamic/preload-chunks.js [app-client] (ecmascript)");
// Normalize loader to return the module as form { default: Component } for `React.lazy`.
// Also for backward compatible since next/dynamic allows to resolve a component directly with loader
// Client component reference proxy need to be converted to a module.
function convertModule(mod) {
    // Check "default" prop before accessing it, as it could be client reference proxy that could break it reference.
    // Cases:
    // mod: { default: Component }
    // mod: Component
    // mod: { default: proxy(Component) }
    // mod: proxy(Component)
    const hasDefault = mod && 'default' in mod;
    return {
        default: hasDefault ? mod.default : mod
    };
}
const defaultOptions = {
    loader: ()=>Promise.resolve(convertModule(()=>null)),
    loading: null,
    ssr: true
};
function Loadable(options) {
    const opts = {
        ...defaultOptions,
        ...options
    };
    const Lazy = /*#__PURE__*/ (0, _react.lazy)(()=>opts.loader().then(convertModule));
    const Loading = opts.loading;
    function LoadableComponent(props) {
        const fallbackElement = Loading ? /*#__PURE__*/ (0, _jsxruntime.jsx)(Loading, {
            isLoading: true,
            pastDelay: true,
            error: null
        }) : null;
        // If it's non-SSR or provided a loading component, wrap it in a suspense boundary
        const hasSuspenseBoundary = !opts.ssr || !!opts.loading;
        const Wrap = hasSuspenseBoundary ? _react.Suspense : _react.Fragment;
        const wrapProps = hasSuspenseBoundary ? {
            fallback: fallbackElement
        } : {};
        const children = opts.ssr ? /*#__PURE__*/ (0, _jsxruntime.jsxs)(_jsxruntime.Fragment, {
            children: [
                typeof window === 'undefined' ? /*#__PURE__*/ (0, _jsxruntime.jsx)(_preloadchunks.PreloadChunks, {
                    moduleIds: opts.modules
                }) : null,
                /*#__PURE__*/ (0, _jsxruntime.jsx)(Lazy, {
                    ...props
                })
            ]
        }) : /*#__PURE__*/ (0, _jsxruntime.jsx)(_dynamicbailouttocsr.BailoutToCSR, {
            reason: "next/dynamic",
            children: /*#__PURE__*/ (0, _jsxruntime.jsx)(Lazy, {
                ...props
            })
        });
        return /*#__PURE__*/ (0, _jsxruntime.jsx)(Wrap, {
            ...wrapProps,
            children: children
        });
    }
    LoadableComponent.displayName = 'LoadableComponent';
    return LoadableComponent;
}
const _default = Loadable; //# sourceMappingURL=loadable.js.map
}),
"[project]/node_modules/next/dist/shared/lib/app-dynamic.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return dynamic;
    }
});
const _interop_require_default = __turbopack_context__.r("[project]/node_modules/@swc/helpers/cjs/_interop_require_default.cjs [app-client] (ecmascript)");
const _loadable = /*#__PURE__*/ _interop_require_default._(__turbopack_context__.r("[project]/node_modules/next/dist/shared/lib/lazy-dynamic/loadable.js [app-client] (ecmascript)"));
function dynamic(dynamicOptions, options) {
    const loadableOptions = {};
    if (typeof dynamicOptions === 'function') {
        loadableOptions.loader = dynamicOptions;
    }
    const mergedOptions = {
        ...loadableOptions,
        ...options
    };
    return (0, _loadable.default)({
        ...mergedOptions,
        modules: mergedOptions.loadableGenerated?.modules
    });
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=app-dynamic.js.map
}),
"[project]/node_modules/zustand/esm/vanilla.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createStore",
    ()=>createStore
]);
const createStoreImpl = (createState)=>{
    let state;
    const listeners = /* @__PURE__ */ new Set();
    const setState = (partial, replace)=>{
        const nextState = typeof partial === "function" ? partial(state) : partial;
        if (!Object.is(nextState, state)) {
            const previousState = state;
            state = (replace != null ? replace : typeof nextState !== "object" || nextState === null) ? nextState : Object.assign({}, state, nextState);
            listeners.forEach((listener)=>listener(state, previousState));
        }
    };
    const getState = ()=>state;
    const getInitialState = ()=>initialState;
    const subscribe = (listener)=>{
        listeners.add(listener);
        return ()=>listeners.delete(listener);
    };
    const api = {
        setState,
        getState,
        getInitialState,
        subscribe
    };
    const initialState = state = createState(setState, getState, api);
    return api;
};
const createStore = (createState)=>createState ? createStoreImpl(createState) : createStoreImpl;
;
}),
"[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "create",
    ()=>create,
    "useStore",
    ()=>useStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/vanilla.mjs [app-client] (ecmascript)");
;
;
const identity = (arg)=>arg;
function useStore(api, selector = identity) {
    const slice = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useSyncExternalStore(api.subscribe, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useCallback({
        "useStore.useSyncExternalStore[slice]": ()=>selector(api.getState())
    }["useStore.useSyncExternalStore[slice]"], [
        api,
        selector
    ]), __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useCallback({
        "useStore.useSyncExternalStore[slice]": ()=>selector(api.getInitialState())
    }["useStore.useSyncExternalStore[slice]"], [
        api,
        selector
    ]));
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useDebugValue(slice);
    return slice;
}
const createImpl = (createState)=>{
    const api = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createStore"])(createState);
    const useBoundStore = (selector)=>useStore(api, selector);
    Object.assign(useBoundStore, api);
    return useBoundStore;
};
const create = (createState)=>createState ? createImpl(createState) : createImpl;
;
}),
"[project]/node_modules/idb-keyval/dist/index.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clear",
    ()=>clear,
    "createStore",
    ()=>createStore,
    "del",
    ()=>del,
    "delMany",
    ()=>delMany,
    "entries",
    ()=>entries,
    "get",
    ()=>get,
    "getMany",
    ()=>getMany,
    "keys",
    ()=>keys,
    "promisifyRequest",
    ()=>promisifyRequest,
    "set",
    ()=>set,
    "setMany",
    ()=>setMany,
    "update",
    ()=>update,
    "values",
    ()=>values
]);
function promisifyRequest(request) {
    return new Promise((resolve, reject)=>{
        // @ts-ignore - file size hacks
        request.oncomplete = request.onsuccess = ()=>resolve(request.result);
        // @ts-ignore - file size hacks
        request.onabort = request.onerror = ()=>reject(request.error);
    });
}
function createStore(dbName, storeName) {
    let dbp;
    const getDB = ()=>{
        if (dbp) return dbp;
        const request = indexedDB.open(dbName);
        request.onupgradeneeded = ()=>request.result.createObjectStore(storeName);
        dbp = promisifyRequest(request);
        dbp.then((db)=>{
            // It seems like Safari sometimes likes to just close the connection.
            // It's supposed to fire this event when that happens. Let's hope it does!
            db.onclose = ()=>dbp = undefined;
        }, ()=>{});
        return dbp;
    };
    return (txMode, callback)=>getDB().then((db)=>callback(db.transaction(storeName, txMode).objectStore(storeName)));
}
let defaultGetStoreFunc;
function defaultGetStore() {
    if (!defaultGetStoreFunc) {
        defaultGetStoreFunc = createStore('keyval-store', 'keyval');
    }
    return defaultGetStoreFunc;
}
/**
 * Get a value by its key.
 *
 * @param key
 * @param customStore Method to get a custom store. Use with caution (see the docs).
 */ function get(key, customStore = defaultGetStore()) {
    return customStore('readonly', (store)=>promisifyRequest(store.get(key)));
}
/**
 * Set a value with a key.
 *
 * @param key
 * @param value
 * @param customStore Method to get a custom store. Use with caution (see the docs).
 */ function set(key, value, customStore = defaultGetStore()) {
    return customStore('readwrite', (store)=>{
        store.put(value, key);
        return promisifyRequest(store.transaction);
    });
}
/**
 * Set multiple values at once. This is faster than calling set() multiple times.
 * It's also atomic – if one of the pairs can't be added, none will be added.
 *
 * @param entries Array of entries, where each entry is an array of `[key, value]`.
 * @param customStore Method to get a custom store. Use with caution (see the docs).
 */ function setMany(entries, customStore = defaultGetStore()) {
    return customStore('readwrite', (store)=>{
        entries.forEach((entry)=>store.put(entry[1], entry[0]));
        return promisifyRequest(store.transaction);
    });
}
/**
 * Get multiple values by their keys
 *
 * @param keys
 * @param customStore Method to get a custom store. Use with caution (see the docs).
 */ function getMany(keys, customStore = defaultGetStore()) {
    return customStore('readonly', (store)=>Promise.all(keys.map((key)=>promisifyRequest(store.get(key)))));
}
/**
 * Update a value. This lets you see the old value and update it as an atomic operation.
 *
 * @param key
 * @param updater A callback that takes the old value and returns a new value.
 * @param customStore Method to get a custom store. Use with caution (see the docs).
 */ function update(key, updater, customStore = defaultGetStore()) {
    return customStore('readwrite', (store)=>// Need to create the promise manually.
        // If I try to chain promises, the transaction closes in browsers
        // that use a promise polyfill (IE10/11).
        new Promise((resolve, reject)=>{
            store.get(key).onsuccess = function() {
                try {
                    store.put(updater(this.result), key);
                    resolve(promisifyRequest(store.transaction));
                } catch (err) {
                    reject(err);
                }
            };
        }));
}
/**
 * Delete a particular key from the store.
 *
 * @param key
 * @param customStore Method to get a custom store. Use with caution (see the docs).
 */ function del(key, customStore = defaultGetStore()) {
    return customStore('readwrite', (store)=>{
        store.delete(key);
        return promisifyRequest(store.transaction);
    });
}
/**
 * Delete multiple keys at once.
 *
 * @param keys List of keys to delete.
 * @param customStore Method to get a custom store. Use with caution (see the docs).
 */ function delMany(keys, customStore = defaultGetStore()) {
    return customStore('readwrite', (store)=>{
        keys.forEach((key)=>store.delete(key));
        return promisifyRequest(store.transaction);
    });
}
/**
 * Clear all values in the store.
 *
 * @param customStore Method to get a custom store. Use with caution (see the docs).
 */ function clear(customStore = defaultGetStore()) {
    return customStore('readwrite', (store)=>{
        store.clear();
        return promisifyRequest(store.transaction);
    });
}
function eachCursor(store, callback) {
    store.openCursor().onsuccess = function() {
        if (!this.result) return;
        callback(this.result);
        this.result.continue();
    };
    return promisifyRequest(store.transaction);
}
/**
 * Get all keys in the store.
 *
 * @param customStore Method to get a custom store. Use with caution (see the docs).
 */ function keys(customStore = defaultGetStore()) {
    return customStore('readonly', (store)=>{
        // Fast path for modern browsers
        if (store.getAllKeys) {
            return promisifyRequest(store.getAllKeys());
        }
        const items = [];
        return eachCursor(store, (cursor)=>items.push(cursor.key)).then(()=>items);
    });
}
/**
 * Get all values in the store.
 *
 * @param customStore Method to get a custom store. Use with caution (see the docs).
 */ function values(customStore = defaultGetStore()) {
    return customStore('readonly', (store)=>{
        // Fast path for modern browsers
        if (store.getAll) {
            return promisifyRequest(store.getAll());
        }
        const items = [];
        return eachCursor(store, (cursor)=>items.push(cursor.value)).then(()=>items);
    });
}
/**
 * Get all entries in the store. Each entry is an array of `[key, value]`.
 *
 * @param customStore Method to get a custom store. Use with caution (see the docs).
 */ function entries(customStore = defaultGetStore()) {
    return customStore('readonly', (store)=>{
        // Fast path for modern browsers
        // (although, hopefully we'll get a simpler path some day)
        if (store.getAll && store.getAllKeys) {
            return Promise.all([
                promisifyRequest(store.getAllKeys()),
                promisifyRequest(store.getAll())
            ]).then(([keys, values])=>keys.map((key, i)=>[
                        key,
                        values[i]
                    ]));
        }
        const items = [];
        return customStore('readonly', (store)=>eachCursor(store, (cursor)=>items.push([
                    cursor.key,
                    cursor.value
                ])).then(()=>items));
    });
}
;
}),
]);

//# sourceMappingURL=_611d2735._.js.map