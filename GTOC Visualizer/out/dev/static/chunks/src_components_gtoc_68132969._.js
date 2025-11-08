(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/gtoc/solutions/useSolutions.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useSolutions",
    ()=>useSolutions
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
;
const useSolutions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])((set, get)=>({
        solutions: [],
        visible: {},
        loadPersisted: async ()=>{
            console.log("[useSolutions] Local-only mode, skipping persistence");
            set({
                solutions: [],
                visible: {}
            });
        },
        importSolution: async (file)=>{
            try {
                const text = await file.text();
                const lines = text.split("\n").map((l)=>l.trim()).filter((l)=>l && !l.startsWith("#"));
                let sol = null;
                const joined = lines.join("\n");
                try {
                    sol = JSON.parse(joined);
                } catch  {
                    const samples = lines.map((line)=>{
                        const nums = line.split(/[,\s]+/).map(Number);
                        if (nums.length < 9 || nums.some((n)=>Number.isNaN(n))) return null;
                        // GTOC layout: bodyId, flag, t, px, py, pz, vx, vy, vz, ...
                        const [bodyId, flag, t, px, py, pz, vx, vy, vz, ...rest] = nums;
                        const p = [
                            px,
                            py,
                            pz
                        ];
                        const v = [
                            vx,
                            vy,
                            vz
                        ];
                        const u = rest.length >= 3 ? [
                            rest[0],
                            rest[1],
                            rest[2]
                        ] : [
                            0,
                            0,
                            0
                        ];
                        return {
                            bodyId,
                            flag,
                            t,
                            p,
                            v,
                            u
                        };
                    }).filter((s)=>!!s);
                    sol = {
                        id: file.name.replace(/\.[^/.]+$/, ""),
                        name: file.name,
                        color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`,
                        samples
                    };
                }
                if (!sol?.samples?.length) throw new Error(`Invalid or empty data in ${file.name}`);
                set((state)=>({
                        solutions: [
                            ...state.solutions,
                            sol
                        ],
                        visible: {
                            ...state.visible,
                            [sol.id]: true
                        }
                    }));
                console.log(`[useSolutions] Imported "${sol.name}" (${sol.samples.length} samples)`);
            } catch (err) {
                console.error("[useSolutions] importSolution error:", err);
                alert(`Failed to import solution: ${err.message}`);
            }
        },
        deleteSolution: async (id)=>{
            console.log(`[useSolutions] Deleted ${id}`);
            set((state)=>({
                    solutions: state.solutions.filter((s)=>s.id !== id),
                    visible: Object.fromEntries(Object.entries(state.visible).filter(([k])=>k !== id))
                }));
        },
        toggle: (id)=>set((state)=>({
                    visible: {
                        ...state.visible,
                        [id]: !state.visible[id]
                    }
                })),
        recolorSolution: (id, newColor)=>set((state)=>({
                    solutions: state.solutions.map((s)=>s.id === id ? {
                            ...s,
                            color: newColor
                        } : s)
                }))
    }));
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/gtoc/solutions/SolutionsUI.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SolutionsUI
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$colorful$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-colorful/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$solutions$2f$useSolutions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/gtoc/solutions/useSolutions.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
/* ---------- Floating color picker portal ---------- */ function ColorPickerPortal({ anchorRef, color, onChange, onClose }) {
    _s();
    const pickerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [pos, setPos] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        x: 0,
        y: 0
    });
    const [tempColor, setTempColor] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(color);
    // 🧭 Smart positioning (prevent offscreen)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ColorPickerPortal.useEffect": ()=>{
            const el = anchorRef.current;
            if (!el) return;
            const rect = el.getBoundingClientRect();
            const pickerWidth = 200;
            const pickerHeight = 190;
            let x = rect.right + 10;
            let y = rect.top;
            if (x + pickerWidth > window.innerWidth) x = rect.left - pickerWidth - 10;
            if (y + pickerHeight > window.innerHeight) y = window.innerHeight - pickerHeight - 10;
            setPos({
                x,
                y
            });
        }
    }["ColorPickerPortal.useEffect"], [
        anchorRef
    ]);
    // 🖱 Close on outside click
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ColorPickerPortal.useEffect": ()=>{
            const handleClick = {
                "ColorPickerPortal.useEffect.handleClick": (e)=>{
                    const target = e.target;
                    if (!anchorRef.current?.contains(target) && !pickerRef.current?.contains(target)) {
                        onClose();
                    }
                }
            }["ColorPickerPortal.useEffect.handleClick"];
            window.addEventListener("mousedown", handleClick);
            return ({
                "ColorPickerPortal.useEffect": ()=>window.removeEventListener("mousedown", handleClick)
            })["ColorPickerPortal.useEffect"];
        }
    }["ColorPickerPortal.useEffect"], [
        anchorRef,
        onClose
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: pickerRef,
        className: "fixed z-[9999] p-3 rounded-xl bg-black/90 border border-white/10 shadow-2xl backdrop-blur-sm flex flex-col items-center space-y-2",
        style: {
            left: pos.x,
            top: pos.y
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$colorful$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HexColorPicker"], {
                color: tempColor,
                onChange: setTempColor
            }, void 0, false, {
                fileName: "[project]/src/components/gtoc/solutions/SolutionsUI.tsx",
                lineNumber: 60,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex gap-2 mt-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>{
                            onChange(tempColor);
                            setTimeout(()=>onClose(), 50); // ensures store updates before unmount
                        },
                        className: "px-3 py-1 rounded bg-green-500/80 hover:bg-green-400 text-white text-xs font-semibold shadow",
                        children: "Save"
                    }, void 0, false, {
                        fileName: "[project]/src/components/gtoc/solutions/SolutionsUI.tsx",
                        lineNumber: 63,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onClose,
                        className: "px-3 py-1 rounded bg-red-500/60 hover:bg-red-400 text-white text-xs font-semibold shadow",
                        children: "Cancel"
                    }, void 0, false, {
                        fileName: "[project]/src/components/gtoc/solutions/SolutionsUI.tsx",
                        lineNumber: 74,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/gtoc/solutions/SolutionsUI.tsx",
                lineNumber: 61,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/gtoc/solutions/SolutionsUI.tsx",
        lineNumber: 55,
        columnNumber: 5
    }, this);
}
_s(ColorPickerPortal, "bUwmyyb/saWywdsveu5irmtYvbI=");
_c = ColorPickerPortal;
function SolutionsUI() {
    _s1();
    const { solutions, visible, importSolution, toggle, deleteSolution, recolorSolution } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$solutions$2f$useSolutions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSolutions"])();
    const [openPicker, setOpenPicker] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const btnRefs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({});
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "absolute top-3 right-3 z-[70] pointer-events-auto bg-black/70 border border-white/10 rounded-xl p-3 w-80 text-white",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-between items-center mb-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "font-semibold text-sm",
                        children: "Solutions"
                    }, void 0, false, {
                        fileName: "[project]/src/components/gtoc/solutions/SolutionsUI.tsx",
                        lineNumber: 103,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "text-xs border border-white/20 rounded px-2 py-1 cursor-pointer hover:bg-white/10",
                        children: [
                            "Import",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "file",
                                accept: ".txt",
                                className: "hidden",
                                onChange: (e)=>{
                                    const f = e.target.files?.[0];
                                    if (f) importSolution(f);
                                    e.target.value = "";
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/components/gtoc/solutions/SolutionsUI.tsx",
                                lineNumber: 106,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/gtoc/solutions/SolutionsUI.tsx",
                        lineNumber: 104,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/gtoc/solutions/SolutionsUI.tsx",
                lineNumber: 102,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-1 max-h-[60vh] overflow-y-auto pr-1",
                children: [
                    solutions.map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between border border-white/15 rounded px-2 py-1 text-xs hover:bg-white/5 transition-colors",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "truncate flex-1",
                                    children: s.name
                                }, void 0, false, {
                                    fileName: "[project]/src/components/gtoc/solutions/SolutionsUI.tsx",
                                    lineNumber: 126,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    ref: (el)=>{
                                        btnRefs.current[s.id] = el;
                                    },
                                    onClick: ()=>setOpenPicker(openPicker === s.id ? null : s.id),
                                    className: "w-4 h-4 rounded-full border border-white/30 mx-1",
                                    style: {
                                        backgroundColor: s.color
                                    },
                                    title: "Change color"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/gtoc/solutions/SolutionsUI.tsx",
                                    lineNumber: 129,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>toggle(s.id),
                                    className: `px-1 rounded border ${visible[s.id] ? "border-white/20 hover:bg-white/10" : "border-white/10 text-white/50 hover:bg-white/5"}`,
                                    children: visible[s.id] ? "👁" : "🚫"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/gtoc/solutions/SolutionsUI.tsx",
                                    lineNumber: 142,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>deleteSolution(s.id),
                                    className: "px-1 rounded border border-red-400/40 text-red-300 hover:bg-red-400/20",
                                    children: "✕"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/gtoc/solutions/SolutionsUI.tsx",
                                    lineNumber: 154,
                                    columnNumber: 13
                                }, this),
                                openPicker === s.id && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ColorPickerPortal, {
                                    anchorRef: {
                                        current: btnRefs.current[s.id]
                                    },
                                    color: s.color,
                                    onChange: (c)=>recolorSolution?.(s.id, c),
                                    onClose: ()=>setOpenPicker(null)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/gtoc/solutions/SolutionsUI.tsx",
                                    lineNumber: 163,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, s.id, true, {
                            fileName: "[project]/src/components/gtoc/solutions/SolutionsUI.tsx",
                            lineNumber: 122,
                            columnNumber: 11
                        }, this)),
                    solutions.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-white/50 text-xs",
                        children: "No solutions loaded."
                    }, void 0, false, {
                        fileName: "[project]/src/components/gtoc/solutions/SolutionsUI.tsx",
                        lineNumber: 174,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/gtoc/solutions/SolutionsUI.tsx",
                lineNumber: 120,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/gtoc/solutions/SolutionsUI.tsx",
        lineNumber: 100,
        columnNumber: 5
    }, this);
}
_s1(SolutionsUI, "cxwnKZJwl7G2+K9DtMspeNcxCdg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$solutions$2f$useSolutions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSolutions"]
    ];
});
_c1 = SolutionsUI;
var _c, _c1;
__turbopack_context__.k.register(_c, "ColorPickerPortal");
__turbopack_context__.k.register(_c1, "SolutionsUI");
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
    ()=>TYPE_COLORS
]);
const SYSTEM_NAME = "Altaira System";
const AU_KM = 149_597_870.691; // kilometers per astronomical unit
const SECONDS_PER_DAY = 86_400; // seconds per day
const DAYS_PER_YEAR = 365.25; // mean solar days per year
const ALTAIRA_GM = 139_348_062_043.343; // km³/s² (gravitational parameter)
const JD_SIM_START = 0; // synthetic epoch for GTOC13 simulation
const JD_EPOCH_0 = 2451545.0; // reference epoch (display anchor only)
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
    SAIL,
    COMPETITION,
    BODY_WEIGHTS,
    TIME_BONUS
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/gtoc/solutions/SolutionPath.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SolutionPath
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/build/three.core.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$Line$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@react-three/drei/core/Line.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/gtoc/utils/constants.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
function SolutionPath({ sol, currentJD, epochZeroJD, showShip, onHover, onUnhover }) {
    _s();
    if (!sol?.samples?.length) return null;
    // --- Detect AU vs km ---
    const medianR = (()=>{
        const mags = sol.samples.map((s)=>Math.hypot(...s.p)).filter((m)=>Number.isFinite(m)).sort((a, b)=>a - b);
        return mags[Math.floor(mags.length / 2)] || 1;
    })();
    const SCALE = medianR > 1e3 ? 1 / __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AU_KM"] : 1;
    // --- Convert to 3D points ---
    const pts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "SolutionPath.useMemo[pts]": ()=>sol.samples.map({
                "SolutionPath.useMemo[pts]": (s)=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](...s.p).multiplyScalar(SCALE)
            }["SolutionPath.useMemo[pts]"]).filter({
                "SolutionPath.useMemo[pts]": (v)=>Number.isFinite(v.x) && Number.isFinite(v.y) && Number.isFinite(v.z)
            }["SolutionPath.useMemo[pts]"])
    }["SolutionPath.useMemo[pts]"], [
        sol.samples,
        SCALE
    ]);
    if (pts.length < 2) return null;
    // --- Continuous progress interpolation ---
    const elapsed = (currentJD - epochZeroJD) * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SECONDS_PER_DAY"];
    const times = sol.samples.map((s)=>s.t);
    let idx = times.findIndex((t, i)=>elapsed >= t && elapsed <= times[i + 1]);
    if (idx < 0) idx = Math.max(0, times.length - 2);
    const t0 = times[idx];
    const t1 = times[idx + 1];
    const a = t1 > t0 ? (elapsed - t0) / (t1 - t0) : 0;
    const shipPos = pts[idx].clone().lerp(pts[idx + 1], a);
    const visiblePts = [
        ...pts.slice(0, idx + 1),
        shipPos
    ];
    const baseColor = sol.color || "#66d9e8";
    // --- Hovered leg state ---
    const [hoveredLeg, setHoveredLeg] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // --- Leg metadata (hover info) ---
    const legs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "SolutionPath.useMemo[legs]": ()=>{
            const out = [];
            if (!sol.samples.length) return out;
            const scaled = sol.samples.map({
                "SolutionPath.useMemo[legs].scaled": (s)=>({
                        t: s.t,
                        body: s.bodyId ?? 0,
                        v: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](...s.p).multiplyScalar(SCALE)
                    })
            }["SolutionPath.useMemo[legs].scaled"]);
            let cur = {
                fromBody: scaled[0].body,
                toBody: scaled[0].body,
                t0: scaled[0].t,
                t1: scaled[0].t,
                pts: [
                    scaled[0].v
                ]
            };
            for(let i = 1; i < scaled.length; i++){
                const s = scaled[i];
                cur.pts.push(s.v);
                cur.t1 = s.t;
                // Detect a body transition
                const nextBody = scaled[i + 1]?.body ?? s.body;
                if (nextBody !== s.body) {
                    // Find the next distinct body ahead to serve as destination
                    const toBody = scaled.slice(i + 1).map({
                        "SolutionPath.useMemo[legs]": (p)=>p.body
                    }["SolutionPath.useMemo[legs]"]).find({
                        "SolutionPath.useMemo[legs]": (b)=>b !== s.body
                    }["SolutionPath.useMemo[legs]"]) ?? s.body;
                    cur.toBody = toBody;
                    out.push(cur);
                    // Start new leg
                    cur = {
                        fromBody: s.body,
                        toBody,
                        t0: s.t,
                        t1: s.t,
                        pts: []
                    };
                }
            }
            // Push the last leg if valid
            if (cur.pts.length > 0) out.push(cur);
            return out;
        }
    }["SolutionPath.useMemo[legs]"], [
        sol.samples,
        SCALE
    ]);
    /* ============================================================= */ return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$Line$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Line"], {
                points: pts,
                color: baseColor,
                lineWidth: 0.2,
                dashed: true,
                dashSize: 0.02,
                gapSize: 0.02,
                transparent: true,
                opacity: 0.25,
                toneMapped: false
            }, void 0, false, {
                fileName: "[project]/src/components/gtoc/solutions/SolutionPath.tsx",
                lineNumber: 148,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$Line$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Line"], {
                points: visiblePts,
                color: baseColor,
                lineWidth: 1.8,
                transparent: true,
                opacity: 0.95,
                toneMapped: false
            }, `${sol.id}-progress`, false, {
                fileName: "[project]/src/components/gtoc/solutions/SolutionPath.tsx",
                lineNumber: 161,
                columnNumber: 7
            }, this),
            showShip && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                position: shipPos,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("sphereGeometry", {
                        args: [
                            0.05,
                            32,
                            32
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/gtoc/solutions/SolutionPath.tsx",
                        lineNumber: 174,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshBasicMaterial", {
                        color: baseColor,
                        toneMapped: false
                    }, void 0, false, {
                        fileName: "[project]/src/components/gtoc/solutions/SolutionPath.tsx",
                        lineNumber: 175,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/gtoc/solutions/SolutionPath.tsx",
                lineNumber: 173,
                columnNumber: 9
            }, this),
            legs.map((leg, i)=>{
                const tofDays = (leg.t1 - leg.t0) / __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SECONDS_PER_DAY"];
                const isHovered = hoveredLeg === i;
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                    children: [
                        isHovered && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$Line$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Line"], {
                            points: leg.pts,
                            color: baseColor,
                            lineWidth: 4.2,
                            transparent: true,
                            opacity: 0.9,
                            toneMapped: false
                        }, void 0, false, {
                            fileName: "[project]/src/components/gtoc/solutions/SolutionPath.tsx",
                            lineNumber: 188,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$Line$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Line"], {
                            points: leg.pts,
                            color: baseColor,
                            lineWidth: 3.5,
                            transparent: true,
                            opacity: 0,
                            toneMapped: false,
                            onPointerOver: (e)=>{
                                e.stopPropagation();
                                setHoveredLeg(i);
                                onHover?.({
                                    solutionName: sol.name,
                                    color: baseColor,
                                    legIndex: i + 1,
                                    fromBody: leg.fromBody,
                                    toBody: leg.toBody,
                                    tofDays
                                }, e.clientX, e.clientY);
                            },
                            onPointerOut: (e)=>{
                                e.stopPropagation();
                                setHoveredLeg(null);
                                onUnhover?.();
                            }
                        }, void 0, false, {
                            fileName: "[project]/src/components/gtoc/solutions/SolutionPath.tsx",
                            lineNumber: 199,
                            columnNumber: 13
                        }, this)
                    ]
                }, `${sol.id}-leg-${i}`, true, {
                    fileName: "[project]/src/components/gtoc/solutions/SolutionPath.tsx",
                    lineNumber: 185,
                    columnNumber: 11
                }, this);
            })
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/gtoc/solutions/SolutionPath.tsx",
        lineNumber: 146,
        columnNumber: 5
    }, this);
}
_s(SolutionPath, "g7dWBeRek17DpyJp6Ra1CenV0So=");
_c = SolutionPath;
var _c;
__turbopack_context__.k.register(_c, "SolutionPath");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/gtoc/solutions/Solutions3D.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Solutions3D
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$solutions$2f$useSolutions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/gtoc/solutions/useSolutions.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$solutions$2f$SolutionPath$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/gtoc/solutions/SolutionPath.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function Solutions3D({ currentJD, epochZeroJD, showShip, onHover, onUnhover }) {
    _s();
    const { solutions, visible } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$solutions$2f$useSolutions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSolutions"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: solutions.map((s)=>visible[s.id] && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$solutions$2f$SolutionPath$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                sol: s,
                currentJD: currentJD,
                epochZeroJD: epochZeroJD,
                showShip: showShip,
                onHover: onHover,
                onUnhover: onUnhover
            }, s.id, false, {
                fileName: "[project]/src/components/gtoc/solutions/Solutions3D.tsx",
                lineNumber: 27,
                columnNumber: 13
            }, this))
    }, void 0, false);
}
_s(Solutions3D, "WgrkwgpWi0QeV17pY7zIFQvRg6I=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$solutions$2f$useSolutions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSolutions"]
    ];
});
_c = Solutions3D;
var _c;
__turbopack_context__.k.register(_c, "Solutions3D");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/gtoc/solutions/types.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/gtoc/solutions/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$solutions$2f$SolutionsUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/gtoc/solutions/SolutionsUI.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$solutions$2f$Solutions3D$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/gtoc/solutions/Solutions3D.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$solutions$2f$SolutionPath$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/gtoc/solutions/SolutionPath.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$solutions$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/gtoc/solutions/types.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$solutions$2f$useSolutions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/gtoc/solutions/useSolutions.ts [app-client] (ecmascript)");
;
;
;
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/gtoc/solutions/SolutionsUI.tsx [app-client] (ecmascript) <export default as SolutionsUI>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SolutionsUI",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$solutions$2f$SolutionsUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$solutions$2f$SolutionsUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/gtoc/solutions/SolutionsUI.tsx [app-client] (ecmascript)");
}),
"[project]/src/components/gtoc/solutions/Solutions3D.tsx [app-client] (ecmascript) <export default as Solutions3D>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Solutions3D",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$solutions$2f$Solutions3D$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$solutions$2f$Solutions3D$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/gtoc/solutions/Solutions3D.tsx [app-client] (ecmascript)");
}),
"[project]/src/components/gtoc/sceneParts/HUD.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>HUD
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
const clamp = (x, a, b)=>Math.max(a, Math.min(b, x));
const lerp = (a, b, t)=>a + (b - a) * t;
const RAIL_HEIGHT_PX = 6;
const RAIL_BOTTOM_PX = 16;
const RAIL_CENTER_BOTTOM_PX = RAIL_BOTTOM_PX + RAIL_HEIGHT_PX / 2;
function jdToDate(jd) {
    const ms = (jd - 2440587.5) * 86400000;
    return new Date(ms);
}
function dateToJD(d) {
    return d.getTime() / 86400000 + 2440587.5;
}
function jdToISO(jd) {
    return jdToDate(jd).toISOString().replace(".000Z", "Z");
}
const isoShort = (iso)=>iso.slice(0, 10);
function buildTimeGrid(jdMin, jdMax, custom) {
    const start = jdToDate(jdMin);
    const end = jdToDate(jdMax);
    const y0 = start.getUTCFullYear();
    const y1 = end.getUTCFullYear();
    const first25 = Math.floor(y0 / 25) * 25;
    const last25 = Math.ceil(y1 / 25) * 25;
    const grid = [
        {
            jd: jdMin,
            label: isoShort(jdToISO(jdMin)),
            kind: "start"
        },
        {
            jd: jdMax,
            label: isoShort(jdToISO(jdMax)),
            kind: "end"
        }
    ];
    const yearBufferJD = 365.25;
    for(let y = first25; y <= last25; y += 25){
        const d = new Date(Date.UTC(y, 0, 1));
        const mJD = dateToJD(d);
        if (mJD <= jdMin + yearBufferJD || mJD >= jdMax - yearBufferJD) continue;
        const isCentury = y % 100 === 0;
        grid.push({
            jd: mJD,
            label: String(y),
            kind: isCentury ? "major" : "minor"
        });
    }
    const dedupTol = (jdMax - jdMin) * 1e-4;
    for (const m of custom){
        if (!grid.some((g)=>Math.abs(g.jd - m.jd) < dedupTol)) grid.push(m);
    }
    grid.sort((a, b)=>a.jd - b.jd);
    return grid;
}
/* ---------- Icons ---------- */ const IconPlay = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: "14",
        height: "14",
        viewBox: "0 0 24 24",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M7 5l12 7-12 7V5z",
            fill: "currentColor"
        }, void 0, false, {
            fileName: "[project]/src/components/gtoc/sceneParts/HUD.tsx",
            lineNumber: 76,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/gtoc/sceneParts/HUD.tsx",
        lineNumber: 75,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
_c = IconPlay;
const IconPause = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: "14",
        height: "14",
        viewBox: "0 0 24 24",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M8 6h3v12H8zM13 6h3v12h-3z",
            fill: "currentColor"
        }, void 0, false, {
            fileName: "[project]/src/components/gtoc/sceneParts/HUD.tsx",
            lineNumber: 81,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/gtoc/sceneParts/HUD.tsx",
        lineNumber: 80,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
_c1 = IconPause;
const IconPrev = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: "14",
        height: "14",
        viewBox: "0 0 24 24",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M7 6h2v12H7zM21 18L9 12l12-6v12z",
            fill: "currentColor"
        }, void 0, false, {
            fileName: "[project]/src/components/gtoc/sceneParts/HUD.tsx",
            lineNumber: 86,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/gtoc/sceneParts/HUD.tsx",
        lineNumber: 85,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
_c2 = IconPrev;
const IconNext = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: "14",
        height: "14",
        viewBox: "0 0 24 24",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M15 6h2v12h-2zM3 18l12-6L3 6v12z",
            fill: "currentColor"
        }, void 0, false, {
            fileName: "[project]/src/components/gtoc/sceneParts/HUD.tsx",
            lineNumber: 91,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/gtoc/sceneParts/HUD.tsx",
        lineNumber: 90,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
_c3 = IconNext;
const IconSpeed = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: "14",
        height: "14",
        viewBox: "0 0 24 24",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "12",
                cy: "12",
                r: "8.5",
                stroke: "currentColor",
                strokeWidth: "1.5",
                fill: "none"
            }, void 0, false, {
                fileName: "[project]/src/components/gtoc/sceneParts/HUD.tsx",
                lineNumber: 96,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M12 12l4-4",
                stroke: "currentColor",
                strokeWidth: "1.5",
                strokeLinecap: "round"
            }, void 0, false, {
                fileName: "[project]/src/components/gtoc/sceneParts/HUD.tsx",
                lineNumber: 97,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/gtoc/sceneParts/HUD.tsx",
        lineNumber: 95,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
_c4 = IconSpeed;
const IconCalendar = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: "14",
        height: "14",
        viewBox: "0 0 24 24",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                x: "3",
                y: "5",
                width: "18",
                height: "16",
                rx: "2",
                stroke: "currentColor",
                strokeWidth: "1.5",
                fill: "none"
            }, void 0, false, {
                fileName: "[project]/src/components/gtoc/sceneParts/HUD.tsx",
                lineNumber: 102,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M8 3v4M16 3v4M3 10h18",
                stroke: "currentColor",
                strokeWidth: "1.5"
            }, void 0, false, {
                fileName: "[project]/src/components/gtoc/sceneParts/HUD.tsx",
                lineNumber: 103,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/gtoc/sceneParts/HUD.tsx",
        lineNumber: 101,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
_c5 = IconCalendar;
function HUD({ jd, setJD, isPlaying, setPlaying, rate, setRate, jdMin, jdMax, milestonesJD, milestonesISO }) {
    _s();
    const railRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const knobRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [isScrubbing, setScrubbing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [stepDays, setStepDays] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(rate);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "HUD.useEffect": ()=>setStepDays(rate)
    }["HUD.useEffect"], [
        rate
    ]);
    const pct = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "HUD.useMemo[pct]": ()=>jdMax > jdMin ? (jd - jdMin) / (jdMax - jdMin) * 100 : 0
    }["HUD.useMemo[pct]"], [
        jd,
        jdMin,
        jdMax
    ]);
    const customMarkers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "HUD.useMemo[customMarkers]": ()=>milestonesJD.map({
                "HUD.useMemo[customMarkers]": (mjd, i)=>({
                        jd: mjd,
                        label: milestonesISO[i],
                        kind: "custom"
                    })
            }["HUD.useMemo[customMarkers]"])
    }["HUD.useMemo[customMarkers]"], [
        milestonesJD,
        milestonesISO
    ]);
    const markers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "HUD.useMemo[markers]": ()=>buildTimeGrid(jdMin, jdMax, customMarkers)
    }["HUD.useMemo[markers]"], [
        jdMin,
        jdMax,
        customMarkers
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "HUD.useEffect": ()=>{
            if (knobRef.current) knobRef.current.tabIndex = 0;
        }
    }["HUD.useEffect"], []);
    const updateFromClientX = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "HUD.useCallback[updateFromClientX]": (clientX)=>{
            const rail = railRef.current;
            if (!rail) return;
            const rect = rail.getBoundingClientRect();
            const p = clamp((clientX - rect.left) / rect.width, 0, 1);
            setJD(lerp(jdMin, jdMax, p));
        }
    }["HUD.useCallback[updateFromClientX]"], [
        jdMin,
        jdMax,
        setJD
    ]);
    const onPointerDownRail = (e)=>{
        e.currentTarget.setPointerCapture(e.pointerId);
        setScrubbing(true);
        updateFromClientX(e.clientX);
    };
    const onPointerMoveRail = (e)=>{
        if (isScrubbing) updateFromClientX(e.clientX);
    };
    const onPointerUpRail = (e)=>{
        e.currentTarget.releasePointerCapture(e.pointerId);
        setScrubbing(false);
    };
    const onWheel = (e)=>{
        e.preventDefault();
        const delta = (jdMax - jdMin) * (e.deltaY < 0 ? -0.0015 : 0.0015);
        setJD((prev)=>clamp(prev + delta, jdMin, jdMax));
    };
    const onKeyDownKnob = (e)=>{
        if (e.key === "ArrowLeft") setJD((prev)=>clamp(prev - stepDays, jdMin, jdMax));
        else if (e.key === "ArrowRight") setJD((prev)=>clamp(prev + stepDays, jdMin, jdMax));
        else if (e.key === " ") {
            e.preventDefault();
            setPlaying(!isPlaying);
        }
    };
    const jumpTo = (mjd)=>setJD(clamp(mjd, jdMin, jdMax));
    const leftPct = (mjd)=>jdMax > jdMin ? (mjd - jdMin) / (jdMax - jdMin) * 100 : 0;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-x-0 bottom-0 z-[9999] pb-[max(env(safe-area-inset-bottom),0px)] text-white select-none",
        role: "region",
        "aria-label": "Time controls",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-[1400px] mx-auto px-4 pt-1",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "relative",
                    style: {
                        height: 40 + RAIL_CENTER_BOTTOM_PX
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-x-0",
                        style: {
                            bottom: RAIL_CENTER_BOTTOM_PX,
                            height: 0
                        },
                        children: markers.map(({ jd: mjd, label, kind }, i)=>{
                            const pos = leftPct(mjd);
                            const isCustom = kind === "custom";
                            const isStart = kind === "start";
                            const isEnd = kind === "end";
                            const tickDown = 6;
                            const tickColor = isStart || isEnd ? "bg-white" : isCustom ? "bg-emerald-300" : "bg-white/65";
                            const textColor = isCustom ? "text-emerald-200" : isStart || isEnd ? "text-white/90" : "text-white/70";
                            const text = label ?? (isStart || isEnd ? isoShort(jdToISO(mjd)) : String(jdToDate(mjd).getUTCFullYear()));
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute -translate-x-1/2",
                                style: {
                                    left: `${pos}%`
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `w-[1px] ${tickColor}`,
                                        style: {
                                            height: tickDown
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/gtoc/sceneParts/HUD.tsx",
                                        lineNumber: 231,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `absolute left-1/2 -translate-x-1/2 -translate-y-[calc(100%-4px)] text-[10px] leading-3 whitespace-nowrap ${textColor}`,
                                        style: {
                                            bottom: tickDown
                                        },
                                        title: text,
                                        children: text
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/gtoc/sceneParts/HUD.tsx",
                                        lineNumber: 232,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "absolute -left-2 -top-6 w-4 h-[28px] pointer-events-auto",
                                        title: label ?? jdToISO(mjd),
                                        "aria-label": `Jump to ${label ?? jdToISO(mjd)}`,
                                        onClick: ()=>jumpTo(mjd)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/gtoc/sceneParts/HUD.tsx",
                                        lineNumber: 239,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, `${kind}-${i}-${mjd}`, true, {
                                fileName: "[project]/src/components/gtoc/sceneParts/HUD.tsx",
                                lineNumber: 226,
                                columnNumber: 17
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/src/components/gtoc/sceneParts/HUD.tsx",
                        lineNumber: 205,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/gtoc/sceneParts/HUD.tsx",
                    lineNumber: 204,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/gtoc/sceneParts/HUD.tsx",
                lineNumber: 203,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-[1400px] mx-auto px-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    ref: railRef,
                    className: "relative cursor-pointer",
                    style: {
                        height: RAIL_BOTTOM_PX + RAIL_HEIGHT_PX
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-x-0 rounded-full bg-white/12 hover:bg-white/16 transition-colors",
                        style: {
                            bottom: RAIL_BOTTOM_PX,
                            height: RAIL_HEIGHT_PX
                        },
                        onPointerDown: onPointerDownRail,
                        onPointerMove: onPointerMoveRail,
                        onPointerUp: onPointerUpRail,
                        onWheel: onWheel,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute inset-y-0 left-0 rounded-l-full bg-white/35",
                                style: {
                                    width: `${pct}%`
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/components/gtoc/sceneParts/HUD.tsx",
                                lineNumber: 263,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                ref: knobRef,
                                className: "absolute top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-white shadow ring-2 ring-black/30",
                                style: {
                                    left: `calc(${pct}% - 6px)`
                                },
                                tabIndex: 0,
                                onKeyDown: onKeyDownKnob
                            }, void 0, false, {
                                fileName: "[project]/src/components/gtoc/sceneParts/HUD.tsx",
                                lineNumber: 264,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/gtoc/sceneParts/HUD.tsx",
                        lineNumber: 255,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/gtoc/sceneParts/HUD.tsx",
                    lineNumber: 254,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/gtoc/sceneParts/HUD.tsx",
                lineNumber: 253,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-[1400px] mx-auto px-4 pb-2",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-[1fr_auto_1fr] items-center gap-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-3 min-w-0",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2 text-sm text-white/90",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(IconCalendar, {}, void 0, false, {
                                        fileName: "[project]/src/components/gtoc/sceneParts/HUD.tsx",
                                        lineNumber: 280,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "tabular-nums",
                                        children: isoShort(jdToISO(jd))
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/gtoc/sceneParts/HUD.tsx",
                                        lineNumber: 281,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/gtoc/sceneParts/HUD.tsx",
                                lineNumber: 279,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/gtoc/sceneParts/HUD.tsx",
                            lineNumber: 278,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-center gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setJD((p)=>clamp(p - stepDays, jdMin, jdMax)),
                                    className: "h-8 px-2 rounded-md border border-white/15 hover:bg-white/10 text-white/90",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(IconPrev, {}, void 0, false, {
                                        fileName: "[project]/src/components/gtoc/sceneParts/HUD.tsx",
                                        lineNumber: 290,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/gtoc/sceneParts/HUD.tsx",
                                    lineNumber: 286,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setPlaying(!isPlaying),
                                    className: "h-8 w-8 rounded-full bg-white/20 hover:bg-white/30 border border-white/25 flex items-center justify-center",
                                    children: isPlaying ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(IconPause, {}, void 0, false, {
                                        fileName: "[project]/src/components/gtoc/sceneParts/HUD.tsx",
                                        lineNumber: 296,
                                        columnNumber: 28
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(IconPlay, {}, void 0, false, {
                                        fileName: "[project]/src/components/gtoc/sceneParts/HUD.tsx",
                                        lineNumber: 296,
                                        columnNumber: 44
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/gtoc/sceneParts/HUD.tsx",
                                    lineNumber: 292,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setJD((p)=>clamp(p + stepDays, jdMin, jdMax)),
                                    className: "h-8 px-2 rounded-md border border-white/15 hover:bg-white/10 text-white/90",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(IconNext, {}, void 0, false, {
                                        fileName: "[project]/src/components/gtoc/sceneParts/HUD.tsx",
                                        lineNumber: 302,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/gtoc/sceneParts/HUD.tsx",
                                    lineNumber: 298,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/gtoc/sceneParts/HUD.tsx",
                            lineNumber: 285,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-end gap-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "hidden md:flex items-center gap-2 text-white/90",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(IconSpeed, {}, void 0, false, {
                                            fileName: "[project]/src/components/gtoc/sceneParts/HUD.tsx",
                                            lineNumber: 308,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "range",
                                            min: 1,
                                            max: 1000,
                                            step: 1,
                                            value: clamp(Math.round(rate), 1, 1000),
                                            onChange: (e)=>setRate(parseInt(e.target.value, 10)),
                                            className: "w-48 accent-white"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/gtoc/sceneParts/HUD.tsx",
                                            lineNumber: 309,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/gtoc/sceneParts/HUD.tsx",
                                    lineNumber: 307,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "hidden sm:flex items-center gap-2 text-xs text-white/80",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "Step"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/gtoc/sceneParts/HUD.tsx",
                                            lineNumber: 320,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "number",
                                            className: "w-25 bg-transparent border border-white/15 rounded px-2 py-1 text-right [color-scheme:dark] text-white tracking-wide",
                                            min: 1,
                                            max: 3650,
                                            value: stepDays,
                                            onChange: (e)=>{
                                                const newVal = clamp(parseInt(e.target.value || "1", 10), 1, 3650);
                                                setStepDays(newVal);
                                                setRate(newVal);
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/gtoc/sceneParts/HUD.tsx",
                                            lineNumber: 321,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "d"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/gtoc/sceneParts/HUD.tsx",
                                            lineNumber: 333,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/gtoc/sceneParts/HUD.tsx",
                                    lineNumber: 319,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/gtoc/sceneParts/HUD.tsx",
                            lineNumber: 306,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/gtoc/sceneParts/HUD.tsx",
                    lineNumber: 277,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/gtoc/sceneParts/HUD.tsx",
                lineNumber: 276,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/gtoc/sceneParts/HUD.tsx",
        lineNumber: 197,
        columnNumber: 5
    }, this);
}
_s(HUD, "HDLWnZEYeSAVpICKv0zzgEworeo=");
_c6 = HUD;
var _c, _c1, _c2, _c3, _c4, _c5, _c6;
__turbopack_context__.k.register(_c, "IconPlay");
__turbopack_context__.k.register(_c1, "IconPause");
__turbopack_context__.k.register(_c2, "IconPrev");
__turbopack_context__.k.register(_c3, "IconNext");
__turbopack_context__.k.register(_c4, "IconSpeed");
__turbopack_context__.k.register(_c5, "IconCalendar");
__turbopack_context__.k.register(_c6, "HUD");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/gtoc/sceneParts/BodyPoint.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>BodyPoint
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/build/three.core.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$f8cd670d$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__D__as__useFrame$3e$__ = __turbopack_context__.i("[project]/node_modules/@react-three/fiber/dist/events-f8cd670d.esm.js [app-client] (ecmascript) <export D as useFrame>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$f8cd670d$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__C__as__useThree$3e$__ = __turbopack_context__.i("[project]/node_modules/@react-three/fiber/dist/events-f8cd670d.esm.js [app-client] (ecmascript) <export C as useThree>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$web$2f$Html$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@react-three/drei/web/Html.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/gtoc/utils/constants.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
/**
 * Builds rotation matrix from perifocal (PQW) to inertial coordinates given Ω, i, ω [rad].
 * R = Rz(Ω) * Rx(i) * Rz(ω)
 */ function pqwToIJK(Ω, i, ω) {
    const cO = Math.cos(Ω), sO = Math.sin(Ω);
    const ci = Math.cos(i), si = Math.sin(i);
    const cw = Math.cos(ω), sw = Math.sin(ω);
    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Matrix3"]().set(cO * cw - sO * sw * ci, -cO * sw - sO * cw * ci, sO * si, sO * cw + cO * sw * ci, -sO * sw + cO * cw * ci, -cO * si, sw * si, cw * si, ci);
}
/**
 * Solves Kepler’s equation M = E − e·sinE for 0 ≤ e < 1 using fixed-point iteration.
 */ function solveE(M, e) {
    const Mp = Math.atan2(Math.sin(M), Math.cos(M));
    let E = Mp;
    for(let k = 0; k < 8; k++)E = Mp + e * Math.sin(E);
    return E;
}
function BodyPoint({ body, jd, showLabel = false }) {
    _s();
    const meshRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const { camera } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$f8cd670d$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__C__as__useThree$3e$__["useThree"])();
    const [isHovered, setHovered] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const displayName = body.name && body.name !== "None" ? body.name : `#${body.id}`;
    const e = Number.isFinite(body.e) ? body.e : 0;
    const a_AU = Number.isFinite(body.a_AU) ? Math.max(1e-6, body.a_AU) : 1;
    const Ω = Number.isFinite(body.Omega) ? body.Omega : 0;
    const i = Number.isFinite(body.inc) ? body.inc : 0;
    const ω = Number.isFinite(body.omega) ? body.omega : 0;
    const M0 = Number.isFinite(body.M0) ? body.M0 : 0;
    const epochJD = Number.isFinite(body.epoch_JD) ? body.epoch_JD : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["JD_EPOCH_0"];
    const R = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "BodyPoint.useMemo[R]": ()=>pqwToIJK(Ω, i, ω)
    }["BodyPoint.useMemo[R]"], [
        Ω,
        i,
        ω
    ]);
    const orbitGeom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "BodyPoint.useMemo[orbitGeom]": ()=>{
            if (e >= 1) return null;
            const segments = 256;
            const pts = [];
            for(let k = 0; k <= segments; k++){
                const M = 2 * Math.PI * k / segments;
                const E = solveE(M, e);
                const r = a_AU * (1 - e * Math.cos(E));
                const cosν = (Math.cos(E) - e) / (1 - e * Math.cos(E));
                const sinν = Math.sqrt(1 - e * e) * Math.sin(E) / (1 - e * Math.cos(E));
                const x_p = r * cosν;
                const y_p = r * sinν;
                const v = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](x_p, y_p, 0).applyMatrix3(R);
                pts.push(v);
            }
            return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BufferGeometry"]().setFromPoints(pts);
        }
    }["BodyPoint.useMemo[orbitGeom]"], [
        a_AU,
        e,
        R
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$f8cd670d$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__D__as__useFrame$3e$__["useFrame"])({
        "BodyPoint.useFrame": ()=>{
            if (!meshRef.current) return;
            const n = 2 * Math.PI / (Math.sqrt(a_AU ** 3) * 365.25); // mean motion [rad/day]
            const M = M0 + n * (jd - epochJD);
            const E = solveE(M, e);
            const r = a_AU * (1 - e * Math.cos(E));
            const cosν = (Math.cos(E) - e) / (1 - e * Math.cos(E));
            const sinν = Math.sqrt(1 - e * e) * Math.sin(E) / (1 - e * Math.cos(E));
            const x_p = r * cosν;
            const y_p = r * sinν;
            const pos = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](x_p, y_p, 0).applyMatrix3(R);
            meshRef.current.position.copy(pos);
        }
    }["BodyPoint.useFrame"]);
    const distance = camera.position.length();
    const opacity = Math.max(0, 1 - distance / 15);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            isHovered && orbitGeom && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("primitive", {
                object: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Line"](orbitGeom, new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LineBasicMaterial"]({
                    color: body.color ?? "#ffffff",
                    transparent: true,
                    opacity: 0.7
                })),
                frustumCulled: false
            }, void 0, false, {
                fileName: "[project]/src/components/gtoc/sceneParts/BodyPoint.tsx",
                lineNumber: 115,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                ref: meshRef,
                onPointerOver: ()=>setHovered(true),
                onPointerOut: ()=>setHovered(false),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                        frustumCulled: false,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("sphereGeometry", {
                                args: [
                                    0.015,
                                    16,
                                    16
                                ]
                            }, void 0, false, {
                                fileName: "[project]/src/components/gtoc/sceneParts/BodyPoint.tsx",
                                lineNumber: 134,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                color: isHovered ? "#ffd500" : body.color ?? "#ffffff",
                                emissive: isHovered ? "#ffd500" : "#000000",
                                emissiveIntensity: isHovered ? 0.4 : 0
                            }, void 0, false, {
                                fileName: "[project]/src/components/gtoc/sceneParts/BodyPoint.tsx",
                                lineNumber: 135,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/gtoc/sceneParts/BodyPoint.tsx",
                        lineNumber: 133,
                        columnNumber: 9
                    }, this),
                    showLabel && body.type === "Planet" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$web$2f$Html$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Html"], {
                        center: true,
                        position: [
                            0,
                            0.05,
                            0
                        ],
                        style: {
                            pointerEvents: "none"
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "px-2 py-1 rounded-lg text-[11px] text-white/90 font-medium   backdrop-blur-md bg-black/40 border border-white/10 shadow-md   whitespace-nowrap select-none",
                            style: {
                                opacity
                            },
                            children: displayName
                        }, void 0, false, {
                            fileName: "[project]/src/components/gtoc/sceneParts/BodyPoint.tsx",
                            lineNumber: 144,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/gtoc/sceneParts/BodyPoint.tsx",
                        lineNumber: 143,
                        columnNumber: 11
                    }, this),
                    isHovered && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$web$2f$Html$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Html"], {
                        center: true,
                        position: [
                            0,
                            0.08,
                            0
                        ],
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-2 rounded-lg text-[11px] leading-tight text-white backdrop-blur-md    bg-black/60 border border-white/10 shadow-lg whitespace-nowrap select-none",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "font-semibold text-[#ffd500]",
                                    children: displayName
                                }, void 0, false, {
                                    fileName: "[project]/src/components/gtoc/sceneParts/BodyPoint.tsx",
                                    lineNumber: 161,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-gray-300",
                                    children: body.type
                                }, void 0, false, {
                                    fileName: "[project]/src/components/gtoc/sceneParts/BodyPoint.tsx",
                                    lineNumber: 162,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-1 text-[10px] text-gray-400",
                                    children: [
                                        "a=",
                                        a_AU.toFixed(3),
                                        " AU",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                            fileName: "[project]/src/components/gtoc/sceneParts/BodyPoint.tsx",
                                            lineNumber: 164,
                                            columnNumber: 39
                                        }, this),
                                        "e=",
                                        e.toFixed(3),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                            fileName: "[project]/src/components/gtoc/sceneParts/BodyPoint.tsx",
                                            lineNumber: 165,
                                            columnNumber: 33
                                        }, this),
                                        "i=",
                                        (i * 180 / Math.PI).toFixed(2),
                                        "°",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                            fileName: "[project]/src/components/gtoc/sceneParts/BodyPoint.tsx",
                                            lineNumber: 166,
                                            columnNumber: 56
                                        }, this),
                                        "Ω=",
                                        (Ω * 180 / Math.PI).toFixed(2),
                                        "°",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                            fileName: "[project]/src/components/gtoc/sceneParts/BodyPoint.tsx",
                                            lineNumber: 167,
                                            columnNumber: 56
                                        }, this),
                                        "ω=",
                                        (ω * 180 / Math.PI).toFixed(2),
                                        "°",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                            fileName: "[project]/src/components/gtoc/sceneParts/BodyPoint.tsx",
                                            lineNumber: 168,
                                            columnNumber: 56
                                        }, this),
                                        "M₀=",
                                        (M0 * 180 / Math.PI).toFixed(2),
                                        "°"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/gtoc/sceneParts/BodyPoint.tsx",
                                    lineNumber: 163,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/gtoc/sceneParts/BodyPoint.tsx",
                            lineNumber: 157,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/gtoc/sceneParts/BodyPoint.tsx",
                        lineNumber: 156,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/gtoc/sceneParts/BodyPoint.tsx",
                lineNumber: 128,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
