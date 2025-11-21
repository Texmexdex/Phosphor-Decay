import { CHORD_TYPES, PROGRESSIONS, VoiceLeading } from './ChordLibrary.js';
import { SCALES } from './MusicTheory.js';

/**
 * Progression Engine - Generates and manages chord progressions
 */
export class ProgressionEngine {
    constructor(musicTheory) {
        this.musicTheory = musicTheory;

        // Current progression state
        this.progression = [];
        this.currentChordIndex = 0;
        this.currentChord = null;
        this.previousVoicing = null;

        // Timing
        this.barsPerChord = 2;
        this.currentBar = 0;

        // Settings
        this.mode = 'minor'; // 'major' or 'minor'
        this.complexity = 'seventh'; // 'triad', 'seventh', 'extended'
        this.voicingStyle = 'smooth'; // 'smooth' (voice leading) or 'open' (wide)

        // Generate default progression
        this.generateProgression('classic_minor', 0);
    }

    /**
     * Generate a progression from the library
     */
    generateProgression(category, index = 0) {
        const progressionData = PROGRESSIONS[category]?.[index];
        if (!progressionData) {
            console.warn(`Progression not found: ${category}[${index}]`);
            return;
        }

        this.progression = progressionData.degrees.map(degree =>
            this.createChordFromDegree(degree)
        );

        this.currentChordIndex = 0;
        this.currentBar = 0;
        this.updateCurrentChord();

        console.log('Generated progression:', progressionData.name);
    }

    /**
     * Create custom progression from scale degrees
     */
    setCustomProgression(degrees) {
        this.progression = degrees.map(degree =>
            this.createChordFromDegree(degree)
        );
        this.currentChordIndex = 0;
        this.currentBar = 0;
        this.updateCurrentChord();
    }

    /**
     * Create a chord from a scale degree (1-based)
     */
    createChordFromDegree(degree) {
        const scaleNotes = this.getScaleNotes();
        const rootIndex = (degree - 1) % scaleNotes.length;
        const root = scaleNotes[rootIndex];

        // Determine chord quality based on scale degree and mode
        const chordType = this.getChordTypeForDegree(degree);

        return {
            degree,
            root,
            type: chordType,
            intervals: CHORD_TYPES[chordType]
        };
    }

    /**
     * Get chord type based on scale degree and current mode
     */
    getChordTypeForDegree(degree) {
        const degreeInScale = ((degree - 1) % 7) + 1;

        if (this.mode === 'major') {
            const complexityMap = {
                triad: { 1: 'major', 2: 'minor', 3: 'minor', 4: 'major', 5: 'major', 6: 'minor', 7: 'diminished' },
                seventh: { 1: 'maj7', 2: 'min7', 3: 'min7', 4: 'maj7', 5: 'dom7', 6: 'min7', 7: 'min7b5' },
                extended: { 1: 'maj9', 2: 'min9', 3: 'min9', 4: 'maj9', 5: 'dom9', 6: 'min9', 7: 'min7b5' }
            };
            return complexityMap[this.complexity]?.[degreeInScale] || 'major';
        } else {
            // Natural minor / Aeolian
            const complexityMap = {
                triad: { 1: 'minor', 2: 'diminished', 3: 'major', 4: 'minor', 5: 'minor', 6: 'major', 7: 'major' },
                seventh: { 1: 'min7', 2: 'min7b5', 3: 'maj7', 4: 'min7', 5: 'min7', 6: 'maj7', 7: 'dom7' },
                extended: { 1: 'min9', 2: 'min7b5', 3: 'maj9', 4: 'min9', 5: 'min9', 6: 'maj9', 7: 'dom9' }
            };
            return complexityMap[this.complexity]?.[degreeInScale] || 'minor';
        }
    }

    /**
     * Get current scale notes
     */
    getScaleNotes() {
        const rootIndex = this.musicTheory.notes.indexOf(this.musicTheory.root);
        const intervals = SCALES[this.musicTheory.scale];
        return intervals.map(interval => {
            const noteIndex = (rootIndex + interval) % 12;
            return this.musicTheory.notes[noteIndex];
        });
    }

    /**
     * Advance to next chord in progression
     */
    advance() {
        this.currentBar++;

        if (this.currentBar >= this.barsPerChord) {
            this.currentBar = 0;
            this.currentChordIndex = (this.currentChordIndex + 1) % this.progression.length;
            this.updateCurrentChord();
        }
    }

    /**
     * Update current chord with voice leading
     */
    updateCurrentChord() {
        const chordData = this.progression[this.currentChordIndex];
        if (!chordData) return;

        // Convert to MIDI note numbers with voice leading
        const voicing = this.applyVoiceLeading(chordData);

        this.currentChord = {
            ...chordData,
            voicing, // MIDI note numbers
            notes: this.voicingToNoteNames(voicing) // Note names with octaves
        };

        this.previousVoicing = voicing;
    }

    /**
     * Apply voice leading to get smooth chord voicing
     */
    applyVoiceLeading(chordData) {
        const rootMidi = this.noteToMidi(chordData.root, 3); // Start at octave 3
        const chordMidi = chordData.intervals.map(interval => rootMidi + interval);

        if (this.voicingStyle === 'smooth') {
            return VoiceLeading.getClosestVoicing(chordMidi, this.previousVoicing);
        } else {
            // Open voicing - spread out
            return chordMidi;
        }
    }

    /**
     * Convert note name to MIDI number
     */
    noteToMidi(noteName, octave) {
        const noteIndex = this.musicTheory.notes.indexOf(noteName);
        return noteIndex + (octave * 12);
    }

    /**
     * Convert MIDI voicing to note names
     */
    voicingToNoteNames(voicing) {
        return voicing.map(midi => {
            const octave = Math.floor(midi / 12);
            const noteIndex = midi % 12;
            const noteName = this.musicTheory.notes[noteIndex];
            return noteName + octave;
        });
    }

    /**
     * Get current chord notes (for synth triggering)
     */
    getCurrentChordNotes() {
        return this.currentChord?.notes || [];
    }

    /**
     * Get a melody note that fits the current chord
     */
    getMelodyNote(style = 'chord', octaveRange = [4, 6]) {
        if (!this.currentChord) return 'C4';

        const scaleNotes = this.getScaleNotes();
        const [minOct, maxOct] = octaveRange;

        if (style === 'chord') {
            // Pick from chord tones
            return this.currentChord.notes[Math.floor(Math.random() * this.currentChord.notes.length)];
        } else if (style === 'scale') {
            // Pick from scale
            const note = scaleNotes[Math.floor(Math.random() * scaleNotes.length)];
            const octave = Math.floor(Math.random() * (maxOct - minOct + 1)) + minOct;
            return note + octave;
        } else {
            // Passing tones - chromatic
            const rootMidi = this.noteToMidi(this.currentChord.root, 4);
            const offset = Math.floor(Math.random() * 24) - 12;
            const midi = rootMidi + offset;
            return this.voicingToNoteNames([midi])[0];
        }
    }

    /**
     * Get bass note (root of current chord)
     */
    getBassNote(octave = 2) {
        if (!this.currentChord) return 'C2';
        return this.currentChord.root + octave;
    }
}
