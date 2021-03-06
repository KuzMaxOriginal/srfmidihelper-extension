export default {
    appUrl: "https://www.sightreadingfactory.com/app",
    pitchNames: "ABCDEFG",
    pitchNamesMap: {
        0: "C", 1: "C#",
        2: "D", 3: "D#",
        4: "E",
        5: "F", 6: "F#",
        7: "G", 8: "G#",
        9: "A", 10: "A#",
        11: "B"
    },
    keySignatures: {
        "C": {sharp: [], flat: []},
        "G": {sharp: ["F"], flat: []},
        "D": {sharp: ["C", "F"], flat: []},
        "A": {sharp: ["C", "F", "G"], flat: []},
        "E": {sharp: ["C", "F", "G", "D"], flat: []},
        "B": {sharp: ["C", "F", "G", "D", "A"], flat: []},
        "F#": {sharp: ["C", "F", "G", "D", "A", "E"], flat: []},
        "C#": {sharp: ["C", "F", "G", "D", "A", "B"], flat: []},

        "F": {sharp: [], flat: ["B"]},
        "Bb": {sharp: [], flat: ["B", "E"]},
        "Eb": {sharp: [], flat: ["B", "E", "A"]},
        "Ab": {sharp: [], flat: ["B", "E", "A", "D"]},
        "Db": {sharp: [], flat: ["B", "E", "A", "D", "G"]},
        "Gb": {sharp: [], flat: ["B", "E", "A", "D", "G", "C"]},
        "Cb": {sharp: [], flat: ["B", "E", "A", "D", "G", "C", "F"]},

        "Am": {sharp: [], flat: []},
        "Em": {sharp: ["F"], flat: []},
        "Bm": {sharp: ["C", "F"], flat: []},
        "F#m": {sharp: ["C", "F", "G"], flat: []},
        "C#m": {sharp: ["C", "F", "G", "D"], flat: []},
        "G#m": {sharp: ["C", "F", "G", "D", "A"], flat: []},
        "D#m": {sharp: ["C", "F", "G", "D", "A", "E"], flat: []},
        "A#m": {sharp: ["C", "F", "G", "D", "A", "B"], flat: []},

        "Dm": {sharp: [], flat: ["B"]},
        "Gm": {sharp: [], flat: ["B", "E"]},
        "Cm": {sharp: [], flat: ["B", "E", "A"]},
        "Fm": {sharp: [], flat: ["B", "E", "A", "D"]},
        "Bbm": {sharp: [], flat: ["B", "E", "A", "D", "G"]},
        "Ebm": {sharp: [], flat: ["B", "E", "A", "D", "G", "C"]},
        "Abm": {sharp: [], flat: ["B", "E", "A", "D", "G", "C", "F"]},
    },
    svg: {
        noteFillDefault: "#000000",
        noteFillHighlighted: "#ff0000",
        noteFillWrong: "#000000",
        noteOpacityWrong: 0.7,
        newLinePath: "h22.5",
        wrongNotePath: "c0.51 -0.03 2.01 0 2.52 0.03c 1.41 0.18 2.64 0.51 3.72 1.08c 1.2 0.63 1.95 1.41 2.19 2.31c 0.09 0.33 0.09 0.9 0 1.23c -0.24 0.9 -0.99 1.68 -2.19 2.31c -1.08 0.57 -2.28 0.9 -3.75 1.08c -0.66 0.06 -2.31 0.06 -2.97 0c -1.47 -0.18 -2.67 -0.51 -3.75 -1.08c -1.2 -0.63 -1.95 -1.41 -2.19 -2.31c -0.09 -0.33 -0.09 -0.9 0 -1.23c 0.24 -0.9 0.99 -1.68 2.19 -2.31c 1.2 -0.63 2.61 -0.99 4.23 -1.11zm 0.57 0.66c -0.87 -0.15 -1.53 0 -2.04 0.51c -0.15 0.15 -0.24 0.27 -0.33 0.48c -0.24 0.51 -0.36 1.08 -0.33 1.77c 0.03 0.69 0.18 1.26 0.42 1.77c 0.6 1.17 1.74 1.98 3.18 2.22c 1.11 0.21 1.95 -0.15 2.34 -0.99c 0.24 -0.51 0.36 -1.08 0.33 -1.8c -0.06 -1.11 -0.45 -2.04 -1.17 -2.76c -0.63 -0.63 -1.47 -1.05 -2.4 -1.2z",
        wrongNoteSharpPath: "c0.21 -0.12 0.54 -0.03 0.66 0.24c 0.06 0.12 0.06 0.21 0.06 2.31c 0 1.23 0 2.22 0.03 2.22c 0 0 0.27 -0.12 0.6 -0.24c 0.69 -0.27 0.78 -0.3 0.96 -0.15c 0.21 0.15 0.21 0.18 0.21 1.38c 0 1.02 0 1.11 -0.06 1.2c -0.03 0.06 -0.09 0.12 -0.12 0.15c -0.06 0.03 -0.42 0.21 -0.84 0.36l -0.75 0.33l -0.03 2.43c 0 1.32 0 2.43 0.03 2.43c 0 0 0.27 -0.12 0.6 -0.24c 0.69 -0.27 0.78 -0.3 0.96 -0.15c 0.21 0.15 0.21 0.18 0.21 1.38c 0 1.02 0 1.11 -0.06 1.2c -0.03 0.06 -0.09 0.12 -0.12 0.15c -0.06 0.03 -0.42 0.21 -0.84 0.36l -0.75 0.33l -0.03 2.52c 0 2.28 -0.03 2.55 -0.06 2.64c -0.21 0.36 -0.72 0.36 -0.93 0c -0.03 -0.09 -0.06 -0.33 -0.06 -2.43l 0 -2.31l -1.29 0.51l -1.26 0.51l 0 2.43c 0 2.58 0 2.52 -0.15 2.67c -0.06 0.09 -0.27 0.18 -0.36 0.18c -0.12 0 -0.33 -0.09 -0.39 -0.18c -0.15 -0.15 -0.15 -0.09 -0.15 -2.43c 0 -1.23 0 -2.22 -0.03 -2.22c 0 0 -0.27 0.12 -0.6 0.24c -0.69 0.27 -0.78 0.3 -0.96 0.15c -0.21 -0.15 -0.21 -0.18 -0.21 -1.38c 0 -1.02 0 -1.11 0.06 -1.2c 0.03 -0.06 0.09 -0.12 0.12 -0.15c 0.06 -0.03 0.42 -0.21 0.84 -0.36l 0.78 -0.33l 0 -2.43c 0 -1.32 0 -2.43 -0.03 -2.43c 0 0 -0.27 0.12 -0.6 0.24c -0.69 0.27 -0.78 0.3 -0.96 0.15c -0.21 -0.15 -0.21 -0.18 -0.21 -1.38c 0 -1.02 0 -1.11 0.06 -1.2c 0.03 -0.06 0.09 -0.12 0.12 -0.15c 0.06 -0.03 0.42 -0.21 0.84 -0.36l 0.78 -0.33l 0 -2.52c 0 -2.28 0.03 -2.55 0.06 -2.64c 0.21 -0.36 0.72 -0.36 0.93 0c 0.03 0.09 0.06 0.33 0.06 2.43l 0.03 2.31l 1.26 -0.51l 1.26 -0.51l 0 -2.43c 0 -2.28 0 -2.43 0.06 -2.55c 0.06 -0.12 0.12 -0.18 0.27 -0.24zm -0.33 10.65l 0 -2.43l -1.29 0.51l -1.26 0.51l 0 2.46l 0 2.43l 0.09 -0.03c 0.06 -0.03 0.63 -0.27 1.29 -0.51l 1.17 -0.48l 0 -2.46z",
        wrongNoteNaturalPath: "c 0.24 -0.06 0.78 0 0.99 0.15c 0.03 0.03 0.03 0.48 0 2.61c -0.03 1.44 -0.03 2.61 -0.03 2.61c 0 0.03 0.75 -0.09 1.68 -0.24c 0.96 -0.18 1.71 -0.27 1.74 -0.27c 0.15 0.03 0.27 0.15 0.36 0.3l 0.06 0.12l 0.09 8.67c 0.09 6.96 0.12 8.67 0.09 8.67c -0.03 0.03 -0.12 0.06 -0.21 0.09c -0.24 0.09 -0.72 0.09 -0.96 0c -0.09 -0.03 -0.18 -0.06 -0.21 -0.09c -0.03 -0.03 -0.03 -0.48 0 -2.61c 0.03 -1.44 0.03 -2.61 0.03 -2.61c 0 -0.03 -0.75 0.09 -1.68 0.24c -0.96 0.18 -1.71 0.27 -1.74 0.27c -0.15 -0.03 -0.27 -0.15 -0.36 -0.3l -0.06 -0.15l -0.09 -7.53c -0.06 -4.14 -0.09 -8.04 -0.12 -8.67l 0 -1.11l 0.15 -0.06c 0.09 -0.03 0.21 -0.06 0.27 -0.09z m 3.75 8.4c 0 -0.33 0 -0.42 -0.03 -0.42c -0.12 0 -2.79 0.45 -2.79 0.48c -0.03 0 -0.09 6.3 -0.09 6.33c 0.03 0 2.79 -0.45 2.82 -0.48c 0 0 0.09 -4.53 0.09 -5.91z",
        dotPath: "c 0.09 -0.03 0.27 -0.06 0.39 -0.06c 0.96 0 1.74 0.78 1.74 1.71c 0 0.96 -0.78 1.74 -1.71 1.74c -0.96 0 -1.74 -0.78 -1.74 -1.71c 0 -0.78 0.54 -1.5 1.32 -1.68z"
    },
    store: {
        INCREMENT_CURRENT_NOTE: "INCREMENT_CURRENT_NOTE",
        RESET_CURRENT_NOTE: "RESET_CURRENT_NOTE",
        ADD_DRAWN_NOTE: "ADD_DRAWN_NOTE",
        REMOVE_DRAWN_NOTE: "REMOVE_DRAWN_NOTE",
        ADD_PRESSED_PITCH: "ADD_PRESSED_PITCH",
        RESET_PRESSED_PITCHES: "RESET_PRESSED_PITCHES",
        REMOVE_PRESSED_PITCH: "REMOVE_PRESSED_PITCH",
        INCREMENT_WRONG_NOTES_COUNT: "INCREMENT_WRONG_NOTES_COUNT",
        RESET_WRONG_NOTES_COUNT: "RESET_WRONG_NOTES_COUNT",
        SET_INDEXED_PITHCES: "SET_INDEXED_PITHCES",
        SET_KEY_SIGNATURE: "SET_KEY_SIGNATURE",
        SET_DIALOG: "SET_DIALOG",
        CLOSE_DIALOG: "CLOSE_DIALOG",
        SET_VALUES_FROM_STORAGE: "SET_VALUES_FROM_STORAGE",
        SET_PREV_IS_SWITCHED_ON: "SET_PREV_IS_SWITCHED_ON",
        SET_IS_SWITCHED_ON: "SET_IS_SWITCHED_ON",
        SET_TAB_PORT: "SET_TAB_PORT",
        SET_TAB_PORT_MESSAGE_LISTENER: "SET_TAB_PORT_MESSAGE_LISTENER",
        SET_INJECT_XHR_LISTENER: "SET_INJECT_XHR_LISTENER",

        SYNC_STORAGE: "SYNC_STORAGE",
        SWITCH_ON: "SWITCH_ON",
        SWITCH_OFF: "SWITCH_OFF",
        SET_RUNTIME_LISTENER: "SET_RUNTIME_LISTENER",
        REMOVE_RUNTIME_LISTENER: "REMOVE_RUNTIME_LISTENER",
        REMOVE_INJECT_XHR_LISTENER: "REMOVE_INJECT_XHR_LISTENER"
    }
};