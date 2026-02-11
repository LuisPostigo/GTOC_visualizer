(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/gtoc/solutions/parseSolutionFile.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "parseSolutionFile",
    ()=>parseSolutionFile
]);
const PALETTE = [
    "#ff6b6b",
    "#4dabf7",
    "#63e6be",
    "#ffd43b",
    "#845ef7",
    "#ffa94d",
    "#5c7cfa",
    "#94d82d",
    "#fcc2d7",
    "#66d9e8"
];
function randomColor() {
    return PALETTE[Math.floor(Math.random() * PALETTE.length)];
}
async function parseSolutionFile(file) {
    const text = await file.text();
    const lines = text.split(/\r?\n/).map((l)=>l.trim()).filter((l)=>l && !l.startsWith("#") && !l.startsWith("//") && !l.startsWith("!"));
    const samples = [];
    for (const line of lines){
        const parts = line.split(/[,\s]+/).map(Number);
        if (parts.length < 6) continue;
        const [bodyId, flag, t, x, y, z, vx, vy, vz] = parts;
        samples.push({
            t,
            p: [
                x,
                y,
                z
            ],
            v: [
                vx ?? 0,
                vy ?? 0,
                vz ?? 0
            ],
            bodyId,
            flag
        });
    }
    return {
        id: file.name,
        name: file.name,
        color: randomColor(),
        samples
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/gtoc/utils/arc_trajectories_cowells_method.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * arc_trajectories_cowells_method.tsx — High-Precision Arc Propagation for the Altaira System
 * ------------------------------------------------------------------------------------------
 * Mimics the Python version that uses SciPy's solve_ivp with t_eval,
 * by integrating with a finer internal step and only emitting at t_eval times.
 */ __turbopack_context__.s([
    "propagateArcCowell",
    ()=>propagateArcCowell
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/gtoc/utils/constants.ts [app-client] (ecmascript)");
;
/** Euclidean norm */ function norm(v) {
    return Math.sqrt(v.reduce((acc, val)=>acc + val * val, 0));
}
/** Two-body gravitational dynamics under central body */ function twoBodyDynamics(_t, state, mu) {
    const [rx, ry, rz, vx, vy, vz] = state;
    const rNorm = norm([
        rx,
        ry,
        rz
    ]);
    const factor = -mu / Math.pow(rNorm, 3);
    const ax = factor * rx;
    const ay = factor * ry;
    const az = factor * rz;
    return [
        vx,
        vy,
        vz,
        ax,
        ay,
        az
    ];
}
/** One RK4 step */ function rk4Step(f, t, y, dt, mu) {
    const k1 = f(t, y, mu);
    const k2 = f(t + dt / 2, y.map((yi, i)=>yi + dt / 2 * k1[i]), mu);
    const k3 = f(t + dt / 2, y.map((yi, i)=>yi + dt / 2 * k2[i]), mu);
    const k4 = f(t + dt, y.map((yi, i)=>yi + dt * k3[i]), mu);
    return y.map((yi, i)=>yi + dt / 6 * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]));
}
function propagateArcCowell(r0, v0, dt, mu = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ALTAIRA_GM"], samples = 40) {
    // output times like Python: 0 .. dt, but drop the last one
    const tEval = Array.from({
        length: samples
    }, (_, i)=>dt * i / (samples - 1)).slice(0, -1); // drop final dt like Python
    const y0 = [
        ...r0,
        ...v0
    ];
    const results = [];
    let t = 0;
    let state = y0;
    // internal integration step (finer than output spacing)
    // 50 is arbitrary but safe; increase if still spiky
    const maxInternalStep = dt / (samples * 50);
    let nextOutIndex = 0;
    const eps = 1e-10;
    while(t < dt - eps && nextOutIndex < tEval.length){
        const targetT = tEval[nextOutIndex];
        const h = Math.min(maxInternalStep, targetT - t);
        // integrate one small step
        state = rk4Step(twoBodyDynamics, t, state, h, mu);
        t += h;
        // snap to target time if we're very close
        if (Math.abs(t - targetT) < 1e-9) {
            t = targetT;
        }
        // if we reached or passed the output time, record it
        if (t >= targetT - 1e-9) {
            results.push({
                t,
                state: [
                    ...state
                ]
            });
            nextOutIndex += 1;
        }
    }
    return results;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/gtoc/solutions/useSolutions.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useSolutions",
    ()=>useSolutions
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$solutions$2f$parseSolutionFile$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/gtoc/solutions/parseSolutionFile.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$arc_trajectories_cowells_method$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/gtoc/utils/arc_trajectories_cowells_method.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/gtoc/utils/constants.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
function isVec3(v) {
    return Array.isArray(v) && v.length === 3 && v.every((n)=>typeof n === "number");
}
const useSolutions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])((set, get)=>({
        solutions: [],
        visible: {},
        loadPersisted: async ()=>{
            return;
        },
        importSolution: async (input)=>{
            try {
                let fileForParser;
                if (typeof input === "string") {
                    fileForParser = new File([
                        input
                    ], "solution.txt", {
                        type: "text/plain"
                    });
                } else {
                    fileForParser = input;
                }
                const parsed = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$solutions$2f$parseSolutionFile$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseSolutionFile"])(fileForParser);
                const propagatedSamples = [];
                for(let i = 0; i < parsed.samples.length - 1; i++){
                    const s0 = parsed.samples[i];
                    const s1 = parsed.samples[i + 1];
                    const dt = s1.t - s0.t;
                    const isArc = s0.bodyId === 0 && s0.flag === 0 && s1.flag === 0;
                    if (isArc && dt > 1.0 && isVec3(s0.p) && isVec3(s0.v)) {
                        const r0 = s0.p;
                        const v0 = s0.v;
                        try {
                            const sol = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$arc_trajectories_cowells_method$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["propagateArcCowell"])(r0, v0, dt, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ALTAIRA_GM"], 200);
                            sol.forEach(({ t, state })=>{
                                propagatedSamples.push({
                                    t: s0.t + t,
                                    p: state.slice(0, 3),
                                    v: state.slice(3, 6),
                                    bodyId: 0,
                                    flag: 0
                                });
                            });
                        } catch (err) {
                            console.error(`[Cowell] Arc propagation failed at segment ${i}:`, err);
                            propagatedSamples.push(s0);
                        }
                    } else {
                        propagatedSamples.push(s0);
                    }
                }
                if (parsed.samples.length > 0) {
                    propagatedSamples.push(parsed.samples[parsed.samples.length - 1]);
                }
                const propagatedSolution = {
                    ...parsed,
                    samples: propagatedSamples
                };
                set((state)=>({
                        solutions: [
                            ...state.solutions,
                            propagatedSolution
                        ],
                        visible: {
                            ...state.visible,
                            [propagatedSolution.id]: true
                        }
                    }));
            } catch (err) {
                console.error("[useSolutions] Failed to import solution:", err);
            }
        },
        deleteSolution: (id)=>{
            set((state)=>({
                    solutions: state.solutions.filter((s)=>s.id !== id),
                    visible: Object.fromEntries(Object.entries(state.visible).filter(([k])=>k !== id))
                }));
        },
        toggle: (id)=>{
            set((state)=>({
                    visible: {
                        ...state.visible,
                        [id]: !state.visible[id]
                    }
                }));
        },
        recolorSolution: (id, newColor)=>{
            set((state)=>({
                    solutions: state.solutions.map((s)=>s.id === id ? {
                            ...s,
                            color: newColor
                        } : s)
                }));
        }
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
        className: "absolute top-16 right-3 z-[70] pointer-events-auto bg-black/70 border border-white/10 rounded-xl p-3 w-80 text-white",
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
                                    lineNumber: 153,
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
                                    lineNumber: 162,
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
                        lineNumber: 173,
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
_s1(SolutionsUI, "gGEOWHGYYLszjKfwFGW90k/Y8VE=", false, function() {
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
"[project]/src/components/gtoc/stores/planetStore.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "usePlanetStore",
    ()=>usePlanetStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/middleware.mjs [app-client] (ecmascript)");
;
;
const usePlanetStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["persist"])((set, get)=>({
        planets: [],
        selectedBodies: [],
        centerBodyId: null,
        showOrbits: true,
        lockedBodyId: null,
        customColors: {},
        hoveredContext: null,
        setPlanets: (list)=>set({
                planets: list
            }),
        togglePlanet: (idOrName)=>{
            const selected = get().selectedBodies;
            set({
                selectedBodies: selected.includes(idOrName) ? selected.filter((n)=>n !== idOrName) : [
                    ...selected,
                    idOrName
                ]
            });
        },
        setCenterBody: (id)=>set({
                centerBodyId: id
            }),
        updatePlanetColor: (id, color)=>{
            set((state)=>({
                    planets: state.planets.map((p)=>String(p.id) === String(id) ? {
                            ...p,
                            color
                        } : p),
                    customColors: {
                        ...state.customColors,
                        [String(id)]: color
                    }
                }));
        },
        updatePlanetTypeColor: (type, color)=>{
            set((state)=>({
                    planets: state.planets.map((p)=>(p.type || "").toLowerCase() === type.toLowerCase() ? {
                            ...p,
                            color
                        } : p)
                }));
        },
        toggleShowOrbits: ()=>set((state)=>({
                    showOrbits: !state.showOrbits
                })),
        clearAll: ()=>set({
                selectedBodies: []
            }),
        setHoveredContext: (ctx)=>set({
                hoveredContext: ctx
            }),
        setLockedBodyId: (id)=>set({
                lockedBodyId: id
            })
    }), {
    name: "vectra-planet-store",
    version: 1,
    storage: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createJSONStorage"])(()=>("TURBOPACK compile-time truthy", 1) ? window.localStorage : "TURBOPACK unreachable"),
    migrate: (persistedState, fromVersion)=>{
        if (fromVersion < 1) {
            return {
                selectedBodies: [],
                centerBodyId: null,
                showOrbits: true,
                lockedBodyId: null,
                customColors: {}
            };
        }
        return persistedState;
    },
    partialize: (state)=>({
            selectedBodies: state.selectedBodies,
            centerBodyId: state.centerBodyId,
            showOrbits: state.showOrbits,
            lockedBodyId: state.lockedBodyId,
            customColors: state.customColors
        })
}));
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$web$2f$Html$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@react-three/drei/web/Html.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$Billboard$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@react-three/drei/core/Billboard.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$f8cd670d$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__D__as__useFrame$3e$__ = __turbopack_context__.i("[project]/node_modules/@react-three/fiber/dist/events-f8cd670d.esm.js [app-client] (ecmascript) <export D as useFrame>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/gtoc/utils/constants.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$planetStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/gtoc/stores/planetStore.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
function SolutionTooltip({ data, position, pinned, onTogglePin, onMouseEnter, onMouseLeave, onSetCenter }) {
    _s();
    const { planets } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$planetStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePlanetStore"])();
    const getName = (id)=>{
        if (id == null) return "?";
        const found = planets.find((p)=>String(p.id) === String(id));
        return found?.name || `#${id}`;
    };
    const [visible, setVisible] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SolutionTooltip.useEffect": ()=>{
            const t = setTimeout({
                "SolutionTooltip.useEffect.t": ()=>setVisible(true)
            }["SolutionTooltip.useEffect.t"], 50);
            return ({
                "SolutionTooltip.useEffect": ()=>clearTimeout(t)
            })["SolutionTooltip.useEffect"];
        }
    }["SolutionTooltip.useEffect"], []);
    if (!visible && !pinned) return null;
    const isShip = data.kind === "ship";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$web$2f$Html$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Html"], {
        position: position.clone().add(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](0, 0.09, 0)),
        style: {
            pointerEvents: "none"
        },
        zIndexRange: [
            100,
            0
        ],
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            onMouseEnter: onMouseEnter,
            onMouseLeave: onMouseLeave,
            className: `pointer-events-auto relative rounded-md p-2 text-[10px] shadow-2xl backdrop-blur-md overflow-hidden transition-all duration-150 ${pinned ? "border-white/40 bg-black/90" : "border-white/10 bg-[#0a0a0c]/85"}`,
            style: {
                borderWidth: "1px",
                minWidth: isShip ? "200px" : "190px",
                transform: "translate(-50%, -100%)",
                marginTop: "-10px"
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "absolute top-0 left-0 h-full w-[2px]",
                    style: {
                        background: data.color
                    }
                }, void 0, false, {
                    fileName: "[project]/src/components/gtoc/solutions/SolutionPath.tsx",
                    lineNumber: 81,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "absolute top-1 right-1 flex items-center gap-1 z-50",
                    children: [
                        isShip && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: (e)=>{
                                e.stopPropagation();
                                onSetCenter?.();
                            },
                            className: "p-1 rounded-sm text-white/20 hover:text-white hover:bg-white/10 transition-colors",
                            title: "Set as Center",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                width: "10",
                                height: "10",
                                viewBox: "0 0 24 24",
                                fill: "none",
                                stroke: "currentColor",
                                strokeWidth: "2.5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                        cx: "12",
                                        cy: "12",
                                        r: "10"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/gtoc/solutions/SolutionPath.tsx",
                                        lineNumber: 94,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                        x1: "12",
                                        y1: "8",
                                        x2: "12",
                                        y2: "16"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/gtoc/solutions/SolutionPath.tsx",
                                        lineNumber: 95,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                        x1: "8",
                                        y1: "12",
                                        x2: "16",
                                        y2: "12"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/gtoc/solutions/SolutionPath.tsx",
                                        lineNumber: 96,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/gtoc/solutions/SolutionPath.tsx",
                                lineNumber: 93,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/gtoc/solutions/SolutionPath.tsx",
                            lineNumber: 85,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: (e)=>{
                                e.stopPropagation();
                                onTogglePin();
                            },
                            className: `p-1 rounded-sm transition-colors ${pinned ? "text-yellow-400 bg-white/10" : "text-white/20 hover:text-white hover:bg-white/10"}`,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                width: "10",
                                height: "10",
                                viewBox: "0 0 24 24",
                                fill: pinned ? "currentColor" : "none",
                                stroke: "currentColor",
                                strokeWidth: "2.5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        d: "M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4a2 2 0 0 0-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58s1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41s-.23-1.06-.59-1.42z"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/gtoc/solutions/SolutionPath.tsx",
                                        lineNumber: 117,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                        cx: "9",
                                        cy: "9",
                                        r: "2"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/gtoc/solutions/SolutionPath.tsx",
                                        lineNumber: 118,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/gtoc/solutions/SolutionPath.tsx",
                                lineNumber: 109,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/gtoc/solutions/SolutionPath.tsx",
                            lineNumber: 101,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/gtoc/solutions/SolutionPath.tsx",
                    lineNumber: 83,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-2 mb-1.5 pb-1.5 border-b border-white/10 pl-2 pr-12",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "font-bold text-white uppercase tracking-tight truncate max-w-[100px]",
                            children: data.solutionName
                        }, void 0, false, {
                            fileName: "[project]/src/components/gtoc/solutions/SolutionPath.tsx",
                            lineNumber: 124,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: `px-1 py-[1px] rounded-[3px] text-[8px] font-mono font-bold ${isShip ? "bg-yellow-500/20 text-yellow-400" : "bg-blue-500/20 text-blue-400"}`,
                            children: isShip ? "SHIP" : `L${data.legIndex}`
                        }, void 0, false, {
                            fileName: "[project]/src/components/gtoc/solutions/SolutionPath.tsx",
                            lineNumber: 125,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/gtoc/solutions/SolutionPath.tsx",
                    lineNumber: 123,
                    columnNumber: 9
                }, this),
                isShip ? /* ---- Ship-specific live info ---- */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        data.fromBody != null && data.toBody != null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-1.5 mb-1.5 px-2 text-white/80 text-[9px]",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-gray-400 text-[7px] uppercase mr-0.5",
                                    children: [
                                        "Leg ",
                                        data.legIndex
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/gtoc/solutions/SolutionPath.tsx",
                                    lineNumber: 138,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "font-semibold text-white truncate max-w-[50px]",
                                    children: getName(data.fromBody)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/gtoc/solutions/SolutionPath.tsx",
                                    lineNumber: 139,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-gray-500",
                                    children: "→"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/gtoc/solutions/SolutionPath.tsx",
                                    lineNumber: 140,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "font-semibold text-white truncate max-w-[50px]",
                                    children: getName(data.toBody)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/gtoc/solutions/SolutionPath.tsx",
                                    lineNumber: 141,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/gtoc/solutions/SolutionPath.tsx",
                            lineNumber: 137,
                            columnNumber: 15
                        }, this),
                        data.legProgress != null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "px-2 mb-1.5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-full h-[3px] rounded-full bg-white/10 overflow-hidden",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "h-full rounded-full transition-all duration-100",
                                        style: {
                                            width: `${Math.min(100, Math.max(0, data.legProgress * 100))}%`,
                                            background: data.color
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/gtoc/solutions/SolutionPath.tsx",
                                        lineNumber: 149,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/gtoc/solutions/SolutionPath.tsx",
                                    lineNumber: 148,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-[7px] text-gray-500 mt-0.5 text-right",
                                    children: [
                                        (data.legProgress * 100).toFixed(0),
                                        "%"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/gtoc/solutions/SolutionPath.tsx",
                                    lineNumber: 154,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/gtoc/solutions/SolutionPath.tsx",
                            lineNumber: 147,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-2 gap-y-1.5 gap-x-2 pl-2 font-mono text-[9px]",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-gray-400 uppercase text-[7px] mb-px",
                                            children: "MET"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/gtoc/solutions/SolutionPath.tsx",
                                            lineNumber: 160,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-white font-medium",
                                            children: [
                                                Number.isFinite(data.missionDays) ? data.missionDays.toFixed(1) : "-",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-gray-400 text-[7px] ml-0.5",
                                                    children: "d"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/gtoc/solutions/SolutionPath.tsx",
                                                    lineNumber: 163,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/gtoc/solutions/SolutionPath.tsx",
                                            lineNumber: 161,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/gtoc/solutions/SolutionPath.tsx",
                                    lineNumber: 159,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-gray-400 uppercase text-[7px] mb-px",
                                            children: "Speed"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/gtoc/solutions/SolutionPath.tsx",
                                            lineNumber: 167,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-white font-medium",
                                            children: [
                                                data.shipVelocity != null && Number.isFinite(data.shipVelocity) ? data.shipVelocity.toFixed(1) : "-",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-gray-400 text-[7px] ml-0.5",
                                                    children: "km/s"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/gtoc/solutions/SolutionPath.tsx",
                                                    lineNumber: 170,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/gtoc/solutions/SolutionPath.tsx",
                                            lineNumber: 168,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/gtoc/solutions/SolutionPath.tsx",
                                    lineNumber: 166,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/gtoc/solutions/SolutionPath.tsx",
                            lineNumber: 158,
                            columnNumber: 13
                        }, this),
                        data.shipPosition && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-1.5 pl-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-gray-400 uppercase text-[7px] mb-px",
                                    children: "Position"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/gtoc/solutions/SolutionPath.tsx",
                                    lineNumber: 177,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-white/70 font-mono text-[8px] leading-relaxed",
                                    children: [
                                        "x=",
                                        data.shipPosition[0].toFixed(3),
                                        " ",
                                        "y=",
                                        data.shipPosition[1].toFixed(3),
                                        " ",
                                        "z=",
                                        data.shipPosition[2].toFixed(3),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-gray-500 ml-1",
                                            children: "AU"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/gtoc/solutions/SolutionPath.tsx",
                                            lineNumber: 182,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/gtoc/solutions/SolutionPath.tsx",
                                    lineNumber: 178,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/gtoc/solutions/SolutionPath.tsx",
                            lineNumber: 176,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true) : /* ---- Leg-specific info (unchanged) ---- */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        data.fromBody != null && data.toBody != null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-1.5 mb-2 px-2 text-white/80 text-[9px]",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "font-semibold text-white truncate max-w-[60px]",
                                    children: getName(data.fromBody)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/gtoc/solutions/SolutionPath.tsx",
                                    lineNumber: 192,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-gray-500",
                                    children: "→"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/gtoc/solutions/SolutionPath.tsx",
                                    lineNumber: 193,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "font-semibold text-white truncate max-w-[60px]",
                                    children: getName(data.toBody)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/gtoc/solutions/SolutionPath.tsx",
                                    lineNumber: 194,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/gtoc/solutions/SolutionPath.tsx",
                            lineNumber: 191,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-2 gap-y-1.5 gap-x-2 pl-2 font-mono text-[9px]",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-gray-400 uppercase text-[7px] mb-px",
                                            children: "T-Flight"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/gtoc/solutions/SolutionPath.tsx",
                                            lineNumber: 200,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-white font-medium",
                                            children: [
                                                Number.isFinite(data.tofDays) ? data.tofDays.toFixed(1) : "-",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-gray-400 text-[7px] ml-0.5",
                                                    children: "d"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/gtoc/solutions/SolutionPath.tsx",
                                                    lineNumber: 203,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/gtoc/solutions/SolutionPath.tsx",
                                            lineNumber: 201,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/gtoc/solutions/SolutionPath.tsx",
                                    lineNumber: 199,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-gray-400 uppercase text-[7px] mb-px",
                                            children: "MET"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/gtoc/solutions/SolutionPath.tsx",
                                            lineNumber: 207,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-white font-medium",
                                            children: [
                                                Number.isFinite(data.missionDays) ? data.missionDays.toFixed(1) : "-",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-gray-400 text-[7px] ml-0.5",
                                                    children: "d"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/gtoc/solutions/SolutionPath.tsx",
                                                    lineNumber: 210,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/gtoc/solutions/SolutionPath.tsx",
                                            lineNumber: 208,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/gtoc/solutions/SolutionPath.tsx",
                                    lineNumber: 206,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/gtoc/solutions/SolutionPath.tsx",
                            lineNumber: 198,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-1.5 pl-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-gray-400 uppercase text-[7px] mb-px",
                                    children: "Leg Dist"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/gtoc/solutions/SolutionPath.tsx",
                                    lineNumber: 216,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-white font-medium",
                                    children: [
                                        Number.isFinite(data.legDistAU) ? data.legDistAU.toFixed(3) : "-",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-gray-400 text-[7px] ml-1",
                                            children: "AU"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/gtoc/solutions/SolutionPath.tsx",
                                            lineNumber: 219,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/gtoc/solutions/SolutionPath.tsx",
                                    lineNumber: 217,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/gtoc/solutions/SolutionPath.tsx",
                            lineNumber: 215,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/gtoc/solutions/SolutionPath.tsx",
            lineNumber: 74,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/gtoc/solutions/SolutionPath.tsx",
        lineNumber: 73,
        columnNumber: 5
    }, this);
}
_s(SolutionTooltip, "5/zELhUieuDvKsDqoxQsp6RjEOM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$planetStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePlanetStore"]
    ];
});
_c = SolutionTooltip;
function SolutionPath({ sol, currentJD, epochZeroJD, showShip, onHover, onUnhover }) {
    _s1();
    const setCenterBody = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$planetStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePlanetStore"])({
        "SolutionPath.usePlanetStore[setCenterBody]": (s)=>s.setCenterBody
    }["SolutionPath.usePlanetStore[setCenterBody]"]);
    const setHoveredContext = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$planetStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePlanetStore"])({
        "SolutionPath.usePlanetStore[setHoveredContext]": (s)=>s.setHoveredContext
    }["SolutionPath.usePlanetStore[setHoveredContext]"]);
    const hoverTimeout = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const shipPosRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"]());
    const [hoveredLeg, setHoveredLeg] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [hoverState, setHoverState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [pinnedItems, setPinnedItems] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    if (!sol?.samples?.length) return null;
    const baseColor = sol.color || "#66d9e8";
    const SCALE = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "SolutionPath.useMemo[SCALE]": ()=>{
            const mags = sol.samples.map({
                "SolutionPath.useMemo[SCALE].mags": (s)=>Math.hypot(...s.p)
            }["SolutionPath.useMemo[SCALE].mags"]).filter(Number.isFinite).sort({
                "SolutionPath.useMemo[SCALE].mags": (a, b)=>a - b
            }["SolutionPath.useMemo[SCALE].mags"]);
            const medianR = mags[Math.floor(mags.length / 2)] || 1;
            return medianR > 1e3 ? 1 / __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AU_KM"] : 1;
        }
    }["SolutionPath.useMemo[SCALE]"], [
        sol.samples
    ]);
    const pts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "SolutionPath.useMemo[pts]": ()=>sol.samples.map({
                "SolutionPath.useMemo[pts]": (s)=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](s.p[0], s.p[1], s.p[2]).multiplyScalar(SCALE)
            }["SolutionPath.useMemo[pts]"]).filter({
                "SolutionPath.useMemo[pts]": (v)=>Number.isFinite(v.x) && Number.isFinite(v.y) && Number.isFinite(v.z)
            }["SolutionPath.useMemo[pts]"])
    }["SolutionPath.useMemo[pts]"], [
        sol.samples,
        SCALE
    ]);
    if (pts.length < 2) return null;
    const elapsed = (currentJD - epochZeroJD) * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SECONDS_PER_DAY"];
    const times = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "SolutionPath.useMemo[times]": ()=>sol.samples.map({
                "SolutionPath.useMemo[times]": (s)=>s.t
            }["SolutionPath.useMemo[times]"])
    }["SolutionPath.useMemo[times]"], [
        sol.samples
    ]);
    const solutionStarted = elapsed >= times[0];
    const legs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "SolutionPath.useMemo[legs]": ()=>{
            const out = [];
            const scaled = sol.samples.map({
                "SolutionPath.useMemo[legs].scaled": (s)=>({
                        t: s.t,
                        body: s.bodyId ?? 0,
                        v: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](s.p[0], s.p[1], s.p[2]).multiplyScalar(SCALE)
                    })
            }["SolutionPath.useMemo[legs].scaled"]);
            let cur = {
                fromBody: scaled[0].body,
                toBody: scaled[0].body,
                t0: scaled[0].t,
                t1: scaled[0].t,
                pts: [
                    scaled[0].v
                ],
                dist: 0
            };
            for(let i = 1; i < scaled.length; i++){
                const s = scaled[i];
                const prev = scaled[i - 1];
                cur.pts.push(s.v);
                cur.dist += s.v.distanceTo(prev.v);
                cur.t1 = s.t;
                const nextBody = scaled[i + 1]?.body ?? s.body;
                if (nextBody !== s.body) {
                    const toBody = scaled.slice(i + 1).map({
                        "SolutionPath.useMemo[legs]": (p)=>p.body
                    }["SolutionPath.useMemo[legs]"]).find({
                        "SolutionPath.useMemo[legs]": (b)=>b !== s.body
                    }["SolutionPath.useMemo[legs]"]) ?? s.body;
                    cur.toBody = toBody;
                    out.push(cur);
                    cur = {
                        fromBody: s.body,
                        toBody,
                        t0: s.t,
                        t1: s.t,
                        pts: [],
                        dist: 0
                    };
                }
            }
            if (cur.pts.length) out.push(cur);
            return out;
        }
    }["SolutionPath.useMemo[legs]"], [
        sol.samples,
        SCALE
    ]);
    const currentLegIndex = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "SolutionPath.useMemo[currentLegIndex]": ()=>{
            if (!legs.length) return null;
            const k = legs.findIndex({
                "SolutionPath.useMemo[currentLegIndex].k": (L)=>elapsed >= L.t0 && elapsed <= L.t1
            }["SolutionPath.useMemo[currentLegIndex].k"]);
            if (k >= 0) return k;
            if (elapsed < legs[0].t0) return 0;
            return legs.length - 1;
        }
    }["SolutionPath.useMemo[currentLegIndex]"], [
        elapsed,
        legs
    ]);
    // Ship position: useFrame mutates refs to avoid React re-renders each frame
    const shipGroupRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Compute ship position & visible trail via useFrame (no React state changes)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$f8cd670d$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__D__as__useFrame$3e$__["useFrame"])({
        "SolutionPath.useFrame": ()=>{
            if (pts.length < 2) return;
            const elapsedNow = (currentJD - epochZeroJD) * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SECONDS_PER_DAY"];
            const started = elapsedNow >= times[0];
            const pos = shipPosRef.current;
            pos.copy(pts[0]);
            if (started) {
                // Binary search for current segment
                let lo = 0, hi = times.length - 2;
                while(lo < hi){
                    const mid = lo + hi + 1 >>> 1;
                    if (times[mid] <= elapsedNow) lo = mid;
                    else hi = mid - 1;
                }
                const idx = lo;
                const t0 = times[idx];
                const t1 = times[idx + 1];
                const a = t1 > t0 ? Math.min(1, Math.max(0, (elapsedNow - t0) / (t1 - t0))) : 0;
                pos.copy(pts[idx]).lerp(pts[idx + 1], a);
            }
            if (shipGroupRef.current) {
                shipGroupRef.current.position.copy(pos);
            }
        }
    }["SolutionPath.useFrame"]);
    // Visible trail: only the portion of the path up to the current time
    const visiblePts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "SolutionPath.useMemo[visiblePts]": ()=>{
            if (pts.length < 2 || !solutionStarted) return [
                pts[0]
            ];
            // Binary search for current segment
            let lo = 0, hi = times.length - 2;
            while(lo < hi){
                const mid = lo + hi + 1 >>> 1;
                if (times[mid] <= elapsed) lo = mid;
                else hi = mid - 1;
            }
            const idx = lo;
            const t0 = times[idx];
            const t1 = times[idx + 1];
            const a = t1 > t0 ? Math.min(1, Math.max(0, (elapsed - t0) / (t1 - t0))) : 0;
            const interpPt = pts[idx].clone().lerp(pts[idx + 1], a);
            return [
                ...pts.slice(0, idx + 1),
                interpPt
            ];
        }
    }["SolutionPath.useMemo[visiblePts]"], [
        pts,
        times,
        elapsed,
        solutionStarted
    ]);
    const clearHoverTimeout = ()=>{
        if (hoverTimeout.current) {
            clearTimeout(hoverTimeout.current);
            hoverTimeout.current = null;
        }
    };
    const handleHover = (payload, pos)=>{
        clearHoverTimeout();
        setHoverState({
            data: payload,
            pos
        });
        onHover?.(payload, 0, 0);
    };
    const handleUnhover = ()=>{
        clearHoverTimeout();
        hoverTimeout.current = setTimeout(()=>{
            setHoverState(null);
            onUnhover?.();
        }, 600);
    };
    const getObjId = (p)=>p.kind === "ship" ? `ship-${sol.id}` : `leg-${sol.id}-${p.legIndex}`;
    const togglePin = (item)=>{
        const id = getObjId(item.data);
        setPinnedItems((prev)=>prev.some((x)=>x.id === id) ? prev.filter((x)=>x.id !== id) : [
                ...prev,
                {
                    id,
                    ...item
                }
            ]);
        if (hoverState && getObjId(hoverState.data) === id) setHoverState(null);
    };
    const shipPayload = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "SolutionPath.useMemo[shipPayload]": ()=>{
            const idx = currentLegIndex ?? 0;
            const leg = legs[idx];
            const pos = shipPosRef.current;
            // Compute velocity from solution samples (interpolated)
            let velocityKmS;
            if (solutionStarted && sol.samples.length > 1) {
                // Binary search for current time in samples
                let lo = 0, hi = sol.samples.length - 2;
                while(lo < hi){
                    const mid = lo + hi + 1 >>> 1;
                    if (sol.samples[mid].t <= elapsed) lo = mid;
                    else hi = mid - 1;
                }
                const s0 = sol.samples[lo];
                const s1 = sol.samples[lo + 1];
                if (s0.v && s1.v) {
                    const dt = s1.t - s0.t;
                    const a = dt > 0 ? Math.min(1, Math.max(0, (elapsed - s0.t) / dt)) : 0;
                    const vx = s0.v[0] + (s1.v[0] - s0.v[0]) * a;
                    const vy = s0.v[1] + (s1.v[1] - s0.v[1]) * a;
                    const vz = s0.v[2] + (s1.v[2] - s0.v[2]) * a;
                    velocityKmS = Math.sqrt(vx * vx + vy * vy + vz * vz);
                } else if (s0.v) {
                    velocityKmS = Math.sqrt(s0.v[0] ** 2 + s0.v[1] ** 2 + s0.v[2] ** 2);
                }
            }
            // Compute leg progress
            let legProgress;
            if (leg && elapsed >= leg.t0) {
                const legDuration = leg.t1 - leg.t0;
                legProgress = legDuration > 0 ? Math.min(1, Math.max(0, (elapsed - leg.t0) / legDuration)) : 1;
            }
            return {
                solutionName: sol.name,
                color: baseColor,
                legIndex: idx + 1,
                fromBody: leg?.fromBody,
                toBody: leg?.toBody,
                tofDays: leg ? (leg.t1 - leg.t0) / __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SECONDS_PER_DAY"] : 0,
                missionDays: currentJD - epochZeroJD,
                legDistAU: leg?.dist ?? 0,
                kind: "ship",
                shipPosition: [
                    pos.x / SCALE,
                    pos.y / SCALE,
                    pos.z / SCALE
                ],
                shipVelocity: velocityKmS,
                legProgress
            };
        }
    }["SolutionPath.useMemo[shipPayload]"], [
        baseColor,
        currentJD,
        currentLegIndex,
        epochZeroJD,
        legs,
        sol.name,
        sol.samples,
        solutionStarted,
        elapsed,
        SCALE
    ]);
    // For pinned ship items, check if a ship is pinned
    const isShipPinned = pinnedItems.some((item)=>item.data.kind === "ship");
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        children: [
            hoverState && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SolutionTooltip, {
                data: hoverState.data,
                position: hoverState.pos,
                pinned: false,
                onTogglePin: ()=>togglePin(hoverState),
                onSetCenter: ()=>setCenterBody(`ship-${sol.id}`),
                onMouseEnter: clearHoverTimeout,
                onMouseLeave: handleUnhover
            }, void 0, false, {
                fileName: "[project]/src/components/gtoc/solutions/SolutionPath.tsx",
                lineNumber: 411,
                columnNumber: 22
            }, this),
            pinnedItems.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SolutionTooltip, {
                    data: item.data.kind === "ship" ? shipPayload : item.data,
                    position: item.data.kind === "ship" ? shipPosRef.current : item.pos,
                    pinned: true,
                    onTogglePin: ()=>togglePin(item),
                    onSetCenter: ()=>setCenterBody(`ship-${sol.id}`)
                }, item.id, false, {
                    fileName: "[project]/src/components/gtoc/solutions/SolutionPath.tsx",
                    lineNumber: 414,
                    columnNumber: 9
                }, this)),
            visiblePts.length >= 2 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$Line$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Line"], {
                points: visiblePts,
                color: baseColor,
                dashed: false,
                lineWidth: 2.8,
                transparent: true,
                opacity: 0.95,
                toneMapped: false
            }, void 0, false, {
                fileName: "[project]/src/components/gtoc/solutions/SolutionPath.tsx",
                lineNumber: 424,
                columnNumber: 34
            }, this),
            solutionStarted && showShip && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                ref: shipGroupRef,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                        visible: false,
                        onClick: (e)=>{
                            e.stopPropagation();
                            togglePin({
                                data: shipPayload
                            });
                        },
                        onPointerOver: (e)=>{
                            e.stopPropagation();
                            document.body.style.cursor = "pointer";
                            setHoveredContext({
                                id: `ship-${sol.id}`,
                                name: sol.name,
                                type: "ship"
                            });
                            if (currentLegIndex != null) setHoveredLeg(currentLegIndex);
                            handleHover(shipPayload, shipPosRef.current.clone());
                        },
                        onPointerOut: (e)=>{
                            e.stopPropagation();
                            document.body.style.cursor = "auto";
                            setHoveredLeg(null);
                            handleUnhover();
                            setHoveredContext(null);
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("sphereGeometry", {
                                args: [
                                    0.2,
                                    16,
                                    16
                                ]
                            }, void 0, false, {
                                fileName: "[project]/src/components/gtoc/solutions/SolutionPath.tsx",
                                lineNumber: 434,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshBasicMaterial", {
                                transparent: true,
                                opacity: 0
                            }, void 0, false, {
                                fileName: "[project]/src/components/gtoc/solutions/SolutionPath.tsx",
                                lineNumber: 435,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/gtoc/solutions/SolutionPath.tsx",
                        lineNumber: 428,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$Billboard$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Billboard"], {
                        follow: true,
                        lockX: false,
                        lockY: false,
                        lockZ: false,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$Line$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Line"], {
                            points: [
                                [
                                    0,
                                    0.056,
                                    0
                                ],
                                [
                                    0.065,
                                    -0.056,
                                    0
                                ],
                                [
                                    -0.065,
                                    -0.056,
                                    0
                                ],
                                [
                                    0,
                                    0.056,
                                    0
                                ]
                            ],
                            color: baseColor,
                            lineWidth: 3,
                            transparent: true,
                            opacity: 1,
                            toneMapped: false,
                            renderOrder: 20,
                            depthTest: false,
                            depthWrite: false
                        }, void 0, false, {
                            fileName: "[project]/src/components/gtoc/solutions/SolutionPath.tsx",
                            lineNumber: 439,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/gtoc/solutions/SolutionPath.tsx",
                        lineNumber: 438,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/gtoc/solutions/SolutionPath.tsx",
                lineNumber: 427,
                columnNumber: 9
            }, this),
            solutionStarted && legs.map((leg, i)=>{
                const isHovered = hoveredLeg === i;
                const tofDays = (leg.t1 - leg.t0) / __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SECONDS_PER_DAY"];
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
                            lineNumber: 449,
                            columnNumber: 27
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
                                handleHover({
                                    solutionName: sol.name,
                                    color: baseColor,
                                    legIndex: i + 1,
                                    fromBody: leg.fromBody,
                                    toBody: leg.toBody,
                                    tofDays,
                                    missionDays: currentJD - epochZeroJD,
                                    legDistAU: leg.dist,
                                    kind: "leg"
                                }, e.point.clone());
                            },
                            onPointerOut: (e)=>{
                                e.stopPropagation();
                                setHoveredLeg(null);
                                handleUnhover();
                            }
                        }, void 0, false, {
                            fileName: "[project]/src/components/gtoc/solutions/SolutionPath.tsx",
                            lineNumber: 450,
                            columnNumber: 13
                        }, this)
                    ]
                }, i, true, {
                    fileName: "[project]/src/components/gtoc/solutions/SolutionPath.tsx",
                    lineNumber: 448,
                    columnNumber: 11
                }, this);
            })
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/gtoc/solutions/SolutionPath.tsx",
        lineNumber: 410,
        columnNumber: 5
    }, this);
}
_s1(SolutionPath, "+zjgX9hyGehsvmzdgrTiI8MC9uw=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$planetStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePlanetStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$planetStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePlanetStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$f8cd670d$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__D__as__useFrame$3e$__["useFrame"]
    ];
});
_c1 = SolutionPath;
var _c, _c1;
__turbopack_context__.k.register(_c, "SolutionTooltip");
__turbopack_context__.k.register(_c1, "SolutionPath");
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
function Solutions3D({ currentJD, epochZeroJD, showShip }) {
    _s();
    const { solutions, visible } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$solutions$2f$useSolutions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSolutions"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: solutions.map((s)=>visible[s.id] && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$solutions$2f$SolutionPath$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                sol: s,
                currentJD: currentJD,
                epochZeroJD: epochZeroJD,
                showShip: showShip
            }, s.id, false, {
                fileName: "[project]/src/components/gtoc/solutions/Solutions3D.tsx",
                lineNumber: 23,
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
"[project]/src/components/gtoc/solutions/Solutions3D.tsx [app-client] (ecmascript) <export default as Solutions3D>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Solutions3D",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$solutions$2f$Solutions3D$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$solutions$2f$Solutions3D$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/gtoc/solutions/Solutions3D.tsx [app-client] (ecmascript)");
}),
"[project]/src/components/gtoc/stores/useMovieStore.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ASPECT_RATIOS",
    ()=>ASPECT_RATIOS,
    "useMovieStore",
    ()=>useMovieStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/middleware.mjs [app-client] (ecmascript)");
