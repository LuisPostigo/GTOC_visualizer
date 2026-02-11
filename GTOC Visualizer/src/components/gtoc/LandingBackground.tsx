"use client";

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";

function RotatingStars() {
    const ref = useRef<any>(null);
    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.x -= delta / 10;
            ref.current.rotation.y -= delta / 15;
        }
    });
    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Stars
                radius={100}
                depth={50}
                count={5000}
                factor={4}
                saturation={0}
                fade
                speed={1}
            />
            <mesh ref={ref}>
                <Stars
                    radius={300}
                    depth={50}
                    count={1000}
                    factor={6}
                    saturation={0}
                    fade
                    speed={2}
                />
            </mesh>
        </group>
    );
}

export default function LandingBackground() {
    return (
        <div className="fixed inset-0 z-0 bg-black">
            <Canvas camera={{ position: [0, 0, 1] }}>
                <RotatingStars />
                {/* Subtle ambient light if needed, but Stars are emissive usually */}
            </Canvas>
            {/* Gradient overlay for better text readability and "premium" feel */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/80 pointer-events-none" />
        </div>
    );
}
