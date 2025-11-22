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
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 1920, max: 3840 },
                    height: { ideal: 1080, max: 2160 }
                }
            });
            this.videoElement.srcObject = stream;
            await this.videoElement.play();
            this.isPlaying = true;
        } catch (err) {
            console.error("Error accessing webcam:", err);
        }
    }

    async startScreenShare() {
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({
                video: {
                    width: { ideal: 1920, max: 3840 },
                    height: { ideal: 1080, max: 2160 }
                }
            });
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
    async startCanvasFeedback(canvas, fps = 30) {
        try {
            const stream = canvas.captureStream(fps);
            this.videoElement.srcObject = stream;
            
            // Wait for video to be ready
            return new Promise((resolve) => {
                this.videoElement.onloadedmetadata = async () => {
                    await this.videoElement.play();
                    this.isPlaying = true;
                    console.log('Canvas feedback started (infinity mirror mode)', 
                        'Video dimensions:', this.videoElement.videoWidth, 'x', this.videoElement.videoHeight,
                        'Ready state:', this.videoElement.readyState);
                    resolve();
                };
            });
        } catch (err) {
            console.error("Error starting canvas feedback:", err);
        }
    }

    stop() {
        if (this.videoElement.srcObject) {
            const tracks = this.videoElement.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            this.videoElement.srcObject = null;
        }
        this.isPlaying = false;
    }
}
