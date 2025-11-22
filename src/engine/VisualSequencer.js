/**
 * VisualSequencer - Fractal-driven audio sequencing
 * 
 * Uses visual events from the feedback loop's natural rhythm to drive music.
 * The self-referential propagation of the feedback creates mathematical patterns
 * that trigger musical sequences.
 */
export class VisualSequencer {
    constructor(audioSystem, analyzer, progression) {
        this.audioSystem = audioSystem;
        this.analyzer = analyzer;
        this.progression = progression;

        // Previous frame data for delta calculations
        this.previousFrameData = null;

        // Per-instrument trigger state
        this.visualTriggers = {
            lead: {
                lastTriggerTime: 0,
                sequencePosition: 0,
                cooldown: 0.08  // seconds - faster response
            },
            bass: {
                lastTriggerTime: 0,
                sequencePosition: 0,
                cooldown: 0.12
            },
            pad: {
                lastTriggerTime: 0,
                sequencePosition: 0,
                cooldown: 0.25
            }
        };

        // Visual sensitivity (0-1) - how reactive to visual changes
        this.sensitivity = {
            lead: 0.3,
            bass: 0.3,
            pad: 0.4
        };

        console.log('VisualSequencer initialized - fractal mode ready');
    }

    /**
     * Analyze visual events and trigger instruments
     * Called every frame by VideoProcessor
     */
    process(time) {
        const videoData = this.analyzer.analyze();
        const now = Tone.now();

        // First frame - just store data
        if (!this.previousFrameData) {
            this.previousFrameData = this.buildFrameData(videoData);
            return;
        }

        // Calculate visual deltas (changes from previous frame)
        const deltas = this.calculateDeltas(videoData, this.previousFrameData);

        // LEAD: Triggered by motion hotspot movement
        if (this.checkTrigger('lead', now, deltas.hotspotMoved && deltas.motionSpike)) {
            this.triggerLead(time, videoData);
        }

        // BASS: Triggered by bottom-region motion spikes
        if (this.checkTrigger('bass', now, deltas.bottomMotionSpike)) {
            this.triggerBass(time, videoData);

            // Progress chord every 8 bass hits
            if (this.visualTriggers.bass.sequencePosition % 8 === 0) {
                this.progression.advance();
            }
        }

        // PAD: Triggered by brightness threshold crossings
        if (this.checkTrigger('pad', now, deltas.brightnessCrossing)) {
            this.triggerPad(time, videoData);
        }

        // Store current frame for next comparison
        this.previousFrameData = this.buildFrameData(videoData);
    }

    /**
     * Build frame data snapshot
     */
    buildFrameData(videoData) {
        const grid = videoData;
        const totalMotion = grid.reduce((sum, cell) => sum + cell.motion, 0) / grid.length;
        const avgBrightness = grid.reduce((sum, cell) => sum + cell.brightness, 0) / grid.length;

        // Spatial analysis
        const bottomRowMotion = grid.filter(c => c.y === this.analyzer.rows - 1)
            .reduce((s, c) => s + c.motion, 0) / this.analyzer.cols;

        // Find hotspot
        let hotspot = grid[0];
        for (const cell of grid) {
            if (cell.motion > hotspot.motion) {
                hotspot = cell;
            }
        }

        return {
            totalMotion,
            avgBrightness,
            bottomRowMotion,
            hotspot: { x: hotspot.x, y: hotspot.y, motion: hotspot.motion }
        };
    }

    /**
     * Calculate visual deltas between frames
     */
    calculateDeltas(videoData, previousData) {
        const currentData = this.buildFrameData(videoData);

        const motionDelta = currentData.totalMotion - previousData.totalMotion;
        const brightnessDelta = currentData.avgBrightness - previousData.avgBrightness;
        const bottomMotionDelta = currentData.bottomRowMotion - previousData.bottomRowMotion;

        const hotspotMoved = currentData.hotspot.x !== previousData.hotspot.x ||
            currentData.hotspot.y !== previousData.hotspot.y;

        // More sensitive thresholds for fractal feedback
        return {
            motionSpike: Math.abs(motionDelta) > (0.02 * this.sensitivity.lead),
            bottomMotionSpike: Math.abs(bottomMotionDelta) > (0.03 * this.sensitivity.bass),
            hotspotMoved,
            brightnessCrossing: this.checkBrightnessCrossing(currentData.avgBrightness, previousData.avgBrightness)
        };
    }

