import { ProgressionEngine } from '../audio/ProgressionEngine.js';
import { RhythmEngine } from '../audio/RhythmEngine.js';

/**
 * Composer - The heart of the music creation system
 * Combines chord progressions, rhythm patterns, and video analysis
 * to create musically sound, video-reactive compositions
 */
export class Composer {
    constructor(audioSystem, analyzer) {
        this.audioSystem = audioSystem;
        this.analyzer = analyzer;

        // Music engines
        this.progression = new ProgressionEngine(audioSystem.musicTheory);
        this.rhythm = new RhythmEngine();

        this.isRunning = false;

        // Video modulation parameters
        this.videoInfluence = {
            melody: 0.7,      // How much video affects melody
            harmony: 0.3,     // How much video affects chords
            rhythm: 0.4,      // How much video affects rhythm
            intensity: 0.5,   // How much video affects overall volume/density
        };

        // Bar counter for chord progression
        this.currentBar = 0;
        this.barsPerChord = 2;

        console.log('Composer initialized');
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;

        // Start Tone Transport only if not already started
        if (Tone.Transport.state !== 'started') {
            Tone.Transport.start();
        }

        // Schedule composition update on 16th notes
        this.loopId = Tone.Transport.scheduleRepeat((time) => {
            this.compose(time);
        }, "16n");

        console.log('Composer started');
    }

    stop() {
        this.isRunning = false;
        Tone.Transport.clear(this.loopId);
        Tone.Transport.stop();
    }

    /**
     * Main composition loop - called every 16th note
     */
    compose(time) {
        // Analyze video
        const videoData = this.analyzeVideo();

        // Advance rhythm
        this.rhythm.advance();

        // Check if we need to change chords
        if (this.rhythm.isBarStart()) {
            this.currentBar++;
            if (this.currentBar >= this.barsPerChord) {
                this.currentBar = 0;
                this.progression.advance();
            }
        }

        // Get instruments that should trigger based on rhythm
        const triggers = this.rhythm.getTriggersForStep();

        // Compose for each instrument
        if (triggers.includes('pad')) {
            this.composePad(time, videoData);
        }

        if (triggers.includes('bass')) {
            this.composeBass(time, videoData);
        }

        if (triggers.includes('melody')) {
            this.composeMelody(time, videoData);
        }

        if (triggers.includes('kick') || triggers.includes('snare') || triggers.includes('hihat')) {
            this.composePercussion(time, videoData, triggers);
        }

        // Modulate effects based on video
        this.modulateEffects(videoData);
    }

    /**
     * Analyze video and extract musical parameters
     */
    analyzeVideo() {
        const grid = this.analyzer.analyze();

        // Global video statistics
        const totalMotion = grid.reduce((sum, cell) => sum + cell.motion, 0) / grid.length;
        const avgBrightness = grid.reduce((sum, cell) => sum + cell.brightness, 0) / grid.length;

        // Color statistics (for later audio-reactive effects)
        const avgRed = grid.reduce((sum, cell) => sum + cell.r, 0) / grid.length / 255;
        const avgGreen = grid.reduce((sum, cell) => sum + cell.g, 0) / grid.length / 255;
        const avgBlue = grid.reduce((sum, cell) => sum + cell.b, 0) / grid.length / 255;

        // Spatial analysis
        const topRowMotion = grid.filter(c => c.y === 0).reduce((s, c) => s + c.motion, 0) / this.analyzer.cols;
        const bottomRowMotion = grid.filter(c => c.y === this.analyzer.rows - 1).reduce((s, c) => s + c.motion, 0) / this.analyzer.cols;
        const leftColMotion = grid.filter(c => c.x === 0).reduce((s, c) => s + c.motion, 0) / this.analyzer.rows;
        const rightColMotion = grid.filter(c => c.x === this.analyzer.cols - 1).reduce((s, c) => s + c.motion, 0) / this.analyzer.rows;

        // Find most active region
        let maxMotionCell = grid[0];
        for (const cell of grid) {
            if (cell.motion > maxMotionCell.motion) {
                maxMotionCell = cell;
            }
        }

        return {
            totalMotion,
            avgBrightness,
            colors: { red: avgRed, green: avgGreen, blue: avgBlue },
            spatial: {
                top: topRowMotion,
                bottom: bottomRowMotion,
                left: leftColMotion,
                right: rightColMotion
            },
            hotspot: maxMotionCell,
            grid
        };
    }

