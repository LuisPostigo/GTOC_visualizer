"use client";

import dynamic from "next/dynamic";

const ViewerCanvas = dynamic(() => import("./ViewerCanvas"), {
  ssr: false,
});

export default function MainCanvasWrapper(props: any) {
  return <ViewerCanvas {...props} />;
}
