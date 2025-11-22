// Fullscreen and Canvas Feedback functionality
export function setupFullscreenAndFeedback(videoInput, videoProcessor) {
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    const canvasFeedbackBtn = document.getElementById('canvas-feedback-btn');
    const canvasContainer = document.getElementById('canvas-container');

    let isFeedbackActive = false;

    // Fullscreen handler
    fullscreenBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
            canvasContainer.requestFullscreen().catch(err => {
                console.error('Fullscreen error:', err);
            });
        } else {
            document.exitFullscreen();
        }
    });

    // Canvas Feedback handler  
    canvasFeedbackBtn.addEventListener('click', () => {
        if (!isFeedbackActive) {
            // Start canvas feedback
            videoInput.startCanvasFeedback(videoProcessor.canvas);
            canvasFeedbackBtn.classList.add('active');
            isFeedbackActive = true;
        } else {
            // Stop canvas feedback - would need to restart original source
            canvasFeedbackBtn.classList.remove('active');
            isFeedbackActive = false;
            // Note: user would need to click webcam/screen again to restore
        }
    });
}
