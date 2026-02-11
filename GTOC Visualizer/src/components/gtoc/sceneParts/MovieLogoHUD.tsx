import React, { Suspense } from "react";
import { useThree } from "@react-three/fiber";
import { Hud, OrthographicCamera, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useMovieStore } from "@/components/gtoc/stores/useMovieStore";

export default function MovieLogoHUD() {
    const { isMovieMode, logoUrl } = useMovieStore();

    if (!isMovieMode || !logoUrl) return null;

    return (
        // @ts-ignore
        <Hud renderPriority={2} clear={false}>
            <OrthographicCamera makeDefault position={[0, 0, 10]} />
            <Suspense fallback={null}>
                <LogoPlane />
            </Suspense>
            <ambientLight intensity={1} />
        </Hud>
    );
}

function LogoPlane() {
    const { size } = useThree();
    const { logoUrl, logoPosition, logoScale } = useMovieStore();
    const texture = useTexture(logoUrl!);

    const baseHeight = size.height * 0.15 * logoScale;
    const aspect = (texture.image as HTMLImageElement).width / (texture.image as HTMLImageElement).height;
    const baseWidth = baseHeight * aspect;

    const posX = (logoPosition.x - 0.5) * size.width;
    const posY = (logoPosition.y - 0.5) * size.height;

    return (
        <mesh position={[posX, posY, 0]}>
            <planeGeometry args={[baseWidth, baseHeight]} />
            <meshBasicMaterial map={texture} transparent />
        </mesh>
    );
}
