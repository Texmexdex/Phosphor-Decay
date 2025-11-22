export class CanvasInteraction {
    constructor(canvas, videoProcessor) {
        this.canvas = canvas;
        this.videoProcessor = videoProcessor;
        this.isDragging = false;
        this.lastX = 0;
        this.lastY = 0;
        this.activeButton = null; // 0: Left, 1: Middle, 2: Right

        this.setupListeners();
    }

    setupListeners() {
        this.canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
        window.addEventListener('mousemove', (e) => this.onMouseMove(e));
        window.addEventListener('mouseup', () => this.onMouseUp());
        this.canvas.addEventListener('contextmenu', (e) => e.preventDefault()); // Prevent context menu
        this.canvas.addEventListener('wheel', (e) => this.onWheel(e), { passive: false });
    }

    onMouseDown(e) {
        this.isDragging = true;
        this.lastX = e.clientX;
        this.lastY = e.clientY;
        this.activeButton = e.button;
        
        console.log('MOUSE_DOWN:', e.button, 'at', e.clientX, e.clientY);

        // Prevent default behavior for middle and right clicks to avoid scrolling/context menu
        if (e.button === 1 || e.button === 2) {
            e.preventDefault();
        }
    }

    onMouseMove(e) {
        if (!this.isDragging) return;

        const deltaX = e.clientX - this.lastX;
        const deltaY = e.clientY - this.lastY;

        this.lastX = e.clientX;
        this.lastY = e.clientY;

        const params = this.videoProcessor.params;

        // Left Click: Pan
        if (this.activeButton === 0) {
            params.feedbackPanX += deltaX;
            params.feedbackPanY += deltaY;
            console.log('PAN:', params.feedbackPanX, params.feedbackPanY);
        }

        // Middle Click: Zoom
        else if (this.activeButton === 1) {
            // Drag up to zoom in, down to zoom out
            const zoomSpeed = 0.005;
            params.feedbackZoom += -deltaY * zoomSpeed;
            // Clamp zoom to reasonable limits
            params.feedbackZoom = Math.max(0.1, Math.min(params.feedbackZoom, 3.0));
            console.log('ZOOM:', params.feedbackZoom);
        }

        // Right Click: Rotate
        else if (this.activeButton === 2) {
            const rotationSpeed = 0.5;
            params.feedbackRotation += deltaX * rotationSpeed;
            console.log('ROTATE:', params.feedbackRotation);
        }
    }

    onMouseUp() {
        this.isDragging = false;
        this.activeButton = null;
    }

    onWheel(e) {
        e.preventDefault();
        const params = this.videoProcessor.params;
        const zoomSpeed = 0.001;

        params.feedbackZoom += -e.deltaY * zoomSpeed;
        // Clamp zoom
        params.feedbackZoom = Math.max(0.1, Math.min(params.feedbackZoom, 3.0));
    }
}
