"use client";

import dynamic from "next/dynamic";

const ViewerCanvas = dynamic(() => import("./viewerCanvas"), {
  ssr: false,
});

export default ViewerCanvas;