    /**
     * Check if brightness crossed a threshold
     */
    checkBrightnessCrossing(current, previous) {
        const threshold = 0.4;
        const crossingUp = previous < threshold && current >= threshold;
        const crossingDown = previous >= threshold && current < threshold;
        return (crossingUp || crossingDown) && Math.abs(current - previous) > (0.1 * this.sensitivity.pad);
    }

    /**
     * Check if enough time has passed for next trigger
     */
    checkTrigger(instrument, now, condition) {
        const trigger = this.visualTriggers[instrument];
        const timeSinceLast = now - trigger.lastTriggerTime;

        if (condition && timeSinceLast > trigger.cooldown) {
            trigger.lastTriggerTime = now;
            trigger.sequencePosition++;
            return true;
        }
        return false;
    }

    /**
     * Trigger lead melody based on hotspot position
     */
    triggerLead(time, videoData) {
        if (this.audioSystem.synths.leadVol.mute) return;

        const currentData = this.buildFrameData(videoData);
        const hotspot = currentData.hotspot;

        // Map Y position to note selection
        let note;
        if (hotspot.y === 0) {
            note = this.progression.getMelodyNote('chord', [5, 6]);
        } else if (hotspot.y === 1) {
            note = this.progression.getMelodyNote('scale', [4, 5]);
        } else if (hotspot.y === 2) {
            note = this.progression.getMelodyNote('scale', [3, 4]);
        } else {
            note = this.progression.getMelodyNote('passing', [3, 5]);
        }

        // Transpose by octave shift
        note = this.transposeNote(note, this.audioSystem.leadOctaveShift);

        const duration = hotspot.motion > 0.5 ? "16n" : "8n";
        const vel = 0.5 + (hotspot.motion * 0.5);

        this.audioSystem.synths.lead.triggerAttackRelease(note, duration, time, vel);
    }

    /**
     * Trigger bass based on bottom motion
     */
    triggerBass(time, videoData) {
        if (this.audioSystem.synths.bassVol.mute) return;

        const currentData = this.buildFrameData(videoData);
        const bassNote = this.progression.getBassNote(1);

        // Sometimes play higher octave based on overall motion
        const baseNote = currentData.totalMotion > 0.5 ?
            this.progression.getBassNote(2) : bassNote;

        const note = this.transposeNote(baseNote, this.audioSystem.bassOctaveShift);
        const vel = 0.6 + (currentData.bottomRowMotion * 0.4);

        this.audioSystem.synths.bass.triggerAttackRelease(note, "8n", time, vel);
    }

    /**
     * Trigger pad chords based on brightness
     */
    triggerPad(time, videoData) {
        if (this.audioSystem.synths.padVol.mute) return;

        const chordNotes = this.progression.getCurrentChordNotes();
        if (!chordNotes || chordNotes.length === 0) return;

        const currentData = this.buildFrameData(videoData);
        const duration = currentData.totalMotion > 0.3 ? "4n" : "2n";
        const vel = 0.3 + (currentData.avgBrightness * 0.3);

        // Transpose all notes in chord
        const transposedNotes = chordNotes.map(note =>
            this.transposeNote(note, this.audioSystem.padOctaveShift)
        );

        this.audioSystem.synths.pad.triggerAttackRelease(transposedNotes, duration, time, vel);
    }

    /**
     * Helper: Transpose note by octaves
     */
    transposeNote(note, octaveShift) {
        if (!octaveShift || octaveShift === 0) return note;

        const match = note.match(/^([A-G]#?)(\d)$/);
        if (!match) return note;

        const [, pitch, octave] = match;
        const newOctave = parseInt(octave) + octaveShift;
        return `${pitch}${newOctave}`;
    }

    /**
     * Set sensitivity for an instrument
     */
    setSensitivity(instrument, value) {
        if (this.sensitivity.hasOwnProperty(instrument)) {
            this.sensitivity[instrument] = Math.max(0, Math.min(1, value));
        }
    }
}
