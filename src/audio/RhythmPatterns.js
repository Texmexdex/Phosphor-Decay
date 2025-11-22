/**
 * Rhythm Patterns Library
 * Each pattern is an array where 1 = hit, 0 = rest
 * 16 steps = 1 bar of 16th notes in 4/4
 */

export const RHYTHM_PATTERNS = {
    // Kick drum patterns
    kick: {
        four_on_floor: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
        two_step: [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
        breakbeat: [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0],
        syncopated: [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0],
        off_beat: [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0],
        minimal: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        double_time: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
        half_time: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        dnb: [1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0],
        dubstep: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    },

    // Hi-hat patterns
    hihat: {
        sixteenths: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        eighths: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
        off_beat: [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0],
        broken: [1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0],
        sparse: [1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 1],
        shuffle: [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
        triplet: [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
        gallop: [1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1],
        open_close: [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1],
    },

    // Snare patterns
    snare: {
        backbeat: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
        double: [0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0],
        triple: [0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0],
        syncopated: [0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0],
        rolling: [0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0],
        ghost_notes: [0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0],
        funky: [0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1],
    },

    // Melodic rhythm patterns
    melody: {
        straight: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
        triplet: [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0],
        euclidean_5: [1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0],
        euclidean_7: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0],
        arpeggio: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
        cascade: [1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0],
        staccato: [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
        legato: [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
        polyrhythm_3: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
        polyrhythm_5: [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0],
        random_sparse: null, // Generated randomly
        random_dense: null,  // Generated randomly
    },

    // Bass patterns
    bass: {
        sustained: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        walking: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
        syncopated: [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0],
        driving: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
        dubstep: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
        wobble: [1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        funky: [1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0],
    },

    // Pad patterns (when to retrigger)
    pad: {
        whole_note: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        half_note: [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
        quarter_note: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
        evolving: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
        pulsing: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
        breathing: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
    }
};

/**
 * Full rhythm templates combining multiple patterns
 */
export const RHYTHM_TEMPLATES = {
    house: {
        name: "House",
        bpm: 125,
        kick: 'four_on_floor',
        snare: 'backbeat',
        hihat: 'sixteenths',
        bass: 'walking',
        melody: 'euclidean_5',
        pad: 'whole_note',
    },

    techno: {
        name: "Techno",
        bpm: 135,
        kick: 'four_on_floor',
        snare: 'backbeat',
        hihat: 'broken',
        bass: 'driving',
        melody: 'euclidean_7',
        pad: 'half_note',
    },

    breakbeat: {
        name: "Breakbeat",
        bpm: 140,
        kick: 'breakbeat',
        snare: 'triple',
        hihat: 'broken',
        bass: 'syncopated',
        melody: 'cascade',
        pad: 'half_note',
    },

    ambient: {
        name: "Ambient",
        bpm: 90,
        kick: 'minimal',
        snare: 'syncopated',
        hihat: 'sparse',
        bass: 'sustained',
        melody: 'euclidean_5',
        pad: 'whole_note',
    },

    glitch: {
        name: "Glitch",
        bpm: 110,
        kick: 'syncopated',
        snare: 'syncopated',
        hihat: 'broken',
        bass: 'syncopated',
        melody: 'random_sparse',
        pad: 'evolving',
    },

    minimal: {
        name: "Minimal",
        bpm: 120,
        kick: 'minimal',
        snare: null, // No snare
        hihat: 'sparse',
        bass: 'sustained',
        melody: 'euclidean_5',
        pad: 'whole_note',
    },

    dnb: {
        name: "Drum & Bass",
        bpm: 170,
        kick: 'dnb',
        snare: 'rolling',
        hihat: 'gallop',
        bass: 'wobble',
        melody: 'staccato',
        pad: 'breathing',
    },

    dubstep: {
        name: "Dubstep",
        bpm: 140,
        kick: 'dubstep',
        snare: 'ghost_notes',
        hihat: 'shuffle',
        bass: 'dubstep',
        melody: 'polyrhythm_5',
        pad: 'pulsing',
    },
};

/**
 * Euclidean rhythm generator
 * Distributes k pulses evenly across n steps
 */
export function generateEuclideanRhythm(pulses, steps) {
    if (pulses >= steps) {
        return Array(steps).fill(1);
    }
    if (pulses === 0) {
        return Array(steps).fill(0);
    }

    const pattern = [];
    let bucket = 0;

    for (let i = 0; i < steps; i++) {
        bucket += pulses;
        if (bucket >= steps) {
            bucket -= steps;
            pattern.push(1);
        } else {
            pattern.push(0);
        }
    }

    return pattern;
}

/**
 * Random rhythm generator
 */
export function generateRandomRhythm(density = 0.5, steps = 16) {
    return Array(steps).fill(0).map(() => Math.random() < density ? 1 : 0);
}
