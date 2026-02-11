import type { Solution } from "@/components/gtoc/solutions/types";

export type ProjectMeta = {
    id: string;
    name: string;
    createdAt: number;
    modifiedAt: number;
    previewColor?: string;
    dataset: "gtoc13"; // extensible for future
};

export type ProjectData = ProjectMeta & {
    // Solutions
    solutions: Solution[];
    solutionVisibility?: Record<string, boolean>;

    // Planet/View State
    selectedBodies?: string[];
    centerBodyId?: string | null;
    customColors?: Record<string, string>;

    // Playback State
    time?: {
        jd: number;
        isPlaying: boolean;
        rate: number;
    };

    // Camera (optional, can be added later)
    camera?: {
        position: [number, number, number];
        target: [number, number, number];
    };
};
