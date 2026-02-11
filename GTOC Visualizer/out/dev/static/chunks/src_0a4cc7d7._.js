(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
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
"[project]/src/components/gtoc/LandingBackground.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>LandingBackground
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$react$2d$three$2d$fiber$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@react-three/fiber/dist/react-three-fiber.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$f8cd670d$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__D__as__useFrame$3e$__ = __turbopack_context__.i("[project]/node_modules/@react-three/fiber/dist/events-f8cd670d.esm.js [app-client] (ecmascript) <export D as useFrame>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$Stars$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@react-three/drei/core/Stars.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function RotatingStars() {
    _s();
    const ref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$f8cd670d$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__D__as__useFrame$3e$__["useFrame"])({
        "RotatingStars.useFrame": (state, delta)=>{
            if (ref.current) {
                ref.current.rotation.x -= delta / 10;
                ref.current.rotation.y -= delta / 15;
            }
        }
    }["RotatingStars.useFrame"]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        rotation: [
            0,
            0,
            Math.PI / 4
        ],
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$Stars$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Stars"], {
                radius: 100,
                depth: 50,
                count: 5000,
                factor: 4,
                saturation: 0,
                fade: true,
                speed: 1
            }, void 0, false, {
                fileName: "[project]/src/components/gtoc/LandingBackground.tsx",
                lineNumber: 17,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                ref: ref,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$Stars$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Stars"], {
                    radius: 300,
                    depth: 50,
                    count: 1000,
                    factor: 6,
                    saturation: 0,
                    fade: true,
                    speed: 2
                }, void 0, false, {
                    fileName: "[project]/src/components/gtoc/LandingBackground.tsx",
                    lineNumber: 27,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/gtoc/LandingBackground.tsx",
                lineNumber: 26,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/gtoc/LandingBackground.tsx",
        lineNumber: 16,
        columnNumber: 9
    }, this);
}
_s(RotatingStars, "8QVLrcMdYxPUkj6ry5zpyt6J6X8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$f8cd670d$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__D__as__useFrame$3e$__["useFrame"]
    ];
});
_c = RotatingStars;
function LandingBackground() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-0 bg-black",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$react$2d$three$2d$fiber$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Canvas"], {
                camera: {
                    position: [
                        0,
                        0,
                        1
                    ]
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(RotatingStars, {}, void 0, false, {
                    fileName: "[project]/src/components/gtoc/LandingBackground.tsx",
                    lineNumber: 45,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/gtoc/LandingBackground.tsx",
                lineNumber: 44,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/80 pointer-events-none"
            }, void 0, false, {
                fileName: "[project]/src/components/gtoc/LandingBackground.tsx",
                lineNumber: 49,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/gtoc/LandingBackground.tsx",
        lineNumber: 43,
        columnNumber: 9
    }, this);
}
_c1 = LandingBackground;
var _c, _c1;
__turbopack_context__.k.register(_c, "RotatingStars");
__turbopack_context__.k.register(_c1, "LandingBackground");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/gtoc/LandingPage.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>LandingPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$projectStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/gtoc/stores/projectStore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$LandingBackground$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/gtoc/LandingBackground.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
function LandingPage() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const projects = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$projectStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProjectStore"])({
        "LandingPage.useProjectStore[projects]": (s)=>s.projects
    }["LandingPage.useProjectStore[projects]"]);
    const refreshProjects = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$projectStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProjectStore"])({
        "LandingPage.useProjectStore[refreshProjects]": (s)=>s.refreshProjects
    }["LandingPage.useProjectStore[refreshProjects]"]);
    const createProject = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$projectStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProjectStore"])({
        "LandingPage.useProjectStore[createProject]": (s)=>s.createProject
    }["LandingPage.useProjectStore[createProject]"]);
    const deleteProject = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$projectStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProjectStore"])({
        "LandingPage.useProjectStore[deleteProject]": (s)=>s.deleteProject
    }["LandingPage.useProjectStore[deleteProject]"]);
    const renameProject = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$projectStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProjectStore"])({
        "LandingPage.useProjectStore[renameProject]": (s)=>s.renameProject
    }["LandingPage.useProjectStore[renameProject]"]);
    const [hydrated, setHydrated] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isCreating, setIsCreating] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Create Modal
    const [showCreateModal, setShowCreateModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [newProjectName, setNewProjectName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    // Rename Modal
    const [showRenameModal, setShowRenameModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [projectToRename, setProjectToRename] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [renameName, setRenameName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    // Delete Modal
    const [showDeleteModal, setShowDeleteModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [projectToDelete, setProjectToDelete] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "LandingPage.useEffect": ()=>{
            refreshProjects();
            setHydrated(true);
        }
    }["LandingPage.useEffect"], [
        refreshProjects
    ]);
    const openCreateModal = ()=>{
        setNewProjectName(`Mission ${projects.length + 1}`);
        setShowCreateModal(true);
    };
    const closeCreateModal = ()=>{
        if (isCreating) return;
        setShowCreateModal(false);
    };
    const handleCreate = async ()=>{
        if (!newProjectName.trim()) return;
        setIsCreating(true);
        try {
            // Add a timeout to force navigation if it hangs (common in some envs)
            const withTimeout = (promise, ms)=>new Promise((resolve, reject)=>{
                    const t = setTimeout(()=>reject(new Error("Timeout")), ms);
                    promise.then((v)=>{
                        window.clearTimeout(t);
                        resolve(v);
                    }).catch((e)=>{
                        window.clearTimeout(t);
                        reject(e);
                    });
                });
            const id = await withTimeout(createProject(newProjectName), 5000);
            console.log("[Landing] Project created, navigating to:", id);
            // Wait a tick for store to update
            await new Promise((r)=>setTimeout(r, 100));
            // Force navigation
            window.location.href = `/gtoc/project?id=${id}`;
        } catch (error) {
            console.error("Failed to create project:", error);
            alert("Failed to create project. See console.");
        } finally{
            setIsCreating(false);
            setShowCreateModal(false);
        }
    };
    const handleOpen = (id)=>{
        console.log("[Landing] Opening project:", id);
        // Use window.location for robust navigation in static export
        window.location.href = `/gtoc/project?id=${id}`;
    };
    const openRenameModal = (e, id, name)=>{
        e.preventDefault();
        e.stopPropagation();
        setProjectToRename({
            id,
            name
        });
        setRenameName(name);
        setShowRenameModal(true);
    };
    const closeRenameModal = ()=>{
        setShowRenameModal(false);
        setProjectToRename(null);
    };
    const handleRename = async ()=>{
        if (!projectToRename || !renameName.trim()) return;
        try {
            await renameProject(projectToRename.id, renameName);
            closeRenameModal();
        } catch (e) {
            console.error("Rename failed:", e);
            alert("Failed to rename project");
        }
    };
    const openDeleteModal = (e, id)=>{
        e.preventDefault();
        e.stopPropagation();
        setProjectToDelete(id);
        setShowDeleteModal(true);
    };
    const closeDeleteModal = ()=>{
        setShowDeleteModal(false);
        setProjectToDelete(null);
    };
    const confirmDelete = async ()=>{
        if (!projectToDelete) return;
        try {
            await deleteProject(projectToDelete);
            closeDeleteModal();
        } catch (e) {
            console.error("Delete failed:", e);
        }
    };
    const handleDelete = async (e, id)=>{
        e.preventDefault();
        e.stopPropagation();
        console.log("[Landing] Delete requested for:", id);
        if (confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
            console.log("[Landing] Confirmed delete for:", id);
            await deleteProject(id);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen relative text-white font-sans selection:bg-purple-500/30 overflow-hidden",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$LandingBackground$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/components/gtoc/LandingPage.tsx",
                lineNumber: 151,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative z-10 p-8",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-w-6xl mx-auto space-y-12",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                            className: "flex items-end justify-between border-b border-white/10 pb-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                            className: "text-4xl font-light tracking-tight flex items-center gap-4",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                src: "/vectra.svg",
                                                alt: "Vectra Logo",
                                                className: "h-30 w-auto mt-20"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/gtoc/LandingPage.tsx",
                                                lineNumber: 160,
                                                columnNumber: 33
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/gtoc/LandingPage.tsx",
                                            lineNumber: 158,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-white/50 text-sm",
                                            children: "Select a mission manifest to begin."
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/gtoc/LandingPage.tsx",
                                            lineNumber: 162,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-white/30 font-mono",
                                            children: [
                                                "Hydrated: ",
                                                hydrated ? "YES" : "NO",
                                                " | Projects: ",
                                                projects.length
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/gtoc/LandingPage.tsx",
                                            lineNumber: 164,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/gtoc/LandingPage.tsx",
                                    lineNumber: 157,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onPointerDown: ()=>console.log("[Landing] pointerdown on New Project"),
                                    onClick: (e)=>{
                                        e.preventDefault();
                                        e.stopPropagation();
                                        console.log("[Landing] New Project clicked");
                                        openCreateModal();
                                    },
                                    disabled: isCreating,
                                    className: `relative z-50 bg-white text-black hover:bg-white/90 px-6 py-2.5 rounded-full font-medium transition-colors flex items-center gap-2 text-sm ${isCreating ? "opacity-60 cursor-not-allowed" : ""}`,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "+"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/gtoc/LandingPage.tsx",
                                            lineNumber: 182,
                                            columnNumber: 29
                                        }, this),
                                        " ",
                                        isCreating ? "Creating..." : "New Project"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/gtoc/LandingPage.tsx",
                                    lineNumber: 169,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/gtoc/LandingPage.tsx",
                            lineNumber: 156,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
                            children: [
                                projects.map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                        initial: {
                                            opacity: 0,
                                            y: 10
                                        },
                                        animate: {
                                            opacity: 1,
                                            y: 0
                                        },
                                        whileHover: {
                                            scale: 1.01,
                                            translateY: -2
                                        },
                                        onClick: ()=>handleOpen(p.id),
                                        className: "group relative bg-[#0a0a0a] border border-white/10 rounded-xl p-6 cursor-pointer hover:border-white/30 transition-all shadow-xl hover:shadow-2xl hover:shadow-purple-900/10 overflow-hidden",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-transparent to-white/5 blur-2xl -mr-10 -mt-10 rounded-full",
                                                style: {
                                                    background: `radial-gradient(circle at center, ${p.previewColor || "#444"}, transparent 70%)`
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/gtoc/LandingPage.tsx",
                                                lineNumber: 197,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "relative z-10 flex flex-col h-full justify-between gap-8 h-40",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                className: "text-xl font-medium tracking-wide group-hover:text-purple-200 transition-colors",
                                                                children: p.name
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/gtoc/LandingPage.tsx",
                                                                lineNumber: 206,
                                                                columnNumber: 41
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex flex-col gap-1 mt-2 text-xs text-white/40 font-mono",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        children: [
                                                                            "ID: ",
                                                                            p.id.slice(0, 8)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/components/gtoc/LandingPage.tsx",
                                                                        lineNumber: 210,
                                                                        columnNumber: 45
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        children: [
                                                                            "Mod: ",
                                                                            new Date(p.modifiedAt).toLocaleDateString()
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/components/gtoc/LandingPage.tsx",
                                                                        lineNumber: 211,
                                                                        columnNumber: 45
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/gtoc/LandingPage.tsx",
                                                                lineNumber: 209,
                                                                columnNumber: 41
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/gtoc/LandingPage.tsx",
                                                        lineNumber: 205,
                                                        columnNumber: 37
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex justify-between items-end opacity-60 group-hover:opacity-100 transition-opacity",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-xs uppercase tracking-widest text-white/30",
                                                                children: (p.dataset || "").toUpperCase()
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/gtoc/LandingPage.tsx",
                                                                lineNumber: 216,
                                                                columnNumber: 41
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex gap-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        type: "button",
                                                                        onClick: (e)=>openRenameModal(e, p.id, p.name),
                                                                        className: "relative z-50 p-2 -m-2 text-white/20 hover:text-blue-400 transition-colors",
                                                                        title: "Rename Project",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                            width: "16",
                                                                            height: "16",
                                                                            viewBox: "0 0 24 24",
                                                                            fill: "none",
                                                                            stroke: "currentColor",
                                                                            strokeWidth: "2",
                                                                            strokeLinecap: "round",
                                                                            strokeLinejoin: "round",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                                    d: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/gtoc/LandingPage.tsx",
                                                                                    lineNumber: 228,
                                                                                    columnNumber: 53
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                                    d: "M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/gtoc/LandingPage.tsx",
                                                                                    lineNumber: 229,
                                                                                    columnNumber: 53
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/components/gtoc/LandingPage.tsx",
                                                                            lineNumber: 227,
                                                                            columnNumber: 49
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/gtoc/LandingPage.tsx",
                                                                        lineNumber: 221,
                                                                        columnNumber: 45
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        type: "button",
                                                                        onClick: (e)=>openDeleteModal(e, p.id),
                                                                        className: "relative z-50 p-2 -m-2 text-white/20 hover:text-red-400 transition-colors",
                                                                        title: "Delete Project",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                            width: "16",
                                                                            height: "16",
                                                                            viewBox: "0 0 24 24",
                                                                            fill: "none",
                                                                            stroke: "currentColor",
                                                                            strokeWidth: "2",
                                                                            strokeLinecap: "round",
                                                                            strokeLinejoin: "round",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                                                                                    points: "3 6 5 6 21 6"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/gtoc/LandingPage.tsx",
                                                                                    lineNumber: 240,
                                                                                    columnNumber: 53
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                                    d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/gtoc/LandingPage.tsx",
                                                                                    lineNumber: 241,
                                                                                    columnNumber: 53
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/components/gtoc/LandingPage.tsx",
                                                                            lineNumber: 239,
                                                                            columnNumber: 49
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/gtoc/LandingPage.tsx",
                                                                        lineNumber: 233,
                                                                        columnNumber: 45
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/gtoc/LandingPage.tsx",
                                                                lineNumber: 220,
                                                                columnNumber: 41
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/gtoc/LandingPage.tsx",
                                                        lineNumber: 215,
                                                        columnNumber: 37
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/gtoc/LandingPage.tsx",
                                                lineNumber: 204,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, p.id, true, {
                                        fileName: "[project]/src/components/gtoc/LandingPage.tsx",
                                        lineNumber: 189,
                                        columnNumber: 29
                                    }, this)),
                                projects.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    onClick: ()=>openCreateModal(),
                                    className: "border border-dashed border-white/10 rounded-xl p-6 flex flex-col items-center justify-center text-white/30 gap-4 cursor-pointer hover:bg-white/5 hover:border-white/20 hover:text-white/60 transition-colors min-h-[200px]",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-2xl",
                                            children: "+"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/gtoc/LandingPage.tsx",
                                            lineNumber: 255,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            children: "Create your first project"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/gtoc/LandingPage.tsx",
                                            lineNumber: 256,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/gtoc/LandingPage.tsx",
                                    lineNumber: 251,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/gtoc/LandingPage.tsx",
                            lineNumber: 187,
                            columnNumber: 21
                        }, this),
                        showCreateModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "fixed inset-0 z-[999] bg-black/70 flex items-center justify-center p-4",
                            // Only close when clicking the backdrop itself (not the modal content)
                            onClick: (e)=>{
                                if (e.target === e.currentTarget) closeCreateModal();
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-full max-w-md rounded-2xl border border-white/10 bg-[#0a0a0a] p-6 shadow-2xl",
                                // Prevent backdrop click close from clicks inside content
                                onClick: (e)=>e.stopPropagation(),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-lg font-medium",
                                        children: "New Project"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/gtoc/LandingPage.tsx",
                                        lineNumber: 275,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-white/50 mt-1",
                                        children: "Enter a project name to create it."
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/gtoc/LandingPage.tsx",
                                        lineNumber: 276,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        autoFocus: true,
                                        value: newProjectName,
                                        onChange: (e)=>setNewProjectName(e.target.value),
                                        onKeyDown: (e)=>{
                                            if (e.key === "Enter") handleCreate();
                                            if (e.key === "Escape") closeCreateModal();
                                        },
                                        className: "mt-4 w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm outline-none focus:border-white/30",
                                        placeholder: "Mission name"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/gtoc/LandingPage.tsx",
                                        lineNumber: 278,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-5 flex justify-end gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: closeCreateModal,
                                                className: "px-4 py-2 rounded-full text-sm text-white/70 hover:text-white hover:bg-white/5 transition disabled:opacity-50",
                                                disabled: isCreating,
                                                children: "Cancel"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/gtoc/LandingPage.tsx",
                                                lineNumber: 291,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: handleCreate,
                                                className: "px-4 py-2 rounded-full text-sm bg-white text-black hover:bg-white/90 transition disabled:opacity-60",
                                                disabled: isCreating || !newProjectName.trim(),
                                                children: isCreating ? "Creating..." : "Create"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/gtoc/LandingPage.tsx",
                                                lineNumber: 299,
                                                columnNumber: 37
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/gtoc/LandingPage.tsx",
                                        lineNumber: 290,
                                        columnNumber: 33
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/gtoc/LandingPage.tsx",
                                lineNumber: 270,
                                columnNumber: 29
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/gtoc/LandingPage.tsx",
                            lineNumber: 263,
                            columnNumber: 25
                        }, this),
                        showRenameModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "fixed inset-0 z-[999] bg-black/70 flex items-center justify-center p-4",
                            onClick: (e)=>{
                                if (e.target === e.currentTarget) closeRenameModal();
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-full max-w-md rounded-2xl border border-white/10 bg-[#0a0a0a] p-6 shadow-2xl",
                                onClick: (e)=>e.stopPropagation(),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-lg font-medium",
                                        children: "Rename Project"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/gtoc/LandingPage.tsx",
                                        lineNumber: 323,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-white/50 mt-1",
                                        children: "Enter a new name for your project."
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/gtoc/LandingPage.tsx",
                                        lineNumber: 324,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        autoFocus: true,
                                        value: renameName,
                                        onChange: (e)=>setRenameName(e.target.value),
                                        onKeyDown: (e)=>{
                                            if (e.key === "Enter") handleRename();
                                            if (e.key === "Escape") closeRenameModal();
                                        },
                                        className: "mt-4 w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm outline-none focus:border-white/30",
                                        placeholder: "Project Name"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/gtoc/LandingPage.tsx",
                                        lineNumber: 326,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-5 flex justify-end gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: closeRenameModal,
                                                className: "px-4 py-2 rounded-full text-sm text-white/70 hover:text-white hover:bg-white/5 transition",
                                                children: "Cancel"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/gtoc/LandingPage.tsx",
                                                lineNumber: 339,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: handleRename,
                                                className: "px-4 py-2 rounded-full text-sm bg-white text-black hover:bg-white/90 transition disabled:opacity-60",
                                                disabled: !renameName.trim(),
                                                children: "Save"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/gtoc/LandingPage.tsx",
                                                lineNumber: 346,
                                                columnNumber: 37
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/gtoc/LandingPage.tsx",
                                        lineNumber: 338,
                                        columnNumber: 33
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/gtoc/LandingPage.tsx",
                                lineNumber: 319,
                                columnNumber: 29
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/gtoc/LandingPage.tsx",
                            lineNumber: 313,
                            columnNumber: 25
                        }, this),
                        showDeleteModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "fixed inset-0 z-[999] bg-black/70 flex items-center justify-center p-4",
                            onClick: (e)=>{
                                if (e.target === e.currentTarget) closeDeleteModal();
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-full max-w-sm rounded-2xl border border-red-500/20 bg-[#0a0a0a] p-6 shadow-2xl shadow-red-900/10",
                                onClick: (e)=>e.stopPropagation(),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-lg font-medium text-red-400 flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                className: "w-5 h-5",
                                                fill: "none",
                                                stroke: "currentColor",
                                                viewBox: "0 0 24 24",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    strokeLinecap: "round",
                                                    strokeLinejoin: "round",
                                                    strokeWidth: "2",
                                                    d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/gtoc/LandingPage.tsx",
                                                    lineNumber: 373,
                                                    columnNumber: 41
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/gtoc/LandingPage.tsx",
                                                lineNumber: 372,
                                                columnNumber: 37
                                            }, this),
                                            "Delete Project?"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/gtoc/LandingPage.tsx",
                                        lineNumber: 371,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-white/60 mt-2",
                                        children: "Are you sure you want to delete this project? This action cannot be undone."
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/gtoc/LandingPage.tsx",
                                        lineNumber: 377,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-6 flex justify-end gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: closeDeleteModal,
                                                className: "px-4 py-2 rounded-full text-sm text-white/70 hover:text-white hover:bg-white/5 transition",
                                                children: "Cancel"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/gtoc/LandingPage.tsx",
                                                lineNumber: 382,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: confirmDelete,
                                                className: "px-4 py-2 rounded-full text-sm bg-red-500 text-white hover:bg-red-600 transition",
                                                children: "Delete"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/gtoc/LandingPage.tsx",
                                                lineNumber: 389,
                                                columnNumber: 37
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/gtoc/LandingPage.tsx",
                                        lineNumber: 381,
                                        columnNumber: 33
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/gtoc/LandingPage.tsx",
                                lineNumber: 367,
                                columnNumber: 29
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/gtoc/LandingPage.tsx",
                            lineNumber: 361,
                            columnNumber: 25
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/gtoc/LandingPage.tsx",
                    lineNumber: 154,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/gtoc/LandingPage.tsx",
                lineNumber: 153,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/gtoc/LandingPage.tsx",
        lineNumber: 150,
        columnNumber: 9
    }, this);
}
_s(LandingPage, "rh91gCHddKRWqK3mh6ngqfqcXQo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$projectStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProjectStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$projectStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProjectStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$projectStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProjectStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$projectStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProjectStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$projectStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProjectStore"]
    ];
});
_c = LandingPage;
var _c;
__turbopack_context__.k.register(_c, "LandingPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/app/gtoc/viewer/page.tsx
__turbopack_context__.s([
    "default",
    ()=>ViewerPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$LandingPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/gtoc/LandingPage.tsx [app-client] (ecmascript)");
"use client";
;
;
function ViewerPage() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$LandingPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
        fileName: "[project]/src/app/page.tsx",
        lineNumber: 8,
        columnNumber: 5
    }, this);
}
_c = ViewerPage;
var _c;
__turbopack_context__.k.register(_c, "ViewerPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_0a4cc7d7._.js.map