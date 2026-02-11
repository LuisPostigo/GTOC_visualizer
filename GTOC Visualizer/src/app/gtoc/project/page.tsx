"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProjectViewer from "@/components/gtoc/ProjectViewer";

function ProjectContent() {
    const searchParams = useSearchParams();
    const id = searchParams.get("id");

    if (!id) {
        return (
            <div className="w-full h-screen bg-black flex items-center justify-center text-white/50">
                No project ID specified.
            </div>
        );
    }

    return <ProjectViewer projectId={id} />;
}

export default function ProjectPage() {
    return (
        <Suspense fallback={<div className="w-full h-screen bg-black text-white">Loading...</div>}>
            <ProjectContent />
        </Suspense>
    );
}
