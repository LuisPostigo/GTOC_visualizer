"use client";

import React, { useMemo } from "react";
import { Line } from "@react-three/drei";
import * as THREE from "three";
import { AU_KM, TYPE_COLORS } from "@/components/gtoc/utils/constants";
import { type Body } from "@/components/gtoc/utils/dataLoader";

export default function OrbitPath({
    body,
    visible = true,
    segments = 256,
    color,
    isSelected = false,
}: {
    body: Body;
    visible?: boolean;
    segments?: number;
    color?: string;
    isSelected?: boolean;
}) {
    if (!visible) return null;

    const points = useMemo(() => {
        const a = body.a_AU;
        const e = body.e;
        if (!Number.isFinite(a) || a <= 0 || !Number.isFinite(e) || e >= 1) return [];

        const pts: THREE.Vector3[] = [];
        const a_km = a * AU_KM;

        const cO = Math.cos(body.Omega),
            sO = Math.sin(body.Omega),
            ci = Math.cos(body.inc),
            si = Math.sin(body.inc),
            co = Math.cos(body.omega),
            so = Math.sin(body.omega);

        const R11 = cO * co - sO * so * ci;
        const R12 = -cO * so - sO * co * ci;
        const R21 = sO * co + cO * so * ci;
        const R22 = -sO * so + cO * co * ci;
        const R31 = so * si;
        const R32 = co * si;

        for (let k = 0; k <= segments; k++) {
            const f = (2 * Math.PI * k) / segments;
            const denom = 1 + e * Math.cos(f);
            if (Math.abs(denom) < 1e-9) continue;

            const r_km = (a_km * (1 - e ** 2)) / denom;
            const x_peri = r_km * Math.cos(f);
            const y_peri = r_km * Math.sin(f);

            const x = (R11 * x_peri + R12 * y_peri) / AU_KM;
            const y = (R21 * x_peri + R22 * y_peri) / AU_KM;
            const z = (R31 * x_peri + R32 * y_peri) / AU_KM;

            if (Number.isFinite(x + y + z)) pts.push(new THREE.Vector3(x, y, z));
        }

        return pts;
    }, [body, segments]);

    if (!points.length) return null;

    // Selection should highlight via thickness/opacity, NOT by overriding the chosen color.
    const lineWidth = isSelected ? 2.5 : 1;
    const opacity = isSelected ? 1.0 : 0.7;
    const finalColor = color ?? TYPE_COLORS[body.type];

    return (
        <Line
            points={points}
            lineWidth={lineWidth}
            color={finalColor}
            opacity={opacity}
            transparent
            depthWrite={false}
            toneMapped={false}
            frustumCulled={false}
        />
    );
}