_s(BodyPoint, "CQaSf16aSe8mJjJgR8A+82Q3XIk=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$f8cd670d$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__C__as__useThree$3e$__["useThree"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$f8cd670d$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__D__as__useFrame$3e$__["useFrame"]
    ];
});
_c = BodyPoint;
var _c;
__turbopack_context__.k.register(_c, "BodyPoint");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/gtoc/KeplerSolver.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Axes",
    ()=>Axes,
    "BodyPoint",
    ()=>BodyPoint,
    "CameraRig",
    ()=>CameraRig,
    "EventBillboard",
    ()=>EventBillboard,
    "OrbitPath",
    ()=>OrbitPath,
    "Sun",
    ()=>Sun,
    "keplerToPositionAU",
    ()=>keplerToPositionAU,
    "solveKepler",
    ()=>solveKepler,
    "useCandidateLOD",
    ()=>useCandidateLOD
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$f8cd670d$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__C__as__useThree$3e$__ = __turbopack_context__.i("[project]/node_modules/@react-three/fiber/dist/events-f8cd670d.esm.js [app-client] (ecmascript) <export C as useThree>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$f8cd670d$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__D__as__useFrame$3e$__ = __turbopack_context__.i("[project]/node_modules/@react-three/fiber/dist/events-f8cd670d.esm.js [app-client] (ecmascript) <export D as useFrame>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$web$2f$Html$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@react-three/drei/web/Html.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$Line$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@react-three/drei/core/Line.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/build/three.core.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/gtoc/utils/constants.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
function solveKepler(M, e, tol = 1e-10, maxIter = 50) {
    if (e < 1) {
        let E = M;
        for(let k = 0; k < maxIter; k++){
            const f = E - e * Math.sin(E) - M;
            const fp = 1 - e * Math.cos(E);
            const d = f / fp;
            E -= d;
            if (Math.abs(d) < tol) break;
        }
        return E;
    }
    if (e === 1) return M; // Parabolic fallback
    // Hyperbolic
    let H = Math.log(2 * Math.abs(M) / e + 1.8);
    for(let k = 0; k < maxIter; k++){
        const sH = Math.sinh(H);
        const cH = Math.cosh(H);
        const f = e * sH - H - M;
        const fp = e * cH - 1;
        const d = f / fp;
        H -= d;
        if (Math.abs(d) < tol) break;
    }
    return H;
}
function keplerToPositionAU(body, jd) {
    const { a_AU, e, inc, Omega, omega, M0, epoch_JD } = body;
    const a_km = a_AU * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AU_KM"];
    const n = Math.sqrt(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ALTAIRA_GM"] / a_km ** 3);
    const dt_s = (jd - epoch_JD) * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SECONDS_PER_DAY"];
    let M = M0 + n * dt_s;
    if (e < 1) M = (M + Math.PI) % (2 * Math.PI) - Math.PI;
    const EorH = solveKepler(M, e);
    let r_km, f_true;
    if (e < 1) {
        const E = EorH;
        const cosE = Math.cos(E);
        const sinE = Math.sin(E);
        const denom = 1 - e * cosE;
        r_km = a_km * denom;
        const cosf = (cosE - e) / denom;
        const sinf = Math.sqrt(1 - e ** 2) * sinE / denom;
        f_true = Math.atan2(sinf, cosf);
    } else {
        const H = EorH;
        const coshH = Math.cosh(H);
        const sinhH = Math.sinh(H);
        const denom = e * coshH - 1;
        r_km = a_km * denom;
        const cosf = (e - coshH) / denom;
        const sinf = Math.sqrt(e ** 2 - 1) * sinhH / denom;
        f_true = Math.atan2(sinf, cosf);
    }
    const cO = Math.cos(Omega), sO = Math.sin(Omega), ci = Math.cos(inc), si = Math.sin(inc), co = Math.cos(omega), so = Math.sin(omega);
    const R11 = cO * co - sO * so * ci;
    const R12 = -cO * so - sO * co * ci;
    const R21 = sO * co + cO * so * ci;
    const R22 = -sO * so + cO * co * ci;
    const R31 = so * si;
    const R32 = co * si;
    const x_peri = r_km * Math.cos(f_true);
    const y_peri = r_km * Math.sin(f_true);
    const x = (R11 * x_peri + R12 * y_peri) / __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AU_KM"];
    const y = (R21 * x_peri + R22 * y_peri) / __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AU_KM"];
    const z = (R31 * x_peri + R32 * y_peri) / __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AU_KM"];
    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](x, y, z);
}
function OrbitPath({ body, visible = true, segments = 256, color }) {
    _s();
    if (!visible) return null;
    const points = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "OrbitPath.useMemo[points]": ()=>{
            const a = body.a_AU;
            const e = body.e;
            if (!Number.isFinite(a) || a <= 0 || !Number.isFinite(e) || e >= 1) return [];
            const pts = [];
            const a_km = a * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AU_KM"];
            const cO = Math.cos(body.Omega), sO = Math.sin(body.Omega), ci = Math.cos(body.inc), si = Math.sin(body.inc), co = Math.cos(body.omega), so = Math.sin(body.omega);
            const R11 = cO * co - sO * so * ci;
            const R12 = -cO * so - sO * co * ci;
            const R21 = sO * co + cO * so * ci;
            const R22 = -sO * so + cO * co * ci;
            const R31 = so * si;
            const R32 = co * si;
            for(let k = 0; k <= segments; k++){
                const f = 2 * Math.PI * k / segments;
                const denom = 1 + e * Math.cos(f);
                if (Math.abs(denom) < 1e-9) continue;
                const r_km = a_km * (1 - e ** 2) / denom;
                const x_peri = r_km * Math.cos(f);
                const y_peri = r_km * Math.sin(f);
                const x = (R11 * x_peri + R12 * y_peri) / __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AU_KM"];
                const y = (R21 * x_peri + R22 * y_peri) / __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AU_KM"];
                const z = (R31 * x_peri + R32 * y_peri) / __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AU_KM"];
                if (Number.isFinite(x + y + z)) pts.push(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](x, y, z));
            }
            return pts;
        }
    }["OrbitPath.useMemo[points]"], [
        body,
        segments
    ]);
    if (!points.length) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$Line$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Line"], {
        points: points,
        lineWidth: 1,
        color: color ?? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TYPE_COLORS"][body.type],
        opacity: 0.7,
        transparent: true,
        raycast: ()=>null
    }, void 0, false, {
        fileName: "[project]/src/components/gtoc/KeplerSolver.tsx",
        lineNumber: 198,
        columnNumber: 5
    }, this);
}
_s(OrbitPath, "G95GpPLhY4BpTJPrFAeCtZA4AeI=");
_c = OrbitPath;
function BodyPoint({ body, jd }) {
    _s1();
    const dotRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const hitRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const { camera } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$f8cd670d$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__C__as__useThree$3e$__["useThree"])();
    const [hovered, setHovered] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [tooltip, setTooltip] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const color = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Color"](body.color ?? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TYPE_COLORS"][body.type]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$f8cd670d$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__D__as__useFrame$3e$__["useFrame"])({
        "BodyPoint.useFrame": ()=>{
            const r = keplerToPositionAU(body, jd);
            dotRef.current.position.copy(r);
            hitRef.current.position.copy(r);
            if (!hovered) return;
            const a_km = body.a_AU * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AU_KM"];
            const n = Math.sqrt(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ALTAIRA_GM"] / a_km ** 3);
            const dt_s = (jd - body.epoch_JD) * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SECONDS_PER_DAY"];
            let M = body.M0 + n * dt_s;
            if (body.e < 1) M = (M + Math.PI) % (2 * Math.PI) - Math.PI;
            const L = body.Omega + body.omega + M;
            const EorH = solveKepler(M, body.e);
            const f_true = body.e < 1 ? Math.atan2(Math.sqrt(1 - body.e ** 2) * Math.sin(EorH), Math.cos(EorH) - body.e) : Math.atan2(Math.sqrt(body.e ** 2 - 1) * Math.sinh(EorH), body.e - Math.cosh(EorH));
            const dir = r.clone().sub(camera.position).normalize();
            const pos = r.clone().add(dir.multiplyScalar(0.06));
            setTooltip({
                pos,
                Ldeg: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MathUtils"].radToDeg(L),
                fdeg: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MathUtils"].radToDeg(f_true)
            });
        }
    }["BodyPoint.useFrame"]);
    const displayName = body.name?.trim()?.length ? body.name : body.id;
    const typeLabel = body.type ?? "Body";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        onPointerOver: ()=>setHovered(true),
        onPointerOut: ()=>setHovered(false),
        children: [
            body.type !== "Planet" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(OrbitPath, {
                body: body,
                visible: hovered,
                segments: 192,
                color: body.color ?? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TYPE_COLORS"][body.type]
            }, void 0, false, {
                fileName: "[project]/src/components/gtoc/KeplerSolver.tsx",
                lineNumber: 260,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                ref: hitRef,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("sphereGeometry", {
                        args: [
                            0.035,
                            8,
                            8
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/gtoc/KeplerSolver.tsx",
                        lineNumber: 269,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshBasicMaterial", {
                        transparent: true,
                        opacity: 0,
                        depthWrite: false
                    }, void 0, false, {
                        fileName: "[project]/src/components/gtoc/KeplerSolver.tsx",
                        lineNumber: 270,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/gtoc/KeplerSolver.tsx",
                lineNumber: 268,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                ref: dotRef,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("sphereGeometry", {
                        args: [
                            0.01,
                            16,
                            16
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/gtoc/KeplerSolver.tsx",
                        lineNumber: 274,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshBasicMaterial", {
                        color: color
                    }, void 0, false, {
                        fileName: "[project]/src/components/gtoc/KeplerSolver.tsx",
                        lineNumber: 275,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/gtoc/KeplerSolver.tsx",
                lineNumber: 273,
                columnNumber: 7
            }, this),
            hovered && tooltip && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$web$2f$Html$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Html"], {
                position: tooltip.pos.toArray(),
                center: true,
                sprite: true,
                distanceFactor: 8,
                style: {
                    pointerEvents: "none",
                    transform: "translate(-50%, -110%)"
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "relative z-50 inline-block w-max",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "absolute inset-0 -z-10 blur-md opacity-40 rounded-2xl bg-gradient-to-br from-white/70 to-white/10"
                        }, void 0, false, {
                            fileName: "[project]/src/components/gtoc/KeplerSolver.tsx",
                            lineNumber: 287,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "px-3 py-2 rounded-2xl bg-white/95 text-xs shadow-lg ring-1 ring-black/5 text-black",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-[8px] uppercase tracking-wide text-zinc-500 whitespace-nowrap",
                                    children: typeLabel
                                }, void 0, false, {
                                    fileName: "[project]/src/components/gtoc/KeplerSolver.tsx",
                                    lineNumber: 289,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-base font-semibold leading-5 whitespace-nowrap",
                                    children: displayName
                                }, void 0, false, {
                                    fileName: "[project]/src/components/gtoc/KeplerSolver.tsx",
                                    lineNumber: 292,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-1 text-[10px] text-zinc-700 whitespace-nowrap",
                                    children: [
                                        "Mean longitude: ",
                                        tooltip.Ldeg.toFixed(2),
                                        "°"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/gtoc/KeplerSolver.tsx",
                                    lineNumber: 295,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-[10px] text-zinc-700 whitespace-nowrap",
                                    children: [
                                        "True anomaly: ",
                                        tooltip.fdeg.toFixed(2),
                                        "°"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/gtoc/KeplerSolver.tsx",
                                    lineNumber: 298,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/gtoc/KeplerSolver.tsx",
                            lineNumber: 288,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/gtoc/KeplerSolver.tsx",
                    lineNumber: 286,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/gtoc/KeplerSolver.tsx",
                lineNumber: 279,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/gtoc/KeplerSolver.tsx",
        lineNumber: 258,
        columnNumber: 5
    }, this);
}
_s1(BodyPoint, "3vio4dXVjnqwZ/hoNItf+V2QO6Y=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$f8cd670d$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__C__as__useThree$3e$__["useThree"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$f8cd670d$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__D__as__useFrame$3e$__["useFrame"]
    ];
});
_c1 = BodyPoint;
function Sun() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("sphereGeometry", {
                args: [
                    0.05,
                    32,
                    32
                ]
            }, void 0, false, {
                fileName: "[project]/src/components/gtoc/KeplerSolver.tsx",
                lineNumber: 313,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshBasicMaterial", {
                color: "#ffcc66"
            }, void 0, false, {
                fileName: "[project]/src/components/gtoc/KeplerSolver.tsx",
                lineNumber: 314,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/gtoc/KeplerSolver.tsx",
        lineNumber: 312,
        columnNumber: 5
    }, this);
}
_c2 = Sun;
function Axes({ size = 1.0 }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$Line$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Line"], {
                points: [
                    new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](0, 0, 0),
                    new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](size, 0, 0)
                ],
                color: "#ff5555",
                lineWidth: 1
            }, void 0, false, {
                fileName: "[project]/src/components/gtoc/KeplerSolver.tsx",
                lineNumber: 323,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$Line$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Line"], {
                points: [
                    new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](0, 0, 0),
                    new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](0, size, 0)
                ],
                color: "#55ff55",
                lineWidth: 1
            }, void 0, false, {
                fileName: "[project]/src/components/gtoc/KeplerSolver.tsx",
                lineNumber: 324,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$Line$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Line"], {
                points: [
                    new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](0, 0, 0),
                    new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](0, 0, size)
                ],
                color: "#5555ff",
                lineWidth: 1
            }, void 0, false, {
                fileName: "[project]/src/components/gtoc/KeplerSolver.tsx",
                lineNumber: 325,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/gtoc/KeplerSolver.tsx",
        lineNumber: 322,
        columnNumber: 5
    }, this);
}
_c3 = Axes;
function CameraRig() {
    _s2();
    const { camera } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$f8cd670d$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__C__as__useThree$3e$__["useThree"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CameraRig.useEffect": ()=>{
            camera.position.set(0, 0, 3.5);
        }
    }["CameraRig.useEffect"], [
        camera
    ]);
    return null;
}
_s2(CameraRig, "Wo14/kl28HhoRfDX+Cg7MK2EhFU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$f8cd670d$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__C__as__useThree$3e$__["useThree"]
    ];
});
_c4 = CameraRig;
function useCandidateLOD(candidate) {
    _s3();
    const { camera } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$f8cd670d$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__C__as__useThree$3e$__["useThree"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useCandidateLOD.useMemo": ()=>{
            const sphere = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Sphere"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](), 0);
            const all = candidate.lods[candidate.lods.length - 1].path;
            for (const p of all)sphere.expandByPoint(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"]().fromArray(p));
            const d = camera.position.distanceTo(sphere.center) - sphere.radius;
            if (d > 10) return candidate.lods.find({
                "useCandidateLOD.useMemo": (l)=>l.level === 3
            }["useCandidateLOD.useMemo"]);
            if (d > 3) return candidate.lods.find({
                "useCandidateLOD.useMemo": (l)=>l.level === 2
            }["useCandidateLOD.useMemo"]);
            return candidate.lods.find({
                "useCandidateLOD.useMemo": (l)=>l.level === 1
            }["useCandidateLOD.useMemo"]);
        }
    }["useCandidateLOD.useMemo"], [
        candidate,
        camera.position.x,
        camera.position.y,
        camera.position.z
    ]);
}
_s3(useCandidateLOD, "UtDHQL5KdFHvdIvvZlpDvve7Z6c=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$f8cd670d$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__C__as__useThree$3e$__["useThree"]
    ];
});
function EventBillboard({ event, jd, bodies }) {
    const show = Math.abs(jd - event.tJD) < 30;
    if (!show) return null;
    const body = bodies.find((b)=>b.id === event.bodyId);
    const pos = body ? keplerToPositionAU(body, event.tJD) : new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"]();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        position: pos.toArray(),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("sphereGeometry", {
                        args: [
                            0.012,
                            8,
                            8
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/gtoc/KeplerSolver.tsx",
                        lineNumber: 371,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshBasicMaterial", {
                        color: "#ffffff"
                    }, void 0, false, {
                        fileName: "[project]/src/components/gtoc/KeplerSolver.tsx",
                        lineNumber: 372,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/gtoc/KeplerSolver.tsx",
                lineNumber: 370,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$web$2f$Html$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Html"], {
                center: true,
                distanceFactor: 8,
                style: {
                    pointerEvents: "auto"
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "px-2 py-1 rounded-xl bg-white/90 text-xs shadow border border-gray-200",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                            children: event.label
                        }, void 0, false, {
                            fileName: "[project]/src/components/gtoc/KeplerSolver.tsx",
                            lineNumber: 376,
                            columnNumber: 11
                        }, this),
                        event.vinf_kms != null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                "V∞: ",
                                event.vinf_kms.toFixed(1),
                                " km/s"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/gtoc/KeplerSolver.tsx",
                            lineNumber: 377,
                            columnNumber: 38
                        }, this),
                        event.alt_km != null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                "Alt: ",
                                event.alt_km.toFixed(0),
                                " km"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/gtoc/KeplerSolver.tsx",
                            lineNumber: 378,
                            columnNumber: 36
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/gtoc/KeplerSolver.tsx",
                    lineNumber: 375,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/gtoc/KeplerSolver.tsx",
                lineNumber: 374,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/gtoc/KeplerSolver.tsx",
        lineNumber: 369,
        columnNumber: 5
    }, this);
}
_c5 = EventBillboard;
var _c, _c1, _c2, _c3, _c4, _c5;
__turbopack_context__.k.register(_c, "OrbitPath");
__turbopack_context__.k.register(_c1, "BodyPoint");
__turbopack_context__.k.register(_c2, "Sun");
__turbopack_context__.k.register(_c3, "Axes");
__turbopack_context__.k.register(_c4, "CameraRig");
__turbopack_context__.k.register(_c5, "EventBillboard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/gtoc/utils/dataLoader.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useBodiesFromGTOCCSV",
    ()=>useBodiesFromGTOCCSV
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/build/three.core.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/gtoc/utils/constants.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function useBodiesFromGTOCCSV(url, keepTypes = [
    "Planet",
    "Asteroid",
    "Comet"
]) {
    _s();
    const [bodies, setBodies] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useBodiesFromGTOCCSV.useEffect": ()=>{
            let cancelled = false;
            ({
                "useBodiesFromGTOCCSV.useEffect": async ()=>{
                    try {
                        const resp = await fetch(url, {
                            cache: "no-store"
                        });
                        if (!resp.ok) throw new Error(`HTTP ${resp.status} loading ${url}`);
                        const text = await resp.text();
                        const lines = text.split(/\r?\n/).map({
                            "useBodiesFromGTOCCSV.useEffect.lines": (l)=>l.trim()
                        }["useBodiesFromGTOCCSV.useEffect.lines"]).filter(Boolean);
                        if (lines.length < 2) throw new Error("CSV missing data rows.");
                        const header = lines[0].split(",").map({
                            "useBodiesFromGTOCCSV.useEffect.header": (h)=>h.trim()
                        }["useBodiesFromGTOCCSV.useEffect.header"]);
                        const out = [];
                        for(let i = 1; i < lines.length; i++){
                            const cells = lines[i].split(",").map({
                                "useBodiesFromGTOCCSV.useEffect.cells": (c)=>c.trim()
                            }["useBodiesFromGTOCCSV.useEffect.cells"]);
                            if (cells.length !== header.length) continue;
                            const rec = {};
                            for(let j = 0; j < header.length; j++)rec[header[j]] = cells[j];
                            const type = rec["Type"] ?? "Asteroid";
                            if (!keepTypes.includes(type)) continue;
                            const a_km = Number(rec["a"]);
                            const e = Number(rec["e"]);
                            const iDeg = Number(rec["i"]);
                            const ODeg = Number(rec["Omega"]);
                            const wDeg = Number(rec["omega"]);
                            const MDeg = Number(rec["M"]);
                            if ([
                                a_km,
                                e,
                                iDeg,
                                ODeg,
                                wDeg,
                                MDeg
                            ].some({
                                "useBodiesFromGTOCCSV.useEffect": (v)=>!Number.isFinite(v)
                            }["useBodiesFromGTOCCSV.useEffect"])) continue;
                            out.push({
                                id: rec["ID"] || `body-${i}`,
                                name: rec["Name"] || `Body ${i}`,
                                type,
                                a_AU: a_km / __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AU_KM"],
                                e,
                                inc: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MathUtils"].degToRad(iDeg),
                                Omega: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MathUtils"].degToRad(ODeg),
                                omega: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MathUtils"].degToRad(wDeg),
                                M0: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MathUtils"].degToRad(MDeg),
                                epoch_JD: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["JD_EPOCH_0"]
                            });
                        }
                        if (!cancelled) {
                            setBodies(out);
                            setError(null);
                        }
                    } catch (err) {
                        if (!cancelled) {
                            setBodies(null);
                            setError(err.message ?? String(err));
                        }
                    }
                }
            })["useBodiesFromGTOCCSV.useEffect"]();
            return ({
                "useBodiesFromGTOCCSV.useEffect": ()=>{
                    cancelled = true;
                }
            })["useBodiesFromGTOCCSV.useEffect"];
        }
    }["useBodiesFromGTOCCSV.useEffect"], [
        url,
        JSON.stringify(keepTypes)
    ]);
    return {
        bodies,
        error
    };
}
_s(useBodiesFromGTOCCSV, "kXt3Ju3ifyIpeDCAvba7I8rNh6g=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/gtoc/utils/simClock.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buildMilestonesByStep",
    ()=>buildMilestonesByStep,
    "clamp",
    ()=>clamp,
    "dateToJD",
    ()=>dateToJD,
    "jdToDate",
    ()=>jdToDate,
    "makeJDRangeFromYears",
    ()=>makeJDRangeFromYears,
    "useSimClock",
    ()=>useSimClock
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/gtoc/utils/constants.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function clamp(v, lo, hi) {
    if (lo != null && v < lo) return lo;
    if (hi != null && v > hi) return hi;
    return v;
}
function dateToJD(date) {
    return date.getTime() / __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MILISECONDS_PER_DAY"] + 2440587.5;
}
function jdToDate(jd) {
    return new Date((jd - 2440587.5) * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MILISECONDS_PER_DAY"]);
}
function buildMilestonesByStep(jdStart, jdEnd, stepDays) {
    const out = [];
    const dir = Math.sign(jdEnd - jdStart) || 1;
    const step = Math.abs(stepDays) * dir;
    let jd = jdStart;
    if (dir > 0) {
        while(jd <= jdEnd){
            out.push(jd);
            jd += step;
        }
    } else {
        while(jd >= jdEnd){
            out.push(jd);
            jd += step;
        }
    }
    if (out[out.length - 1] !== jdEnd) out.push(jdEnd);
    return out;
}
function makeJDRangeFromYears(centerJD, years) {
    const days = years * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DAYS_PER_YEAR"];
    return {
        jdMin: centerJD - days,
        jdMax: centerJD + days
    };
}
function useSimClock(opts = {}) {
    _s();
    const { jd0, jdMin, jdMax, milestones, snapPlayToMilestones = false, milestoneStepsPerSec = 2, playing = true, rate0 = 50 } = opts;
    const [jd, _setJD] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "useSimClock.useState": ()=>clamp(jd0 ?? dateToJD(new Date()), jdMin, jdMax)
    }["useSimClock.useState"]);
    const [isPlaying, _setPlaying] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(playing);
    const [rate, _setRate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(rate0); // days per second
    /* Refs to avoid stale closures */ const jdRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(jd);
    const rateRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(rate);
    const playingRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(isPlaying);
    const minJDRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(jdMin);
    const maxJDRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(jdMax);
    const milestonesRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(milestones);
    const snapRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(snapPlayToMilestones);
    const stepPerSecRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(milestoneStepsPerSec);
    const lastGoodRateRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(rate0 > 0 ? rate0 : 1);
    const idxRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    const rafRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const lastTsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    /* Sync state to refs */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useSimClock.useEffect": ()=>{
            jdRef.current = jd;
        }
    }["useSimClock.useEffect"], [
        jd
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useSimClock.useEffect": ()=>{
            rateRef.current = rate;
            if (Number.isFinite(rate) && rate > 0) lastGoodRateRef.current = rate;
        }
    }["useSimClock.useEffect"], [
        rate
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useSimClock.useEffect": ()=>{
            playingRef.current = isPlaying;
        }
    }["useSimClock.useEffect"], [
        isPlaying
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useSimClock.useEffect": ()=>{
            minJDRef.current = jdMin;
        }
    }["useSimClock.useEffect"], [
        jdMin
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useSimClock.useEffect": ()=>{
            maxJDRef.current = jdMax;
        }
    }["useSimClock.useEffect"], [
        jdMax
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useSimClock.useEffect": ()=>{
            milestonesRef.current = milestones;
        }
    }["useSimClock.useEffect"], [
        milestones
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useSimClock.useEffect": ()=>{
            snapRef.current = snapPlayToMilestones;
        }
    }["useSimClock.useEffect"], [
        snapPlayToMilestones
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useSimClock.useEffect": ()=>{
            stepPerSecRef.current = milestoneStepsPerSec;
        }
    }["useSimClock.useEffect"], [
        milestoneStepsPerSec
    ]);
    /* State setters */ const setJD = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useSimClock.useCallback[setJD]": (v)=>{
            _setJD({
                "useSimClock.useCallback[setJD]": (prev)=>{
                    const raw = typeof v === "function" ? v(prev) : v;
                    const lo = minJDRef.current ?? -Infinity;
                    const hi = maxJDRef.current ?? Infinity;
                    const next = clamp(raw, lo, hi);
                    jdRef.current = next;
                    return next;
                }
            }["useSimClock.useCallback[setJD]"]);
        }
    }["useSimClock.useCallback[setJD]"], []);
    const setRate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useSimClock.useCallback[setRate]": (v)=>{
            _setRate(v);
            rateRef.current = v;
            if (Number.isFinite(v) && v > 0) lastGoodRateRef.current = v;
        }
    }["useSimClock.useCallback[setRate]"], []);
    const setPlaying = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useSimClock.useCallback[setPlaying]": (v)=>{
            _setPlaying(v);
            playingRef.current = v;
            if (!v) lastTsRef.current = null;
        }
    }["useSimClock.useCallback[setPlaying]"], []);
    /* Keeps milestone index near current jd */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useSimClock.useEffect": ()=>{
            const ms = milestonesRef.current;
            if (!ms?.length) return;
            let best = 0;
            let bd = Infinity;
            for(let k = 0; k < ms.length; k++){
                const d = Math.abs(ms[k] - jdRef.current);
                if (d < bd) {
                    bd = d;
                    best = k;
                }
            }
            idxRef.current = best;
        }
    }["useSimClock.useEffect"], [
        milestones,
        jd
    ]);
    /* Main RAF loop */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useSimClock.useEffect": ()=>{
            function tick(ts) {
                if (lastTsRef.current == null) lastTsRef.current = ts;
                const prevTs = lastTsRef.current;
                lastTsRef.current = ts;
                const dtSec = Math.max(0, (ts - prevTs) / 1000);
                if (playingRef.current) {
                    const lo = minJDRef.current ?? -Infinity;
                    const hi = maxJDRef.current ?? Infinity;
                    if (snapRef.current && milestonesRef.current?.length) {
                        const ms = milestonesRef.current;
                        const maxIdx = ms.length - 1;
                        let idx = idxRef.current + stepPerSecRef.current * dtSec;
                        idx = clamp(idx, 0, maxIdx);
                        idxRef.current = idx;
                        const jdSnap = ms[Math.round(idx)];
                        const next = clamp(jdSnap, lo, hi);
                        _setJD(next);
                        jdRef.current = next;
                        if (next <= lo || next >= hi || Math.round(idx) === 0 || Math.round(idx) === maxIdx) {
                            _setPlaying(false);
                            playingRef.current = false;
                        }
                    } else {
                        const r = Number.isFinite(rateRef.current) && rateRef.current > 0 ? rateRef.current : lastGoodRateRef.current;
                        if (r > 0) {
                            let next = jdRef.current + r * dtSec;
                            next = clamp(next, lo, hi);
                            _setJD(next);
                            jdRef.current = next;
                            if (next === hi && r > 0 || next === lo && r < 0) {
                                _setPlaying(false);
                                playingRef.current = false;
                            }
                        }
                    }
                } else {
                    lastTsRef.current = ts; // paused: avoids dt spike
                }
                rafRef.current = requestAnimationFrame(tick);
            }
            rafRef.current = requestAnimationFrame(tick);
            return ({
                "useSimClock.useEffect": ()=>{
                    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
                    rafRef.current = null;
                    lastTsRef.current = null;
                }
            })["useSimClock.useEffect"];
        }
    }["useSimClock.useEffect"], []);
    return {
        jd,
        setJD,
        isPlaying,
        setPlaying,
        rate,
        setRate
    };
}
_s(useSimClock, "8vZgqXlX69buQfmNaV6Vib6pzd8=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/gtoc/viewerCanvas.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ViewerCanvas
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react-dom/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$react$2d$three$2d$fiber$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@react-three/fiber/dist/react-three-fiber.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$OrbitControls$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@react-three/drei/core/OrbitControls.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$Stars$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@react-three/drei/core/Stars.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$solutions$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/gtoc/solutions/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$solutions$2f$SolutionsUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__SolutionsUI$3e$__ = __turbopack_context__.i("[project]/src/components/gtoc/solutions/SolutionsUI.tsx [app-client] (ecmascript) <export default as SolutionsUI>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$solutions$2f$Solutions3D$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Solutions3D$3e$__ = __turbopack_context__.i("[project]/src/components/gtoc/solutions/Solutions3D.tsx [app-client] (ecmascript) <export default as Solutions3D>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$sceneParts$2f$HUD$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/gtoc/sceneParts/HUD.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$sceneParts$2f$BodyPoint$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/gtoc/sceneParts/BodyPoint.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$KeplerSolver$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/gtoc/KeplerSolver.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/gtoc/utils/constants.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$dataLoader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/gtoc/utils/dataLoader.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$simClock$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/gtoc/utils/simClock.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
;
;
function ViewerCanvas(props = {}) {
    _s();
    /* ---- Simulation clock ---- */ const usingExternalClock = props.jd !== undefined && props.setJD && props.isPlaying !== undefined && props.setPlaying && props.rate !== undefined && props.setRate;
    const { jd, setJD, isPlaying, setPlaying, rate, setRate } = usingExternalClock ? props : (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$simClock$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSimClock"])();
    /* ---- Load celestial bodies ---- */ const bodiesHook = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$dataLoader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBodiesFromGTOCCSV"])("/data/df_extracted_full.csv", [
        "Planet",
        "Asteroid",
        "Comet"
    ]);
    const bodies = props.bodies ?? bodiesHook.bodies ?? [];
    const hookError = bodiesHook.error;
    /* ---- Tooltip state ---- */ const [hover, setHover] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const bodyName = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ViewerCanvas.useMemo[bodyName]": ()=>{
            const m = new Map();
            bodies?.forEach({
                "ViewerCanvas.useMemo[bodyName]": (b)=>{
                    const idNum = Number(b.id);
                    const nm = b.name && String(b.name).trim() || `#${idNum || "?"}`;
                    if (!Number.isNaN(idNum)) m.set(idNum, nm);
                }
            }["ViewerCanvas.useMemo[bodyName]"]);
            return m;
        }
    }["ViewerCanvas.useMemo[bodyName]"], [
        bodies
    ]);
    /* ---- Tooltip overlay ---- */ const tooltip = hover && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "pointer-events-none fixed z-[2147483646] select-none",
        style: {
            left: hover.x + 14,
            top: hover.y + 16
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "rounded-xl p-[1px]",
            style: {
                background: `linear-gradient(135deg, ${hover.data.color}99 0%, rgba(255,255,255,0.2) 70%)`,
                boxShadow: "0 6px 20px rgba(0,0,0,0.35)"
            },
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-xl backdrop-blur-md bg-black/85 px-3 py-2 text-[11px] text-white min-w-[200px] border border-white/10 shadow-2xl",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-center mb-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "inline-block h-2.5 w-2.5 rounded-full ring-2 ring-white/30 mr-2",
                                style: {
                                    backgroundColor: hover.data.color
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/components/gtoc/viewerCanvas.tsx",
                                lineNumber: 95,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "font-semibold text-white/90 truncate",
                                children: hover.data.solutionName
                            }, void 0, false, {
                                fileName: "[project]/src/components/gtoc/viewerCanvas.tsx",
                                lineNumber: 99,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/gtoc/viewerCanvas.tsx",
                        lineNumber: 94,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-xs text-center text-white/70 mb-1",
                        children: [
                            hover.data.fromBody ? bodyName.get(hover.data.fromBody) ?? `#${hover.data.fromBody}` : "—",
                            " ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "opacity-50",
                                children: "→"
                            }, void 0, false, {
                                fileName: "[project]/src/components/gtoc/viewerCanvas.tsx",
                                lineNumber: 109,
                                columnNumber: 13
                            }, this),
                            " ",
                            hover.data.toBody ? bodyName.get(hover.data.toBody) ?? `#${hover.data.toBody}` : "—"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/gtoc/viewerCanvas.tsx",
                        lineNumber: 105,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-1 pt-1 border-t border-white/10 text-[10px] text-white/60 text-center",
                        children: [
                            "Leg ",
                            hover.data.legIndex,
                            " • TOF ",
                            hover.data.tofDays.toFixed(1),
                            " days"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/gtoc/viewerCanvas.tsx",
                        lineNumber: 116,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/gtoc/viewerCanvas.tsx",
                lineNumber: 92,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/gtoc/viewerCanvas.tsx",
            lineNumber: 85,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/gtoc/viewerCanvas.tsx",
        lineNumber: 81,
        columnNumber: 5
    }, this);
    /* ---- Render ---- */ return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative w-full h-screen bg-black",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$solutions$2f$SolutionsUI$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__SolutionsUI$3e$__["SolutionsUI"], {}, void 0, false, {
                fileName: "[project]/src/components/gtoc/viewerCanvas.tsx",
                lineNumber: 129,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$react$2d$three$2d$fiber$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Canvas"], {
                dpr: [
                    1,
                    2
                ],
                camera: {
                    fov: 65,
                    near: 0.001,
                    far: 1e12,
                    position: [
                        0,
                        0,
                        2e6
                    ]
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("color", {
                        attach: "background",
                        args: [
                            "#000000"
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/gtoc/viewerCanvas.tsx",
                        lineNumber: 137,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ambientLight", {
                        intensity: 0.6
                    }, void 0, false, {
                        fileName: "[project]/src/components/gtoc/viewerCanvas.tsx",
                        lineNumber: 138,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pointLight", {
                        position: [
                            0,
                            0,
                            0
                        ],
                        intensity: 2.0,
                        color: "#ffffff"
                    }, void 0, false, {
                        fileName: "[project]/src/components/gtoc/viewerCanvas.tsx",
                        lineNumber: 139,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$KeplerSolver$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CameraRig"], {}, void 0, false, {
                        fileName: "[project]/src/components/gtoc/viewerCanvas.tsx",
                        lineNumber: 141,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$OrbitControls$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OrbitControls"], {
                        enableDamping: true,
                        dampingFactor: 0.1
                    }, void 0, false, {
                        fileName: "[project]/src/components/gtoc/viewerCanvas.tsx",
                        lineNumber: 142,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$Stars$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Stars"], {
                        radius: 100,
                        depth: 50,
                        count: 1000,
                        factor: 2,
                        fade: true,
                        speed: 0.5
                    }, void 0, false, {
                        fileName: "[project]/src/components/gtoc/viewerCanvas.tsx",
                        lineNumber: 143,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$KeplerSolver$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Sun"], {}, void 0, false, {
                        fileName: "[project]/src/components/gtoc/viewerCanvas.tsx",
                        lineNumber: 145,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$KeplerSolver$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Axes"], {
                        size: 1.0
                    }, void 0, false, {
                        fileName: "[project]/src/components/gtoc/viewerCanvas.tsx",
                        lineNumber: 146,
                        columnNumber: 9
                    }, this),
                    bodies?.map((b)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                            children: b.type === "Planet" && b.e < 1 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$KeplerSolver$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OrbitPath"], {
                                        body: b,
                                        visible: true,
                                        segments: 256,
                                        color: b.color ?? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TYPE_COLORS"][b.type]
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/gtoc/viewerCanvas.tsx",
                                        lineNumber: 153,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$sceneParts$2f$BodyPoint$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        body: b,
                                        jd: jd,
                                        showLabel: true
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/gtoc/viewerCanvas.tsx",
                                        lineNumber: 159,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$sceneParts$2f$BodyPoint$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                body: b,
                                jd: jd
                            }, void 0, false, {
                                fileName: "[project]/src/components/gtoc/viewerCanvas.tsx",
                                lineNumber: 162,
                                columnNumber: 15
                            }, this)
                        }, b.id, false, {
                            fileName: "[project]/src/components/gtoc/viewerCanvas.tsx",
                            lineNumber: 150,
                            columnNumber: 11
                        }, this)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$solutions$2f$Solutions3D$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Solutions3D$3e$__["Solutions3D"], {
                        currentJD: jd,
                        epochZeroJD: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["JD_EPOCH_0"],
                        showShip: true,
                        onHover: (data, x, y)=>setHover({
                                data,
                                x,
                                y
                            }),
                        onUnhover: ()=>setHover(null)
                    }, void 0, false, {
                        fileName: "[project]/src/components/gtoc/viewerCanvas.tsx",
                        lineNumber: 168,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/gtoc/viewerCanvas.tsx",
                lineNumber: 132,
                columnNumber: 7
            }, this),
            tooltip,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PortalHUD, {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "pointer-events-auto fixed left-1/2 -translate-x-1/2 bottom-2 z-[999] w-full max-w-[120rem] px-3",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$sceneParts$2f$HUD$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        jd: jd,
                        setJD: setJD,
                        isPlaying: isPlaying,
                        setPlaying: setPlaying,
                        rate: rate,
                        setRate: setRate,
                        candidates: [],
                        jdMin: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["JD_EPOCH_0"],
                        jdMax: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["JD_EPOCH_0"] + 200 * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DAYS_PER_YEAR"],
                        milestonesJD: props.milestonesJD ?? [
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["JD_EPOCH_0"],
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["JD_EPOCH_0"] + 50 * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DAYS_PER_YEAR"],
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["JD_EPOCH_0"] + 100 * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DAYS_PER_YEAR"]
                        ],
                        milestonesISO: props.milestonesISO ?? [
                            "2000-01-01",
                            "2050-01-01",
                            "2100-01-01"
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/gtoc/viewerCanvas.tsx",
                        lineNumber: 183,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/gtoc/viewerCanvas.tsx",
                    lineNumber: 182,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/gtoc/viewerCanvas.tsx",
                lineNumber: 181,
                columnNumber: 7
            }, this),
            hookError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute top-16 right-3 z-[80] text-xs pointer-events-none",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "px-3 py-2 rounded bg-red-600 text-white shadow",
                    children: hookError
                }, void 0, false, {
                    fileName: "[project]/src/components/gtoc/viewerCanvas.tsx",
                    lineNumber: 214,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/gtoc/viewerCanvas.tsx",
                lineNumber: 213,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/gtoc/viewerCanvas.tsx",
        lineNumber: 127,
        columnNumber: 5
    }, this);
}
_s(ViewerCanvas, "eBdt17d5jgPp1UOGStNdzm+JEjk=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$simClock$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSimClock"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$dataLoader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBodiesFromGTOCCSV"]
    ];
});
_c = ViewerCanvas;
/* ======================= Utility Components ======================= */ function PortalHUD({ children }) {
    _s1();
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PortalHUD.useEffect": ()=>setMounted(true)
    }["PortalHUD.useEffect"], []);
    if (!mounted) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createPortal"])(children, document.body);
}
_s1(PortalHUD, "LrrVfNW3d1raFE0BNzCTILYmIfo=");
_c1 = PortalHUD;
var _c, _c1;
__turbopack_context__.k.register(_c, "ViewerCanvas");
__turbopack_context__.k.register(_c1, "PortalHUD");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/gtoc/viewerCanvas.tsx [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/components/gtoc/viewerCanvas.tsx [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=src_components_gtoc_68132969._.js.map