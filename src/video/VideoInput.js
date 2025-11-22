export class VideoInput {
    constructor() {
        this.videoElement = document.createElement('video');
        this.videoElement.autoplay = true;
        this.videoElement.muted = true;
        this.isPlaying = false;
        this.onMetadataLoaded = null; // Callback for when video dimensions are ready

        // Listen for video metadata (dimensions) loaded
        this.videoElement.addEventListener('loadedmetadata', () => {
            if (this.onMetadataLoaded) {
                this.onMetadataLoaded();
            }
        });
    }

    getVideoElement() {
        return this.videoElement;
    }

    async startWebcam() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            this.videoElement.srcObject = stream;
            await this.videoElement.play();
            this.isPlaying = true;
        } catch (err) {
            console.error("Error accessing webcam:", err);
        }
    }

    async startScreenShare() {
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
            this.videoElement.srcObject = stream;
            await this.videoElement.play();
            this.isPlaying = true;
        } catch (err) {
            console.error("Error accessing screen:", err);
        }
    }

    /**
     * Start canvas feedback - capture canvas output as video input
     * Creates infinity mirror effect
     */
    startCanvasFeedback(canvas, fps = 30) {
        try {
            const stream = canvas.captureStream(fps);
            this.videoElement.srcObject = stream;
            this.videoElement.play();
            this.isPlaying = true;
            console.log('Canvas feedback started (infinity mirror mode)');
        } catch (err) {
            console.error("Error starting canvas feedback:", err);
        }
    }
}
