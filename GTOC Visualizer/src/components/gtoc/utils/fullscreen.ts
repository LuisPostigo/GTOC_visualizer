// Robust fullscreen helpers (Safari/Chrome/Firefox/Edge).
// IMPORTANT: Fullscreen must be triggered from a direct user gesture (e.g., a click handler).

type AnyDocument = Document & {
    webkitFullscreenElement?: Element | null;
    mozFullScreenElement?: Element | null;
    msFullscreenElement?: Element | null;
    webkitExitFullscreen?: () => void;
    mozCancelFullScreen?: () => void;
    msExitFullscreen?: () => void;
};

type AnyElement = Element & {
    webkitRequestFullscreen?: () => void;
    mozRequestFullScreen?: () => void;
    msRequestFullscreen?: () => void;
};

export function getFullscreenElement(): Element | null {
    const doc = document as AnyDocument;
    return (
        doc.fullscreenElement ??
        doc.webkitFullscreenElement ??
        doc.mozFullScreenElement ??
        doc.msFullscreenElement ??
        null
    );
}

export function isFullscreen(): boolean {
    return !!getFullscreenElement();
}

/** Prefer requesting fullscreen for a specific container; fall back to documentElement. */
export async function enterFullscreen(elem?: Element | null) {
    if (typeof document === "undefined") return;

    const target = (elem ?? document.documentElement) as AnyElement | null;
    if (!target) return;

    try {
        if ("requestFullscreen" in target && typeof (target as any).requestFullscreen === "function") {
            await (target as any).requestFullscreen();
            return;
        }
        // Safari
        if (typeof target.webkitRequestFullscreen === "function") {
            target.webkitRequestFullscreen();
            return;
        }
        // Legacy Safari/WebKit (uppercase 'S')
        if (typeof (target as any).webkitRequestFullScreen === "function") {
            (target as any).webkitRequestFullScreen();
            return;
        }
        // Firefox
        if (typeof target.mozRequestFullScreen === "function") {
            target.mozRequestFullScreen();
            return;
        }
        // IE/Legacy Edge
        if (typeof target.msRequestFullscreen === "function") {
            target.msRequestFullscreen();
            return;
        }
    } catch (err) {
        // Most common: not called from user gesture
        console.warn("Fullscreen Error:", err);
    }
}

export function exitFullscreen() {
    if (typeof document === "undefined") return;

    const doc = document as AnyDocument;
    if (!getFullscreenElement()) return;

    try {
        if (typeof doc.exitFullscreen === "function") {
            doc.exitFullscreen().catch(() => { });
            return;
        }
        if (typeof doc.webkitExitFullscreen === "function") {
            doc.webkitExitFullscreen();
            return;
        }
        if (typeof doc.mozCancelFullScreen === "function") {
            doc.mozCancelFullScreen();
            return;
        }
        if (typeof doc.msExitFullscreen === "function") {
            doc.msExitFullscreen();
            return;
        }
    } catch {
        // ignore
    }
}

/** Convenience: try common visualizer container ids, else falls back to documentElement. */
export function getDefaultFullscreenTarget(): Element {
    const ids = [
        "visualizer-root",
        "gtoc-visualizer",
        "gtoc-root",
        "app",
        "__next",
    ];
    for (const id of ids) {
        const el = document.getElementById(id);
        if (el) return el;
    }
    return document.documentElement;
}

export async function toggleFullscreen(target?: Element | null) {
    if (isFullscreen()) {
        exitFullscreen();
    } else {
        await enterFullscreen(target ?? getDefaultFullscreenTarget());
    }
}
