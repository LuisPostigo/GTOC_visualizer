"use client";

import React, { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";

export function Sun() {
    return (
        <mesh>
            <sphereGeometry args={[0.05, 32, 32]} />
            <meshBasicMaterial color="#ffcc66" />
        </mesh>
    );
}

export function Axes({ size = 1.0 }: { size?: number }) {
    return (
        <group>
            <Line points={[new THREE.Vector3(0, 0, 0), new THREE.Vector3(size, 0, 0)]} color="#ff5555" lineWidth={1} />
            <Line points={[new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, size, 0)]} color="#55ff55" lineWidth={1} />
            <Line points={[new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, size)]} color="#5555ff" lineWidth={1} />
        </group>
    );
}

export function CameraRig() {
    const { camera } = useThree();
    useEffect(() => {
        camera.position.set(0, 0, 3.5);
    }, [camera]);
    return null;
}
