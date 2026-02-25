"use client";

import { useEffect, useRef, useState } from "react";
import { useMovieStore } from "../stores/useMovieStore";
import { useFrame } from "@react-three/fiber";
import { JD_EPOCH_0 } from "../utils/constants";

import { exitFullscreen, isFullscreen } from "@/components/gtoc/utils/fullscreen";

interface Props {
    jd: number;
    setJD: (jd: number) => void;
    setPlaying: (playing: boolean) => void;
}

export default function PresentationController({ jd, setJD, setPlaying }: Props) {
    const { isPresentationMode, keyframes, togglePresentationMode, setPresentationOpacity } = useMovieStore();

    // Local refs for logic state (don't need re-renders for logic internals)
    const fadeState = useRef<"IN" | "PLAYING" | "OUT" | "RESETTING">("IN");
    const fadeTimer = useRef<NodeJS.Timeout | null>(null);

    // Fullscreen exit logic
    useEffect(() => {
        if (!isPresentationMode && isFullscreen()) {
            exitFullscreen();
        }
    }, [isPresentationMode]);

    // Handle external fullscreen changes (ESC key)
    useEffect(() => {
        const handleChange = () => {
            if (!isFullscreen() && isPresentationMode) {
                togglePresentationMode(false);
            }
        };

        document.addEventListener("fullscreenchange", handleChange);
        document.addEventListener("webkitfullscreenchange", handleChange);
        document.addEventListener("mozfullscreenchange", handleChange);
        document.addEventListener("MSFullscreenChange", handleChange);

        return () => {
            document.removeEventListener("fullscreenchange", handleChange);
            document.removeEventListener("webkitfullscreenchange", handleChange);
            document.removeEventListener("mozfullscreenchange", handleChange);
            document.removeEventListener("MSFullscreenChange", handleChange);
        };
    }, [isPresentationMode, togglePresentationMode]);

    // Animation Loop
    useFrame(() => {
        if (!isPresentationMode) return;

        const { timelineStartJD, timelineEndJD } = useMovieStore.getState();

        let startJD = 0;
        let endJD = 0;

        if (timelineStartJD !== null && timelineEndJD !== null) {
            startJD = timelineStartJD;
            endJD = timelineEndJD;
        } else if (keyframes.length >= 2) {
            startJD = keyframes[0].jd;
            endJD = keyframes[keyframes.length - 1].jd;
        } else {
            startJD = JD_EPOCH_0;
            // Default to 2000 days if nothing set (approx 40s at 50d/s)
            endJD = startJD + 2000;
        }

        if (fadeState.current === "PLAYING" && jd >= endJD) {
            console.log("Presentation: End reached. Fading out...");
            fadeState.current = "OUT";
            setPresentationOpacity(1);

            fadeTimer.current = setTimeout(() => {
                setPlaying(false);
                setJD(startJD);
                fadeState.current = "RESETTING";

                setTimeout(() => {
                    setJD(startJD);
                    setPlaying(true);
                    setPresentationOpacity(0);
                    fadeState.current = "IN";

                    setTimeout(() => {
                        fadeState.current = "PLAYING";
                    }, 1500);
                }, 1000);
            }, 1500);
        }
    });

    // Initial Start / Reset
    useEffect(() => {
        if (!isPresentationMode) return;

        const { timelineStartJD } = useMovieStore.getState();
        const startJD = timelineStartJD ?? (keyframes.length >= 2 ? keyframes[0].jd : JD_EPOCH_0);

        setPresentationOpacity(1);
        fadeState.current = "RESETTING";

        setPlaying(false);
        setJD(startJD);

        setTimeout(() => {
            setJD(startJD);
            setPlaying(true);
            setPresentationOpacity(0);
            fadeState.current = "IN";

            setTimeout(() => {
                fadeState.current = "PLAYING";
            }, 1500);
        }, 500);
    }, [isPresentationMode, keyframes, setJD, setPlaying, setPresentationOpacity]);

    return null;
}