    /**
     * Compose pad part - plays chord tones
     */
    composePad(time, videoData) {
        if (this.audioSystem.synths.padVol.mute) return;

        const chordNotes = this.progression.getCurrentChordNotes();
        if (!chordNotes || chordNotes.length === 0) return;

        // Video modulates which notes are played and how long
        const brightnessThreshold = 0.3 + (this.videoInfluence.harmony * 0.4);

        if (videoData.avgBrightness > brightnessThreshold || this.rhythm.isBarStart()) {
            // Play full chord
            const duration = videoData.totalMotion > 0.3 ? "4n" : "2n";
            const vel = 0.3 + (videoData.avgBrightness * 0.3);

            this.audioSystem.synths.pad.triggerAttackRelease(
                chordNotes,
                duration,
                time,
                vel
            );
        }
    }

    /**
     * Compose bass part - plays root note with variation
     */
    composeBass(time, videoData) {
        if (this.audioSystem.synths.bassVol.mute) return;

        const bassNote = this.progression.getBassNote(1);

        // Bottom row motion drives bass intensity
        const intensity = videoData.spatial.bottom;
        const vel = 0.6 + (intensity * 0.4);

        // Sometimes play octave based on motion
        const note = videoData.totalMotion > 0.5 ?
            this.progression.getBassNote(2) :
            bassNote;

        const duration = this.rhythm.isStrongBeat() ? "4n" : "8n";

        this.audioSystem.synths.bass.triggerAttackRelease(
            note,
            duration,
            time,
            vel
        );
    }

    /**
     * Compose melody part - video-driven but musically coherent
     */
    composeMelody(time, videoData) {
        if (this.audioSystem.synths.leadVol.mute) return;

        // Use hotspot position to select melody note
        const hotspot = videoData.hotspot;

        // Map Y position (0-3) to note selection style
        let note;
        if (hotspot.y === 0) {
            // Top = high chord tones
            note = this.progression.getMelodyNote('chord', [5, 6]);
        } else if (hotspot.y === 1) {
            // Upper mid = scale tones
            note = this.progression.getMelodyNote('scale', [4, 5]);
        } else if (hotspot.y === 2) {
            // Lower mid = scale tones, lower octave
            note = this.progression.getMelodyNote('scale', [3, 4]);
        } else {
            // Bottom = chromatic passing tones
            note = this.progression.getMelodyNote('passing', [3, 5]);
        }

        // Motion affects duration and velocity
        const duration = hotspot.motion > 0.5 ? "16n" : "8n";
        const vel = 0.5 + (hotspot.motion * 0.5);

        this.audioSystem.synths.lead.triggerAttackRelease(
            note,
            duration,
            time,
            vel
        );
    }

    /**
     * Compose percussion - noise synth driven by glitchy motion
     */
    composePercussion(time, videoData, triggers) {
        if (this.audioSystem.synths.noiseVol.mute) return;

        // Trigger noise on high motion areas
        if (videoData.totalMotion > 0.4) {
            const vel = videoData.totalMotion;
            const duration = "32n";

            this.audioSystem.synths.noise.triggerAttackRelease(
                duration,
                time,
                vel
            );
        }
    }

    /**
     * Modulate audio effects based on video
     */
    modulateEffects(videoData) {
        // Reverb wet based on brightness
        if (this.audioSystem.synths.reverb) {
            const reverbWet = 0.3 + (videoData.avgBrightness * 0.4);
            this.audioSystem.synths.reverb.wet.rampTo(reverbWet, 0.1);
        }

        // Delay feedback based on total motion
        if (this.audioSystem.synths.delay) {
            const delayFeedback = 0.3 + (videoData.totalMotion * 0.3);
            this.audioSystem.synths.delay.feedback.rampTo(delayFeedback, 0.1);
        }

        // Bitcrusher based on color (red = glitchy)
        if (this.audioSystem.synths.bitCrusher) {
            const crushWet = videoData.colors.red * 0.5;
            this.audioSystem.synths.bitCrusher.wet.rampTo(crushWet, 0.1);
        }

        // Distortion based on motion intensity
        if (this.audioSystem.synths.distortion) {
            const distWet = Math.min(0.3, videoData.totalMotion * 0.5);
            this.audioSystem.synths.distortion.wet.rampTo(distWet, 0.1);
        }
    }

    /**
     * Change chord progression
     */
    setProgression(category, index) {
        this.progression.generateProgression(category, index);
    }

    /**
     * Change rhythm template
     */
    setRhythmTemplate(templateName) {
        this.rhythm.loadTemplate(templateName);
        Tone.Transport.bpm.value = this.rhythm.template.bpm;
    }

    /**
     * Set how much video influences music
     */
    setVideoInfluence(parameter, amount) {
        if (this.videoInfluence.hasOwnProperty(parameter)) {
            this.videoInfluence[parameter] = Math.max(0, Math.min(1, amount));
        }
    }
}
