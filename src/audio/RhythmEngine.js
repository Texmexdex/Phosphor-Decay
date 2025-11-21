import { RHYTHM_PATTERNS, RHYTHM_TEMPLATES, generateEuclideanRhythm, generateRandomRhythm } from './RhythmPatterns.js';

/**
 * Rhythm Engine - Manages rhythm patterns and timing
 */
export class RhythmEngine {
    constructor() {
        // Current template
        this.template = RHYTHM_TEMPLATES.ambient;

        // Patterns for each instrument
        this.patterns = {
            kick: [],
            snare: [],
            hihat: [],
            bass: [],
            melody: [],
            pad: []
        };

        // Current step (0-15 for 16th notes)
        this.step = 0;
        this.stepsPerBar = 16;

        // Variation and humanization
        this.variation = 0.1; // Chance to skip a hit
        this.swing = 0; // Swing amount (0-1)

        this.loadTemplate('ambient');
    }

    /**
     * Load a rhythm template
     */
    loadTemplate(templateName) {
        const template = RHYTHM_TEMPLATES[templateName];
        if (!template) {
            console.warn(`Template not found: ${templateName}`);
            return;
        }

        this.template = template;

        // Load patterns for each inst
        for (const [inst, patternName] of Object.entries(template)) {
            if (inst === 'name' || inst === 'bpm') continue;

            if (!patternName) {
                // No pattern for this instrument
                this.patterns[inst] = Array(this.stepsPerBar).fill(0);
            } else if (patternName.startsWith('random')) {
                const density = patternName.includes('dense') ? 0.7 : 0.3;
                this.patterns[inst] = generateRandomRhythm(density, this.stepsPerBar);
            } else {
                const category = this.getCategoryForInstrument(inst);
                this.patterns[inst] = RHYTHM_PATTERNS[category]?.[patternName] ||
                    Array(this.stepsPerBar).fill(0);
            }
        }

        console.log('Loaded rhythm template:', template.name);
    }

    /**
     * Get pattern category for instrument
     */
    getCategoryForInstrument(inst) {
        const mapping = {
            kick: 'kick',
            snare: 'snare',
            hihat: 'hihat',
            bass: 'bass',
            melody: 'melody',
            pad: 'pad'
        };
        return mapping[inst] || inst;
    }

    /**
     * Advance to next step
     */
    advance() {
        this.step = (this.step + 1) % this.stepsPerBar;
    }

    /**
     * Check if instrument should trigger on current step
     */
    shouldTrigger(instrument) {
        const pattern = this.patterns[instrument];
        if (!pattern || pattern.length === 0) return false;

        const hit = pattern[this.step];

        // Apply variation (random skip)
        if (hit && Math.random() < this.variation) {
            return false;
        }

        return hit === 1;
    }

    /**
     * Get all instruments that should trigger
     */
    getTriggersForStep() {
        const triggers = [];
        for (const inst of Object.keys(this.patterns)) {
            if (this.shouldTrigger(inst)) {
                triggers.push(inst);
            }
        }
        return triggers;
    }

    /**
     * Check if we're on a strong beat (1 or 3)
     */
    isStrongBeat() {
        return this.step === 0 || this.step === 8;
    }

    /**
     * Check if we're on a weak beat (2 or 4)
     */
    isWeakBeat() {
        return this.step === 4 || this.step === 12;
    }

    /**
     * Check if we're at the start of a bar
     */
    isBarStart() {
        return this.step === 0;
    }

    /**
     * Get current step velocity (0-1) with humanization
     */
    getVelocity(instrument, baseVelocity = 0.8) {
        let velocity = baseVelocity;

        // Accent strong beats
        if (this.isStrongBeat()) {
            velocity *= 1.2;
        } else if (this.isWeakBeat()) {
            velocity *= 0.9;
        }

        // Humanize
        velocity += (Math.random() - 0.5) * 0.1;

        return Math.max(0.1, Math.min(1, velocity));
    }

    /**
     * Set custom pattern for instrument
     */
    setPattern(instrument, pattern) {
        if (pattern.length !== this.stepsPerBar) {
            console.warn(`Pattern length mismatch: expected ${this.stepsPerBar}, got ${pattern.length}`);
            return;
        }
        this.patterns[instrument] = [...pattern];
    }

    /**
     * Generate Euclidean pattern for instrument
     */
    setEuclideanPattern(instrument, pulses) {
        this.patterns[instrument] = generateEuclideanRhythm(pulses, this.stepsPerBar);
    }

    /**
     * Randomize pattern for instrument
     */
    randomizePattern(instrument, density = 0.5) {
        this.patterns[instrument] = generateRandomRhythm(density, this.stepsPerBar);
    }

    /**
     * Get timing offset for swing
     */
    getSwingOffset() {
        // Apply swing to off-beats (odd steps)
        if (this.step % 2 === 1 && this.swing > 0) {
            return this.swing * 0.1; // Max 100ms delay
        }
        return 0;
    }
}
