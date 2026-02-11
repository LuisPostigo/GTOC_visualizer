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
]);

//# sourceMappingURL=src_components_gtoc_7f42143b._.js.map