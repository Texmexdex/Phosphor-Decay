export class DrawingSystem {
    constructor() {
        this.isDrawing = false;
        this.currentStroke = [];
        this.recordings = []; // Array of recorded strokes
        this.isRecording = false;
        this.isPlaying = false;
        this.playbackIndex = 0;
        this.playbackStrokeIndex = 0;
        this.loop = true;
        
        // Drawing style
        this.lineWidth = 3;
        this.lineColor = '#00ff41';
        this.opacity = 1;
    }

    startDrawing(x, y) {
        this.isDrawing = true;
        this.currentStroke = [{ x, y, time: Date.now() }];
    }

    continueDrawing(x, y) {
        if (!this.isDrawing) return;
        this.currentStroke.push({ x, y, time: Date.now() });
    }

    endDrawing() {
        if (!this.isDrawing) return;
        this.isDrawing = false;
        
        if (this.isRecording && this.currentStroke.length > 1) {
            // Normalize timestamps relative to first point
            const startTime = this.currentStroke[0].time;
            const normalizedStroke = this.currentStroke.map(point => ({
                x: point.x,
                y: point.y,
                time: point.time - startTime
            }));
            this.recordings.push(normalizedStroke);
            console.log('STROKE_RECORDED:', this.recordings.length, 'strokes total');
        }
        
        this.currentStroke = [];
    }

    startRecording() {
        this.isRecording = true;
        this.recordings = [];
        console.log('RECORDING_STARTED');
    }

    stopRecording() {
        this.isRecording = false;
        console.log('RECORDING_STOPPED:', this.recordings.length, 'strokes');
    }

    startPlayback() {
        if (this.recordings.length === 0) {
            console.log('NO_RECORDINGS_TO_PLAY');
            return;
        }
        this.isPlaying = true;
        this.playbackIndex = 0;
        this.playbackStrokeIndex = 0;
        this.playbackStartTime = Date.now();
        console.log('PLAYBACK_STARTED');
    }

    stopPlayback() {
        this.isPlaying = false;
        console.log('PLAYBACK_STOPPED');
    }

    clearRecordings() {
        this.recordings = [];
        this.isPlaying = false;
        console.log('RECORDINGS_CLEARED');
    }

    draw(ctx, width, height) {
        ctx.save();
        ctx.strokeStyle = this.lineColor;
        ctx.lineWidth = this.lineWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.globalAlpha = this.opacity;

        // Draw current stroke being drawn
        if (this.isDrawing && this.currentStroke.length > 1) {
            ctx.beginPath();
            ctx.moveTo(this.currentStroke[0].x, this.currentStroke[0].y);
            for (let i = 1; i < this.currentStroke.length; i++) {
                ctx.lineTo(this.currentStroke[i].x, this.currentStroke[i].y);
            }
            ctx.stroke();
        }

        // Draw playback
        if (this.isPlaying && this.recordings.length > 0) {
            const elapsed = Date.now() - this.playbackStartTime;
            
            // Draw all completed strokes
            for (let i = 0; i < this.playbackIndex; i++) {
                this.drawStroke(ctx, this.recordings[i]);
            }
            
            // Draw current stroke up to current time
            if (this.playbackIndex < this.recordings.length) {
                const currentStroke = this.recordings[this.playbackIndex];
                const strokePoints = [];
                
                for (let i = 0; i < currentStroke.length; i++) {
                    if (currentStroke[i].time <= elapsed) {
                        strokePoints.push(currentStroke[i]);
                    } else {
                        break;
                    }
                }
                
                if (strokePoints.length > 1) {
                    ctx.beginPath();
                    ctx.moveTo(strokePoints[0].x, strokePoints[0].y);
                    for (let i = 1; i < strokePoints.length; i++) {
                        ctx.lineTo(strokePoints[i].x, strokePoints[i].y);
                    }
                    ctx.stroke();
                }
                
                // Check if stroke is complete
                if (strokePoints.length === currentStroke.length) {
                    this.playbackIndex++;
                    
                    // Check if all strokes played
                    if (this.playbackIndex >= this.recordings.length) {
                        if (this.loop) {
                            // Restart
                            this.playbackIndex = 0;
                            this.playbackStartTime = Date.now();
                        } else {
                            this.stopPlayback();
                        }
                    }
                }
            }
        }

        ctx.restore();
    }

    drawStroke(ctx, stroke) {
        if (stroke.length < 2) return;
        ctx.beginPath();
        ctx.moveTo(stroke[0].x, stroke[0].y);
        for (let i = 1; i < stroke.length; i++) {
            ctx.lineTo(stroke[i].x, stroke[i].y);
        }
        ctx.stroke();
    }
}