"use client";
;
;
const ASPECT_RATIOS = {
    "16:9": 16 / 9,
    "4:3": 4 / 3,
    "1:1": 1,
    "2.35:1": 2.35,
    "9:16": 9 / 16
};
let _logoCounter = 0;
function nextLogoId() {
    return `logo-${Date.now()}-${_logoCounter++}`;
}
const defaultPersisted = {
    isMovieMode: false,
    logos: [],
    aspectRatio: ASPECT_RATIOS["16:9"],
    keyframes: [],
    missionName: "",
    missionNameSize: 32
};
const useMovieStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["persist"])((set, get)=>({
        isMovieMode: false,
        isPresentationMode: false,
        isRecording: false,
        recordingProgress: 0,
        aspectRatio: ASPECT_RATIOS["16:9"],
        logos: [],
        // Derived compat getters are computed via get() in selectors;
        // for the store object we seed these:
        logoUrl: null,
        logoPosition: {
            x: 0.05,
            y: 0.05
        },
        logoScale: 1,
        keyframes: [],
        captureKeyframeTrigger: 0,
        nearbyKeyframeId: null,
        toggleMovieMode: (active)=>set((state)=>({
                    isMovieMode: active ?? !state.isMovieMode
                })),
        togglePresentationMode: (active)=>set((state)=>({
                    isPresentationMode: active ?? !state.isPresentationMode
                })),
        presentationOpacity: 0,
        setPresentationOpacity: (opacity)=>set({
                presentationOpacity: opacity
            }),
        // ---- Multi-logo API ----
        addLogo: (url)=>{
            const entry = {
                id: nextLogoId(),
                url,
                position: {
                    x: 0.05,
                    y: 0.05
                },
                scale: 1
            };
            set((state)=>{
                const logos = [
                    ...state.logos,
                    entry
                ];
                return {
                    logos,
                    logoUrl: logos[0]?.url ?? null
                };
            });
        },
        updateLogo: (id, patch)=>set((state)=>{
                const logos = state.logos.map((l)=>l.id === id ? {
                        ...l,
                        ...patch
                    } : l);
                return {
                    logos,
                    logoUrl: logos[0]?.url ?? null,
                    logoPosition: logos[0]?.position ?? {
                        x: 0.05,
                        y: 0.05
                    },
                    logoScale: logos[0]?.scale ?? 1
                };
            }),
        removeLogo: (id)=>set((state)=>{
                const logos = state.logos.filter((l)=>l.id !== id);
                return {
                    logos,
                    logoUrl: logos[0]?.url ?? null,
                    logoPosition: logos[0]?.position ?? {
                        x: 0.05,
                        y: 0.05
                    },
                    logoScale: logos[0]?.scale ?? 1
                };
            }),
        // ---- Legacy single-logo compat ----
        setLogo: (url)=>{
            if (!url) {
                // Clear all logos
                set({
                    logos: [],
                    logoUrl: null,
                    logoPosition: {
                        x: 0.05,
                        y: 0.05
                    },
                    logoScale: 1
                });
                return;
            }
            // Add a new logo
            get().addLogo(url);
        },
        setLogoPosition: (pos)=>{
            const logos = get().logos;
            if (logos.length > 0) get().updateLogo(logos[0].id, {
                position: pos
            });
        },
        setLogoScale: (scale)=>{
            const logos = get().logos;
            if (logos.length > 0) get().updateLogo(logos[0].id, {
                scale
            });
        },
        setRecording: (isRecording, progress = 0)=>set({
                isRecording,
                recordingProgress: progress
            }),
        setRecordingProgress: (progress)=>set({
                recordingProgress: progress
            }),
        // ---- Export settings modal ----
        showExportSettings: false,
        exportFilename: "vectra_4k_export",
        exportRate: 50,
        setShowExportSettings: (show)=>set({
                showExportSettings: show
            }),
        setExportFilename: (name)=>set({
                exportFilename: name
            }),
        setExportRate: (rate)=>set({
                exportRate: rate
            }),
        // ---- Mission name ----
        missionName: "",
        missionNameSize: 32,
        setMissionName: (name)=>set({
                missionName: name
            }),
        setMissionNameSize: (size)=>set({
                missionNameSize: size
            }),
        // ---- Offline 4K export ----
        isExporting: false,
        exportProgress: 0,
        exportFrameInfo: "",
        exportStartTime: 0,
        startExport: ()=>set({
                isExporting: true,
                isRecording: true,
                showExportSettings: false,
                exportProgress: 0,
                exportFrameInfo: "Preparing…",
                exportStartTime: Date.now()
            }),
        updateExportProgress: (progress, frameInfo)=>set({
                exportProgress: progress,
                exportFrameInfo: frameInfo,
                recordingProgress: progress
            }),
        finishExport: ()=>set({
                isExporting: false,
                isRecording: false,
                exportProgress: 0,
                exportFrameInfo: "",
                recordingProgress: 0,
                exportStartTime: 0
            }),
        setAspectRatio: (ratio)=>set({
                aspectRatio: ratio
            }),
        setNearbyKeyframeId: (id)=>set({
                nearbyKeyframeId: id
            }),
        addKeyframe: (k)=>set((state)=>({
                    keyframes: [
                        ...state.keyframes,
                        k
                    ].sort((a, b)=>a.jd - b.jd)
                })),
        updateKeyframe: (id, k)=>set((state)=>({
                    keyframes: state.keyframes.map((old)=>old.id === id ? {
                            ...old,
                            ...k
                        } : old).sort((a, b)=>a.jd - b.jd)
                })),
        removeKeyframe: (id)=>set((state)=>({
                    keyframes: state.keyframes.filter((k)=>k.id !== id)
                })),
        clearKeyframes: ()=>set({
                keyframes: []
            }),
        triggerKeyframeCapture: ()=>set((state)=>({
                    captureKeyframeTrigger: state.captureKeyframeTrigger + 1
                }))
    }), {
    name: "vectra-movie-store",
    version: 4,
    storage: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createJSONStorage"])(()=>("TURBOPACK compile-time truthy", 1) ? window.localStorage : "TURBOPACK unreachable"),
    migrate: (persisted, fromVersion)=>{
        const p = persisted ?? {};
        // Migrate from single-logo fields (v3) to logos array (v4)
        if (fromVersion < 4) {
            const logos = [];
            if (p.logoUrl && !p.logoUrl.startsWith("blob:")) {
                logos.push({
                    id: nextLogoId(),
                    url: p.logoUrl,
                    position: p.logoPosition ?? {
                        x: 0.05,
                        y: 0.05
                    },
                    scale: p.logoScale ?? 1
                });
            }
            // Remove old fields
            delete p.logoUrl;
            delete p.logoPosition;
            delete p.logoScale;
            return {
                ...defaultPersisted,
                ...p,
                logos
            };
        }
        // Clear stale blob URLs from logos
        if (Array.isArray(p.logos)) {
            p.logos = p.logos.filter((l)=>l.url && !l.url.startsWith("blob:"));
        }
        return {
            ...defaultPersisted,
            ...p
        };
    },
    partialize: (state)=>({
            isMovieMode: state.isMovieMode,
            logos: state.logos.filter((l)=>!l.url.startsWith("blob:")).map(({ id, url, position, scale })=>({
                    id,
                    url,
                    position,
                    scale
                })),
            aspectRatio: state.aspectRatio,
            keyframes: state.keyframes
        })
}));
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/gtoc/sceneParts/HUD.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>HUD
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$useMovieStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/gtoc/stores/useMovieStore.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
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
            lineNumber: 77,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/gtoc/sceneParts/HUD.tsx",
        lineNumber: 76,
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
            lineNumber: 82,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/gtoc/sceneParts/HUD.tsx",
        lineNumber: 81,
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
            lineNumber: 87,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/gtoc/sceneParts/HUD.tsx",
        lineNumber: 86,
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
            lineNumber: 92,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/gtoc/sceneParts/HUD.tsx",
        lineNumber: 91,
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
                lineNumber: 97,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M12 12l4-4",
                stroke: "currentColor",
                strokeWidth: "1.5",
                strokeLinecap: "round"
            }, void 0, false, {
                fileName: "[project]/src/components/gtoc/sceneParts/HUD.tsx",
                lineNumber: 98,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/gtoc/sceneParts/HUD.tsx",
        lineNumber: 96,
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
                lineNumber: 103,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M8 3v4M16 3v4M3 10h18",
                stroke: "currentColor",
                strokeWidth: "1.5"
            }, void 0, false, {
                fileName: "[project]/src/components/gtoc/sceneParts/HUD.tsx",
                lineNumber: 104,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/gtoc/sceneParts/HUD.tsx",
        lineNumber: 102,
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
                className: "max-w-[1400px] mx-auto px-4 pt-1 relative z-20",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "relative",
                    style: {
                        height: 40 + RAIL_CENTER_BOTTOM_PX
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "absolute inset-x-0 pointer-events-none z-50",
                            style: {
                                bottom: RAIL_CENTER_BOTTOM_PX,
                                height: 0
                            },
                            children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$useMovieStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMovieStore"])({
                                "HUD.useMovieStore": (s)=>s.keyframes
                            }["HUD.useMovieStore"]).map((kf)=>{
                                const pos = leftPct(kf.jd);
                                const isSelected = Math.abs(jd - kf.jd) < 0.1; // Highlight if closest
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "absolute -translate-x-1/2 pointer-events-auto flex flex-col items-center justify-end",
                                    style: {
                                        left: `${pos}%`,
                                        bottom: 0
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: `w-[2px] h-4 mb-1 rounded-full shadow-sm ${isSelected ? "bg-yellow-400" : "bg-emerald-400"}`
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/gtoc/sceneParts/HUD.tsx",
                                            lineNumber: 218,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: "absolute bottom-[-10px] w-8 h-10 -translate-x-[0px]",
                                            title: `${jdToISO(kf.jd)}\nShift+Click to Delete`,
                                            "aria-label": `Jump to ${jdToISO(kf.jd)}`,
                                            onClick: (e)=>{
                                                e.stopPropagation(); // Stop rail click
                                                if (e.shiftKey) {
                                                    if (confirm("Delete this keyframe?")) __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$useMovieStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMovieStore"].getState().removeKeyframe(kf.id);
                                                } else {
                                                    jumpTo(kf.jd);
                                                }
                                            },
                                            onContextMenu: (e)=>{
                                                e.preventDefault();
                                                e.stopPropagation();
                                                if (confirm("Delete this keyframe?")) __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$useMovieStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMovieStore"].getState().removeKeyframe(kf.id);
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/gtoc/sceneParts/HUD.tsx",
                                            lineNumber: 223,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, kf.jd, true, {
                                    fileName: "[project]/src/components/gtoc/sceneParts/HUD.tsx",
                                    lineNumber: 212,
                                    columnNumber: 17
                                }, this);
                            })
                        }, void 0, false, {
                            fileName: "[project]/src/components/gtoc/sceneParts/HUD.tsx",
                            lineNumber: 207,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                            lineNumber: 271,
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
                                            lineNumber: 272,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: "absolute -left-2 -top-6 w-4 h-[28px] pointer-events-auto",
                                            title: label ?? jdToISO(mjd),
                                            "aria-label": `Jump to ${label ?? jdToISO(mjd)}`,
                                            onClick: ()=>jumpTo(mjd)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/gtoc/sceneParts/HUD.tsx",
                                            lineNumber: 279,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, `${kind}-${i}-${mjd}`, true, {
                                    fileName: "[project]/src/components/gtoc/sceneParts/HUD.tsx",
                                    lineNumber: 266,
                                    columnNumber: 17
                                }, this);
                            })
                        }, void 0, false, {
                            fileName: "[project]/src/components/gtoc/sceneParts/HUD.tsx",
                            lineNumber: 245,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/gtoc/sceneParts/HUD.tsx",
                    lineNumber: 205,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/gtoc/sceneParts/HUD.tsx",
                lineNumber: 204,
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
                                lineNumber: 303,
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
                                lineNumber: 304,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/gtoc/sceneParts/HUD.tsx",
                        lineNumber: 295,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/gtoc/sceneParts/HUD.tsx",
                    lineNumber: 294,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/gtoc/sceneParts/HUD.tsx",
                lineNumber: 293,
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
                                        lineNumber: 320,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "tabular-nums",
                                        children: isoShort(jdToISO(jd))
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/gtoc/sceneParts/HUD.tsx",
                                        lineNumber: 321,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/gtoc/sceneParts/HUD.tsx",
                                lineNumber: 319,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/gtoc/sceneParts/HUD.tsx",
                            lineNumber: 318,
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
                                        lineNumber: 330,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/gtoc/sceneParts/HUD.tsx",
                                    lineNumber: 326,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setPlaying(!isPlaying),
                                    className: "h-8 w-8 rounded-full bg-white/20 hover:bg-white/30 border border-white/25 flex items-center justify-center",
                                    children: isPlaying ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(IconPause, {}, void 0, false, {
                                        fileName: "[project]/src/components/gtoc/sceneParts/HUD.tsx",
                                        lineNumber: 336,
                                        columnNumber: 28
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(IconPlay, {}, void 0, false, {
                                        fileName: "[project]/src/components/gtoc/sceneParts/HUD.tsx",
                                        lineNumber: 336,
                                        columnNumber: 44
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/gtoc/sceneParts/HUD.tsx",
                                    lineNumber: 332,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setJD((p)=>clamp(p + stepDays, jdMin, jdMax)),
                                    className: "h-8 px-2 rounded-md border border-white/15 hover:bg-white/10 text-white/90",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(IconNext, {}, void 0, false, {
                                        fileName: "[project]/src/components/gtoc/sceneParts/HUD.tsx",
                                        lineNumber: 342,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/gtoc/sceneParts/HUD.tsx",
                                    lineNumber: 338,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/gtoc/sceneParts/HUD.tsx",
                            lineNumber: 325,
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
                                            lineNumber: 348,
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
                                            lineNumber: 349,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/gtoc/sceneParts/HUD.tsx",
                                    lineNumber: 347,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "hidden sm:flex items-center gap-2 text-xs text-white/80",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "Step"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/gtoc/sceneParts/HUD.tsx",
                                            lineNumber: 360,
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
                                            lineNumber: 361,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "d"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/gtoc/sceneParts/HUD.tsx",
                                            lineNumber: 373,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/gtoc/sceneParts/HUD.tsx",
                                    lineNumber: 359,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/gtoc/sceneParts/HUD.tsx",
                            lineNumber: 346,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/gtoc/sceneParts/HUD.tsx",
                    lineNumber: 317,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/gtoc/sceneParts/HUD.tsx",
                lineNumber: 316,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/gtoc/sceneParts/HUD.tsx",
        lineNumber: 198,
        columnNumber: 5
    }, this);
}
_s(HUD, "9Wxgm05bgUdY8wauQuv5ILEbE6Y=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$useMovieStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMovieStore"]
    ];
});
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
"[project]/src/components/gtoc/KeplerSolver.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "keplerToPositionAU",
    ()=>keplerToPositionAU,
    "solveKepler",
    ()=>solveKepler
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/build/three.core.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/gtoc/utils/constants.ts [app-client] (ecmascript)");
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
    if (e === 1) return M;
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
function keplerToPositionAU(body, jd, out) {
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
    if (!out) out = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"]();
    return out.set(x, y, z);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/gtoc/sceneParts/InstancedBodies.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>InstancedBodies
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/build/three.core.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$f8cd670d$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__D__as__useFrame$3e$__ = __turbopack_context__.i("[project]/node_modules/@react-three/fiber/dist/events-f8cd670d.esm.js [app-client] (ecmascript) <export D as useFrame>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$f8cd670d$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__C__as__useThree$3e$__ = __turbopack_context__.i("[project]/node_modules/@react-three/fiber/dist/events-f8cd670d.esm.js [app-client] (ecmascript) <export C as useThree>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$web$2f$Html$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@react-three/drei/web/Html.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$KeplerSolver$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/gtoc/KeplerSolver.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$planetStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/gtoc/stores/planetStore.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
/* ---------- reusable scratch objects (module-level, never GC'd) ---------- */ const _mat4 = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Matrix4"]();
const _pos = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"]();
const _color = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Color"]();
const _scale = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](1, 1, 1);
const _quat = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Quaternion"]();
/* ---------- Body tooltip (rendered only for hovered/pinned body) ---------- */ function BodyTooltip({ body, position, pinned, onTogglePin, onCenter, onPointerEnter, onPointerLeave }) {
    _s();
    const displayName = body.name && body.name !== "None" ? body.name : `#${body.id}`;
    const bodyColor = body.color ?? "#ffffff";
    const { camera } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$f8cd670d$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__C__as__useThree$3e$__["useThree"])();
    const distance = camera.position.length();
    const opacity = Math.max(0.6, 1 - distance / 20);
    const a_AU = Number.isFinite(body.a_AU) ? Math.max(1e-6, body.a_AU) : 1;
    const e = Number.isFinite(body.e) ? body.e : 0;
    const Ω = Number.isFinite(body.Omega) ? body.Omega : 0;
    const i = Number.isFinite(body.inc) ? body.inc : 0;
    const ω = Number.isFinite(body.omega) ? body.omega : 0;
    const M0 = Number.isFinite(body.M0) ? body.M0 : 0;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$web$2f$Html$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Html"], {
        position: position.clone().add(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](0, 0.025, 0)),
        style: {
            pointerEvents: "none"
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            onMouseEnter: onPointerEnter,
            onMouseLeave: onPointerLeave,
            className: "pointer-events-auto relative p-2 rounded-lg text-[11px] leading-tight text-white backdrop-blur-md bg-black/80 border border-white/20 shadow-lg whitespace-nowrap select-none group",
            style: {
                minWidth: "120px",
                transform: "translate(-50%, -100%)",
                marginTop: "-10px"
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: (e)=>{
                        e.stopPropagation();
                        onTogglePin();
                    },
                    className: `absolute top-1 right-1 p-1 rounded-md transition-colors ${pinned ? "bg-white/20 text-white" : "text-white/40 hover:text-white hover:bg-white/10"}`,
                    title: pinned ? "Unpin" : "Pin",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                        width: "12",
                        height: "12",
                        viewBox: "0 0 24 24",
                        fill: pinned ? "currentColor" : "none",
                        stroke: "currentColor",
                        strokeWidth: "2",
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                d: "M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4a2 2 0 0 0-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58s1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41s-.23-1.06-.59-1.42z"
                            }, void 0, false, {
                                fileName: "[project]/src/components/gtoc/sceneParts/InstancedBodies.tsx",
                                lineNumber: 63,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                cx: "9",
                                cy: "9",
                                r: "2"
                            }, void 0, false, {
                                fileName: "[project]/src/components/gtoc/sceneParts/InstancedBodies.tsx",
                                lineNumber: 64,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/gtoc/sceneParts/InstancedBodies.tsx",
                        lineNumber: 62,
                        columnNumber: 21
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/gtoc/sceneParts/InstancedBodies.tsx",
                    lineNumber: 57,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: (e)=>{
                        e.stopPropagation();
                        onCenter();
                    },
                    className: "absolute top-1 right-6 p-1 rounded-md text-white/40 hover:text-white hover:bg-white/10 transition-colors",
                    title: "Set as Center",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                        width: "12",
                        height: "12",
                        viewBox: "0 0 24 24",
                        fill: "none",
                        stroke: "currentColor",
                        strokeWidth: "2",
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                cx: "12",
                                cy: "12",
                                r: "10"
                            }, void 0, false, {
                                fileName: "[project]/src/components/gtoc/sceneParts/InstancedBodies.tsx",
                                lineNumber: 74,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                x1: "12",
                                y1: "8",
                                x2: "12",
                                y2: "16"
                            }, void 0, false, {
                                fileName: "[project]/src/components/gtoc/sceneParts/InstancedBodies.tsx",
                                lineNumber: 75,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                x1: "8",
                                y1: "12",
                                x2: "16",
                                y2: "12"
                            }, void 0, false, {
                                fileName: "[project]/src/components/gtoc/sceneParts/InstancedBodies.tsx",
                                lineNumber: 76,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/gtoc/sceneParts/InstancedBodies.tsx",
                        lineNumber: 73,
                        columnNumber: 21
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/gtoc/sceneParts/InstancedBodies.tsx",
                    lineNumber: 68,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "font-semibold text-[#ffd500] pr-6",
                    children: displayName
                }, void 0, false, {
                    fileName: "[project]/src/components/gtoc/sceneParts/InstancedBodies.tsx",
                    lineNumber: 80,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-gray-300",
                    children: body.type
                }, void 0, false, {
                    fileName: "[project]/src/components/gtoc/sceneParts/InstancedBodies.tsx",
                    lineNumber: 81,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mt-1 text-[10px] text-gray-400",
                    children: [
                        "a=",
                        a_AU.toFixed(3),
                        " AU",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                            fileName: "[project]/src/components/gtoc/sceneParts/InstancedBodies.tsx",
                            lineNumber: 84,
                            columnNumber: 43
                        }, this),
                        "e=",
                        e.toFixed(3),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                            fileName: "[project]/src/components/gtoc/sceneParts/InstancedBodies.tsx",
                            lineNumber: 85,
                            columnNumber: 37
                        }, this),
                        "i=",
                        (i * 180 / Math.PI).toFixed(2),
                        "°",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                            fileName: "[project]/src/components/gtoc/sceneParts/InstancedBodies.tsx",
                            lineNumber: 86,
                            columnNumber: 58
                        }, this),
                        "Ω=",
                        (Ω * 180 / Math.PI).toFixed(2),
                        "°",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                            fileName: "[project]/src/components/gtoc/sceneParts/InstancedBodies.tsx",
                            lineNumber: 87,
                            columnNumber: 58
                        }, this),
                        "ω=",
                        (ω * 180 / Math.PI).toFixed(2),
                        "°",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                            fileName: "[project]/src/components/gtoc/sceneParts/InstancedBodies.tsx",
                            lineNumber: 88,
                            columnNumber: 58
                        }, this),
                        "M₀=",
                        (M0 * 180 / Math.PI).toFixed(2),
                        "°"
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/gtoc/sceneParts/InstancedBodies.tsx",
                    lineNumber: 83,
                    columnNumber: 17
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/gtoc/sceneParts/InstancedBodies.tsx",
            lineNumber: 51,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/gtoc/sceneParts/InstancedBodies.tsx",
        lineNumber: 50,
        columnNumber: 9
    }, this);
}
_s(BodyTooltip, "44XKsTesKVjIHDbH9uQR1TSiqHg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$f8cd670d$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__C__as__useThree$3e$__["useThree"]
    ];
});
_c = BodyTooltip;
/* ---------- Small label (planet name / selected body label) ---------- */ function BodyLabel({ body, position, isSelected }) {
    _s1();
    const displayName = body.name && body.name !== "None" ? body.name : `#${body.id}`;
    const bodyColor = body.color ?? "#ffffff";
    const { camera } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$f8cd670d$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__C__as__useThree$3e$__["useThree"])();
    const distance = camera.position.length();
    const opacity = Math.max(0.6, 1 - distance / 20);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$web$2f$Html$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Html"], {
        center: true,
        position: position.clone().add(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](0, 0.07, 0)),
        style: {
            pointerEvents: "none"
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "rounded-md font-semibold select-none",
            style: {
                padding: "3px 6px",
                fontSize: isSelected ? "18px" : "11px",
                color: isSelected ? bodyColor : "#eee",
                background: isSelected ? "rgba(0,0,0,0.45)" : "rgba(0,0,0,0.25)",
                border: "1px solid rgba(255,255,255,0.1)",
                textShadow: `0 0 10px ${bodyColor}88`,
                backdropFilter: "blur(6px)",
                opacity
            },
            children: displayName
        }, void 0, false, {
            fileName: "[project]/src/components/gtoc/sceneParts/InstancedBodies.tsx",
            lineNumber: 114,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/gtoc/sceneParts/InstancedBodies.tsx",
        lineNumber: 113,
        columnNumber: 9
    }, this);
}
_s1(BodyLabel, "44XKsTesKVjIHDbH9uQR1TSiqHg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$f8cd670d$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__C__as__useThree$3e$__["useThree"]
    ];
});
_c1 = BodyLabel;
function InstancedBodies({ bodies, jd }) {
    _s2();
    const meshRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const { raycaster, camera, pointer } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$f8cd670d$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__C__as__useThree$3e$__["useThree"])();
    const selectedBodies = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$planetStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePlanetStore"])({
        "InstancedBodies.usePlanetStore[selectedBodies]": (s)=>s.selectedBodies
    }["InstancedBodies.usePlanetStore[selectedBodies]"]);
    const setCenterBody = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$planetStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePlanetStore"])({
        "InstancedBodies.usePlanetStore[setCenterBody]": (s)=>s.setCenterBody
    }["InstancedBodies.usePlanetStore[setCenterBody]"]);
    const setHoveredContext = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$planetStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePlanetStore"])({
        "InstancedBodies.usePlanetStore[setHoveredContext]": (s)=>s.setHoveredContext
    }["InstancedBodies.usePlanetStore[setHoveredContext]"]);
    const [hoveredIdx, setHoveredIdx] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [pinnedIdx, setPinnedIdx] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const hoverTimeoutRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Per-body position cache (updated every frame in useFrame)
    const positionsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(new Float32Array(0));
    // Keep positions buffer sized correctly
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "InstancedBodies.useEffect": ()=>{
            if (bodies.length * 3 !== positionsRef.current.length) {
                positionsRef.current = new Float32Array(bodies.length * 3);
            }
        }
    }["InstancedBodies.useEffect"], [
        bodies.length
    ]);
    // Body index → selection set (for O(1) lookup)
    const selectedSet = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "InstancedBodies.useMemo[selectedSet]": ()=>{
            const set = new Set();
            for (const id of selectedBodies)set.add(id);
            return set;
        }
    }["InstancedBodies.useMemo[selectedSet]"], [
        selectedBodies
    ]);
    // Set per-instance colors once (or when bodies/colors change)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "InstancedBodies.useEffect": ()=>{
            const mesh = meshRef.current;
            if (!mesh || bodies.length === 0) return;
            for(let i = 0; i < bodies.length; i++){
                const b = bodies[i];
                const idKey = String(b.id);
                const isSelected = selectedSet.has(idKey) || selectedSet.has(b.name);
                _color.set(b.color ?? "#ffffff");
                // Emissive-like boost for selected
                if (isSelected) {
                    _color.lerp(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Color"]("#ffd500"), 0.4);
                }
                mesh.setColorAt(i, _color);
            }
            if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
        }
    }["InstancedBodies.useEffect"], [
        bodies,
        selectedSet
    ]);
    // Main per-frame loop: update all instance matrices from Kepler
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$f8cd670d$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__D__as__useFrame$3e$__["useFrame"])({
        "InstancedBodies.useFrame": ()=>{
            const mesh = meshRef.current;
            if (!mesh || bodies.length === 0) return;
            const positions = positionsRef.current;
            for(let i = 0; i < bodies.length; i++){
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$KeplerSolver$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["keplerToPositionAU"])(bodies[i], jd, _pos);
                // Store position for tooltip/label lookups
                positions[i * 3] = _pos.x;
                positions[i * 3 + 1] = _pos.y;
                positions[i * 3 + 2] = _pos.z;
                _mat4.compose(_pos, _quat, _scale);
                mesh.setMatrixAt(i, _mat4);
            }
            mesh.instanceMatrix.needsUpdate = true;
        }
    }["InstancedBodies.useFrame"]);
    // Click handler
    const handleClick = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "InstancedBodies.useCallback[handleClick]": (e)=>{
            e.stopPropagation();
            const idx = e.instanceId;
            if (idx == null || idx >= bodies.length) return;
            const b = bodies[idx];
            if (pinnedIdx === idx) {
                setPinnedIdx(null);
            } else {
                setPinnedIdx(idx);
                setCenterBody(b.id);
            }
        }
    }["InstancedBodies.useCallback[handleClick]"], [
        bodies,
        pinnedIdx,
        setCenterBody
    ]);
    const handlePointerOver = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "InstancedBodies.useCallback[handlePointerOver]": (e)=>{
            e.stopPropagation();
            const idx = e.instanceId;
            if (idx == null || idx >= bodies.length) return;
            if (hoverTimeoutRef.current) {
                clearTimeout(hoverTimeoutRef.current);
                hoverTimeoutRef.current = null;
            }
            setHoveredIdx(idx);
            const b = bodies[idx];
            setHoveredContext({
                id: String(b.id),
                name: b.name || `Body ${b.id}`,
                type: "planet"
            });
        }
    }["InstancedBodies.useCallback[handlePointerOver]"], [
        bodies,
        setHoveredContext
    ]);
    const handlePointerOut = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "InstancedBodies.useCallback[handlePointerOut]": (e)=>{
            e.stopPropagation();
            if (pinnedIdx != null) return;
            hoverTimeoutRef.current = setTimeout({
                "InstancedBodies.useCallback[handlePointerOut]": ()=>{
                    setHoveredIdx(null);
                    setHoveredContext(null);
                }
            }["InstancedBodies.useCallback[handlePointerOut]"], 2000);
        }
    }["InstancedBodies.useCallback[handlePointerOut]"], [
        pinnedIdx,
        setHoveredContext
    ]);
    // Helper to get current position for a body index
    const getBodyPos = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "InstancedBodies.useCallback[getBodyPos]": (idx)=>{
            const p = positionsRef.current;
            return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](p[idx * 3], p[idx * 3 + 1], p[idx * 3 + 2]);
        }
    }["InstancedBodies.useCallback[getBodyPos]"], []);
    const isVisible = hoveredIdx != null || pinnedIdx != null;
    const tooltipIdx = pinnedIdx ?? hoveredIdx;
    // Determine which bodies need name labels (planets + selected, but NOT the one showing tooltip)
    const labelIndices = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "InstancedBodies.useMemo[labelIndices]": ()=>{
            const out = [];
            for(let i = 0; i < bodies.length; i++){
                const b = bodies[i];
                const idKey = String(b.name && b.name !== "None" ? b.name : b.id);
                const isSelected = selectedSet.has(idKey);
                const showLabel = isSelected || b.type === "Planet";
                if (showLabel && i !== tooltipIdx) out.push(i);
            }
            return out;
        }
    }["InstancedBodies.useMemo[labelIndices]"], [
        bodies,
        selectedSet,
        tooltipIdx
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("instancedMesh", {
                ref: meshRef,
                args: [
                    undefined,
                    undefined,
                    bodies.length
                ],
                frustumCulled: false,
                onClick: handleClick,
                onPointerOver: handlePointerOver,
                onPointerOut: handlePointerOut,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("sphereGeometry", {
                        args: [
                            0.015,
                            12,
                            12
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/gtoc/sceneParts/InstancedBodies.tsx",
                        lineNumber: 303,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshBasicMaterial", {
                        color: "#ffffff",
                        toneMapped: false
                    }, void 0, false, {
                        fileName: "[project]/src/components/gtoc/sceneParts/InstancedBodies.tsx",
                        lineNumber: 304,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/gtoc/sceneParts/InstancedBodies.tsx",
                lineNumber: 295,
                columnNumber: 13
            }, this),
            tooltipIdx != null && tooltipIdx < bodies.length && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(BodyTooltip, {
                body: bodies[tooltipIdx],
                position: getBodyPos(tooltipIdx),
                pinned: pinnedIdx === tooltipIdx,
                onTogglePin: ()=>{
                    if (pinnedIdx === tooltipIdx) {
                        setPinnedIdx(null);
                    } else {
                        setPinnedIdx(tooltipIdx);
                        setCenterBody(bodies[tooltipIdx].id);
                    }
                },
                onCenter: ()=>setCenterBody(bodies[tooltipIdx].id),
                onPointerEnter: ()=>{
                    if (hoverTimeoutRef.current) {
                        clearTimeout(hoverTimeoutRef.current);
                        hoverTimeoutRef.current = null;
                    }
                },
                onPointerLeave: ()=>{
                    if (pinnedIdx != null) return;
                    hoverTimeoutRef.current = setTimeout(()=>{
                        setHoveredIdx(null);
                        setHoveredContext(null);
                    }, 2000);
                }
            }, void 0, false, {
                fileName: "[project]/src/components/gtoc/sceneParts/InstancedBodies.tsx",
                lineNumber: 312,
                columnNumber: 17
            }, this),
            labelIndices.map((idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(BodyLabel, {
                    body: bodies[idx],
                    position: getBodyPos(idx),
                    isSelected: selectedSet.has(String(bodies[idx].name && bodies[idx].name !== "None" ? bodies[idx].name : bodies[idx].id))
                }, bodies[idx].id, false, {
                    fileName: "[project]/src/components/gtoc/sceneParts/InstancedBodies.tsx",
                    lineNumber: 343,
                    columnNumber: 17
                }, this))
        ]
    }, void 0, true);
}
_s2(InstancedBodies, "t2+Vyx7PCoJE2WJmQD17mMxmhCM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$f8cd670d$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__C__as__useThree$3e$__["useThree"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$planetStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePlanetStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$planetStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePlanetStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$planetStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePlanetStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$f8cd670d$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__D__as__useFrame$3e$__["useFrame"]
    ];
});
_c2 = InstancedBodies;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "BodyTooltip");
__turbopack_context__.k.register(_c1, "BodyLabel");
__turbopack_context__.k.register(_c2, "InstancedBodies");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/gtoc/sceneParts/MergedOrbitPaths.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MergedOrbitPaths
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/build/three.core.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/gtoc/utils/constants.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const SEGMENTS = 256;
/**
 * Computes orbit points for a single body (pure function, no React).
 * Returns null if the orbit is invalid (e.g. hyperbolic, degenerate).
 */ function computeOrbitPoints(body, segments) {
    const a = body.a_AU;
    const e = body.e;
    if (!Number.isFinite(a) || a <= 0 || !Number.isFinite(e) || e >= 1) return null;
    const a_km = a * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AU_KM"];
    const cO = Math.cos(body.Omega), sO = Math.sin(body.Omega), ci = Math.cos(body.inc), si = Math.sin(body.inc), co = Math.cos(body.omega), so = Math.sin(body.omega);
    const R11 = cO * co - sO * so * ci;
    const R12 = -cO * so - sO * co * ci;
    const R21 = sO * co + cO * so * ci;
    const R22 = -sO * so + cO * co * ci;
    const R31 = so * si;
    const R32 = co * si;
    // +1 to close the loop
    const out = new Float32Array((segments + 1) * 3);
    let valid = 0;
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
        if (Number.isFinite(x + y + z)) {
            out[valid * 3] = x;
            out[valid * 3 + 1] = y;
            out[valid * 3 + 2] = z;
            valid++;
        }
    }
    return valid >= 2 ? out.slice(0, valid * 3) : null;
}
function MergedOrbitPaths({ bodies, selectedBodies, showOrbits, colorMap }) {
    _s();
    const groupRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const selectedSet = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "MergedOrbitPaths.useMemo[selectedSet]": ()=>new Set(selectedBodies)
    }["MergedOrbitPaths.useMemo[selectedSet]"], [
        selectedBodies
    ]);
    // Determine which bodies should have orbits visible
    const visibleBodies = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "MergedOrbitPaths.useMemo[visibleBodies]": ()=>{
            if (!showOrbits) return [];
            return bodies.filter({
                "MergedOrbitPaths.useMemo[visibleBodies]": (b)=>{
                    const idKey = String(b.name && b.name !== "None" ? b.name : b.id);
                    return b.type === "Planet" || selectedSet.has(idKey);
                }
            }["MergedOrbitPaths.useMemo[visibleBodies]"]);
        }
    }["MergedOrbitPaths.useMemo[visibleBodies]"], [
        bodies,
        showOrbits,
        selectedSet
    ]);
    // Build merged geometry
    const geometry = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "MergedOrbitPaths.useMemo[geometry]": ()=>{
            if (visibleBodies.length === 0) return null;
            // Pre-compute all orbits
            const orbits = [];
            for (const b of visibleBodies){
                const pts = computeOrbitPoints(b, SEGMENTS);
                if (!pts) continue;
                const idKey = String(b.id);
                const isSelected = selectedSet.has(String(b.name && b.name !== "None" ? b.name : b.id));
                const activeColor = colorMap.get(idKey) ?? b.color ?? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TYPE_COLORS"][b.type] ?? "#ffffff";
                const color = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Color"](activeColor);
                orbits.push({
                    points: pts,
                    color,
                    lineWidth: isSelected ? 2.5 : 1
                });
            }
            if (orbits.length === 0) return null;
            // Convert closed polylines to line-segment pairs for LineSegments
            // Each orbit of N vertices → (N-1) line segments → (N-1)*2 vertices
            let totalVertices = 0;
            for (const o of orbits){
                const nPts = o.points.length / 3;
                totalVertices += (nPts - 1) * 2;
            }
            const positions = new Float32Array(totalVertices * 3);
            const colors = new Float32Array(totalVertices * 3);
            let offset = 0;
            for (const o of orbits){
                const nPts = o.points.length / 3;
                const r = o.color.r, g = o.color.g, b = o.color.b;
                for(let k = 0; k < nPts - 1; k++){
                    const i0 = k * 3;
                    const i1 = (k + 1) * 3;
                    // Start vertex
                    positions[offset * 3] = o.points[i0];
                    positions[offset * 3 + 1] = o.points[i0 + 1];
                    positions[offset * 3 + 2] = o.points[i0 + 2];
                    colors[offset * 3] = r;
                    colors[offset * 3 + 1] = g;
                    colors[offset * 3 + 2] = b;
                    offset++;
                    // End vertex
                    positions[offset * 3] = o.points[i1];
                    positions[offset * 3 + 1] = o.points[i1 + 1];
                    positions[offset * 3 + 2] = o.points[i1 + 2];
                    colors[offset * 3] = r;
                    colors[offset * 3 + 1] = g;
                    colors[offset * 3 + 2] = b;
                    offset++;
                }
            }
            const geo = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BufferGeometry"]();
            geo.setAttribute("position", new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BufferAttribute"](positions, 3));
            geo.setAttribute("color", new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BufferAttribute"](colors, 3));
            return geo;
        }
    }["MergedOrbitPaths.useMemo[geometry]"], [
        visibleBodies,
        colorMap,
        selectedSet
    ]);
    if (!geometry) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        ref: groupRef,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("lineSegments", {
            geometry: geometry,
            frustumCulled: false,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("lineBasicMaterial", {
                vertexColors: true,
                transparent: true,
                opacity: 0.7,
                depthWrite: false,
                toneMapped: false
            }, void 0, false, {
                fileName: "[project]/src/components/gtoc/sceneParts/MergedOrbitPaths.tsx",
                lineNumber: 163,
                columnNumber: 17
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/gtoc/sceneParts/MergedOrbitPaths.tsx",
            lineNumber: 162,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/gtoc/sceneParts/MergedOrbitPaths.tsx",
        lineNumber: 161,
        columnNumber: 9
    }, this);
}
_s(MergedOrbitPaths, "XP7f/HjK+LTmHmr4na6YJqo/8YI=");
_c = MergedOrbitPaths;
var _c;
__turbopack_context__.k.register(_c, "MergedOrbitPaths");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/gtoc/sceneParts/SceneHelpers.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Axes",
    ()=>Axes,
    "CameraRig",
    ()=>CameraRig,
    "Sun",
    ()=>Sun
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$f8cd670d$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__C__as__useThree$3e$__ = __turbopack_context__.i("[project]/node_modules/@react-three/fiber/dist/events-f8cd670d.esm.js [app-client] (ecmascript) <export C as useThree>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$Line$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@react-three/drei/core/Line.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/build/three.core.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
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
                fileName: "[project]/src/components/gtoc/sceneParts/SceneHelpers.tsx",
                lineNumber: 11,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshBasicMaterial", {
                color: "#ffcc66"
            }, void 0, false, {
                fileName: "[project]/src/components/gtoc/sceneParts/SceneHelpers.tsx",
                lineNumber: 12,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/gtoc/sceneParts/SceneHelpers.tsx",
        lineNumber: 10,
        columnNumber: 9
    }, this);
}
_c = Sun;
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
                fileName: "[project]/src/components/gtoc/sceneParts/SceneHelpers.tsx",
                lineNumber: 20,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$Line$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Line"], {
                points: [
                    new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](0, 0, 0),
                    new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](0, size, 0)
                ],
                color: "#55ff55",
                lineWidth: 1
            }, void 0, false, {
                fileName: "[project]/src/components/gtoc/sceneParts/SceneHelpers.tsx",
                lineNumber: 21,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$Line$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Line"], {
                points: [
                    new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](0, 0, 0),
                    new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](0, 0, size)
                ],
                color: "#5555ff",
                lineWidth: 1
            }, void 0, false, {
                fileName: "[project]/src/components/gtoc/sceneParts/SceneHelpers.tsx",
                lineNumber: 22,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/gtoc/sceneParts/SceneHelpers.tsx",
        lineNumber: 19,
        columnNumber: 9
    }, this);
}
_c1 = Axes;
function CameraRig() {
    _s();
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
_s(CameraRig, "Wo14/kl28HhoRfDX+Cg7MK2EhFU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$f8cd670d$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__C__as__useThree$3e$__["useThree"]
    ];
});
_c2 = CameraRig;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "Sun");
__turbopack_context__.k.register(_c1, "Axes");
__turbopack_context__.k.register(_c2, "CameraRig");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/gtoc/sceneParts/KeyframeCameraDriver.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "KeyframeCameraDriver",
    ()=>KeyframeCameraDriver
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$f8cd670d$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__D__as__useFrame$3e$__ = __turbopack_context__.i("[project]/node_modules/@react-three/fiber/dist/events-f8cd670d.esm.js [app-client] (ecmascript) <export D as useFrame>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$f8cd670d$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__C__as__useThree$3e$__ = __turbopack_context__.i("[project]/node_modules/@react-three/fiber/dist/events-f8cd670d.esm.js [app-client] (ecmascript) <export C as useThree>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/build/three.core.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$useMovieStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/gtoc/stores/useMovieStore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$planetStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/gtoc/stores/planetStore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$KeplerSolver$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/gtoc/KeplerSolver.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$solutions$2f$useSolutions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/gtoc/solutions/useSolutions.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
;
;
function KeyframeCameraDriver({ controlsRef, jd, isPlaying = false }) {
    _s();
    const { camera } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$f8cd670d$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__C__as__useThree$3e$__["useThree"])();
    const { keyframes, isMovieMode, isPresentationMode, isRecording, captureKeyframeTrigger, addKeyframe, updateKeyframe, setNearbyKeyframeId, nearbyKeyframeId } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$useMovieStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMovieStore"])();
    const { centerBodyId, setCenterBody, planets } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$planetStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePlanetStore"])();
    const { solutions } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$solutions$2f$useSolutions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSolutions"])();
    const lastCaptureTrigger = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    // O(1) lookup maps (rebuilt only when data changes)
    const planetMap = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useMemo({
        "KeyframeCameraDriver.useMemo[planetMap]": ()=>{
            const m = new Map();
            for (const p of planets){
                m.set(String(p.id), p);
                if (p.name) m.set(String(p.name), p);
            }
            return m;
        }
    }["KeyframeCameraDriver.useMemo[planetMap]"], [
        planets
    ]);
    const solutionMap = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useMemo({
        "KeyframeCameraDriver.useMemo[solutionMap]": ()=>{
            const m = new Map();
            for (const s of solutions)m.set(s.id, s);
            return m;
        }
    }["KeyframeCameraDriver.useMemo[solutionMap]"], [
        solutions
    ]);
    // Scratch vectors — reused across frames, never GC'd
    const _scratchPos = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useRef(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"]()).current;
    const _p0 = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useRef(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"]()).current;
    const _p1 = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useRef(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"]()).current;
    // Helper: Get global position of a body (or Sun origin) at a given JD
    const getGlobalBodyPos = (id, tJD)=>{
        if (!id) return _scratchPos.set(0, 0, 0);
        // Check Planets (O(1) map lookup)
        const planet = planetMap.get(id);
        if (planet) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$KeplerSolver$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["keplerToPositionAU"])(planet, tJD, _scratchPos);
        }
        // Check Solutions (Ships)
        const sol = solutionMap.get(id);
        if (sol && sol.samples.length > 0) {
            const samples = sol.samples;
            if (tJD < samples[0].t) return _scratchPos.fromArray(samples[0].p);
            if (tJD > samples[samples.length - 1].t) return _scratchPos.fromArray(samples[samples.length - 1].p);
            // Binary search
            let low = 0, high = samples.length - 1;
            while(low <= high){
                const mid = low + high >>> 1;
                if (samples[mid].t < tJD) low = mid + 1;
                else high = mid - 1;
            }
            const idx = Math.max(0, Math.min(samples.length - 1, low));
            const prev = samples[idx - 1] || samples[0];
            const next = samples[idx];
            if (prev === next) return _scratchPos.fromArray(prev.p);
            const factor = (tJD - prev.t) / (next.t - prev.t);
            _p0.fromArray(prev.p);
            _p1.fromArray(next.p);
            return _scratchPos.copy(_p0).lerp(_p1, factor);
        }
        return _scratchPos.set(0, 0, 0);
    };
    // Track nearby keyframe for UI feedback
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$f8cd670d$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__D__as__useFrame$3e$__["useFrame"])({
        "KeyframeCameraDriver.useFrame": ()=>{
            const NEARBY_THRESHOLD = 0.5; // days
            const nearby = keyframes.find({
                "KeyframeCameraDriver.useFrame.nearby": (k)=>Math.abs(k.jd - jd) < NEARBY_THRESHOLD
            }["KeyframeCameraDriver.useFrame.nearby"]);
            const newId = nearby ? nearby.id : null;
            // Only update store if changed to avoid renders
            if (newId !== nearbyKeyframeId) {
                // Defer update to avoid "setState during render" conflicts
                setTimeout({
                    "KeyframeCameraDriver.useFrame": ()=>setNearbyKeyframeId(newId)
                }["KeyframeCameraDriver.useFrame"], 0);
            }
        }
    }["KeyframeCameraDriver.useFrame"]);
    // Capture Effect
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$f8cd670d$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__D__as__useFrame$3e$__["useFrame"])({
        "KeyframeCameraDriver.useFrame": ()=>{
            if (captureKeyframeTrigger > lastCaptureTrigger.current) {
                lastCaptureTrigger.current = captureKeyframeTrigger;
                console.log("Capturing Keyframe at JD", jd);
                if (controlsRef.current) {
                    // Check if we are updating the nearby one (preferred) or creating new
                    if (nearbyKeyframeId) {
                        console.log("Updating nearby keyframe", nearbyKeyframeId);
                        updateKeyframe(nearbyKeyframeId, {
                            position: camera.position.toArray(),
                            target: controlsRef.current.target.toArray(),
                            centerBodyId: centerBodyId // Save current center
                        });
                    } else {
                        const k = {
                            id: crypto.randomUUID(),
                            jd,
                            position: camera.position.toArray(),
                            target: controlsRef.current.target.toArray(),
                            centerBodyId: centerBodyId // Save current center
                        };
                        addKeyframe(k);
                    }
                }
            }
        }
    }["KeyframeCameraDriver.useFrame"]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$f8cd670d$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__D__as__useFrame$3e$__["useFrame"])({
        "KeyframeCameraDriver.useFrame": ()=>{
            if (!(isPresentationMode || isRecording || isMovieMode && isPlaying) || keyframes.length < 2) return;
            // Find next keyframe
            const nextIdx = keyframes.findIndex({
                "KeyframeCameraDriver.useFrame.nextIdx": (k)=>k.jd > jd
            }["KeyframeCameraDriver.useFrame.nextIdx"]);
            // If we are before first, snap to first
            if (nextIdx === 0) {
                const k = keyframes[0];
                // Force center
                if (centerBodyId !== k.centerBodyId) {
                    setTimeout({
                        "KeyframeCameraDriver.useFrame": ()=>setCenterBody(k.centerBodyId ?? null)
                    }["KeyframeCameraDriver.useFrame"], 0);
                }
                lerpCamera(camera, controlsRef.current, k.position, k.target, 1);
                return;
            }
            // If after last, snap to last
            if (nextIdx === -1) {
                const k = keyframes[keyframes.length - 1];
                if (centerBodyId !== k.centerBodyId) {
                    setTimeout({
                        "KeyframeCameraDriver.useFrame": ()=>setCenterBody(k.centerBodyId ?? null)
                    }["KeyframeCameraDriver.useFrame"], 0);
                }
                lerpCamera(camera, controlsRef.current, k.position, k.target, 1);
                return;
            }
            const prev = keyframes[nextIdx - 1];
            const next = keyframes[nextIdx];
            if (!prev || !next) return;
            // Force Center to Prev Keyframe's Center (Step Function)
            if (centerBodyId !== prev.centerBodyId) {
                setTimeout({
                    "KeyframeCameraDriver.useFrame": ()=>setCenterBody(prev.centerBodyId ?? null)
                }["KeyframeCameraDriver.useFrame"], 0);
            // Note: This might cause a 1-frame jump if the renderer reacts slowly, but usually fine in React loop
            }
            // Interpolation Progress
            const total = next.jd - prev.jd;
            const current = jd - prev.jd;
            const progress = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MathUtils"].clamp(current / total, 0, 1);
            const t = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MathUtils"].smoothstep(progress, 0, 1);
            // 1. Calculate GLOBAL positions for Prev and Next Camera/Target
            const prevOffset = getGlobalBodyPos(prev.centerBodyId, prev.jd).clone();
            const nextOffset = getGlobalBodyPos(next.centerBodyId, next.jd).clone();
            const prevCamGlobal = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"]().fromArray(prev.position).add(prevOffset);
            const prevTgtGlobal = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"]().fromArray(prev.target).add(prevOffset);
            const nextCamGlobal = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"]().fromArray(next.position).add(nextOffset);
            const nextTgtGlobal = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"]().fromArray(next.target).add(nextOffset);
            // 2. Interpolate in GLOBAL space
            const currentCamGlobal = prevCamGlobal.lerp(nextCamGlobal, t);
            const currentTgtGlobal = prevTgtGlobal.lerp(nextTgtGlobal, t);
            // 3. Convert back to LOCAL frame (determined by prev.centerBodyId at current JD)
            const currentOffset = getGlobalBodyPos(prev.centerBodyId, jd).clone();
            currentCamGlobal.sub(currentOffset);
            currentTgtGlobal.sub(currentOffset);
            // Apply
            camera.position.copy(currentCamGlobal);
            if (controlsRef.current) {
                controlsRef.current.target.copy(currentTgtGlobal);
                controlsRef.current.update();
            }
        }
    }["KeyframeCameraDriver.useFrame"]);
    return null;
}
_s(KeyframeCameraDriver, "DN+iXCf9KTxb9yJ1FVeieYz1RXQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$f8cd670d$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__C__as__useThree$3e$__["useThree"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$useMovieStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMovieStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$planetStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePlanetStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$solutions$2f$useSolutions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSolutions"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$f8cd670d$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__D__as__useFrame$3e$__["useFrame"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$f8cd670d$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__D__as__useFrame$3e$__["useFrame"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$f8cd670d$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__D__as__useFrame$3e$__["useFrame"]
    ];
});
_c = KeyframeCameraDriver;
function lerpCamera(camera, controls, posArr, targetArr, t) {
    const pos = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"]().fromArray(posArr);
    const target = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"]().fromArray(targetArr);
    // Direct set if t=1 (snap)
    camera.position.copy(pos);
    if (controls) {
        controls.target.copy(target);
        controls.update();
    }
}
var _c;
__turbopack_context__.k.register(_c, "KeyframeCameraDriver");
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
    "JD_T0",
    ()=>JD_T0,
    "buildMilestonesByStep",
    ()=>buildMilestonesByStep,
    "clamp",
    ()=>clamp,
    "dateToJD",
    ()=>dateToJD,
    "epochSecondsFromJD",
    ()=>epochSecondsFromJD,
    "jdFromEpochSeconds",
    ()=>jdFromEpochSeconds,
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
const JD_T0 = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["JD_EPOCH_0"];
function epochSecondsFromJD(jd) {
    return Math.round((jd - JD_T0) * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SECONDS_PER_DAY"]);
}
function jdFromEpochSeconds(tSec) {
    return JD_T0 + tSec / __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SECONDS_PER_DAY"];
}
function useSimClock(opts = {}) {
    _s();
    const { jd0, jdMin, jdMax, milestones, snapPlayToMilestones = false, milestoneStepsPerSec = 2, playing = true, startPlaying, rate0 = 50 } = opts;
    // ✅ Default to file epoch (JD_EPOCH_0) rather than wall-clock "now"
    const [jd, _setJD] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "useSimClock.useState": ()=>clamp(jd0 ?? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["JD_EPOCH_0"], jdMin, jdMax)
    }["useSimClock.useState"]);
    const [isPlaying, _setPlaying] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(startPlaying ?? playing);
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
_s(useSimClock, "4TZijd0xvaugwK43PmQ4RFR/Bqg=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/gtoc/ui/ColorPickerPortal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ColorPickerPortal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react-dom/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$colorful$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-colorful/dist/index.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function ColorPickerPortal({ anchorRef, color, onChange, onClose }) {
    _s();
    const pickerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [pos, setPos] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        x: 0,
        y: 0
    });
    const [tempColor, setTempColor] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(color);
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ColorPickerPortal.useEffect": ()=>setMounted(true)
    }["ColorPickerPortal.useEffect"], []);
    // Smart positioning
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ColorPickerPortal.useEffect": ()=>{
            const el = anchorRef.current;
            if (!el) return;
            const rect = el.getBoundingClientRect();
            // Position to the right of the anchor if possible, or below
            setPos({
                x: rect.right + 10,
                y: rect.top
            });
        }
    }["ColorPickerPortal.useEffect"], [
        anchorRef
    ]);
    // Close on outside click
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ColorPickerPortal.useEffect": ()=>{
            const handleClick = {
                "ColorPickerPortal.useEffect.handleClick": (e)=>{
                    const target = e.target;
                    // We need to check if click is outside BOTH the picker AND the anchor button
                    if (pickerRef.current && !pickerRef.current.contains(target) && anchorRef.current && !anchorRef.current.contains(target)) {
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
    if (!mounted) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createPortal"])(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: pickerRef,
        className: "fixed z-[99999] p-3 rounded-lg bg-[#1a1a1a] border border-white/10 shadow-2xl backdrop-blur-md flex flex-col items-center gap-2",
        style: {
            left: pos.x,
            top: pos.y
        },
        onClick: (e)=>e.stopPropagation(),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$colorful$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HexColorPicker"], {
                color: tempColor,
                onChange: setTempColor
            }, void 0, false, {
                fileName: "[project]/src/components/gtoc/ui/ColorPickerPortal.tsx",
                lineNumber: 61,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex gap-2 w-full",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: ()=>{
                        onChange(tempColor);
                        onClose();
                    },
                    className: "flex-1 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors",
                    children: "Apply"
                }, void 0, false, {
                    fileName: "[project]/src/components/gtoc/ui/ColorPickerPortal.tsx",
                    lineNumber: 63,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/gtoc/ui/ColorPickerPortal.tsx",
                lineNumber: 62,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/gtoc/ui/ColorPickerPortal.tsx",
        lineNumber: 55,
        columnNumber: 9
    }, this), document.body);
}
_s(ColorPickerPortal, "UXLf7zCMolizcBxDqD2bwhu+gAo=");
_c = ColorPickerPortal;
var _c;
__turbopack_context__.k.register(_c, "ColorPickerPortal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/gtoc/ui/BodyListPanel.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>BodyListPanel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react-dom/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$ui$2f$ColorPickerPortal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/gtoc/ui/ColorPickerPortal.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
// Icons
const TargetIcon = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: "12",
        height: "12",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "12",
                cy: "12",
                r: "10"
            }, void 0, false, {
                fileName: "[project]/src/components/gtoc/ui/BodyListPanel.tsx",
                lineNumber: 10,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "12",
                y1: "8",
                x2: "12",
                y2: "16"
            }, void 0, false, {
                fileName: "[project]/src/components/gtoc/ui/BodyListPanel.tsx",
                lineNumber: 11,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "8",
                y1: "12",
                x2: "16",
                y2: "12"
            }, void 0, false, {
                fileName: "[project]/src/components/gtoc/ui/BodyListPanel.tsx",
                lineNumber: 12,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/gtoc/ui/BodyListPanel.tsx",
        lineNumber: 9,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
_c = TargetIcon;
function BodyListPanel({ isOpen, onClose, anchorRef, planets, selectedBodies, centerBodyId, togglePlanet, updatePlanetColor, updatePlanetTypeColor, setCenterBody, btnRefs, openPicker, setOpenPicker }) {
    _s();
    const [pos, setPos] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        x: 0,
        y: 0
    });
    const [bodyQuery, setBodyQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const panelRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "BodyListPanel.useEffect": ()=>setMounted(true)
    }["BodyListPanel.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "BodyListPanel.useEffect": ()=>{
            if (isOpen && anchorRef.current) {
                const rect = anchorRef.current.getBoundingClientRect();
                setPos({
                    x: rect.left,
                    y: rect.bottom + 8
                });
            }
        }
    }["BodyListPanel.useEffect"], [
        isOpen,
        anchorRef
    ]);
    // Close on outside click
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "BodyListPanel.useEffect": ()=>{
            if (!isOpen) return;
            const handleClick = {
                "BodyListPanel.useEffect.handleClick": (e)=>{
                    const target = e.target;
                    // Don't close if clicking inside panel OR clicking specific elements like color picker
                    const isInsidePanel = panelRef.current?.contains(target);
                    const isInsideAnchor = anchorRef.current?.contains(target);
                    const isInsideColorPicker = target.closest('.react-colorful'); // Hacky check for color picker
                    if (!isInsidePanel && !isInsideAnchor && !isInsideColorPicker) {
                        onClose();
                    }
                }
            }["BodyListPanel.useEffect.handleClick"];
            window.addEventListener("mousedown", handleClick);
            return ({
                "BodyListPanel.useEffect": ()=>window.removeEventListener("mousedown", handleClick)
            })["BodyListPanel.useEffect"];
        }
    }["BodyListPanel.useEffect"], [
        isOpen,
        onClose,
        anchorRef
    ]);
    const filteredBodies = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "BodyListPanel.useMemo[filteredBodies]": ()=>{
            const q = bodyQuery.trim().toLowerCase();
            const isNumeric = /^\d+$/.test(q);
            return planets.filter({
                "BodyListPanel.useMemo[filteredBodies]": (b)=>{
                    const name = (b.name || "").toLowerCase();
                    const type = (b.type || "").toLowerCase();
                    const hasValidName = name && name !== "none" && name !== "";
                    if (!q) return type === "planet" && hasValidName;
                    if (!isNumeric) return type === "planet" && hasValidName && name.includes(q);
                    return String(b.id ?? "").toLowerCase().includes(q);
                }
            }["BodyListPanel.useMemo[filteredBodies]"]);
        }
    }["BodyListPanel.useMemo[filteredBodies]"], [
        planets,
        bodyQuery
    ]);
    if (!mounted || !isOpen) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createPortal"])(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: panelRef,
        className: "fixed z-[9999] w-[400px] max-h-[50vh] flex flex-col bg-[#0a0a0c]/95 border border-white/10 backdrop-blur-xl rounded-lg shadow-2xl overflow-hidden",
        style: {
            left: pos.x,
            top: pos.y
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-3 border-b border-white/10 flex flex-col gap-2 bg-white/5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-[10px] uppercase tracking-wider font-bold text-white/50",
                                children: "Details"
                            }, void 0, false, {
                                fileName: "[project]/src/components/gtoc/ui/BodyListPanel.tsx",
                                lineNumber: 104,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: onClose,
                                className: "text-white/30 hover:text-white",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    width: "14",
                                    height: "14",
                                    viewBox: "0 0 24 24",
                                    fill: "none",
                                    stroke: "currentColor",
                                    strokeWidth: "2",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        d: "M18 6L6 18M6 6l12 12"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/gtoc/ui/BodyListPanel.tsx",
                                        lineNumber: 105,
                                        columnNumber: 188
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/gtoc/ui/BodyListPanel.tsx",
                                    lineNumber: 105,
                                    columnNumber: 90
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/gtoc/ui/BodyListPanel.tsx",
                                lineNumber: 105,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/gtoc/ui/BodyListPanel.tsx",
                        lineNumber: 103,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-2 mb-1",
                        children: [
                            "Planet",
                            "Asteroid",
                            "Comet"
                        ].map((type)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                ref: (el)=>{
                                    btnRefs.current[`group-${type}`] = el;
                                },
                                onClick: (e)=>{
                                    e.stopPropagation();
                                    setOpenPicker(openPicker === `group-${type}` ? null : `group-${type}`);
                                },
                                className: "flex-1 flex items-center justify-center gap-1.5 py-1 rounded bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-[10px] text-white/60",
                                title: `Color All ${type}s`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-2 h-2 rounded-full shadow-sm",
                                        style: {
                                            backgroundColor: type === "Planet" ? "#4da6ff" : type === "Asteroid" ? "#888" : "#ffcc00"
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/gtoc/ui/BodyListPanel.tsx",
                                        lineNumber: 121,
                                        columnNumber: 29
                                    }, this),
                                    type,
                                    "s"
                                ]
                            }, type, true, {
                                fileName: "[project]/src/components/gtoc/ui/BodyListPanel.tsx",
                                lineNumber: 111,
                                columnNumber: 25
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/components/gtoc/ui/BodyListPanel.tsx",
                        lineNumber: 109,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "text",
                                value: bodyQuery,
                                onChange: (e)=>setBodyQuery(e.target.value),
                                placeholder: "Search Name or ID...",
                                className: "w-full bg-black/40 border border-white/10 rounded px-3 py-1.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-emerald-500/50",
                                autoFocus: true
                            }, void 0, false, {
                                fileName: "[project]/src/components/gtoc/ui/BodyListPanel.tsx",
                                lineNumber: 129,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                className: "absolute right-2.5 top-2 w-3.5 h-3.5 text-white/20",
                                viewBox: "0 0 24 24",
                                fill: "none",
                                stroke: "currentColor",
                                strokeWidth: "2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                        cx: "11",
                                        cy: "11",
                                        r: "8"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/gtoc/ui/BodyListPanel.tsx",
                                        lineNumber: 137,
                                        columnNumber: 159
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                        x1: "21",
                                        y1: "21",
                                        x2: "16.65",
                                        y2: "16.65"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/gtoc/ui/BodyListPanel.tsx",
                                        lineNumber: 137,
                                        columnNumber: 198
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/gtoc/ui/BodyListPanel.tsx",
                                lineNumber: 137,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/gtoc/ui/BodyListPanel.tsx",
                        lineNumber: 128,
                        columnNumber: 17
                    }, this),
                    [
                        "Planet",
                        "Asteroid",
                        "Comet"
                    ].map((type)=>openPicker === `group-${type}` && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$ui$2f$ColorPickerPortal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            anchorRef: {
                                current: btnRefs.current[`group-${type}`]
                            },
                            color: "#ffffff",
                            onChange: (c)=>updatePlanetTypeColor(type, c),
                            onClose: ()=>setOpenPicker(null)
                        }, type, false, {
                            fileName: "[project]/src/components/gtoc/ui/BodyListPanel.tsx",
                            lineNumber: 143,
                            columnNumber: 25
                        }, this))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/gtoc/ui/BodyListPanel.tsx",
                lineNumber: 102,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "overflow-y-auto p-2 grid grid-cols-2 gap-2 content-start",
                children: [
                    filteredBodies.slice(0, 100).map((body, idx)=>{
                        const identifier = String(body.name && body.name !== "None" ? body.name : body.id);
                        const isChecked = selectedBodies.includes(identifier);
                        const isCenter = centerBodyId === String(body.id);
                        const displayName = body.name && body.name !== "None" ? `${body.name}` : `#${body.id}`;
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `flex items-center gap-2 px-2 py-1.5 rounded border transition-all text-xs text-left group
                        ${isChecked ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-100" : "bg-white/5 border-transparent text-white/60 hover:bg-white/10 hover:text-white"}`,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    ref: (el)=>{
                                        btnRefs.current[`body-${body.id}`] = el;
                                    },
                                    onClick: (e)=>{
                                        e.stopPropagation();
                                        setOpenPicker(openPicker === `body-${body.id}` ? null : `body-${body.id}`);
                                    },
                                    className: "w-2.5 h-2.5 rounded-full shadow-[0_0_4px_currentColor] flex-shrink-0 hover:scale-125 transition-transform cursor-pointer border border-white/20",
                                    style: {
                                        backgroundColor: body.color || "#888"
                                    },
                                    title: "Change Color"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/gtoc/ui/BodyListPanel.tsx",
                                    lineNumber: 172,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>togglePlanet(identifier),
                                    className: "flex-1 truncate text-left focus:outline-none",
                                    title: `ID: ${body.id}`,
                                    children: displayName
                                }, void 0, false, {
                                    fileName: "[project]/src/components/gtoc/ui/BodyListPanel.tsx",
                                    lineNumber: 184,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: (e)=>{
                                        e.stopPropagation();
                                        setCenterBody(isCenter ? null : String(body.id));
                                    },
                                    className: `p-1 rounded transition-colors ${isCenter ? "text-blue-400 bg-blue-500/20" : "text-white/20 hover:text-white hover:bg-white/10"}`,
                                    title: isCenter ? "Current Center (Click to Reset)" : "Set as Visual Center",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TargetIcon, {}, void 0, false, {
                                        fileName: "[project]/src/components/gtoc/ui/BodyListPanel.tsx",
                                        lineNumber: 204,
                                        columnNumber: 33
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/gtoc/ui/BodyListPanel.tsx",
                                    lineNumber: 193,
                                    columnNumber: 29
                                }, this),
                                openPicker === `body-${body.id}` && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$ui$2f$ColorPickerPortal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    anchorRef: {
                                        current: btnRefs.current[`body-${body.id}`]
                                    },
                                    color: body.color || "#ffffff",
                                    onChange: (c)=>updatePlanetColor(body.id, c),
                                    onClose: ()=>setOpenPicker(null)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/gtoc/ui/BodyListPanel.tsx",
                                    lineNumber: 209,
                                    columnNumber: 33
                                }, this)
                            ]
                        }, `${body.id}-${idx}`, true, {
                            fileName: "[project]/src/components/gtoc/ui/BodyListPanel.tsx",
                            lineNumber: 163,
                            columnNumber: 25
                        }, this);
                    }),
                    filteredBodies.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "col-span-full text-white/30 text-xs italic p-4 text-center",
                        children: "No bodies found."
                    }, void 0, false, {
                        fileName: "[project]/src/components/gtoc/ui/BodyListPanel.tsx",
                        lineNumber: 220,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/gtoc/ui/BodyListPanel.tsx",
                lineNumber: 155,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-2 border-t border-white/5 bg-white/5 text-[10px] text-white/30 flex justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: [
                            filteredBodies.length,
                            " bodies found"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/gtoc/ui/BodyListPanel.tsx",
                        lineNumber: 225,
                        columnNumber: 17
                    }, this),
                    selectedBodies.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-emerald-400",
                        children: [
                            selectedBodies.length,
                            " selected"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/gtoc/ui/BodyListPanel.tsx",
                        lineNumber: 226,
                        columnNumber: 47
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/gtoc/ui/BodyListPanel.tsx",
                lineNumber: 224,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/gtoc/ui/BodyListPanel.tsx",
        lineNumber: 96,
        columnNumber: 9
    }, this), document.body);
}
_s(BodyListPanel, "SgYpId4KxZYxV6/+jpPI34VW+V0=");
_c1 = BodyListPanel;
var _c, _c1;
__turbopack_context__.k.register(_c, "TargetIcon");
__turbopack_context__.k.register(_c1, "BodyListPanel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/gtoc/utils/fullscreen.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Robust fullscreen helpers (Safari/Chrome/Firefox/Edge).
// IMPORTANT: Fullscreen must be triggered from a direct user gesture (e.g., a click handler).
__turbopack_context__.s([
    "enterFullscreen",
    ()=>enterFullscreen,
    "exitFullscreen",
    ()=>exitFullscreen,
    "getDefaultFullscreenTarget",
    ()=>getDefaultFullscreenTarget,
    "getFullscreenElement",
    ()=>getFullscreenElement,
    "isFullscreen",
    ()=>isFullscreen,
    "toggleFullscreen",
    ()=>toggleFullscreen
]);
function getFullscreenElement() {
    const doc = document;
    return doc.fullscreenElement ?? doc.webkitFullscreenElement ?? doc.mozFullScreenElement ?? doc.msFullscreenElement ?? null;
}
function isFullscreen() {
    return !!getFullscreenElement();
}
async function enterFullscreen(elem) {
    if (typeof document === "undefined") return;
    const target = elem ?? document.documentElement;
    if (!target) return;
    try {
        if ("requestFullscreen" in target && typeof target.requestFullscreen === "function") {
            await target.requestFullscreen();
            return;
        }
        // Safari
        if (typeof target.webkitRequestFullscreen === "function") {
            target.webkitRequestFullscreen();
            return;
        }
        // Legacy Safari/WebKit (uppercase 'S')
        if (typeof target.webkitRequestFullScreen === "function") {
            target.webkitRequestFullScreen();
            return;
        }
        // Firefox
        if (typeof target.mozRequestFullScreen === "function") {
            target.mozRequestFullScreen();
            return;
        }
        // IE/Legacy Edge
        if (typeof target.msRequestFullscreen === "function") {
            target.msRequestFullscreen();
            return;
        }
    } catch (err) {
        // Most common: not called from user gesture
        console.warn("Fullscreen Error:", err);
    }
}
function exitFullscreen() {
    if (typeof document === "undefined") return;
    const doc = document;
    if (!getFullscreenElement()) return;
    try {
        if (typeof doc.exitFullscreen === "function") {
            doc.exitFullscreen().catch(()=>{});
            return;
        }
        if (typeof doc.webkitExitFullscreen === "function") {
            doc.webkitExitFullscreen();
            return;
        }
        if (typeof doc.mozCancelFullScreen === "function") {
            doc.mozCancelFullScreen();
            return;
        }
        if (typeof doc.msExitFullscreen === "function") {
            doc.msExitFullscreen();
            return;
        }
    } catch  {
    // ignore
    }
}
function getDefaultFullscreenTarget() {
    const ids = [
        "visualizer-root",
        "gtoc-visualizer",
        "gtoc-root",
        "app",
        "__next"
    ];
    for (const id of ids){
        const el = document.getElementById(id);
        if (el) return el;
    }
    return document.documentElement;
}
async function toggleFullscreen(target) {
    if (isFullscreen()) {
        exitFullscreen();
    } else {
        await enterFullscreen(target ?? getDefaultFullscreenTarget());
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/gtoc/ui/Ribbon.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Ribbon
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$solutions$2f$useSolutions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/gtoc/solutions/useSolutions.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$planetStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/gtoc/stores/planetStore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$ui$2f$ColorPickerPortal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/gtoc/ui/ColorPickerPortal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$ui$2f$BodyListPanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/gtoc/ui/BodyListPanel.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$useMovieStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/gtoc/stores/useMovieStore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$fullscreen$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/gtoc/utils/fullscreen.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
;
;
function Ribbon({ onSave, onExit, onMakeMovie, isSaving }) {
    _s();
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("solutions");
    const { isMovieMode, logos, isRecording, aspectRatio, keyframes, nearbyKeyframeId, isPresentationMode } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$useMovieStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMovieStore"])();
    const [isCollapsed, setIsCollapsed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [fullscreenActive, setFullscreenActive] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Keep ribbon "out of the way" in fullscreen, but don't force-hide (Esc exits fullscreen).
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Ribbon.useEffect": ()=>{
            const handleFs = {
                "Ribbon.useEffect.handleFs": ()=>{
                    const active = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$fullscreen$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isFullscreen"])();
                    setFullscreenActive(active);
                    if (active) setIsCollapsed(true);
                }
            }["Ribbon.useEffect.handleFs"];
            handleFs();
            document.addEventListener("fullscreenchange", handleFs);
            document.addEventListener("webkitfullscreenchange", handleFs);
            document.addEventListener("mozfullscreenchange", handleFs);
            document.addEventListener("MSFullscreenChange", handleFs);
            return ({
                "Ribbon.useEffect": ()=>{
                    document.removeEventListener("fullscreenchange", handleFs);
                    document.removeEventListener("webkitfullscreenchange", handleFs);
                    document.removeEventListener("mozfullscreenchange", handleFs);
                    document.removeEventListener("MSFullscreenChange", handleFs);
                }
            })["Ribbon.useEffect"];
        }
    }["Ribbon.useEffect"], []);
    // --- Solutions Logic ---
    const { solutions, visible, importSolution, toggle, deleteSolution, recolorSolution } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$solutions$2f$useSolutions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSolutions"])();
    const [openPicker, setOpenPicker] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const btnRefs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({});
    // --- Body Selector Logic ---
    const { planets = [], selectedBodies = [], centerBodyId, togglePlanet, setPlanets, updatePlanetColor, updatePlanetTypeColor, setCenterBody, showOrbits, toggleShowOrbits, hoveredContext } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$planetStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePlanetStore"])();
    const [showBodyPanel, setShowBodyPanel] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const bodyPanelBtnRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Hide entire Ribbon in presentation mode
    if (isPresentationMode) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "pointer-events-auto fixed top-0 left-0 right-0 z-[1000] flex flex-col font-sans select-none",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "h-10 bg-[#0a0a0c]/95 border-b border-white/10 backdrop-blur-md flex items-center justify-between px-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-1 h-full",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mr-4 flex items-center gap-2 text-white/50 font-bold tracking-wider text-xs uppercase",
                                children: [
                                    "VECTRA ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-white/20",
                                        children: "|"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                        lineNumber: 91,
                                        columnNumber: 32
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                lineNumber: 90,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>{
                                    setActiveTab("solutions");
                                    setIsCollapsed(false);
                                },
                                className: `h-full px-4 text-xs font-medium border-b-2 transition-colors ${activeTab === "solutions" && !isCollapsed ? "border-blue-500 text-white" : "border-transparent text-white/60 hover:text-white hover:bg-white/5"}`,
                                children: "Solutions"
                            }, void 0, false, {
                                fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                lineNumber: 98,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>{
                                    setActiveTab("view");
                                    setIsCollapsed(false);
                                },
                                className: `h-full px-4 text-xs font-medium border-b-2 transition-colors ${activeTab === "view" && !isCollapsed ? "border-emerald-500 text-white" : "border-transparent text-white/60 hover:text-white hover:bg-white/5"}`,
                                children: "View"
                            }, void 0, false, {
                                fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                lineNumber: 109,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>{
                                    setActiveTab("movie");
                                    setIsCollapsed(false);
                                },
                                className: `h-full px-4 text-xs font-medium border-b-2 transition-colors ${activeTab === "movie" && !isCollapsed ? "border-purple-500 text-white" : "border-transparent text-white/60 hover:text-white hover:bg-white/5"}`,
                                children: "Movie"
                            }, void 0, false, {
                                fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                lineNumber: 120,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                        lineNumber: 88,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setIsCollapsed(!isCollapsed),
                        className: "text-white/40 hover:text-white transition-colors",
                        title: isCollapsed ? "Expand Ribbon" : "Collapse Ribbon",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            width: "16",
                            height: "16",
                            viewBox: "0 0 24 24",
                            fill: "none",
                            stroke: "currentColor",
                            strokeWidth: "2",
                            className: `transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""}`,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                d: "M18 15l-6-6-6 6"
                            }, void 0, false, {
                                fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                lineNumber: 138,
                                columnNumber: 25
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                            lineNumber: 137,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                        lineNumber: 132,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                lineNumber: 87,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `overflow-hidden transition-all duration-300 ease-in-out bg-[#0a0a0c]/90 border-b border-white/10 backdrop-blur-xl ${isCollapsed ? "max-h-0 opacity-0" : "max-h-[140px] opacity-100"}`,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "h-[120px] w-full px-4 py-3 flex gap-6 overflow-x-auto",
                    children: [
                        activeTab === "solutions" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex gap-2 min-w-[100px] border-r border-white/10 pr-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "flex flex-col items-center justify-center h-[80px] w-[64px] rounded hover:bg-white/10 border border-white/10 cursor-pointer transition-colors group",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                    className: "w-6 h-6 text-blue-400 group-hover:text-blue-300 mb-1",
                                                    viewBox: "0 0 24 24",
                                                    fill: "none",
                                                    stroke: "currentColor",
                                                    strokeWidth: "1.5",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                        d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                        lineNumber: 156,
                                                        columnNumber: 41
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                    lineNumber: 155,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-[10px] text-white/70",
                                                    children: "Import"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                    lineNumber: 158,
                                                    columnNumber: 37
                                                }, this),
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
                                                    fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                    lineNumber: 159,
                                                    columnNumber: 37
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                            lineNumber: 154,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: onSave,
                                            disabled: isSaving,
                                            className: "flex flex-col items-center justify-center h-[80px] w-[64px] rounded hover:bg-white/10 border border-white/10 transition-colors group disabled:opacity-50",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                    className: `w-6 h-6 mb-1 ${isSaving ? "text-yellow-400 animate-pulse" : "text-white/80 group-hover:text-white"}`,
                                                    viewBox: "0 0 24 24",
                                                    fill: "none",
                                                    stroke: "currentColor",
                                                    strokeWidth: "1.5",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                            d: "M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                            lineNumber: 178,
                                                            columnNumber: 41
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                                                            points: "17 21 17 13 7 13 7 21"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                            lineNumber: 179,
                                                            columnNumber: 41
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                                                            points: "7 3 7 8 15 8"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                            lineNumber: 180,
                                                            columnNumber: 41
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                    lineNumber: 177,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-[10px] text-white/70",
                                                    children: isSaving ? "Saving..." : "Save"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                    lineNumber: 182,
                                                    columnNumber: 37
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                            lineNumber: 172,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: async ()=>{
                                                // IMPORTANT: must be called from this click handler
                                                const target = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$fullscreen$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDefaultFullscreenTarget"])();
                                                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$fullscreen$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toggleFullscreen"])(target);
                                            },
                                            className: `flex flex-col items-center justify-center h-[80px] w-[64px] rounded border transition-colors group
                                        ${fullscreenActive ? "bg-blue-500/15 border-blue-500/35 hover:bg-blue-500/20" : "hover:bg-white/10 border-white/10"}`,
                                            title: fullscreenActive ? "Exit Fullscreen (Esc)" : "Enter Fullscreen",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                    className: "w-6 h-6 text-white/80 group-hover:text-white mb-1",
                                                    viewBox: "0 0 24 24",
                                                    fill: "none",
                                                    stroke: "currentColor",
                                                    strokeWidth: "1.5",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                            d: "M8 3H3v5"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                            lineNumber: 196,
                                                            columnNumber: 41
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                            d: "M16 3h5v5"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                            lineNumber: 197,
                                                            columnNumber: 41
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                            d: "M3 16v5h5"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                            lineNumber: 198,
                                                            columnNumber: 41
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                            d: "M21 16v5h-5"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                            lineNumber: 199,
                                                            columnNumber: 41
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                    lineNumber: 195,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-[10px] text-white/70",
                                                    children: fullscreenActive ? "Fullscreen" : "Fullscreen"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                    lineNumber: 201,
                                                    columnNumber: 37
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                            lineNumber: 185,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: onExit,
                                            className: "flex flex-col items-center justify-center h-[80px] w-[64px] rounded hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 transition-colors group",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                    className: "w-6 h-6 text-red-400 group-hover:text-red-300 mb-1",
                                                    viewBox: "0 0 24 24",
                                                    fill: "none",
                                                    stroke: "currentColor",
                                                    strokeWidth: "1.5",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                            d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                            lineNumber: 211,
                                                            columnNumber: 41
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                                                            points: "16 17 21 12 16 7"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                            lineNumber: 212,
                                                            columnNumber: 41
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                            x1: "21",
                                                            y1: "12",
                                                            x2: "9",
                                                            y2: "12"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                            lineNumber: 213,
                                                            columnNumber: 41
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                    lineNumber: 210,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-[10px] text-white/70 group-hover:text-red-200",
                                                    children: "Exit"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                    lineNumber: 215,
                                                    columnNumber: 37
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                            lineNumber: 206,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                    lineNumber: 152,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-col gap-2 flex-1 min-w-[200px]",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-[10px] text-white/30 uppercase tracking-wider font-semibold",
                                            children: "Loaded Solutions"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                            lineNumber: 221,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex-1 overflow-y-auto pr-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 content-start",
                                            children: [
                                                solutions.map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-2 bg-white/5 rounded px-2 py-1.5 border border-white/5 hover:border-white/20 transition-colors",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                ref: (el)=>{
                                                                    btnRefs.current[s.id] = el;
                                                                },
                                                                onClick: ()=>setOpenPicker(openPicker === s.id ? null : s.id),
                                                                className: "w-3 h-3 rounded-full border border-white/30 shadow-sm",
                                                                style: {
                                                                    backgroundColor: s.color
                                                                }
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                                lineNumber: 226,
                                                                columnNumber: 45
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-xs text-white/90 truncate flex-1 font-mono",
                                                                title: s.name,
                                                                children: s.name
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                                lineNumber: 234,
                                                                columnNumber: 45
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>toggle(s.id),
                                                                className: "text-white/40 hover:text-white transition-colors",
                                                                title: "Toggle Visibility",
                                                                children: visible[s.id] ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                    width: "14",
                                                                    height: "14",
                                                                    viewBox: "0 0 24 24",
                                                                    fill: "none",
                                                                    stroke: "currentColor",
                                                                    strokeWidth: "2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                            d: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                                            lineNumber: 239,
                                                                            columnNumber: 151
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                                            cx: "12",
                                                                            cy: "12",
                                                                            r: "3"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                                            lineNumber: 239,
                                                                            columnNumber: 208
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                                    lineNumber: 239,
                                                                    columnNumber: 53
                                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                    width: "14",
                                                                    height: "14",
                                                                    viewBox: "0 0 24 24",
                                                                    fill: "none",
                                                                    stroke: "currentColor",
                                                                    strokeWidth: "2",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                        d: "M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                                        lineNumber: 241,
                                                                        columnNumber: 151
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                                    lineNumber: 241,
                                                                    columnNumber: 53
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                                lineNumber: 237,
                                                                columnNumber: 45
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>deleteSolution(s.id),
                                                                className: "text-white/20 hover:text-red-400 transition-colors",
                                                                title: "Delete",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                    width: "14",
                                                                    height: "14",
                                                                    viewBox: "0 0 24 24",
                                                                    fill: "none",
                                                                    stroke: "currentColor",
                                                                    strokeWidth: "2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                                            x1: "18",
                                                                            y1: "6",
                                                                            x2: "6",
                                                                            y2: "18"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                                            lineNumber: 247,
                                                                            columnNumber: 147
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                                            x1: "6",
                                                                            y1: "6",
                                                                            x2: "18",
                                                                            y2: "18"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                                            lineNumber: 247,
                                                                            columnNumber: 190
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                                    lineNumber: 247,
                                                                    columnNumber: 49
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                                lineNumber: 246,
                                                                columnNumber: 45
                                                            }, this),
                                                            openPicker === s.id && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$ui$2f$ColorPickerPortal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                                anchorRef: {
                                                                    current: btnRefs.current[s.id]
                                                                },
                                                                color: s.color,
                                                                onChange: (c)=>recolorSolution?.(s.id, c),
                                                                onClose: ()=>setOpenPicker(null)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                                lineNumber: 252,
                                                                columnNumber: 49
                                                            }, this)
                                                        ]
                                                    }, s.id, true, {
                                                        fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                        lineNumber: 224,
                                                        columnNumber: 41
                                                    }, this)),
                                                solutions.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "col-span-full flex items-center justify-center text-white/20 text-xs italic h-full",
                                                    children: "No solutions loaded. Import a file to get started."
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                    lineNumber: 262,
                                                    columnNumber: 41
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                            lineNumber: 222,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                    lineNumber: 220,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true),
                        activeTab === "movie" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-col gap-2 min-w-[100px] border-r border-white/10 pr-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-[10px] text-white/30 uppercase tracking-wider font-semibold mb-auto",
                                            children: "Mode"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                            lineNumber: 277,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$useMovieStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMovieStore"].getState().toggleMovieMode(),
                                            className: `flex flex-col items-center justify-center h-[64px] w-[64px] rounded border transition-colors
                                    ${isMovieMode ? "bg-purple-500/20 border-purple-500/50 text-purple-200" : "hover:bg-white/5 border-white/5 text-white/50 hover:text-white"}`,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                    width: "24",
                                                    height: "24",
                                                    viewBox: "0 0 24 24",
                                                    fill: "none",
                                                    stroke: "currentColor",
                                                    strokeWidth: "1.5",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                            x: "2",
                                                            y: "2",
                                                            width: "20",
                                                            height: "20",
                                                            rx: "2.18",
                                                            ry: "2.18"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                            lineNumber: 287,
                                                            columnNumber: 41
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                            x1: "7",
                                                            y1: "2",
                                                            x2: "7",
                                                            y2: "22"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                            lineNumber: 288,
                                                            columnNumber: 41
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                            x1: "17",
                                                            y1: "2",
                                                            x2: "17",
                                                            y2: "22"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                            lineNumber: 289,
                                                            columnNumber: 41
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                            x1: "2",
                                                            y1: "12",
                                                            x2: "22",
                                                            y2: "12"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                            lineNumber: 290,
                                                            columnNumber: 41
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                            x1: "2",
                                                            y1: "7",
                                                            x2: "7",
                                                            y2: "7"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                            lineNumber: 291,
                                                            columnNumber: 41
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                            x1: "2",
                                                            y1: "17",
                                                            x2: "7",
                                                            y2: "17"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                            lineNumber: 292,
                                                            columnNumber: 41
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                            x1: "17",
                                                            y1: "17",
                                                            x2: "22",
                                                            y2: "17"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                            lineNumber: 293,
                                                            columnNumber: 41
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                            x1: "17",
                                                            y1: "7",
                                                            x2: "22",
                                                            y2: "7"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                            lineNumber: 294,
                                                            columnNumber: 41
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                    lineNumber: 286,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-[10px] mt-1",
                                                    children: isMovieMode ? "ON" : "OFF"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                    lineNumber: 296,
                                                    columnNumber: 37
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                            lineNumber: 278,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                    lineNumber: 276,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-col gap-2 min-w-[100px] border-r border-white/10 pr-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-[10px] text-white/30 uppercase tracking-wider font-semibold mb-auto",
                                            children: "Assets"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                            lineNumber: 302,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: `flex flex-col items-center justify-center h-[64px] w-[64px] rounded border transition-colors cursor-pointer group
                                    ${logos.length > 0 ? "bg-white/10 border-white/20" : "hover:bg-white/5 border-white/5 text-white/50 hover:text-white"}`,
                                            children: [
                                                logos.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                    src: logos[0].url,
                                                    className: "w-8 h-8 object-contain mb-1",
                                                    alt: "Logo"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                    lineNumber: 307,
                                                    columnNumber: 41
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                    width: "24",
                                                    height: "24",
                                                    viewBox: "0 0 24 24",
                                                    fill: "none",
                                                    stroke: "currentColor",
                                                    strokeWidth: "1.5",
                                                    className: "mb-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                            d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                            lineNumber: 310,
                                                            columnNumber: 45
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                                                            points: "17 8 12 3 7 8"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                            lineNumber: 310,
                                                            columnNumber: 99
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                            x1: "12",
                                                            y1: "3",
                                                            x2: "12",
                                                            y2: "15"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                            lineNumber: 310,
                                                            columnNumber: 134
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                    lineNumber: 309,
                                                    columnNumber: 41
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-[10px]",
                                                    children: logos.length > 0 ? `Logos (${logos.length})` : "Upload Logo"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                    lineNumber: 313,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "file",
                                                    accept: "image/*",
                                                    className: "hidden",
                                                    onChange: (e)=>{
                                                        const f = e.target.files?.[0];
                                                        if (f) {
                                                            const reader = new FileReader();
                                                            reader.onload = (ev)=>{
                                                                if (ev.target?.result) __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$useMovieStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMovieStore"].getState().addLogo(ev.target.result);
                                                            };
                                                            reader.readAsDataURL(f);
                                                        }
                                                        e.target.value = "";
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                    lineNumber: 314,
                                                    columnNumber: 37
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                            lineNumber: 303,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                    lineNumber: 301,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-col gap-2 min-w-[100px] border-r border-white/10 pr-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-[10px] text-white/30 uppercase tracking-wider font-semibold mb-auto",
                                            children: "Keyframes"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                            lineNumber: 330,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$useMovieStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMovieStore"].getState().triggerKeyframeCapture(),
                                                    disabled: !isMovieMode,
                                                    className: `flex flex-col items-center justify-center h-[64px] w-[64px] rounded border transition-colors 
                                        ${!isMovieMode ? "opacity-30 border-white/5 cursor-not-allowed" : nearbyKeyframeId ? "border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300" : "border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/20"}`,
                                                    children: [
                                                        nearbyKeyframeId ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                            width: "20",
                                                            height: "20",
                                                            viewBox: "0 0 24 24",
                                                            fill: "none",
                                                            stroke: "currentColor",
                                                            strokeWidth: "1.5",
                                                            className: "mb-1",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                    d: "M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                                    lineNumber: 343,
                                                                    columnNumber: 49
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                    d: "M3 3v5h5"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                                    lineNumber: 344,
                                                                    columnNumber: 49
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                    d: "M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                                    lineNumber: 345,
                                                                    columnNumber: 49
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                    d: "M16 21h5v-5"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                                    lineNumber: 346,
                                                                    columnNumber: 49
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                            lineNumber: 342,
                                                            columnNumber: 45
                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                            width: "20",
                                                            height: "20",
                                                            viewBox: "0 0 24 24",
                                                            fill: "none",
                                                            stroke: "currentColor",
                                                            strokeWidth: "1.5",
                                                            className: "mb-1",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                                    cx: "12",
                                                                    cy: "12",
                                                                    r: "10"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                                    lineNumber: 350,
                                                                    columnNumber: 49
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                                    x1: "12",
                                                                    y1: "8",
                                                                    x2: "12",
                                                                    y2: "16"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                                    lineNumber: 351,
                                                                    columnNumber: 49
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                                    x1: "8",
                                                                    y1: "12",
                                                                    x2: "16",
                                                                    y2: "12"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                                    lineNumber: 352,
                                                                    columnNumber: 49
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                            lineNumber: 349,
                                                            columnNumber: 45
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex flex-col items-center -space-y-1",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-[9px] text-white/80",
                                                                    children: nearbyKeyframeId ? "Update" : "Add"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                                    lineNumber: 356,
                                                                    columnNumber: 45
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-[9px] text-white/40",
                                                                    children: keyframes.length
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                                    lineNumber: 357,
                                                                    columnNumber: 45
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                            lineNumber: 355,
                                                            columnNumber: 41
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                    lineNumber: 333,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex flex-col h-[64px] w-[40px] gap-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>nearbyKeyframeId && __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$useMovieStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMovieStore"].getState().removeKeyframe(nearbyKeyframeId),
                                                            disabled: !isMovieMode || !nearbyKeyframeId,
                                                            className: `flex-1 flex items-center justify-center rounded border transition-colors
                                            ${!isMovieMode || !nearbyKeyframeId ? "border-white/5 text-white/10 cursor-not-allowed" : "border-red-500/20 bg-red-500/5 text-red-400 hover:bg-red-500/20"}`,
                                                            title: "Delete Selected Keyframe",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                width: "14",
                                                                height: "14",
                                                                viewBox: "0 0 24 24",
                                                                fill: "none",
                                                                stroke: "currentColor",
                                                                strokeWidth: "1.5",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                    d: "M18 6L6 18M6 6l12 12"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                                    lineNumber: 372,
                                                                    columnNumber: 49
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                                lineNumber: 371,
                                                                columnNumber: 45
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                            lineNumber: 364,
                                                            columnNumber: 41
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>confirm("Clear all keyframes?") && __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$useMovieStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMovieStore"].getState().clearKeyframes(),
                                                            disabled: !isMovieMode,
                                                            className: `flex-1 flex items-center justify-center rounded border transition-colors
                                            ${!isMovieMode ? "border-white/5 text-white/10 cursor-not-allowed" : "border-white/5 text-white/30 hover:text-red-400 hover:bg-white/5"}`,
                                                            title: "Clear All Keyframes",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                width: "14",
                                                                height: "14",
                                                                viewBox: "0 0 24 24",
                                                                fill: "none",
                                                                stroke: "currentColor",
                                                                strokeWidth: "1.5",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                        d: "M3 6h18"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                                        lineNumber: 385,
                                                                        columnNumber: 49
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                        d: "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                                        lineNumber: 386,
                                                                        columnNumber: 49
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                        d: "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                                        lineNumber: 387,
                                                                        columnNumber: 49
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                                lineNumber: 384,
                                                                columnNumber: 45
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                            lineNumber: 377,
                                                            columnNumber: 41
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                    lineNumber: 362,
                                                    columnNumber: 37
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                            lineNumber: 331,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                    lineNumber: 329,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-col gap-2 min-w-[100px] border-r border-white/10 pr-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-[10px] text-white/30 uppercase tracking-wider font-semibold mb-auto",
                                            children: "Format"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                            lineNumber: 396,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "grid grid-cols-2 gap-1 h-[64px]",
                                            children: [
                                                {
                                                    label: "16:9",
                                                    val: 1.7777
                                                },
                                                {
                                                    label: "4:3",
                                                    val: 1.3333
                                                },
                                                {
                                                    label: "2.35",
                                                    val: 2.35
                                                },
                                                {
                                                    label: "1:1",
                                                    val: 1
                                                }
                                            ].map((opt)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$useMovieStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMovieStore"].getState().setAspectRatio(opt.val),
                                                    className: `px-2 py-1 text-[9px] rounded border transition-colors ${Math.abs(aspectRatio - opt.val) < 0.01 ? "bg-white/20 border-white/40 text-white" : "border-white/5 text-white/40 hover:bg-white/5 hover:text-white"}`,
                                                    children: opt.label
                                                }, opt.label, false, {
                                                    fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                    lineNumber: 404,
                                                    columnNumber: 41
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                            lineNumber: 397,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                    lineNumber: 395,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-col gap-2 min-w-[140px]",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-[10px] text-white/30 uppercase tracking-wider font-semibold mb-auto",
                                            children: "Action"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                            lineNumber: 420,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: onMakeMovie,
                                                    disabled: !isMovieMode,
                                                    className: `flex flex-col items-center justify-center h-[64px] px-4 rounded border transition-all
                                    ${isRecording ? "bg-red-500/20 border-red-500/50 text-red-200 animate-pulse" : !isMovieMode ? "opacity-30 cursor-not-allowed border-white/5" : "bg-purple-500/10 border-purple-500/30 text-purple-200 hover:bg-purple-500/20 hover:border-purple-500/50"}`,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                            width: "24",
                                                            height: "24",
                                                            viewBox: "0 0 24 24",
                                                            fill: "none",
                                                            stroke: "currentColor",
                                                            strokeWidth: "1.5",
                                                            className: "mb-1",
                                                            children: isRecording ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                                x: "6",
                                                                y: "6",
                                                                width: "12",
                                                                height: "12",
                                                                fill: "currentColor"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                                lineNumber: 433,
                                                                columnNumber: 49
                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                                        cx: "12",
                                                                        cy: "12",
                                                                        r: "10"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                                        lineNumber: 436,
                                                                        columnNumber: 53
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polygon", {
                                                                        points: "10 8 16 12 10 16 10 8"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                                        lineNumber: 437,
                                                                        columnNumber: 53
                                                                    }, this)
                                                                ]
                                                            }, void 0, true)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                            lineNumber: 431,
                                                            columnNumber: 41
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-[10px]",
                                                            children: isRecording ? "STOP REC" : "Generate 4K Video"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                            lineNumber: 441,
                                                            columnNumber: 41
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                    lineNumber: 422,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: async ()=>{
                                                        // Fullscreen must be initiated from this click handler.
                                                        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$fullscreen$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["enterFullscreen"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$fullscreen$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDefaultFullscreenTarget"])());
                                                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$useMovieStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMovieStore"].getState().togglePresentationMode(true);
                                                    },
                                                    disabled: !isMovieMode,
                                                    className: `flex flex-col items-center justify-center h-[64px] px-4 rounded border transition-all
                                    ${!isMovieMode ? "opacity-30 cursor-not-allowed border-white/5" : "bg-blue-500/10 border-blue-500/30 text-blue-200 hover:bg-blue-500/20 hover:border-blue-500/50"}`,
                                                    title: "Start Presentation Mode (Fullscreen Loop)",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                            width: "24",
                                                            height: "24",
                                                            viewBox: "0 0 24 24",
                                                            fill: "none",
                                                            stroke: "currentColor",
                                                            strokeWidth: "1.5",
                                                            className: "mb-1",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                    d: "M15 3h6v6"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                                    lineNumber: 457,
                                                                    columnNumber: 45
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                    d: "M9 21H3v-6"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                                    lineNumber: 458,
                                                                    columnNumber: 45
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                    d: "M21 3l-7 7"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                                    lineNumber: 459,
                                                                    columnNumber: 45
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                    d: "M3 21l7-7"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                                    lineNumber: 460,
                                                                    columnNumber: 45
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                            lineNumber: 456,
                                                            columnNumber: 41
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-[10px]",
                                                            children: "Presentation"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                            lineNumber: 462,
                                                            columnNumber: 41
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                    lineNumber: 445,
                                                    columnNumber: 37
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                            lineNumber: 421,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                    lineNumber: 419,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true),
                        activeTab === "view" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-col gap-2 min-w-[140px] border-r border-white/10 pr-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-[10px] text-white/30 uppercase tracking-wider font-semibold mb-auto",
                                            children: "Settings"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                            lineNumber: 473,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: toggleShowOrbits,
                                                    className: `flex flex-col items-center justify-center h-[64px] w-[64px] rounded border transition-colors group
                                    ${showOrbits ? "bg-white/10 border-white/20 text-white" : "hover:bg-white/5 border-white/5 text-white/50 hover:text-white/80"}`,
                                                    title: showOrbits ? "Hide Orbits" : "Show Orbits",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                            className: "w-6 h-6 mb-1",
                                                            viewBox: "0 0 24 24",
                                                            fill: "none",
                                                            stroke: "currentColor",
                                                            strokeWidth: "1.5",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                                    cx: "12",
                                                                    cy: "12",
                                                                    r: "9",
                                                                    strokeOpacity: showOrbits ? 1 : 0.5
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                                    lineNumber: 485,
                                                                    columnNumber: 45
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                    d: "M12 3a9 9 0 0 1 9 9",
                                                                    strokeOpacity: showOrbits ? 1 : 0.5,
                                                                    strokeDasharray: "4 4"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                                    lineNumber: 486,
                                                                    columnNumber: 45
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                            lineNumber: 484,
                                                            columnNumber: 41
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-[10px]",
                                                            children: showOrbits ? "Orbits: ON" : "Orbits: OFF"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                            lineNumber: 488,
                                                            columnNumber: 41
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                    lineNumber: 475,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>setCenterBody(null),
                                                    disabled: !centerBodyId,
                                                    className: `flex flex-col items-center justify-center h-[64px] w-[64px] rounded border transition-colors group
                                        ${centerBodyId ? "bg-blue-500/10 border-blue-500/30 text-blue-200 hover:bg-blue-500/20" : "border-transparent bg-white/5 text-white/30 cursor-not-allowed"}`,
                                                    title: "Reset Center to Sun",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                            className: "w-6 h-6 mb-1",
                                                            viewBox: "0 0 24 24",
                                                            fill: "none",
                                                            stroke: "currentColor",
                                                            strokeWidth: "1.5",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                                    cx: "12",
                                                                    cy: "12",
                                                                    r: "4"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                                    lineNumber: 503,
                                                                    columnNumber: 45
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                    d: "M3 12h2"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                                    lineNumber: 504,
                                                                    columnNumber: 45
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                    d: "M19 12h2"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                                    lineNumber: 504,
                                                                    columnNumber: 65
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                    d: "M12 3v2"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                                    lineNumber: 505,
                                                                    columnNumber: 45
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                    d: "M12 19v2"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                                    lineNumber: 505,
                                                                    columnNumber: 65
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                    d: "M5.6 5.6l1.4 1.4"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                                    lineNumber: 506,
                                                                    columnNumber: 45
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                    d: "M17 17l1.4 1.4"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                                    lineNumber: 506,
                                                                    columnNumber: 74
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                    d: "M18.4 5.6l-1.4 1.4"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                                    lineNumber: 507,
                                                                    columnNumber: 45
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                    d: "M7 17l-1.4 1.4"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                                    lineNumber: 507,
                                                                    columnNumber: 76
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                            lineNumber: 502,
                                                            columnNumber: 41
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-[10px]",
                                                            children: [
                                                                "Center: ",
                                                                centerBodyId ? "Body" : "Sun"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                            lineNumber: 509,
                                                            columnNumber: 41
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                    lineNumber: 492,
                                                    columnNumber: 37
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                            lineNumber: 474,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                    lineNumber: 472,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-col gap-2 min-w-[200px] border-r border-white/10 pr-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-[10px] text-white/30 uppercase tracking-wider font-semibold mb-auto",
                                            children: "Panels"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                            lineNumber: 516,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    ref: bodyPanelBtnRef,
                                                    onClick: ()=>setShowBodyPanel(!showBodyPanel),
                                                    className: `flex flex-col items-center justify-center h-[64px] w-[64px] rounded border transition-colors group
                                        ${showBodyPanel || selectedBodies.length > 0 ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-200" : "hover:bg-white/5 border-white/5 text-white/70 hover:text-white"}`,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                            className: "w-6 h-6 mb-1",
                                                            viewBox: "0 0 24 24",
                                                            fill: "none",
                                                            stroke: "currentColor",
                                                            strokeWidth: "1.5",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                                    cx: "12",
                                                                    cy: "12",
                                                                    r: "10"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                                    lineNumber: 528,
                                                                    columnNumber: 45
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                    d: "M2 12h20"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                                    lineNumber: 529,
                                                                    columnNumber: 45
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                    d: "M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                                    lineNumber: 530,
                                                                    columnNumber: 45
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                            lineNumber: 527,
                                                            columnNumber: 41
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-[10px]",
                                                            children: "Bodies"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                            lineNumber: 532,
                                                            columnNumber: 41
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                    lineNumber: 518,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$planetStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePlanetStore"].setState({
                                                            selectedBodies: []
                                                        }),
                                                    disabled: selectedBodies.length === 0,
                                                    className: "flex flex-col items-center justify-center h-[64px] px-2 rounded border border-transparent hover:bg-white/5 hover:border-red-500/20 text-white/40 hover:text-red-300 disabled:opacity-20 transition-all",
                                                    title: "Clear Selection",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                        width: "20",
                                                        height: "20",
                                                        viewBox: "0 0 24 24",
                                                        fill: "none",
                                                        stroke: "currentColor",
                                                        strokeWidth: "1.5",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                            d: "M18 6L6 18M6 6l12 12"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                            lineNumber: 540,
                                                            columnNumber: 141
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                        lineNumber: 540,
                                                        columnNumber: 41
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                                    lineNumber: 534,
                                                    columnNumber: 37
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                            lineNumber: 517,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                    lineNumber: 515,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$ui$2f$BodyListPanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    isOpen: showBodyPanel,
                                    onClose: ()=>setShowBodyPanel(false),
                                    anchorRef: bodyPanelBtnRef,
                                    planets: planets,
                                    selectedBodies: selectedBodies,
                                    centerBodyId: centerBodyId,
                                    togglePlanet: togglePlanet,
                                    updatePlanetColor: updatePlanetColor,
                                    updatePlanetTypeColor: updatePlanetTypeColor,
                                    setCenterBody: setCenterBody,
                                    btnRefs: btnRefs,
                                    openPicker: openPicker,
                                    setOpenPicker: setOpenPicker
                                }, void 0, false, {
                                    fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                                    lineNumber: 546,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                    lineNumber: 146,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
                lineNumber: 144,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/gtoc/ui/Ribbon.tsx",
        lineNumber: 84,
        columnNumber: 9
    }, this);
}
_s(Ribbon, "K1+Ji/fKOzVGuQgrVMf8O1U5ppc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$useMovieStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMovieStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$solutions$2f$useSolutions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSolutions"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$planetStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePlanetStore"]
    ];
});
_c = Ribbon;
var _c;
__turbopack_context__.k.register(_c, "Ribbon");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/gtoc/utils/shipUtils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getShipPosition",
    ()=>getShipPosition
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/build/three.core.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/gtoc/utils/constants.ts [app-client] (ecmascript)");
;
;
function getShipPosition(sol, currentJD, epochZeroJD) {
    if (!sol?.samples?.length) return null;
    // --- SCALE LOGIC (from SolutionPath.tsx) ---
    // If coordinates are large (e.g. > 1000), assume KM and convert to AU.
    // Otherwise assume AU.
    const medianR = (()=>{
        const mags = sol.samples.map((s)=>Math.hypot(...s.p)).filter((m)=>Number.isFinite(m)).sort((a, b)=>a - b);
        return mags[Math.floor(mags.length / 2)] || 1;
    })();
    const SCALE = medianR > 1e3 ? 1 / __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AU_KM"] : 1;
    // --- TIME ---
    const elapsed = (currentJD - epochZeroJD) * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SECONDS_PER_DAY"];
    const times = sol.samples.map((s)=>s.t);
    // If before start, return first point
    if (elapsed < times[0]) {
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](...sol.samples[0].p).multiplyScalar(SCALE);
    }
    // If after end, return last point
    if (elapsed > times[times.length - 1]) {
        const last = sol.samples[sol.samples.length - 1];
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](...last.p).multiplyScalar(SCALE);
    }
    // --- INTERPOLATION ---
    let idx = times.findIndex((t, i)=>elapsed >= t && elapsed <= times[i + 1]);
    if (idx < 0) idx = Math.max(0, times.length - 2);
    const t0 = times[idx];
    const t1 = times[idx + 1];
    const a = t1 > t0 ? (elapsed - t0) / (t1 - t0) : 0;
    const p0 = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](...sol.samples[idx].p).multiplyScalar(SCALE);
    const p1 = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](...sol.samples[idx + 1].p).multiplyScalar(SCALE);
    return p0.lerp(p1, a);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/gtoc/ui/MovieOverlay.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MovieOverlay
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$useMovieStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/gtoc/stores/useMovieStore.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
/* ──────────────────────────────────────────────────────────────────────────── */ /*  Individual draggable / resizable / deletable logo                          */ /* ──────────────────────────────────────────────────────────────────────────── */ function DraggableLogo({ logo }) {
    _s();
    const { updateLogo, removeLogo } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$useMovieStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMovieStore"])();
    const [isDragging, setIsDragging] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isResizing, setIsResizing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const resizeStartRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Drag
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DraggableLogo.useEffect": ()=>{
            if (!isDragging) return;
            const handleMouseMove = {
                "DraggableLogo.useEffect.handleMouseMove": (e)=>{
                    const dx = e.movementX / window.innerWidth;
                    const dy = -e.movementY / window.innerHeight;
                    updateLogo(logo.id, {
                        position: {
                            x: Math.min(1, Math.max(0, logo.position.x + dx)),
                            y: Math.min(1, Math.max(0, logo.position.y + dy))
                        }
                    });
                }
            }["DraggableLogo.useEffect.handleMouseMove"];
            const stop = {
                "DraggableLogo.useEffect.stop": ()=>setIsDragging(false)
            }["DraggableLogo.useEffect.stop"];
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", stop);
            return ({
                "DraggableLogo.useEffect": ()=>{
                    window.removeEventListener("mousemove", handleMouseMove);
                    window.removeEventListener("mouseup", stop);
                }
            })["DraggableLogo.useEffect"];
        }
    }["DraggableLogo.useEffect"], [
        isDragging,
        logo.id,
        logo.position,
        updateLogo
    ]);
    // Resize
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DraggableLogo.useEffect": ()=>{
            if (!isResizing) return;
            const handlePointerMove = {
                "DraggableLogo.useEffect.handlePointerMove": (e)=>{
                    const s = resizeStartRef.current;
                    if (!s) return;
                    const dx = e.clientX - s.x;
                    const dy = e.clientY - s.y;
                    const dominant = Math.max(dx, dy);
                    const pxPerScaleUnit = 120;
                    const deltaScale = dominant / pxPerScaleUnit;
                    const next = Math.min(5, Math.max(0.1, s.startScale + deltaScale));
                    updateLogo(logo.id, {
                        scale: next
                    });
                }
            }["DraggableLogo.useEffect.handlePointerMove"];
            const stop = {
                "DraggableLogo.useEffect.stop": ()=>{
                    setIsResizing(false);
                    resizeStartRef.current = null;
                }
            }["DraggableLogo.useEffect.stop"];
            window.addEventListener("pointermove", handlePointerMove);
            window.addEventListener("pointerup", stop);
            window.addEventListener("pointercancel", stop);
            return ({
                "DraggableLogo.useEffect": ()=>{
                    window.removeEventListener("pointermove", handlePointerMove);
                    window.removeEventListener("pointerup", stop);
                    window.removeEventListener("pointercancel", stop);
                }
            })["DraggableLogo.useEffect"];
        }
    }["DraggableLogo.useEffect"], [
        isResizing,
        logo.id,
        updateLogo
    ]);
    const handleMouseDownDrag = (e)=>{
        if (isResizing) return;
        e.preventDefault();
        setIsDragging(true);
    };
    const handleResizePointerDown = (e)=>{
        e.preventDefault();
        e.stopPropagation();
        setIsResizing(true);
        resizeStartRef.current = {
            x: e.clientX,
            y: e.clientY,
            startScale: logo.scale
        };
        e.currentTarget.setPointerCapture(e.pointerId);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "absolute pointer-events-auto cursor-move group",
        style: {
            left: `${logo.position.x * 100}%`,
            bottom: `${logo.position.y * 100}%`,
            transform: "translate(-50%, 50%)",
            width: `${15 * logo.scale}vh`,
            height: `${15 * logo.scale}vh`,
            background: "transparent"
        },
        onMouseDown: handleMouseDownDrag,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                src: logo.url,
                alt: "Logo",
                draggable: false,
                className: "w-full h-full object-contain select-none pointer-events-none"
            }, void 0, false, {
                fileName: "[project]/src/components/gtoc/ui/MovieOverlay.tsx",
                lineNumber: 105,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `absolute inset-0 border border-dashed border-white/60 rounded-md ${isDragging || isResizing ? "opacity-100" : "opacity-0 group-hover:opacity-100"} transition-opacity`
            }, void 0, false, {
                fileName: "[project]/src/components/gtoc/ui/MovieOverlay.tsx",
                lineNumber: 113,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onMouseDown: (e)=>e.stopPropagation(),
                onClick: (e)=>{
                    e.stopPropagation();
                    removeLogo(logo.id);
                },
                className: `absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500/80 hover:bg-red-500 text-white flex items-center justify-center text-xs leading-none cursor-pointer ${isDragging ? "hidden" : "opacity-0 group-hover:opacity-100"} transition-opacity`,
                title: "Remove logo",
                children: "✕"
            }, void 0, false, {
                fileName: "[project]/src/components/gtoc/ui/MovieOverlay.tsx",
                lineNumber: 119,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                onPointerDown: handleResizePointerDown,
                className: `absolute -right-2 -bottom-2 w-4 h-4 rounded-sm bg-white/70 hover:bg-white cursor-nwse-resize ${isDragging ? "hidden" : "opacity-0 group-hover:opacity-100"} transition-opacity`,
                style: {
                    touchAction: "none"
                },
                title: "Resize"
            }, void 0, false, {
                fileName: "[project]/src/components/gtoc/ui/MovieOverlay.tsx",
                lineNumber: 133,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/gtoc/ui/MovieOverlay.tsx",
        lineNumber: 93,
        columnNumber: 9
    }, this);
}
_s(DraggableLogo, "Z4gTWDFZuocy+ANzLhN/8wyWT3g=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$useMovieStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMovieStore"]
    ];
});
_c = DraggableLogo;
function MovieOverlay() {
    _s1();
    const { isMovieMode, isPresentationMode, logos, addLogo, missionName, missionNameSize, setMissionName, setMissionNameSize } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$useMovieStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMovieStore"])();
    const fileInputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const handleFileChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "MovieOverlay.useCallback[handleFileChange]": (e)=>{
            const f = e.target.files?.[0];
            if (f) addLogo(URL.createObjectURL(f));
            e.target.value = "";
        }
    }["MovieOverlay.useCallback[handleFileChange]"], [
        addLogo
    ]);
    if (!isMovieMode) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "absolute inset-0 pointer-events-none z-[1100]",
        style: {
            background: "transparent"
        },
        children: [
            !isPresentationMode && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                "data-export-ignore": true,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-yellow-500/30 pointer-events-none",
                        style: {
                            width: "100%",
                            height: "100%",
                            background: "transparent"
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "absolute top-4 left-4 text-yellow-500/50 text-xs font-mono",
                            children: "REC AREA (Preview)"
                        }, void 0, false, {
                            fileName: "[project]/src/components/gtoc/ui/MovieOverlay.tsx",
                            lineNumber: 175,
                            columnNumber: 25
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/gtoc/ui/MovieOverlay.tsx",
                        lineNumber: 171,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute bottom-20 left-20 pointer-events-auto",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>fileInputRef.current?.click(),
                                className: "px-6 py-4 rounded-lg border-2 border-dashed border-white/30 hover:border-white/60 bg-black/40 text-white/70 hover:text-white transition-all flex flex-col items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        width: "24",
                                        height: "24",
                                        viewBox: "0 0 24 24",
                                        fill: "none",
                                        stroke: "currentColor",
                                        strokeWidth: "2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/gtoc/ui/MovieOverlay.tsx",
                                                lineNumber: 187,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                                                points: "17 8 12 3 7 8"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/gtoc/ui/MovieOverlay.tsx",
                                                lineNumber: 188,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                x1: "12",
                                                y1: "3",
                                                x2: "12",
                                                y2: "15"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/gtoc/ui/MovieOverlay.tsx",
                                                lineNumber: 189,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/gtoc/ui/MovieOverlay.tsx",
                                        lineNumber: 186,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-sm font-bold",
                                        children: logos.length > 0 ? "Add Another Logo" : "Upload Mission Logo"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/gtoc/ui/MovieOverlay.tsx",
                                        lineNumber: 191,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[10px] text-white/40",
                                        children: "PNG Recommended"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/gtoc/ui/MovieOverlay.tsx",
                                        lineNumber: 194,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/gtoc/ui/MovieOverlay.tsx",
                                lineNumber: 182,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                ref: fileInputRef,
                                type: "file",
                                accept: "image/*",
                                className: "hidden",
                                onChange: handleFileChange
                            }, void 0, false, {
                                fileName: "[project]/src/components/gtoc/ui/MovieOverlay.tsx",
                                lineNumber: 197,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/gtoc/ui/MovieOverlay.tsx",
                        lineNumber: 181,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/gtoc/ui/MovieOverlay.tsx",
                lineNumber: 170,
                columnNumber: 17
            }, this),
            logos.map((logo)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DraggableLogo, {
                    logo: logo
                }, logo.id, false, {
                    fileName: "[project]/src/components/gtoc/ui/MovieOverlay.tsx",
                    lineNumber: 210,
                    columnNumber: 17
                }, this)),
            (missionName || !isPresentationMode) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute pointer-events-auto",
                style: {
                    bottom: "3%",
                    right: "3%"
                },
                children: [
                    !isPresentationMode && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        "data-export-ignore": true,
                        className: "mb-2 flex flex-col items-end gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "text",
                                placeholder: "Mission Name",
                                value: missionName,
                                onChange: (e)=>setMissionName(e.target.value),
                                className: "px-3 py-1.5 rounded-md bg-black/60 border border-white/20 text-white text-sm outline-none focus:border-white/50 backdrop-blur-md text-right",
                                style: {
                                    width: "220px"
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/components/gtoc/ui/MovieOverlay.tsx",
                                lineNumber: 222,
                                columnNumber: 29
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2 text-[10px] text-white/40",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Size"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/gtoc/ui/MovieOverlay.tsx",
                                        lineNumber: 231,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "range",
                                        min: 16,
                                        max: 72,
                                        value: missionNameSize,
                                        onChange: (e)=>setMissionNameSize(parseInt(e.target.value)),
                                        className: "w-20 accent-violet-500"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/gtoc/ui/MovieOverlay.tsx",
                                        lineNumber: 232,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: [
                                            missionNameSize,
                                            "px"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/gtoc/ui/MovieOverlay.tsx",
                                        lineNumber: 240,
                                        columnNumber: 33
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/gtoc/ui/MovieOverlay.tsx",
                                lineNumber: 230,
                                columnNumber: 29
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/gtoc/ui/MovieOverlay.tsx",
                        lineNumber: 221,
                        columnNumber: 25
                    }, this),
                    missionName && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-right select-none",
                        style: {
                            fontSize: `${missionNameSize}px`,
                            fontWeight: 700,
                            fontFamily: "'Inter', 'Outfit', system-ui, sans-serif",
                            letterSpacing: "-0.02em",
                            color: "#ffffff",
                            textShadow: "0 0 20px rgba(139,92,246,0.5), 0 0 60px rgba(139,92,246,0.2), 0 2px 4px rgba(0,0,0,0.8)",
                            lineHeight: 1.1
                        },
                        children: missionName
                    }, void 0, false, {
                        fileName: "[project]/src/components/gtoc/ui/MovieOverlay.tsx",
                        lineNumber: 246,
                        columnNumber: 25
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/gtoc/ui/MovieOverlay.tsx",
                lineNumber: 215,
                columnNumber: 17
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/gtoc/ui/MovieOverlay.tsx",
        lineNumber: 164,
        columnNumber: 9
    }, this);
}
_s1(MovieOverlay, "kYJQ95uM1WtWYqtocegNtws9mKw=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$useMovieStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMovieStore"]
    ];
});
_c1 = MovieOverlay;
var _c, _c1;
__turbopack_context__.k.register(_c, "DraggableLogo");
__turbopack_context__.k.register(_c1, "MovieOverlay");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/gtoc/utils/VideoRecorder.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "VideoRecorder",
    ()=>VideoRecorder
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$mp4$2d$muxer$2f$build$2f$mp4$2d$muxer$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/mp4-muxer/build/mp4-muxer.mjs [app-client] (ecmascript)");
;
class VideoRecorder {
    encoder = null;
    muxer = null;
    frameIndex = 0;
    fps = 60;
    canvas;
    started = false;
    // Compositing canvas for overlaying DOM labels
    compCanvas = null;
    compCtx = null;
    // 4K target
    targetWidth = 3840;
    targetHeight = 2160;
    constructor(canvas){
        this.canvas = canvas;
    }
    isSupported() {
        return typeof VideoEncoder !== "undefined";
    }
    /** Create or get the compositing canvas sized to 4K */ getCompositingCanvas() {
        if (!this.compCanvas) {
            this.compCanvas = document.createElement("canvas");
            this.compCanvas.width = this.targetWidth;
            this.compCanvas.height = this.targetHeight;
            this.compCtx = this.compCanvas.getContext("2d", {
                willReadFrequently: false
            });
        }
        return this.compCanvas;
    }
    async startRecording(_manualFrame = false, fps = 60) {
        this.fps = fps;
        this.frameIndex = 0;
        if (!this.isSupported()) {
            throw new Error("WebCodecs VideoEncoder is not supported in this browser. " + "Please use Chrome 94+ or Edge 94+.");
        }
        // Create mp4-muxer target
        this.muxer = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$mp4$2d$muxer$2f$build$2f$mp4$2d$muxer$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Muxer"]({
            target: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$mp4$2d$muxer$2f$build$2f$mp4$2d$muxer$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ArrayBufferTarget"](),
            video: {
                codec: "avc",
                width: this.targetWidth,
                height: this.targetHeight
            },
            fastStart: "in-memory"
        });
        // Create VideoEncoder
        this.encoder = new VideoEncoder({
            output: (chunk, meta)=>{
                this.muxer.addVideoChunk(chunk, meta);
            },
            error: (e)=>{
                console.error("VideoEncoder error:", e);
            }
        });
        // Configure H.264 at high bitrate
        this.encoder.configure({
            codec: "avc1.640033",
            width: this.targetWidth,
            height: this.targetHeight,
            bitrate: 50_000_000,
            framerate: this.fps,
            hardwareAcceleration: "prefer-hardware"
        });
        this.started = true;
        console.log(`VideoRecorder: started (WebCodecs H.264 @ ${fps} fps, 4K)`);
    }
    /**
     * Capture a frame from a canvas (can be the compositing canvas or the
     * raw WebGL canvas). Each frame gets an exact timestamp so the output
     * video has perfectly uniform frame timing.
     */ captureFrame(sourceCanvas) {
        if (!this.encoder || !this.started) return;
        const source = sourceCanvas || this.compCanvas || this.canvas;
        const timestampUs = this.frameIndex / this.fps * 1_000_000;
        const durationUs = 1 / this.fps * 1_000_000;
        const frame = new VideoFrame(source, {
            timestamp: timestampUs,
            duration: durationUs
        });
        // Every 60 frames → keyframe (for seekability)
        const isKeyFrame = this.frameIndex % 60 === 0;
        this.encoder.encode(frame, {
            keyFrame: isKeyFrame
        });
        frame.close();
        this.frameIndex++;
    }
    async stopRecordingAndDownload(filename = "gtoc_movie") {
        if (!this.encoder || !this.muxer) return;
        // Flush remaining frames
        await this.encoder.flush();
        this.encoder.close();
        this.muxer.finalize();
        const target = this.muxer.target;
        const blob = new Blob([
            target.buffer
        ], {
            type: "video/mp4"
        });
        // Download
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = filename.replace(/\.[^/.]+$/, "") + ".mp4";
        document.body.appendChild(a);
        a.click();
        setTimeout(()=>{
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);
        this.encoder = null;
        this.muxer = null;
        this.started = false;
        this.compCanvas = null;
        this.compCtx = null;
        console.log(`VideoRecorder: saved ${filename}.mp4 (${this.frameIndex} frames)`);
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/gtoc/utils/PresentationController.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>PresentationController
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$useMovieStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/gtoc/stores/useMovieStore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$f8cd670d$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__D__as__useFrame$3e$__ = __turbopack_context__.i("[project]/node_modules/@react-three/fiber/dist/events-f8cd670d.esm.js [app-client] (ecmascript) <export D as useFrame>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/gtoc/utils/constants.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$fullscreen$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/gtoc/utils/fullscreen.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
function PresentationController({ jd, setJD, setPlaying }) {
    _s();
    const { isPresentationMode, keyframes, togglePresentationMode, setPresentationOpacity } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$useMovieStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMovieStore"])();
    // Local refs for logic state (don't need re-renders for logic internals)
    const fadeState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])("IN");
    const fadeTimer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Fullscreen exit logic
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PresentationController.useEffect": ()=>{
            if (!isPresentationMode && (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$fullscreen$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isFullscreen"])()) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$fullscreen$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["exitFullscreen"])();
            }
        }
    }["PresentationController.useEffect"], [
        isPresentationMode
    ]);
    // Handle external fullscreen changes (ESC key)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PresentationController.useEffect": ()=>{
            const handleChange = {
                "PresentationController.useEffect.handleChange": ()=>{
                    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$fullscreen$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isFullscreen"])() && isPresentationMode) {
                        togglePresentationMode(false);
                    }
                }
            }["PresentationController.useEffect.handleChange"];
            document.addEventListener("fullscreenchange", handleChange);
            document.addEventListener("webkitfullscreenchange", handleChange);
            document.addEventListener("mozfullscreenchange", handleChange);
            document.addEventListener("MSFullscreenChange", handleChange);
            return ({
                "PresentationController.useEffect": ()=>{
                    document.removeEventListener("fullscreenchange", handleChange);
                    document.removeEventListener("webkitfullscreenchange", handleChange);
                    document.removeEventListener("mozfullscreenchange", handleChange);
                    document.removeEventListener("MSFullscreenChange", handleChange);
                }
            })["PresentationController.useEffect"];
        }
    }["PresentationController.useEffect"], [
        isPresentationMode,
        togglePresentationMode
    ]);
    // Animation Loop
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$f8cd670d$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__D__as__useFrame$3e$__["useFrame"])({
        "PresentationController.useFrame": ()=>{
            if (!isPresentationMode) return;
            let startJD = 0;
            let endJD = 0;
            if (keyframes.length >= 2) {
                startJD = keyframes[0].jd;
                endJD = keyframes[keyframes.length - 1].jd;
            } else {
                startJD = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["JD_EPOCH_0"];
                endJD = startJD + 60;
            }
            if (fadeState.current === "PLAYING" && jd >= endJD) {
                console.log("Presentation: End reached. Fading out...");
                fadeState.current = "OUT";
                setPresentationOpacity(1);
                fadeTimer.current = setTimeout({
                    "PresentationController.useFrame": ()=>{
                        setPlaying(false);
                        setJD(startJD);
                        fadeState.current = "RESETTING";
                        setTimeout({
                            "PresentationController.useFrame": ()=>{
                                setJD(startJD);
                                setPlaying(true);
                                setPresentationOpacity(0);
                                fadeState.current = "IN";
                                setTimeout({
                                    "PresentationController.useFrame": ()=>{
                                        fadeState.current = "PLAYING";
                                    }
                                }["PresentationController.useFrame"], 1500);
                            }
                        }["PresentationController.useFrame"], 1000);
                    }
                }["PresentationController.useFrame"], 1500);
            }
        }
    }["PresentationController.useFrame"]);
    // Initial Start / Reset
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PresentationController.useEffect": ()=>{
            if (!isPresentationMode) return;
            const startJD = keyframes.length >= 2 ? keyframes[0].jd : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["JD_EPOCH_0"];
            setPresentationOpacity(1);
            fadeState.current = "RESETTING";
            setPlaying(false);
            setJD(startJD);
            setTimeout({
                "PresentationController.useEffect": ()=>{
                    setJD(startJD);
                    setPlaying(true);
                    setPresentationOpacity(0);
                    fadeState.current = "IN";
                    setTimeout({
                        "PresentationController.useEffect": ()=>{
                            fadeState.current = "PLAYING";
                        }
                    }["PresentationController.useEffect"], 1500);
                }
            }["PresentationController.useEffect"], 500);
        }
    }["PresentationController.useEffect"], [
        isPresentationMode,
        keyframes,
        setJD,
        setPlaying,
        setPresentationOpacity
    ]);
    return null;
}
_s(PresentationController, "g1RopU0VHHemJ6ZiOWSnY46d5yo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$useMovieStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMovieStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$f8cd670d$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__D__as__useFrame$3e$__["useFrame"]
    ];
});
_c = PresentationController;
var _c;
__turbopack_context__.k.register(_c, "PresentationController");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/gtoc/ui/PresentationOverlay.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>PresentationOverlay
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$useMovieStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/gtoc/stores/useMovieStore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$fullscreen$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/gtoc/utils/fullscreen.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function PresentationOverlay() {
    _s();
    const { isPresentationMode, togglePresentationMode, presentationOpacity } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$useMovieStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMovieStore"])();
    // Mouse Idle Logic (for showing/hiding controls)
    const [showControls, setShowControls] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const idleTimer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PresentationOverlay.useEffect": ()=>{
            if (!isPresentationMode) return;
            const onInteract = {
                "PresentationOverlay.useEffect.onInteract": ()=>{
                    setShowControls(true);
                    if (idleTimer.current) clearTimeout(idleTimer.current);
                    idleTimer.current = setTimeout({
                        "PresentationOverlay.useEffect.onInteract": ()=>setShowControls(false)
                    }["PresentationOverlay.useEffect.onInteract"], 3000);
                }
            }["PresentationOverlay.useEffect.onInteract"];
            window.addEventListener("mousemove", onInteract);
            window.addEventListener("mousedown", onInteract);
            window.addEventListener("keydown", onInteract);
            // Initial show
            onInteract();
            return ({
                "PresentationOverlay.useEffect": ()=>{
                    window.removeEventListener("mousemove", onInteract);
                    window.removeEventListener("mousedown", onInteract);
                    window.removeEventListener("keydown", onInteract);
                    if (idleTimer.current) clearTimeout(idleTimer.current);
                }
            })["PresentationOverlay.useEffect"];
        }
    }["PresentationOverlay.useEffect"], [
        isPresentationMode
    ]);
    if (!isPresentationMode) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-export-ignore": true,
        style: {
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 10000,
            pointerEvents: "none"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "black",
                    opacity: presentationOpacity,
                    transition: "opacity 1.5s ease-in-out"
                }
            }, void 0, false, {
                fileName: "[project]/src/components/gtoc/ui/PresentationOverlay.tsx",
                lineNumber: 43,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: "absolute",
                    top: 24,
                    left: 24,
                    pointerEvents: "auto",
                    opacity: showControls ? 1 : 0,
                    transition: "opacity 0.3s ease-in-out",
                    zIndex: 10001
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: ()=>{
                        togglePresentationMode(false);
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$fullscreen$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["exitFullscreen"])();
                    },
                    style: {
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        border: "none",
                        background: "rgba(220, 38, 38, 0.8)",
                        color: "white",
                        cursor: "pointer",
                        backdropFilter: "blur(4px)",
                        boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
                        transition: "all 0.2s ease"
                    },
                    onMouseEnter: (e)=>{
                        e.currentTarget.style.background = "rgba(220, 38, 38, 1)";
                        e.currentTarget.style.transform = "scale(1.1)";
                    },
                    onMouseLeave: (e)=>{
                        e.currentTarget.style.background = "rgba(220, 38, 38, 0.8)";
                        e.currentTarget.style.transform = "scale(1)";
                    },
                    title: "Exit Presentation",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                        width: "20",
                        height: "20",
                        viewBox: "0 0 24 24",
                        fill: "none",
                        stroke: "currentColor",
                        strokeWidth: "3",
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            d: "M18 6L6 18M6 6l12 12"
                        }, void 0, false, {
                            fileName: "[project]/src/components/gtoc/ui/PresentationOverlay.tsx",
                            lineNumber: 108,
                            columnNumber: 25
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/gtoc/ui/PresentationOverlay.tsx",
                        lineNumber: 98,
                        columnNumber: 21
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/gtoc/ui/PresentationOverlay.tsx",
                    lineNumber: 68,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/gtoc/ui/PresentationOverlay.tsx",
                lineNumber: 57,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/gtoc/ui/PresentationOverlay.tsx",
        lineNumber: 41,
        columnNumber: 9
    }, this);
}
_s(PresentationOverlay, "nsetetP+6z8NG7v2as4eNCqg3CY=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$useMovieStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMovieStore"]
    ];
});
_c = PresentationOverlay;
var _c;
__turbopack_context__.k.register(_c, "PresentationOverlay");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/gtoc/ui/ExportOverlay.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ExportOverlay
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$useMovieStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/gtoc/stores/useMovieStore.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
function ExportOverlay() {
    _s();
    const { isExporting, exportProgress, exportFrameInfo, exportStartTime, finishExport, setRecording } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$useMovieStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMovieStore"])();
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
    const handleCancel = ()=>{
        // Signal the recording loop to break
        setRecording(false, 0);
        finishExport();
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-export-ignore": true,
        style: {
            position: "fixed",
            inset: 0,
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0, 0, 0, 0.88)",
            backdropFilter: "blur(8px)"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    width: "460px",
                    background: "linear-gradient(145deg, #1a1a2e 0%, #16213e 100%)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "16px",
                    padding: "36px 32px 28px",
                    boxShadow: "0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            marginBottom: "24px"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    width: "32px",
                                    height: "32px",
                                    border: "3px solid rgba(139, 92, 246, 0.2)",
                                    borderTopColor: "#8B5CF6",
                                    borderRadius: "50%",
                                    animation: "exportSpin 1s linear infinite"
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/components/gtoc/ui/ExportOverlay.tsx",
                                lineNumber: 61,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            color: "#fff",
                                            fontSize: "16px",
                                            fontWeight: 700,
                                            letterSpacing: "-0.01em"
                                        },
                                        children: "Exporting 4K Video"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/gtoc/ui/ExportOverlay.tsx",
                                        lineNumber: 72,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            color: "rgba(255,255,255,0.4)",
                                            fontSize: "11px",
                                            fontWeight: 500,
                                            marginTop: "2px"
                                        },
                                        children: "3840 × 2160 · High Bitrate"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/gtoc/ui/ExportOverlay.tsx",
                                        lineNumber: 75,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/gtoc/ui/ExportOverlay.tsx",
                                lineNumber: 71,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/gtoc/ui/ExportOverlay.tsx",
                        lineNumber: 59,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            width: "100%",
                            height: "8px",
                            borderRadius: "4px",
                            background: "rgba(255,255,255,0.06)",
                            overflow: "hidden",
                            marginBottom: "12px"
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                width: `${pct}%`,
                                height: "100%",
                                borderRadius: "4px",
                                background: "linear-gradient(90deg, #7C3AED, #A78BFA)",
                                transition: "width 0.15s ease-out",
                                boxShadow: "0 0 12px rgba(139, 92, 246, 0.4)"
                            }
                        }, void 0, false, {
                            fileName: "[project]/src/components/gtoc/ui/ExportOverlay.tsx",
                            lineNumber: 92,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/gtoc/ui/ExportOverlay.tsx",
                        lineNumber: 82,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "24px"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    color: "rgba(255,255,255,0.5)",
                                    fontSize: "12px",
                                    fontFamily: "monospace"
                                },
                                children: exportFrameInfo
                            }, void 0, false, {
                                fileName: "[project]/src/components/gtoc/ui/ExportOverlay.tsx",
                                lineNumber: 113,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    color: "rgba(255,255,255,0.7)",
                                    fontSize: "13px",
                                    fontWeight: 600,
                                    fontFamily: "monospace"
                                },
                                children: [
                                    pct.toFixed(1),
                                    "%"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/gtoc/ui/ExportOverlay.tsx",
                                lineNumber: 116,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/gtoc/ui/ExportOverlay.tsx",
                        lineNumber: 105,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            color: "rgba(255,255,255,0.35)",
                            fontSize: "11px",
                            textAlign: "center",
                            marginBottom: "20px",
                            fontStyle: "italic"
                        },
                        children: etaStr
                    }, void 0, false, {
                        fileName: "[project]/src/components/gtoc/ui/ExportOverlay.tsx",
                        lineNumber: 122,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: handleCancel,
                        style: {
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
                            transition: "all 0.15s ease"
                        },
                        onMouseEnter: (e)=>{
                            e.currentTarget.style.background = "rgba(239, 68, 68, 0.18)";
                            e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.5)";
                        },
                        onMouseLeave: (e)=>{
                            e.currentTarget.style.background = "rgba(239, 68, 68, 0.08)";
                            e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.3)";
                        },
                        children: "Cancel Export"
                    }, void 0, false, {
                        fileName: "[project]/src/components/gtoc/ui/ExportOverlay.tsx",
                        lineNumber: 135,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/gtoc/ui/ExportOverlay.tsx",
                lineNumber: 48,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("style", {
                children: `
                @keyframes exportSpin {
                    to { transform: rotate(360deg); }
                }
            `
            }, void 0, false, {
                fileName: "[project]/src/components/gtoc/ui/ExportOverlay.tsx",
                lineNumber: 164,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/gtoc/ui/ExportOverlay.tsx",
        lineNumber: 35,
        columnNumber: 9
    }, this);
}
_s(ExportOverlay, "+/ldC584SfgNuoI65auuU7JTouo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$useMovieStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMovieStore"]
    ];
});
_c = ExportOverlay;
var _c;
__turbopack_context__.k.register(_c, "ExportOverlay");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/gtoc/ui/ExportSettingsModal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ExportSettingsModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$useMovieStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/gtoc/stores/useMovieStore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/gtoc/utils/constants.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function ExportSettingsModal({ onStartExport }) {
    _s();
    const { showExportSettings, setShowExportSettings, exportFilename, setExportFilename, exportRate, setExportRate, keyframes } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$useMovieStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMovieStore"])();
    const [localFilename, setLocalFilename] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(exportFilename);
    const [localRate, setLocalRate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(exportRate);
    // Compute estimated video duration based on keyframes and rate
    const durationInfo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ExportSettingsModal.useMemo[durationInfo]": ()=>{
            const startJD = keyframes.length > 0 ? keyframes[0].jd : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["JD_EPOCH_0"];
            const endJD = keyframes.length > 0 ? keyframes[keyframes.length - 1].jd : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["JD_EPOCH_0"] + 60;
            const totalDays = endJD - startJD;
            const FPS = 60;
            const totalFrames = Math.max(1, Math.ceil(totalDays / (localRate / FPS)));
            const durationSec = totalFrames / FPS;
            const min = Math.floor(durationSec / 60);
            const sec = Math.floor(durationSec % 60);
            const formatted = min > 0 ? `${min}m ${sec}s` : `${sec}s`;
            return {
                totalDays: totalDays.toFixed(1),
                totalFrames,
                durationSec: durationSec.toFixed(1),
                formatted
            };
        }
    }["ExportSettingsModal.useMemo[durationInfo]"], [
        keyframes,
        localRate
    ]);
    if (!showExportSettings) return null;
    const handleStart = ()=>{
        setExportFilename(localFilename);
        setExportRate(localRate);
        onStartExport(localFilename, localRate);
    };
    const handleCancel = ()=>{
        setShowExportSettings(false);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-export-ignore": true,
        style: {
            position: "fixed",
            inset: 0,
            zIndex: 99998,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(6px)"
        },
        onClick: (e)=>{
            if (e.target === e.currentTarget) handleCancel();
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                width: "480px",
                background: "linear-gradient(145deg, #1a1a2e 0%, #16213e 100%)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "16px",
                padding: "32px",
                boxShadow: "0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)"
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        marginBottom: "28px"
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                width: "36px",
                                height: "36px",
                                borderRadius: "10px",
                                background: "linear-gradient(135deg, #7C3AED, #A78BFA)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                width: "18",
                                height: "18",
                                viewBox: "0 0 24 24",
                                fill: "none",
                                stroke: "white",
                                strokeWidth: "2",
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polygon", {
                                        points: "23 7 16 12 23 17 23 7"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/gtoc/ui/ExportSettingsModal.tsx",
                                        lineNumber: 85,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                        x: "1",
                                        y: "5",
                                        width: "15",
                                        height: "14",
                                        rx: "2",
                                        ry: "2"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/gtoc/ui/ExportSettingsModal.tsx",
                                        lineNumber: 86,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/gtoc/ui/ExportSettingsModal.tsx",
                                lineNumber: 84,
                                columnNumber: 25
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/gtoc/ui/ExportSettingsModal.tsx",
                            lineNumber: 73,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        color: "#fff",
                                        fontSize: "17px",
                                        fontWeight: 700,
                                        letterSpacing: "-0.01em"
                                    },
                                    children: "Export 4K Video"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/gtoc/ui/ExportSettingsModal.tsx",
                                    lineNumber: 90,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        color: "rgba(255,255,255,0.4)",
                                        fontSize: "11px",
                                        fontWeight: 500,
                                        marginTop: "1px"
                                    },
                                    children: "3840 × 2160 · H.264 · 60 fps"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/gtoc/ui/ExportSettingsModal.tsx",
                                    lineNumber: 93,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/gtoc/ui/ExportSettingsModal.tsx",
                            lineNumber: 89,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/gtoc/ui/ExportSettingsModal.tsx",
                    lineNumber: 72,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        marginBottom: "20px"
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            style: {
                                display: "block",
                                color: "rgba(255,255,255,0.6)",
                                fontSize: "12px",
                                fontWeight: 600,
                                marginBottom: "6px",
                                textTransform: "uppercase",
                                letterSpacing: "0.05em"
                            },
                            children: "Filename"
                        }, void 0, false, {
                            fileName: "[project]/src/components/gtoc/ui/ExportSettingsModal.tsx",
                            lineNumber: 101,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                position: "relative"
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    value: localFilename,
                                    onChange: (e)=>setLocalFilename(e.target.value),
                                    placeholder: "vectra_4k_export",
                                    style: {
                                        width: "100%",
                                        padding: "10px 50px 10px 12px",
                                        borderRadius: "8px",
                                        border: "1px solid rgba(255,255,255,0.12)",
                                        background: "rgba(0,0,0,0.3)",
                                        color: "#fff",
                                        fontSize: "14px",
                                        outline: "none",
                                        fontFamily: "monospace",
                                        boxSizing: "border-box"
                                    },
                                    onFocus: (e)=>{
                                        e.currentTarget.style.borderColor = "rgba(124, 58, 237, 0.5)";
                                    },
                                    onBlur: (e)=>{
                                        e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/src/components/gtoc/ui/ExportSettingsModal.tsx",
                                    lineNumber: 115,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    style: {
                                        position: "absolute",
                                        right: "12px",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        color: "rgba(255,255,255,0.3)",
                                        fontSize: "13px",
                                        fontFamily: "monospace"
                                    },
                                    children: ".mp4"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/gtoc/ui/ExportSettingsModal.tsx",
                                    lineNumber: 139,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/gtoc/ui/ExportSettingsModal.tsx",
                            lineNumber: 114,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/gtoc/ui/ExportSettingsModal.tsx",
                    lineNumber: 100,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        marginBottom: "28px"
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            style: {
                                display: "block",
                                color: "rgba(255,255,255,0.6)",
                                fontSize: "12px",
                                fontWeight: 600,
                                marginBottom: "6px",
                                textTransform: "uppercase",
                                letterSpacing: "0.05em"
                            },
                            children: "Simulation Speed"
                        }, void 0, false, {
                            fileName: "[project]/src/components/gtoc/ui/ExportSettingsModal.tsx",
                            lineNumber: 157,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: "flex",
                                alignItems: "center",
                                gap: "12px"
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "range",
                                    min: 1,
                                    max: 1500,
                                    step: 1,
                                    value: localRate,
                                    onChange: (e)=>setLocalRate(parseInt(e.target.value, 10)),
                                    style: {
                                        flex: 1,
                                        accentColor: "#7C3AED",
                                        height: "4px"
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/src/components/gtoc/ui/ExportSettingsModal.tsx",
                                    lineNumber: 171,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: "flex",
                                        alignItems: "baseline",
                                        gap: "4px",
                                        minWidth: "90px"
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "number",
                                            min: 1,
                                            max: 3650,
                                            value: localRate,
                                            onChange: (e)=>{
                                                const val = Math.max(1, Math.min(3650, parseInt(e.target.value || "1", 10)));
                                                setLocalRate(val);
                                            },
                                            style: {
                                                width: "55px",
                                                padding: "6px 8px",
                                                borderRadius: "6px",
                                                border: "1px solid rgba(255,255,255,0.12)",
                                                background: "rgba(0,0,0,0.3)",
                                                color: "#fff",
                                                fontSize: "13px",
                                                textAlign: "right",
                                                outline: "none",
                                                fontFamily: "monospace"
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/gtoc/ui/ExportSettingsModal.tsx",
                                            lineNumber: 192,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                color: "rgba(255,255,255,0.4)",
                                                fontSize: "12px"
                                            },
                                            children: "days/s"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/gtoc/ui/ExportSettingsModal.tsx",
                                            lineNumber: 214,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/gtoc/ui/ExportSettingsModal.tsx",
                                    lineNumber: 184,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/gtoc/ui/ExportSettingsModal.tsx",
                            lineNumber: 170,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                marginTop: "10px",
                                padding: "10px 12px",
                                borderRadius: "8px",
                                background: "rgba(124, 58, 237, 0.08)",
                                border: "1px solid rgba(124, 58, 237, 0.15)"
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center"
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                color: "rgba(255,255,255,0.5)",
                                                fontSize: "11px",
                                                fontWeight: 600,
                                                textTransform: "uppercase",
                                                letterSpacing: "0.04em"
                                            },
                                            children: "Est. Video Duration"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/gtoc/ui/ExportSettingsModal.tsx",
                                            lineNumber: 229,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                color: "#A78BFA",
                                                fontSize: "16px",
                                                fontWeight: 700,
                                                fontFamily: "monospace"
                                            },
                                            children: durationInfo.formatted
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/gtoc/ui/ExportSettingsModal.tsx",
                                            lineNumber: 232,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/gtoc/ui/ExportSettingsModal.tsx",
                                    lineNumber: 228,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: "flex",
                                        justifyContent: "space-between",
                                        marginTop: "5px"
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            color: "rgba(255,255,255,0.3)",
                                            fontSize: "10px"
                                        },
                                        children: [
                                            durationInfo.totalDays,
                                            " sim days · ",
                                            durationInfo.totalFrames.toLocaleString(),
                                            " frames"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/gtoc/ui/ExportSettingsModal.tsx",
                                        lineNumber: 237,
                                        columnNumber: 29
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/gtoc/ui/ExportSettingsModal.tsx",
                                    lineNumber: 236,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/gtoc/ui/ExportSettingsModal.tsx",
                            lineNumber: 219,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/gtoc/ui/ExportSettingsModal.tsx",
                    lineNumber: 156,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        display: "flex",
                        gap: "10px"
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handleCancel,
                            style: {
                                flex: 1,
                                padding: "11px",
                                borderRadius: "8px",
                                border: "1px solid rgba(255,255,255,0.12)",
                                background: "rgba(255,255,255,0.04)",
                                color: "rgba(255,255,255,0.7)",
                                fontSize: "13px",
                                fontWeight: 600,
                                cursor: "pointer",
                                transition: "all 0.15s ease"
                            },
                            onMouseEnter: (e)=>{
                                e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                            },
                            onMouseLeave: (e)=>{
                                e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                            },
                            children: "Cancel"
                        }, void 0, false, {
                            fileName: "[project]/src/components/gtoc/ui/ExportSettingsModal.tsx",
                            lineNumber: 246,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handleStart,
                            style: {
                                flex: 1,
                                padding: "11px",
                                borderRadius: "8px",
                                border: "none",
                                background: "linear-gradient(135deg, #7C3AED, #6D28D9)",
                                color: "#fff",
                                fontSize: "13px",
                                fontWeight: 700,
                                cursor: "pointer",
                                transition: "all 0.15s ease",
                                boxShadow: "0 4px 15px rgba(124, 58, 237, 0.3)"
                            },
                            onMouseEnter: (e)=>{
                                e.currentTarget.style.transform = "translateY(-1px)";
                                e.currentTarget.style.boxShadow = "0 6px 20px rgba(124, 58, 237, 0.4)";
                            },
                            onMouseLeave: (e)=>{
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow = "0 4px 15px rgba(124, 58, 237, 0.3)";
                            },
                            children: "Start Export"
                        }, void 0, false, {
                            fileName: "[project]/src/components/gtoc/ui/ExportSettingsModal.tsx",
                            lineNumber: 269,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/gtoc/ui/ExportSettingsModal.tsx",
                    lineNumber: 245,
                    columnNumber: 17
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/gtoc/ui/ExportSettingsModal.tsx",
            lineNumber: 61,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/gtoc/ui/ExportSettingsModal.tsx",
        lineNumber: 45,
        columnNumber: 9
    }, this);
}
_s(ExportSettingsModal, "DrTtWQcbR8Eqt9jKD8WxqLCXbjU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$useMovieStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMovieStore"]
    ];
});
_c = ExportSettingsModal;
var _c;
__turbopack_context__.k.register(_c, "ExportSettingsModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/gtoc/ViewerCanvas.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ViewerCanvas
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react-dom/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$react$2d$three$2d$fiber$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@react-three/fiber/dist/react-three-fiber.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$f8cd670d$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__C__as__useThree$3e$__ = __turbopack_context__.i("[project]/node_modules/@react-three/fiber/dist/events-f8cd670d.esm.js [app-client] (ecmascript) <export C as useThree>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$f8cd670d$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__D__as__useFrame$3e$__ = __turbopack_context__.i("[project]/node_modules/@react-three/fiber/dist/events-f8cd670d.esm.js [app-client] (ecmascript) <export D as useFrame>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$OrbitControls$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@react-three/drei/core/OrbitControls.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$Stars$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@react-three/drei/core/Stars.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$GizmoHelper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@react-three/drei/core/GizmoHelper.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$GizmoViewport$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@react-three/drei/core/GizmoViewport.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/build/three.core.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$solutions$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/gtoc/solutions/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$solutions$2f$Solutions3D$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Solutions3D$3e$__ = __turbopack_context__.i("[project]/src/components/gtoc/solutions/Solutions3D.tsx [app-client] (ecmascript) <export default as Solutions3D>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$sceneParts$2f$HUD$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/gtoc/sceneParts/HUD.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$sceneParts$2f$InstancedBodies$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/gtoc/sceneParts/InstancedBodies.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$sceneParts$2f$MergedOrbitPaths$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/gtoc/sceneParts/MergedOrbitPaths.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$sceneParts$2f$SceneHelpers$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/gtoc/sceneParts/SceneHelpers.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$sceneParts$2f$KeyframeCameraDriver$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/gtoc/sceneParts/KeyframeCameraDriver.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$KeplerSolver$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/gtoc/KeplerSolver.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/gtoc/utils/constants.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$dataLoader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/gtoc/utils/dataLoader.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$simClock$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/gtoc/utils/simClock.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$ui$2f$Ribbon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/gtoc/ui/Ribbon.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$planetStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/gtoc/stores/planetStore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$solutions$2f$useSolutions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/gtoc/solutions/useSolutions.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$shipUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/gtoc/utils/shipUtils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$useMovieStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/gtoc/stores/useMovieStore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$ui$2f$MovieOverlay$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/gtoc/ui/MovieOverlay.tsx [app-client] (ecmascript)");
// MovieLogoHUD removed — logo is rendered via HTML overlay (MovieOverlay.tsx)
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$VideoRecorder$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/gtoc/utils/VideoRecorder.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$PresentationController$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/gtoc/utils/PresentationController.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$ui$2f$PresentationOverlay$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/gtoc/ui/PresentationOverlay.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$ui$2f$ExportOverlay$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/gtoc/ui/ExportOverlay.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$ui$2f$ExportSettingsModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/gtoc/ui/ExportSettingsModal.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature(), _s4 = __turbopack_context__.k.signature();
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
;
;
;
;
// -------------------- CAMERA ANIMATOR --------------------
function useCameraAnimator(controlsRef) {
    _s();
    const { camera } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$f8cd670d$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__C__as__useThree$3e$__["useThree"])();
    const animRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const easeInOut = (t)=>t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    const animate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useCameraAnimator.useCallback[animate]": (toPos, toTarget, durMs)=>{
            if (animRef.current) cancelAnimationFrame(animRef.current);
            const fromPos = camera.position.clone();
            const fromTarget = controlsRef.current?.target?.clone() ?? new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](0, 0, 0);
            const start = performance.now();
            const dur = Math.max(80, durMs);
            const tick = {
                "useCameraAnimator.useCallback[animate].tick": ()=>{
                    const now = performance.now();
                    const t = Math.min(1, (now - start) / dur);
                    const k = easeInOut(t);
                    camera.position.lerpVectors(fromPos, toPos, k);
                    if (controlsRef.current) {
                        controlsRef.current.target.lerpVectors(fromTarget, toTarget, k);
                        controlsRef.current.update();
                    }
                    if (t < 1) {
                        animRef.current = requestAnimationFrame(tick);
                    } else {
                        animRef.current = null;
                    }
                }
            }["useCameraAnimator.useCallback[animate].tick"];
            animRef.current = requestAnimationFrame(tick);
        }
    }["useCameraAnimator.useCallback[animate]"], [
        camera,
        controlsRef
    ]);
    const moveTowardAxis = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useCameraAnimator.useCallback[moveTowardAxis]": (axis, mode)=>{
            if (!controlsRef.current) return;
            const target = controlsRef.current.target.clone();
            const dist = camera.position.distanceTo(target);
            const dir = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](axis === "x" ? 1 : axis === "-x" ? -1 : 0, axis === "y" ? 1 : axis === "-y" ? -1 : 0, axis === "z" ? 1 : axis === "-z" ? -1 : 0);
            const fullPos = target.clone().add(dir.multiplyScalar(dist));
            const frac = mode === "nudge" ? 0.35 : 1.0;
            const toPos = camera.position.clone().lerp(fullPos, frac);
            animate(toPos, target, mode === "nudge" ? 240 : 650);
        }
    }["useCameraAnimator.useCallback[moveTowardAxis]"], [
        animate,
        camera.position,
        controlsRef
    ]);
    return {
        moveTowardAxis
    };
}
_s(useCameraAnimator, "Pfum22EObAuZHEElhIDYI46sLBI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$f8cd670d$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__C__as__useThree$3e$__["useThree"]
    ];
});
function GizmoCameraDriver({ controlsRef, intentRef }) {
    _s1();
    const { moveTowardAxis } = useCameraAnimator(controlsRef);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "GizmoCameraDriver.useEffect": ()=>{
            let raf;
            const tick = {
                "GizmoCameraDriver.useEffect.tick": ()=>{
                    const intent = intentRef.current;
                    if (intent) {
                        intentRef.current = null;
                        moveTowardAxis(intent.axis, intent.mode);
                    }
                    raf = requestAnimationFrame(tick);
                }
            }["GizmoCameraDriver.useEffect.tick"];
            raf = requestAnimationFrame(tick);
            return ({
                "GizmoCameraDriver.useEffect": ()=>cancelAnimationFrame(raf)
            })["GizmoCameraDriver.useEffect"];
        }
    }["GizmoCameraDriver.useEffect"], [
        intentRef,
        moveTowardAxis
    ]);
    return null;
}
_s1(GizmoCameraDriver, "FgRhUxuyXiNR87Sv/P1vwJmI6ME=", false, function() {
    return [
        useCameraAnimator
    ];
});
_c = GizmoCameraDriver;
function CenterTracker({ controlsRef, centerBodyId, bodies, jd }) {
    _s2();
    const { camera } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$f8cd670d$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__C__as__useThree$3e$__["useThree"])();
    const previousCenterRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const { solutions } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$solutions$2f$useSolutions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSolutions"])();
    const { isPresentationMode, keyframes } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$useMovieStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMovieStore"])();
    const targetBody = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "CenterTracker.useMemo[targetBody]": ()=>{
            if (!centerBodyId) return null;
            return bodies?.find({
                "CenterTracker.useMemo[targetBody]": (b)=>String(b.id) === String(centerBodyId)
            }["CenterTracker.useMemo[targetBody]"]);
        }
    }["CenterTracker.useMemo[targetBody]"], [
        centerBodyId,
        bodies
    ]);
    const targetShipSol = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "CenterTracker.useMemo[targetShipSol]": ()=>{
            if (!centerBodyId) return null;
            if (String(centerBodyId).startsWith("ship-")) {
                const solId = String(centerBodyId).replace("ship-", "");
                return solutions.find({
                    "CenterTracker.useMemo[targetShipSol]": (s)=>s.id === solId
                }["CenterTracker.useMemo[targetShipSol]"]);
            }
            return null;
        }
    }["CenterTracker.useMemo[targetShipSol]"], [
        centerBodyId,
        solutions
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$f8cd670d$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__D__as__useFrame$3e$__["useFrame"])({
        "CenterTracker.useFrame": ()=>{
            if (!controlsRef.current) return;
            // improved: If KeyframeCameraDriver is active (Presentation + valid keyframes),
            // it handles the camera/target fully. CenterTracker should back off to avoid double-application.
            if (isPresentationMode && keyframes.length >= 2) return;
            let targetPos = null;
            if (targetBody) {
                targetPos = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$KeplerSolver$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["keplerToPositionAU"])(targetBody, jd);
            } else if (targetShipSol) {
                targetPos = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$shipUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getShipPosition"])(targetShipSol, jd, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["JD_EPOCH_0"]);
            }
            if (targetPos) {
                const prevTarget = controlsRef.current.target.clone();
                controlsRef.current.target.copy(targetPos);
                if (previousCenterRef.current === centerBodyId) {
                    const delta = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"]().subVectors(targetPos, prevTarget);
                    camera.position.add(delta);
                }
            } else if (centerBodyId === null && previousCenterRef.current !== null) {
                const prevTarget = controlsRef.current.target.clone();
                controlsRef.current.target.set(0, 0, 0);
                const delta = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"]().subVectors(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](0, 0, 0), prevTarget);
                camera.position.add(delta);
            }
            previousCenterRef.current = centerBodyId;
        }
    }["CenterTracker.useFrame"]);
    return null;
}
_s2(CenterTracker, "HeLLH8ZCVUAPCN0T6zTkL8JVHBA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$f8cd670d$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__C__as__useThree$3e$__["useThree"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$solutions$2f$useSolutions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSolutions"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$useMovieStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMovieStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$f8cd670d$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__D__as__useFrame$3e$__["useFrame"]
    ];
});
_c1 = CenterTracker;
function ViewerCanvas(props = {}) {
    _s3();
    const usingExternalClock = "jd" in props && "setJD" in props && "isPlaying" in props && "setPlaying" in props;
    const { onSave, onExit, isSaving } = props;
    const { jd, setJD, isPlaying, setPlaying, rate, setRate } = usingExternalClock ? props : (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$simClock$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSimClock"])({
        jd0: props.initialTime?.jd ?? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["JD_EPOCH_0"],
        jdMin: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["JD_EPOCH_0"],
        jdMax: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["JD_EPOCH_0"] + 200 * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DAYS_PER_YEAR"],
        rate0: props.initialTime?.rate ?? 50,
        startPlaying: props.initialTime?.isPlaying ?? false
    });
    const onTimeUpdateRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(props.onTimeUpdate);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ViewerCanvas.useEffect": ()=>{
            onTimeUpdateRef.current = props.onTimeUpdate;
        }
    }["ViewerCanvas.useEffect"], [
        props.onTimeUpdate
    ]);
    const latestTimeRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({
        jd,
        isPlaying,
        rate
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ViewerCanvas.useEffect": ()=>{
            latestTimeRef.current = {
                jd,
                isPlaying,
                rate
            };
        }
    }["ViewerCanvas.useEffect"], [
        jd,
        isPlaying,
        rate
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ViewerCanvas.useEffect": ()=>{
            if (!onTimeUpdateRef.current) return;
            const interval = window.setInterval({
                "ViewerCanvas.useEffect.interval": ()=>{
                    const cb = onTimeUpdateRef.current;
                    if (!cb) return;
                    const t = latestTimeRef.current;
                    cb(t.jd, t.isPlaying, t.rate);
                }
            }["ViewerCanvas.useEffect.interval"], 250);
            return ({
                "ViewerCanvas.useEffect": ()=>window.clearInterval(interval)
            })["ViewerCanvas.useEffect"];
        }
    }["ViewerCanvas.useEffect"], []);
    const bodiesHook = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$dataLoader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBodiesFromGTOCCSV"])("/data/df_extracted_full.csv", [
        "Planet",
        "Asteroid",
        "Comet"
    ]);
    const bodies = props.bodies ?? bodiesHook.bodies ?? [];
    const hookError = bodiesHook.error;
    const { setPlanets, selectedBodies, planets: storePlanets, showOrbits, customColors } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$planetStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePlanetStore"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ViewerCanvas.useEffect": ()=>{
            if (bodies && bodies.length > 0) {
                // Sync store if lengths differ (e.g. data loaded)
                // We apply any persisted custom colors here
                if (storePlanets.length !== bodies.length) {
                    const mapped = bodies.filter({
                        "ViewerCanvas.useEffect.mapped": (b)=>b && (b.name || b.id)
                    }["ViewerCanvas.useEffect.mapped"]).map({
                        "ViewerCanvas.useEffect.mapped": (b)=>{
                            const idStr = String(b.id);
                            // Use custom color if persisted, else default
                            const savedColor = customColors[idStr];
                            const defaultColor = b.color ?? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TYPE_COLORS"][b.type] ?? "#ffffff";
                            return {
                                ...b,
                                id: b.id,
                                name: b.name || String(b.id),
                                type: b.type,
                                color: savedColor ?? defaultColor
                            };
                        }
                    }["ViewerCanvas.useEffect.mapped"]);
                    setPlanets(mapped);
                }
            }
        }
    }["ViewerCanvas.useEffect"], [
        bodies,
        setPlanets,
        storePlanets.length,
        storePlanets,
        customColors
    ]);
    const colorMap = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ViewerCanvas.useMemo[colorMap]": ()=>{
            const map = new Map();
            if (!storePlanets) return map;
            storePlanets.forEach({
                "ViewerCanvas.useMemo[colorMap]": (p)=>{
                    map.set(String(p.id), p.color);
                }
            }["ViewerCanvas.useMemo[colorMap]"]);
            return map;
        }
    }["ViewerCanvas.useMemo[colorMap]"], [
        storePlanets
    ]);
    // Pre-filter + color-map bodies once for instanced rendering
    const validBodies = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ViewerCanvas.useMemo[validBodies]": ()=>{
            if (!bodies) return [];
            return bodies.filter({
                "ViewerCanvas.useMemo[validBodies]": (b)=>b && (b.name || b.id) && b.a_AU && b.e !== undefined
            }["ViewerCanvas.useMemo[validBodies]"]).map({
                "ViewerCanvas.useMemo[validBodies]": (b)=>({
                        ...b,
                        color: colorMap.get(String(b.id)) ?? b.color ?? "#ffffff"
                    })
            }["ViewerCanvas.useMemo[validBodies]"]);
        }
    }["ViewerCanvas.useMemo[validBodies]"], [
        bodies,
        colorMap
    ]);
    /* -------------------------------------------------------------------------- */ /*                                MOVIE LOGIC                                 */ /* -------------------------------------------------------------------------- */ const canvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const recorderRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const glRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Subscribe to movie store values for layout + UI only
    const { isRecording, isMovieMode, aspectRatio, isPresentationMode, isExporting } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$useMovieStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMovieStore"])();
    // Convenience: hide UI when in presentation or exporting
    const hideUI = isPresentationMode || isExporting;
    // Open the settings modal OR cancel if already exporting
    const handleMakeMovie = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ViewerCanvas.useCallback[handleMakeMovie]": ()=>{
            const store = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$useMovieStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMovieStore"].getState();
            if (store.isRecording || store.isExporting) {
                // Cancel
                store.setRecording(false, 0);
                recorderRef.current?.stopRecordingAndDownload(`vectra_movie_${Date.now()}`).catch(console.error);
                store.finishExport();
                setPlaying(false);
                if (glRef.current && canvasRef.current) {
                    glRef.current.setPixelRatio(window.devicePixelRatio);
                    glRef.current.setSize(window.innerWidth, window.innerHeight);
                }
                window.dispatchEvent(new Event("resize"));
                return;
            }
            // Show settings modal
            store.setShowExportSettings(true);
        }
    }["ViewerCanvas.useCallback[handleMakeMovie]"], [
        setPlaying
    ]);
    // Actual export — called from ExportSettingsModal
    const handleStartExport = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ViewerCanvas.useCallback[handleStartExport]": async (filename, exportRate)=>{
            if (!canvasRef.current || !glRef.current) return;
            const store = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$useMovieStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMovieStore"].getState();
            store.startExport();
            await new Promise({
                "ViewerCanvas.useCallback[handleStartExport]": (r)=>requestAnimationFrame({
                        "ViewerCanvas.useCallback[handleStartExport]": ()=>requestAnimationFrame(r)
                    }["ViewerCanvas.useCallback[handleStartExport]"])
            }["ViewerCanvas.useCallback[handleStartExport]"]);
            const TARGET_W = 3840;
            const TARGET_H = 2160;
            const gl = glRef.current;
            const canvas = canvasRef.current;
            // Force drawing buffer to 4K WITHOUT changing CSS layout.
            // Keeping the canvas DOM element at viewport size is critical:
            // drei Html overlays and MovieOverlay logos are positioned in
            // viewport-space, so the DOM layout must remain unchanged for
            // getBoundingClientRect() to return correct coords during compositing.
            const force4K = {
                "ViewerCanvas.useCallback[handleStartExport].force4K": ()=>{
                    canvas.width = TARGET_W;
                    canvas.height = TARGET_H;
                    gl.setPixelRatio(1);
                    gl.setSize(TARGET_W, TARGET_H, false);
                    gl.setViewport(0, 0, TARGET_W, TARGET_H);
                }
            }["ViewerCanvas.useCallback[handleStartExport].force4K"];
            force4K();
            await new Promise({
                "ViewerCanvas.useCallback[handleStartExport]": (r)=>requestAnimationFrame({
                        "ViewerCanvas.useCallback[handleStartExport]": ()=>requestAnimationFrame(r)
                    }["ViewerCanvas.useCallback[handleStartExport]"])
            }["ViewerCanvas.useCallback[handleStartExport]"]);
            force4K();
            const recorder = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$VideoRecorder$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["VideoRecorder"](canvas);
            recorderRef.current = recorder;
            setPlaying(false);
            // Compositing canvas for overlaying DOM content onto WebGL
            const compCanvas = recorder.getCompositingCanvas();
            const compCtx = compCanvas.getContext("2d");
            // Pre-load logo images from store data
            const logoImages = new Map();
            const logos = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$useMovieStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMovieStore"].getState().logos;
            for (const logo of logos){
                const img = new Image();
                img.crossOrigin = "anonymous";
                img.src = logo.url;
                try {
                    await new Promise({
                        "ViewerCanvas.useCallback[handleStartExport]": (resolve)=>{
                            img.onload = ({
                                "ViewerCanvas.useCallback[handleStartExport]": ()=>resolve()
                            })["ViewerCanvas.useCallback[handleStartExport]"];
                            img.onerror = ({
                                "ViewerCanvas.useCallback[handleStartExport]": ()=>resolve()
                            })["ViewerCanvas.useCallback[handleStartExport]"];
                        }
                    }["ViewerCanvas.useCallback[handleStartExport]"]);
                } catch  {}
                if (img.complete && img.naturalWidth > 0) logoImages.set(logo.id, img);
            }
            const canvasClientW = canvas.clientWidth || window.innerWidth;
            const canvasClientH = canvas.clientHeight || window.innerHeight;
            const scaleX = TARGET_W / canvasClientW;
            const scaleY = TARGET_H / canvasClientH;
            // Recursive DOM renderer: walks the element tree and draws to Canvas 2D
            const renderElement = {
                "ViewerCanvas.useCallback[handleStartExport].renderElement": (el, canvasRect)=>{
                    const cs = window.getComputedStyle(el);
                    if (cs.display === "none" || cs.visibility === "hidden") return;
                    if (parseFloat(cs.opacity) < 0.01) return;
                    if (el.closest("[data-export-ignore]")) return;
                    const rect = el.getBoundingClientRect();
                    // Skip elements outside canvas
                    if (rect.right < canvasRect.left || rect.left > canvasRect.right || rect.bottom < canvasRect.top || rect.top > canvasRect.bottom) return;
                    if (rect.width < 1 || rect.height < 1) return;
                    const x = (rect.left - canvasRect.left) * scaleX;
                    const y = (rect.top - canvasRect.top) * scaleY;
                    const w = rect.width * scaleX;
                    const h = rect.height * scaleY;
                    compCtx.save();
                    compCtx.globalAlpha = parseFloat(cs.opacity) || 1;
                    // Draw background
                    const bg = cs.backgroundColor;
                    if (bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent") {
                        compCtx.fillStyle = bg;
                        const br = parseFloat(cs.borderRadius) * scaleX || 0;
                        compCtx.beginPath();
                        compCtx.roundRect(x, y, w, h, Math.min(br, w / 2, h / 2));
                        compCtx.fill();
                    }
                    // Draw border
                    const bw = parseFloat(cs.borderTopWidth);
                    if (bw > 0 && cs.borderTopStyle !== "none") {
                        const bc = cs.borderTopColor;
                        if (bc && bc !== "rgba(0, 0, 0, 0)" && bc !== "transparent") {
                            compCtx.strokeStyle = bc;
                            compCtx.lineWidth = bw * scaleX;
                            const br = parseFloat(cs.borderRadius) * scaleX || 0;
                            compCtx.beginPath();
                            compCtx.roundRect(x, y, w, h, Math.min(br, w / 2, h / 2));
                            compCtx.stroke();
                        }
                    }
                    // Draw text for leaf text nodes
                    for (const child of el.childNodes){
                        if (child.nodeType === Node.TEXT_NODE) {
                            const txt = child.textContent?.trim();
                            if (!txt) continue;
                            const range = document.createRange();
                            range.selectNodeContents(child);
                            const rects = range.getClientRects();
                            if (rects.length === 0) continue;
                            for (const tr of rects){
                                const tx = (tr.left + tr.width / 2 - canvasRect.left) * scaleX;
                                const ty = (tr.top + tr.height / 2 - canvasRect.top) * scaleY;
                                if (tx < 0 || tx > TARGET_W || ty < 0 || ty > TARGET_H) continue;
                                const fontSize = parseFloat(cs.fontSize) * scaleX;
                                compCtx.font = `${cs.fontWeight} ${Math.max(10, fontSize)}px ${cs.fontFamily || "sans-serif"}`;
                                compCtx.fillStyle = cs.color || "#fff";
                                compCtx.textAlign = "center";
                                compCtx.textBaseline = "middle";
                                compCtx.shadowColor = "rgba(0,0,0,0.7)";
                                compCtx.shadowBlur = 2 * scaleX;
                                compCtx.fillText(txt, tx, ty);
                            }
                        }
                    }
                    compCtx.restore();
                    // Recurse into children (skip CANVAS, BUTTON, SVG, INPUT elements)
                    for (const child of el.children){
                        if (child instanceof HTMLElement) {
                            const tag = child.tagName;
                            if (tag === "CANVAS" || tag === "SVG" || tag === "BUTTON" || tag === "INPUT" || tag === "STYLE") continue;
                            renderElement(child, canvasRect);
                        }
                    }
                }
            }["ViewerCanvas.useCallback[handleStartExport].renderElement"];
            // Composite: WebGL canvas + DOM overlays (direct Canvas 2D rendering)
            const compositeFrame = {
                "ViewerCanvas.useCallback[handleStartExport].compositeFrame": ()=>{
                    compCtx.clearRect(0, 0, TARGET_W, TARGET_H);
                    // 1. Draw the WebGL 4K rendering
                    compCtx.drawImage(canvas, 0, 0, TARGET_W, TARGET_H);
                    // 2. Render DOM overlays using recursive renderer
                    // R3F DOM: sharedParent > [canvasWrapper, dreiOverlay1, dreiOverlay2, ...]
                    // Inner container: sharedParent.parentElement > [sharedParent, MovieOverlay, ...]
                    const r3fSharedParent = canvas.parentElement?.parentElement;
                    const innerContainer = r3fSharedParent?.parentElement;
                    const canvasRect = canvas.getBoundingClientRect();
                    // Render drei Html overlays (siblings of canvas wrapper in R3F root)
                    if (r3fSharedParent) {
                        for (const child of r3fSharedParent.children){
                            if (!(child instanceof HTMLElement)) continue;
                            if (child.contains(canvas)) continue; // skip canvas wrapper
                            renderElement(child, canvasRect);
                        }
                    }
                    // Render MovieOverlay content (sibling of Canvas component in inner container)
                    if (innerContainer) {
                        for (const child of innerContainer.children){
                            if (!(child instanceof HTMLElement)) continue;
                            if (child.contains(canvas)) continue; // skip R3F root
                            renderElement(child, canvasRect);
                        }
                    }
                    // 3. Draw logos from store data (guaranteed correct positioning)
                    const currentLogos = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$useMovieStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMovieStore"].getState().logos;
                    currentLogos.forEach({
                        "ViewerCanvas.useCallback[handleStartExport].compositeFrame": (logo)=>{
                            const img = logoImages.get(logo.id);
                            if (!img || img.naturalWidth === 0) return;
                            const logoSize = TARGET_H * 0.15 * logo.scale;
                            const aspect = img.naturalWidth / img.naturalHeight;
                            let drawW, drawH;
                            if (aspect > 1) {
                                drawW = logoSize;
                                drawH = logoSize / aspect;
                            } else {
                                drawH = logoSize;
                                drawW = logoSize * aspect;
                            }
                            const cx = logo.position.x * TARGET_W;
                            const cy = (1 - logo.position.y) * TARGET_H;
                            compCtx.drawImage(img, cx - drawW / 2, cy - drawH / 2, drawW, drawH);
                        }
                    }["ViewerCanvas.useCallback[handleStartExport].compositeFrame"]);
                    // 4. Draw mission name from store data
                    const store = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$useMovieStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMovieStore"].getState();
                    if (store.missionName) {
                        const fontSize = store.missionNameSize * scaleX;
                        compCtx.save();
                        compCtx.font = `700 ${fontSize}px 'Inter', 'Outfit', system-ui, sans-serif`;
                        compCtx.fillStyle = "#ffffff";
                        compCtx.textAlign = "right";
                        compCtx.textBaseline = "bottom";
                        compCtx.shadowColor = "rgba(139,92,246,0.5)";
                        compCtx.shadowBlur = 20 * scaleX;
                        compCtx.fillText(store.missionName, TARGET_W * 0.97, TARGET_H * 0.97);
                        // Second shadow layer for depth
                        compCtx.shadowColor = "rgba(0,0,0,0.8)";
                        compCtx.shadowBlur = 4 * scaleX;
                        compCtx.fillText(store.missionName, TARGET_W * 0.97, TARGET_H * 0.97);
                        compCtx.restore();
                    }
                }
            }["ViewerCanvas.useCallback[handleStartExport].compositeFrame"];
            const keys = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$useMovieStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMovieStore"].getState().keyframes;
            const startJD = keys.length > 0 ? keys[0].jd : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["JD_EPOCH_0"];
            const endJD = keys.length > 0 ? keys[keys.length - 1].jd : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["JD_EPOCH_0"] + 60;
            const FPS = 60;
            const dtPerFrame = (exportRate || 50) / FPS;
            const totalFrames = Math.max(1, Math.ceil((endJD - startJD) / dtPerFrame));
            setJD(startJD);
            await new Promise({
                "ViewerCanvas.useCallback[handleStartExport]": (r)=>setTimeout(r, 300)
            }["ViewerCanvas.useCallback[handleStartExport]"]);
            force4K();
            try {
                await recorder.startRecording(true, FPS);
                setPlaying(false);
                for(let i = 0; i <= totalFrames; i++){
                    if (!__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$useMovieStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMovieStore"].getState().isRecording) break;
                    const t = startJD + i * dtPerFrame;
                    setJD(t);
                    await new Promise({
                        "ViewerCanvas.useCallback[handleStartExport]": (r)=>requestAnimationFrame({
                                "ViewerCanvas.useCallback[handleStartExport]": ()=>requestAnimationFrame(r)
                            }["ViewerCanvas.useCallback[handleStartExport]"])
                    }["ViewerCanvas.useCallback[handleStartExport]"]);
                    force4K();
                    await new Promise({
                        "ViewerCanvas.useCallback[handleStartExport]": (r)=>requestAnimationFrame(r)
                    }["ViewerCanvas.useCallback[handleStartExport]"]);
                    compositeFrame();
                    recorder.captureFrame(compCanvas);
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$useMovieStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMovieStore"].getState().updateExportProgress(i / totalFrames, `Frame ${i + 1} / ${totalFrames + 1}`);
                }
                if (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$useMovieStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMovieStore"].getState().isRecording) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$useMovieStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMovieStore"].getState().updateExportProgress(1, "Finalizing…");
                    await recorder.stopRecordingAndDownload(filename || `vectra_4k_${Date.now()}`);
                }
            } catch (e) {
                console.error("Export failed", e);
                alert("Export Failed: " + (e instanceof Error ? e.message : String(e)));
            } finally{
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$useMovieStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMovieStore"].getState().finishExport();
                setPlaying(false);
                if (glRef.current && canvasRef.current) {
                    glRef.current.setPixelRatio(window.devicePixelRatio);
                    glRef.current.setSize(window.innerWidth, window.innerHeight);
                }
                window.dispatchEvent(new Event("resize"));
            }
        }
    }["ViewerCanvas.useCallback[handleStartExport]"], [
        setJD,
        setPlaying
    ]);
    /* -------------------------------------------------------------------------- */ /*                               VIEW / GIZMO                                 */ /* -------------------------------------------------------------------------- */ const [gizmoHot, setGizmoHot] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const controlsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const gizmoIntentRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const axisColors = gizmoHot ? [
        "#ff3b30",
        "#34c759",
        "#0a84ff"
    ] : [
        "#6b6b6b",
        "#6b6b6b",
        "#6b6b6b"
    ];
    const labelColor = gizmoHot ? "#eaeaea" : "#9a9a9a";
    // Movie Mode "Letterboxing" & Aspect Ratio layout
    const [windowSize, setWindowSize] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        w: 1920,
        h: 1080
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ViewerCanvas.useEffect": ()=>{
            const onResize = {
                "ViewerCanvas.useEffect.onResize": ()=>setWindowSize({
                        w: window.innerWidth,
                        h: window.innerHeight
                    })
            }["ViewerCanvas.useEffect.onResize"];
            onResize();
            window.addEventListener("resize", onResize);
            return ({
                "ViewerCanvas.useEffect": ()=>window.removeEventListener("resize", onResize)
            })["ViewerCanvas.useEffect"];
        }
    }["ViewerCanvas.useEffect"], []);
    const videoLayout = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ViewerCanvas.useMemo[videoLayout]": ()=>{
            if (!isMovieMode) return null;
            const margin = {
                top: 110,
                bottom: 150,
                left: 20,
                right: 20
            };
            const availW = windowSize.w - margin.left - margin.right;
            const availH = windowSize.h - margin.top - margin.bottom;
            const ratio = aspectRatio || 1.7777;
            let w = availW;
            let h = w / ratio;
            if (h > availH) {
                h = availH;
                w = h * ratio;
            }
            return {
                w,
                h,
                marginTop: margin.top,
                scale: 1,
                isScaled: false
            };
        }
    }["ViewerCanvas.useMemo[videoLayout]"], [
        isMovieMode,
        windowSize,
        aspectRatio
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative w-full h-screen bg-black flex flex-col overflow-hidden items-center justify-start",
        children: [
            !hideUI && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$ui$2f$Ribbon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                onSave: onSave,
                onExit: onExit,
                isSaving: isSaving,
                onMakeMovie: handleMakeMovie
            }, void 0, false, {
                fileName: "[project]/src/components/gtoc/ViewerCanvas.tsx",
                lineNumber: 649,
                columnNumber: 19
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `relative transition-all duration-500 ease-out shadow-2xl overflow-hidden ${isMovieMode ? "bg-black" : "w-full h-full flex-1"}`,
                style: isMovieMode && videoLayout && !isPresentationMode && !isExporting ? {
                    width: videoLayout.w,
                    height: videoLayout.h,
                    marginTop: videoLayout.marginTop,
                    flex: "none",
                    transform: videoLayout.isScaled ? `scale(${videoLayout.scale})` : "none",
                    transformOrigin: "top center"
                } : isPresentationMode || isExporting ? {
                    width: "100vw",
                    height: "100vh",
                    margin: 0,
                    flex: "none"
                } : {},
                children: [
                    !isMovieMode && !hideUI && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute bottom-[140px] left-[20px] w-[120px] h-[120px] z-[100] pointer-events-none",
                        onMouseEnter: ()=>setGizmoHot(true),
                        onMouseLeave: ()=>setGizmoHot(false),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                className: "absolute right-0 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full pointer-events-auto cursor-pointer",
                                style: {
                                    background: "transparent"
                                },
                                onClick: ()=>gizmoIntentRef.current = {
                                        axis: "x",
                                        mode: "nudge"
                                    },
                                onDoubleClick: ()=>gizmoIntentRef.current = {
                                        axis: "x",
                                        mode: "snap"
                                    },
                                "aria-label": "X axis"
                            }, void 0, false, {
                                fileName: "[project]/src/components/gtoc/ViewerCanvas.tsx",
                                lineNumber: 681,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                className: "absolute left-1/2 top-0 -translate-x-1/2 w-14 h-14 rounded-full pointer-events-auto cursor-pointer",
                                style: {
                                    background: "transparent"
                                },
                                onClick: ()=>gizmoIntentRef.current = {
                                        axis: "y",
                                        mode: "nudge"
                                    },
                                onDoubleClick: ()=>gizmoIntentRef.current = {
                                        axis: "y",
                                        mode: "snap"
                                    },
                                "aria-label": "Y axis"
                            }, void 0, false, {
                                fileName: "[project]/src/components/gtoc/ViewerCanvas.tsx",
                                lineNumber: 690,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                className: "absolute left-0 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full pointer-events-auto cursor-pointer",
                                style: {
                                    background: "transparent"
                                },
                                onClick: ()=>gizmoIntentRef.current = {
                                        axis: "z",
                                        mode: "nudge"
                                    },
                                onDoubleClick: ()=>gizmoIntentRef.current = {
                                        axis: "z",
                                        mode: "snap"
                                    },
                                "aria-label": "Z axis"
                            }, void 0, false, {
                                fileName: "[project]/src/components/gtoc/ViewerCanvas.tsx",
                                lineNumber: 699,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/gtoc/ViewerCanvas.tsx",
                        lineNumber: 676,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$react$2d$three$2d$fiber$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Canvas"], {
                        dpr: isExporting ? 1 : isRecording ? 1 : [
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
                        onPointerMissed: ()=>{
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$planetStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePlanetStore"].getState().setLockedBodyId(null);
                        },
                        onCreated: ({ gl })=>{
                            canvasRef.current = gl.domElement;
                            glRef.current = gl;
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$PresentationController$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                jd: jd,
                                setJD: setJD,
                                setPlaying: setPlaying
                            }, void 0, false, {
                                fileName: "[project]/src/components/gtoc/ViewerCanvas.tsx",
                                lineNumber: 721,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("color", {
                                attach: "background",
                                args: [
                                    "#000"
                                ]
                            }, void 0, false, {
                                fileName: "[project]/src/components/gtoc/ViewerCanvas.tsx",
                                lineNumber: 722,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ambientLight", {
                                intensity: 0.6
                            }, void 0, false, {
                                fileName: "[project]/src/components/gtoc/ViewerCanvas.tsx",
                                lineNumber: 723,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pointLight", {
                                position: [
                                    0,
                                    0,
                                    0
                                ],
                                intensity: 2.0,
                                color: "#fff"
                            }, void 0, false, {
                                fileName: "[project]/src/components/gtoc/ViewerCanvas.tsx",
                                lineNumber: 724,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$sceneParts$2f$SceneHelpers$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CameraRig"], {}, void 0, false, {
                                fileName: "[project]/src/components/gtoc/ViewerCanvas.tsx",
                                lineNumber: 726,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$OrbitControls$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OrbitControls"], {
                                ref: controlsRef,
                                makeDefault: true,
                                enableDamping: true,
                                dampingFactor: 0.1,
                                mouseButtons: {
                                    LEFT: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MOUSE"].ROTATE,
                                    MIDDLE: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MOUSE"].ROTATE,
                                    RIGHT: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MOUSE"].PAN
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/components/gtoc/ViewerCanvas.tsx",
                                lineNumber: 728,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$Stars$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Stars"], {
                                radius: 100,
                                depth: 50,
                                count: 1000,
                                factor: 2,
                                fade: true,
                                speed: 0.5
                            }, void 0, false, {
                                fileName: "[project]/src/components/gtoc/ViewerCanvas.tsx",
                                lineNumber: 740,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GizmoCameraDriver, {
                                controlsRef: controlsRef,
                                intentRef: gizmoIntentRef
                            }, void 0, false, {
                                fileName: "[project]/src/components/gtoc/ViewerCanvas.tsx",
                                lineNumber: 742,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$sceneParts$2f$KeyframeCameraDriver$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["KeyframeCameraDriver"], {
                                controlsRef: controlsRef,
                                jd: jd,
                                isPlaying: isPlaying
                            }, void 0, false, {
                                fileName: "[project]/src/components/gtoc/ViewerCanvas.tsx",
                                lineNumber: 743,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$sceneParts$2f$SceneHelpers$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Sun"], {}, void 0, false, {
                                fileName: "[project]/src/components/gtoc/ViewerCanvas.tsx",
                                lineNumber: 745,
                                columnNumber: 11
                            }, this),
                            !hideUI && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$sceneParts$2f$SceneHelpers$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Axes"], {
                                size: 1.0
                            }, void 0, false, {
                                fileName: "[project]/src/components/gtoc/ViewerCanvas.tsx",
                                lineNumber: 746,
                                columnNumber: 23
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                                onPointerDown: (e)=>e.stopPropagation(),
                                onPointerUp: (e)=>e.stopPropagation(),
                                onClick: (e)=>e.stopPropagation(),
                                children: !hideUI && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$GizmoHelper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GizmoHelper"], {
                                    alignment: "bottom-left",
                                    margin: [
                                        80,
                                        200
                                    ],
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$GizmoViewport$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GizmoViewport"], {
                                        axisColors: axisColors,
                                        labelColor: labelColor
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/gtoc/ViewerCanvas.tsx",
                                        lineNumber: 755,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/gtoc/ViewerCanvas.tsx",
                                    lineNumber: 754,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/gtoc/ViewerCanvas.tsx",
                                lineNumber: 748,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CenterTracker, {
                                controlsRef: controlsRef,
                                centerBodyId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$planetStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePlanetStore"])({
                                    "ViewerCanvas.usePlanetStore": (s)=>s.centerBodyId
                                }["ViewerCanvas.usePlanetStore"]),
                                bodies: bodies,
                                jd: jd
                            }, void 0, false, {
                                fileName: "[project]/src/components/gtoc/ViewerCanvas.tsx",
                                lineNumber: 760,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$sceneParts$2f$MergedOrbitPaths$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                bodies: validBodies,
                                selectedBodies: selectedBodies,
                                showOrbits: showOrbits,
                                colorMap: colorMap
                            }, void 0, false, {
                                fileName: "[project]/src/components/gtoc/ViewerCanvas.tsx",
                                lineNumber: 767,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$sceneParts$2f$InstancedBodies$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                bodies: validBodies,
                                jd: jd
                            }, void 0, false, {
                                fileName: "[project]/src/components/gtoc/ViewerCanvas.tsx",
                                lineNumber: 773,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$solutions$2f$Solutions3D$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Solutions3D$3e$__["Solutions3D"], {
                                currentJD: jd,
                                epochZeroJD: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["JD_EPOCH_0"],
                                showShip: true
                            }, void 0, false, {
                                fileName: "[project]/src/components/gtoc/ViewerCanvas.tsx",
                                lineNumber: 775,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/gtoc/ViewerCanvas.tsx",
                        lineNumber: 710,
                        columnNumber: 9
                    }, this),
                    !hideUI && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PortalHUD, {
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
                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["JD_EPOCH_0"]
                                ],
                                milestonesISO: props.milestonesISO ?? [
                                    "2000-01-01"
                                ]
                            }, void 0, false, {
                                fileName: "[project]/src/components/gtoc/ViewerCanvas.tsx",
                                lineNumber: 781,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/gtoc/ViewerCanvas.tsx",
                            lineNumber: 780,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/gtoc/ViewerCanvas.tsx",
                        lineNumber: 779,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$ui$2f$MovieOverlay$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                        fileName: "[project]/src/components/gtoc/ViewerCanvas.tsx",
                        lineNumber: 798,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$ui$2f$PresentationOverlay$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                        fileName: "[project]/src/components/gtoc/ViewerCanvas.tsx",
                        lineNumber: 800,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$ui$2f$ExportOverlay$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                        fileName: "[project]/src/components/gtoc/ViewerCanvas.tsx",
                        lineNumber: 801,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$ui$2f$ExportSettingsModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        onStartExport: handleStartExport
                    }, void 0, false, {
                        fileName: "[project]/src/components/gtoc/ViewerCanvas.tsx",
                        lineNumber: 802,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/gtoc/ViewerCanvas.tsx",
                lineNumber: 651,
                columnNumber: 7
            }, this),
            hookError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute top-20 right-5 z-[50] text-xs pointer-events-none",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "px-3 py-2 rounded bg-red-600 text-white shadow",
                    children: hookError
                }, void 0, false, {
                    fileName: "[project]/src/components/gtoc/ViewerCanvas.tsx",
                    lineNumber: 807,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/gtoc/ViewerCanvas.tsx",
                lineNumber: 806,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/gtoc/ViewerCanvas.tsx",
        lineNumber: 648,
        columnNumber: 5
    }, this);
}
_s3(ViewerCanvas, "jsZkI8ucynvcjfViPOe26ad9mCc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$simClock$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSimClock"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$utils$2f$dataLoader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBodiesFromGTOCCSV"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$planetStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePlanetStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$useMovieStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMovieStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gtoc$2f$stores$2f$planetStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePlanetStore"]
    ];
});
_c2 = ViewerCanvas;
function PortalHUD({ children }) {
    _s4();
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PortalHUD.useEffect": ()=>setMounted(true)
    }["PortalHUD.useEffect"], []);
    if (!mounted) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createPortal"])(children, document.body);
}
_s4(PortalHUD, "LrrVfNW3d1raFE0BNzCTILYmIfo=");
_c3 = PortalHUD;
var _c, _c1, _c2, _c3;
__turbopack_context__.k.register(_c, "GizmoCameraDriver");
__turbopack_context__.k.register(_c1, "CenterTracker");
__turbopack_context__.k.register(_c2, "ViewerCanvas");
__turbopack_context__.k.register(_c3, "PortalHUD");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/gtoc/ViewerCanvas.tsx [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/components/gtoc/ViewerCanvas.tsx [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=src_components_gtoc_008e3064._.js.map