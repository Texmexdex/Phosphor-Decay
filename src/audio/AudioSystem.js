import { SynthEngine } from './Synths.js';
import { MusicTheory } from './MusicTheory.js';

export class AudioSystem {
    constructor() {
        this.isReady = false;
        this.musicTheory = new MusicTheory();
        this.progression = null; // Will be set by Composer

        // Octave shifts
        this.leadOctaveShift = 0;
        this.bassOctaveShift = 0;
        this.padOctaveShift = 0;
    }


    init() {
        // Create a Master Limiter to prevent clipping
        this.limiter = new Tone.Limiter(-1).toDestination();
        this.masterVolume = new Tone.Volume(-10).connect(this.limiter);

        // Master Filter for global timbre control
        this.masterFilter = new Tone.Filter({
            type: 'lowpass',
            frequency: 20000,
            Q: 1
        }).connect(this.masterVolume);

        // Initialize Synth Engine
        this.synths = new SynthEngine(this.masterFilter);

        console.log('AUDIO_SYSTEM_ONLINE');
        this.isReady = true;

        // Bind Volume Control
        const volSlider = document.getElementById('master-vol');
        if (volSlider) {
            volSlider.addEventListener('input', (e) => {
                this.masterVolume.volume.value = e.target.value;
            });
        }
    }

    // Control Methods
    setInstrumentVolume(instrument, value) {
        if (this.synths && this.synths[instrument + 'Vol']) {
            this.synths[instrument + 'Vol'].volume.value = value;
        }
    }

    toggleInstrument(instrument, isActive) {
        if (this.synths && this.synths[instrument + 'Vol']) {
            this.synths[instrument + 'Vol'].mute = !isActive;
        }
    }

    setScale(scaleName) {
        if (this.musicTheory) {
            this.musicTheory.scale = scaleName;
        }
    }

    setRoot(rootNote) {
        if (this.musicTheory) {
            this.musicTheory.root = rootNote;
        }
    }

    // Synth Switching Methods
    setLeadType(type) {
        if (this.synths) {
            this.synths.switchLeadType(type);
        }
    }

    setBassType(type) {
        if (this.synths) {
            this.synths.switchBassType(type);
        }
    }

    setPadType(type) {
        if (this.synths) {
            this.synths.switchPadType(type);
        }
    }

    // Octave Shift Methods
    setLeadOctave(shift) {
        this.leadOctaveShift = shift;
    }

    setBassOctave(shift) {
        this.bassOctaveShift = shift;
    }

    setPadOctave(shift) {
        this.padOctaveShift = shift;
    }

    // Timbre Controls
    setFilterCutoff(freq) {
        if (this.masterFilter) {
            this.masterFilter.frequency.rampTo(freq, 0.1);
        }
    }

    setFilterResonance(q) {
        if (this.masterFilter) {
            this.masterFilter.Q.value = q;
        }
    }

    setFilterType(type) {
        if (this.masterFilter) {
            this.masterFilter.type = type;
        }
    }

    // Envelope controls for lead
    setLeadAttack(time) {
        if (this.synths && this.synths.lead) {
            this.synths.lead.set({ envelope: { attack: time } });
        }
    }

    setLeadRelease(time) {
        if (this.synths && this.synths.lead) {
            this.synths.lead.set({ envelope: { release: time } });
        }
    }

    // Envelope controls for bass
    setBassAttack(time) {
        if (this.synths && this.synths.bass) {
            this.synths.bass.set({ envelope: { attack: time } });
        }
    }

    setBassRelease(time) {
        if (this.synths && this.synths.bass) {
            this.synths.bass.set({ envelope: { release: time } });
        }
    }

    // Envelope controls for pad
    setPadAttack(time) {
        if (this.synths && this.synths.pad) {
            this.synths.pad.set({ envelope: { attack: time } });
        }
    }

    setPadRelease(time) {
        if (this.synths && this.synths.pad) {
            this.synths.pad.set({ envelope: { release: time } });
        }
    }

    // Method to trigger a note based on abstract parameters
    trigger(instrument, noteIndex, velocity = 1, duration = "8n") {
        if (!this.isReady) return;
        // Triggering is handled in Mapper for now
    }
}
