import { Muxer, ArrayBufferTarget } from "mp4-muxer";

/**
 * Frame-accurate 4K video recorder using WebCodecs + mp4-muxer.
 *
 * Unlike MediaRecorder which stamps frames with wall-clock time (causing
 * choppy playback when rendering is slow), this encodes each frame with
 * exact timestamps based on the logical frame rate.
 */
export class VideoRecorder {
    private encoder: VideoEncoder | null = null;
    private muxer: Muxer<ArrayBufferTarget> | null = null;
    private frameIndex = 0;
    private fps = 60;
    private canvas: HTMLCanvasElement;
    private started = false;

    // Compositing canvas for overlaying DOM labels
    private compCanvas: HTMLCanvasElement | null = null;
    private compCtx: CanvasRenderingContext2D | null = null;

    // 4K target
    public readonly targetWidth = 3840;
    public readonly targetHeight = 2160;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
    }

    public isSupported(): boolean {
        return typeof VideoEncoder !== "undefined";
    }

    /** Create or get the compositing canvas sized to 4K */
    public getCompositingCanvas(): HTMLCanvasElement {
        if (!this.compCanvas) {
            this.compCanvas = document.createElement("canvas");
            this.compCanvas.width = this.targetWidth;
            this.compCanvas.height = this.targetHeight;
            this.compCtx = this.compCanvas.getContext("2d", { willReadFrequently: false });
        }
        return this.compCanvas;
    }

    public async startRecording(_manualFrame = false, fps = 60) {
        this.fps = fps;
        this.frameIndex = 0;

        if (!this.isSupported()) {
            throw new Error(
                "WebCodecs VideoEncoder is not supported in this browser. " +
                "Please use Chrome 94+ or Edge 94+."
            );
        }

        // Create mp4-muxer target
        this.muxer = new Muxer({
            target: new ArrayBufferTarget(),
            video: {
                codec: "avc",
                width: this.targetWidth,
                height: this.targetHeight,
            },
            fastStart: "in-memory",
        });

        // Create VideoEncoder
        this.encoder = new VideoEncoder({
            output: (chunk, meta) => {
                this.muxer!.addVideoChunk(chunk, meta);
            },
            error: (e) => {
                console.error("VideoEncoder error:", e);
            },
        });

        // Configure H.264 at high bitrate
        this.encoder.configure({
            codec: "avc1.640033", // High profile, level 5.1 (supports 4K)
            width: this.targetWidth,
            height: this.targetHeight,
            bitrate: 50_000_000, // 50 Mbps
            framerate: this.fps,
            hardwareAcceleration: "prefer-hardware",
        });

        this.started = true;
        console.log(`VideoRecorder: started (WebCodecs H.264 @ ${fps} fps, 4K)`);
    }

    /**
     * Capture a frame from a canvas (can be the compositing canvas or the
     * raw WebGL canvas). Each frame gets an exact timestamp so the output
     * video has perfectly uniform frame timing.
     */
    public captureFrame(sourceCanvas?: HTMLCanvasElement) {
        if (!this.encoder || !this.started) return;

        const source = sourceCanvas || this.compCanvas || this.canvas;
        const timestampUs = (this.frameIndex / this.fps) * 1_000_000;
        const durationUs = (1 / this.fps) * 1_000_000;

        const frame = new VideoFrame(source, {
            timestamp: timestampUs,
            duration: durationUs,
        });

        // Every 60 frames → keyframe (for seekability)
        const isKeyFrame = this.frameIndex % 60 === 0;
        this.encoder.encode(frame, { keyFrame: isKeyFrame });
        frame.close();

        this.frameIndex++;
    }

    public async stopRecordingAndDownload(filename: string = "gtoc_movie") {
        if (!this.encoder || !this.muxer) return;

        // Flush remaining frames
        await this.encoder.flush();
        this.encoder.close();
        this.muxer.finalize();

        const target = this.muxer.target as ArrayBufferTarget;
        const blob = new Blob([target.buffer], { type: "video/mp4" });

        // Download
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = filename.replace(/\.[^/.]+$/, "") + ".mp4";
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);

        this.encoder = null;
        this.muxer = null;
        this.started = false;
        this.compCanvas = null;
        this.compCtx = null;

        console.log(`VideoRecorder: saved ${filename}.mp4 (${this.frameIndex} frames)`);
    }
}
