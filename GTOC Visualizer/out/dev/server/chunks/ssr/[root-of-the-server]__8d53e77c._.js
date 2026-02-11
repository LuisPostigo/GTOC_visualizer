module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[project]/src/components/gtoc/MainCanvasWrapper.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MainCanvasWrapper
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/shared/lib/app-dynamic.js [app-ssr] (ecmascript)");
;
"use client";
;
;
const ViewerCanvas = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(async ()=>{}, {
    loadableGenerated: {
        modules: [
            "[project]/src/components/gtoc/ViewerCanvas.tsx [app-client] (ecmascript, next/dynamic entry)"
        ]
    },
    ssr: false
});
function MainCanvasWrapper(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ViewerCanvas, {
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/gtoc/MainCanvasWrapper.tsx",
        lineNumber: 10,
        columnNumber: 10
    }, this);
}
}),
"[project]/src/components/gtoc/utils/constants.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
}),
"[project]/src/components/gtoc/stores/projectStore.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "updateProjectTime",
    ()=>updateProjectTime,
    "useProjectStore",
    ()=>useProjectStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$idb$2d$keyval$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/idb-keyval/dist/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/gtoc/utils/constants.ts [app-ssr] (ecmascript)");
;
;
;
const IDB_PREFIX = "gtoc_proj_";
const META_KEY = "gtoc_projects_meta";
const isBrowser = ()=>("TURBOPACK compile-time value", "undefined") !== "undefined";
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
const useProjectStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])((apiSet, apiGet)=>({
        projects: [],
        currentProject: null,
        isLoading: false,
        isSaving: false,
        refreshProjects: async ()=>{
            if (!isBrowser()) return;
            //TURBOPACK unreachable
            ;
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
                    jd: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["JD_EPOCH_0"],
                    isPlaying: false,
                    rate: 100
                },
                previewColor: `hsl(${Math.random() * 360}, 70%, 60%)`
            };
            try {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$idb$2d$keyval$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["set"])(IDB_PREFIX + id, newProject);
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
                if (isBrowser()) //TURBOPACK unreachable
                ;
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
                const project = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$idb$2d$keyval$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["get"])(IDB_PREFIX + id);
                if (project) {
                    const updated = {
                        ...project,
                        name: newName,
                        modifiedAt: now
                    };
                    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$idb$2d$keyval$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["set"])(IDB_PREFIX + id, updated);
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
                if (isBrowser()) //TURBOPACK unreachable
                ;
            } catch (e) {
                console.error("Failed to rename project:", e);
                throw e;
            }
        },
        deleteProject: async (id)=>{
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$idb$2d$keyval$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["del"])(IDB_PREFIX + id);
            const updatedList = apiGet().projects.filter((p)=>p.id !== id);
            apiSet({
                projects: updatedList
            });
            if (isBrowser()) //TURBOPACK unreachable
            ;
        },
        loadProject: async (id)=>{
            apiSet({
                isLoading: true
            });
            try {
                const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$idb$2d$keyval$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["get"])(IDB_PREFIX + id);
                if (!data) throw new Error("Project not found");
                apiSet({
                    currentProject: data
                });
                // Hydrate other stores client-side only (lazy imports prevent hydration crashes)
                if (isBrowser()) //TURBOPACK unreachable
                ;
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
            if (!isBrowser()) return;
            //TURBOPACK unreachable
            ;
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
                if (isBrowser()) //TURBOPACK unreachable
                ;
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
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$idb$2d$keyval$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["set"])(IDB_PREFIX + updatedProject.id, updatedProject);
                apiSet({
                    currentProject: updatedProject
                });
                // 2. Update Metadata List safely
                let currentList = apiGet().projects;
                // Guard: If store list is empty (e.g. page refresh), try to hydrate from LocalStorage first
                // to avoid overwriting the valid list with an empty one.
                if (currentList.length === 0 && isBrowser()) //TURBOPACK unreachable
                ;
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
                if (isBrowser()) //TURBOPACK unreachable
                ;
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
}),
"[project]/src/components/gtoc/ProjectViewer.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ProjectViewer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$MainCanvasWrapper$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/gtoc/MainCanvasWrapper.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$projectStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/gtoc/stores/projectStore.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
function ProjectViewer({ projectId }) {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    // Granular selectors
    const currentProject = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$projectStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useProjectStore"])((s)=>s.currentProject);
    const loadProject = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$projectStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useProjectStore"])((s)=>s.loadProject);
    const isLoading = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$projectStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useProjectStore"])((s)=>s.isLoading);
    const saveCurrentProject = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$projectStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useProjectStore"])((s)=>s.saveCurrentProject);
    const closeProject = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$projectStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useProjectStore"])((s)=>s.closeProject);
    const isSaving = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$projectStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useProjectStore"])((s)=>s.isSaving);
    const loadAttemptedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Load project on mount / when projectId changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (projectId && (!currentProject || currentProject.id !== projectId)) {
            if (loadAttemptedRef.current !== projectId) {
                loadAttemptedRef.current = projectId;
                console.log("[ProjectViewer] Loading project:", projectId);
                loadProject(projectId);
            }
        }
    }, [
        projectId,
        currentProject,
        loadProject
    ]);
    // Cleanup on unmount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        return ()=>{
            console.log("[ProjectViewer] Unmounting/Closing project");
            closeProject();
        };
    }, [
        closeProject
    ]);
    // Auto-save loop
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const interval = window.setInterval(()=>{
            const state = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$projectStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useProjectStore"].getState();
            if (state.currentProject && state.currentProject.id === projectId && !state.isLoading) {
                saveCurrentProject();
            }
        }, 5000);
        return ()=>window.clearInterval(interval);
    }, [
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
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-full h-screen bg-black flex items-center justify-center text-white/50 space-x-3",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
                }, void 0, false, {
                    fileName: "[project]/src/components/gtoc/ProjectViewer.tsx",
                    lineNumber: 87,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-full h-screen bg-black flex flex-col items-center justify-center text-white space-y-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-red-500",
                    children: "Failed to load mission data."
                }, void 0, false, {
                    fileName: "[project]/src/components/gtoc/ProjectViewer.tsx",
                    lineNumber: 101,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative w-full h-screen bg-black fade-in",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$MainCanvasWrapper$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
            initialTime: currentProject.time,
            onTimeUpdate: (jd, isPlaying, rate)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$projectStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateProjectTime"])(jd, isPlaying, rate),
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
}),
"[project]/src/app/gtoc/project/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ProjectPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$ProjectViewer$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/gtoc/ProjectViewer.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
function ProjectContent() {
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const id = searchParams.get("id");
    if (!id) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-full h-screen bg-black flex items-center justify-center text-white/50",
            children: "No project ID specified."
        }, void 0, false, {
            fileName: "[project]/src/app/gtoc/project/page.tsx",
            lineNumber: 13,
            columnNumber: 13
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$ProjectViewer$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
        projectId: id
    }, void 0, false, {
        fileName: "[project]/src/app/gtoc/project/page.tsx",
        lineNumber: 19,
        columnNumber: 12
    }, this);
}
function ProjectPage() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Suspense"], {
        fallback: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-full h-screen bg-black text-white",
            children: "Loading..."
        }, void 0, false, {
            fileName: "[project]/src/app/gtoc/project/page.tsx",
            lineNumber: 24,
            columnNumber: 29
        }, void 0),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ProjectContent, {}, void 0, false, {
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
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__8d53e77c._.js.map