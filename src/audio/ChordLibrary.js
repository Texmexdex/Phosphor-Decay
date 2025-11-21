/**
 * Chord Library - Database of chord types and common progressions
 */

export const CHORD_TYPES = {
    // Triads
    major: [0, 4, 7],
    minor: [0, 3, 7],
    diminished: [0, 3, 6],
    augmented: [0, 4, 8],

    // Seventh chords
    maj7: [0, 4, 7, 11],
    min7: [0, 3, 7, 10],
    dom7: [0, 4, 7, 10],
    min7b5: [0, 3, 6, 10],  // Half-diminished
    dim7: [0, 3, 6, 9],

    // Extended chords
    maj9: [0, 4, 7, 11, 14],
    min9: [0, 3, 7, 10, 14],
    dom9: [0, 4, 7, 10, 14],

    // Sus chords
    sus2: [0, 2, 7],
    sus4: [0, 5, 7],
    sus7: [0, 5, 7, 10],
};

/**
 * Common chord progressions by genre/mood
 * Represented as scale degrees (1-based)
 */
export const PROGRESSIONS = {
    // Classic progressions
    classic_major: [
        { name: "I-IV-V-I", degrees: [1, 4, 5, 1], mood: "bright" },
        { name: "I-vi-IV-V", degrees: [1, 6, 4, 5], mood: "pop" },
        { name: "I-V-vi-IV", degrees: [1, 5, 6, 4], mood: "anthemic" },
        { name: "ii-V-I", degrees: [2, 5, 1], mood: "jazz" },
    ],

    classic_minor: [
        { name: "i-VI-III-VII", degrees: [1, 6, 3, 7], mood: "dramatic" },
        { name: "i-iv-VII-III", degrees: [1, 4, 7, 3], mood: "dark" },
        { name: "i-VII-VI-VII", degrees: [1, 7, 6, 7], mood: "tension" },
        { name: "i-v-i-v", degrees: [1, 5, 1, 5], mood: "hypnotic" },
    ],

    // Ambient/electronic progressions
    ambient: [
        { name: "Pad Drone", degrees: [1, 1, 1, 1], mood: "ethereal" },
        { name: "Floating", degrees: [1, 4, 1, 5], mood: "spacey" },
        { name: "Evolving", degrees: [1, 6, 4, 7], mood: "mysterious" },
        { name: "Minimal", degrees: [1, 5, 1, 5], mood: "meditative" },
    ],

    // Glitch/experimental
    experimental: [
        { name: "Chromatic Climb", degrees: [1, 2, 3, 4], mood: "tense" },
        { name: "Tritone Switch", degrees: [1, 5, 1, 5], mood: "unstable" },
        { name: "Parallel Motion", degrees: [1, 3, 5, 7], mood: "colorful" },
        { name: "Static", degrees: [1, 1, 2, 1], mood: "minimal" },
    ],
};

/**
 * Voice leading rules for smooth chord transitions
 */
export class VoiceLeading {
    /**
     * Get the closest voicing of a chord to a previous chord
     * Minimizes voice movement
     */
    static getClosestVoicing(chord, previousChord, octaveRange = [2, 5]) {
        if (!previousChord || previousChord.length === 0) {
            // First chord - use root position in mid range
            return chord.map(note => note + 3 * 12); // Octave 3
        }

        // Find voicing that minimizes total interval distance
        const voicings = this.generateVoicings(chord, octaveRange);
        let bestVoicing = voicings[0];
        let minDistance = Infinity;

        for (const voicing of voicings) {
            const distance = this.calculateVoiceDistance(voicing, previousChord);
            if (distance < minDistance) {
                minDistance = distance;
                bestVoicing = voicing;
            }
        }

        return bestVoicing;
    }

    /**
     * Generate all possible voicings of a chord within octave range
     */
    static generateVoicings(chord, octaveRange) {
        const voicings = [];
        const [minOct, maxOct] = octaveRange;

        // Generate different inversions and octave positions
        for (let rootOct = minOct; rootOct <= maxOct; rootOct++) {
            // Root position
            const rootVoicing = chord.map(interval => interval + rootOct * 12);
            if (this.isWithinRange(rootVoicing, octaveRange)) {
                voicings.push(rootVoicing);
            }

            // Inversions
            for (let inv = 1; inv < chord.length; inv++) {
                const inverted = [...chord.slice(inv), ...chord.slice(0, inv).map(i => i + 12)];
                const voicing = inverted.map(interval => interval + (rootOct - 1) * 12);
                if (this.isWithinRange(voicing, octaveRange)) {
                    voicings.push(voicing);
                }
            }
        }

        return voicings;
    }

    static isWithinRange(voicing, octaveRange) {
        const [minOct, maxOct] = octaveRange;
        const minMidi = minOct * 12;
        const maxMidi = (maxOct + 1) * 12;
        return voicing.every(note => note >= minMidi && note < maxMidi);
    }

    static calculateVoiceDistance(voicing1, voicing2) {
        // Pad shorter array
        const len = Math.max(voicing1.length, voicing2.length);
        const v1 = [...voicing1, ...Array(len - voicing1.length).fill(voicing1[voicing1.length - 1] || 0)];
        const v2 = [...voicing2, ...Array(len - voicing2.length).fill(voicing2[voicing2.length - 1] || 0)];

        return v1.reduce((sum, note, i) => sum + Math.abs(note - v2[i]), 0);
    }
}
