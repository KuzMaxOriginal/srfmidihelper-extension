import Vue from "vue";
import Vuex from "vuex";

import constants from "./constants.js";
import { repaintSVG } from "./core";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        currentNoteIndex: -1,
        wrongNotesCount: 0,
        drawnNotes: [],
        indexedPitches: [],
        midiPressedPitches: [],
        selectedKeySignature: null
    },
    mutations: {
        [constants.store.INCREMENT_CURRENT_NOTE](state) {
            state.currentNoteIndex++;
            repaintSVG();
        },
        [constants.store.RESET_CURRENT_NOTE](state) {
            state.currentNoteIndex = -1;
            repaintSVG();
        },
        [constants.store.FIRST_CURRENT_NOTE](state) {
            state.currentNoteIndex = 0;
            repaintSVG();
        },
        [constants.store.ADD_DRAWN_NOTE](state, drawnNote) {
            state.drawnNotes.push(drawnNote);
            repaintSVG();
        },
        [constants.store.REMOVE_DRAWN_NOTE](state, drawnNote) {
            if (state.drawnNotes.indexOf(drawnNote) !== -1) {
                state.drawnNotes.splice(state.drawnNotes.indexOf(drawnNote), 1);
            }

            repaintSVG();
        },
        [constants.store.SET_INDEXED_PITHCES](state, indexedPitches) {
            state.indexedPitches = indexedPitches;
            repaintSVG();
        },
        [constants.store.ADD_PRESSED_PITCH](state, pitch) {
            state.midiPressedPitches.push(pitch);
        },
        [constants.store.RESET_PRESSED_PITCHES](state) {
            state.midiPressedPitches.length = 0;
        },
        [constants.store.REMOVE_PRESSED_PITCH](state, pitch) {
            if (state.midiPressedPitches.indexOf(pitch) !== -1) {
                state.midiPressedPitches.splice(state.midiPressedPitches.indexOf(pitch), 1);
            }
        },
        [constants.store.INCREMENT_WRONG_NOTES_COUNT](state) {
            state.wrongNotesCount++;
        },
        [constants.store.RESET_WRONG_NOTES_COUNT](state) {
            state.wrongNotesCount = 0;
        }
    },
    getters: {
        getRequiredNoteNodes: state => {
            return state.indexedPitches[state.currentNoteIndex].noteNodes;
        },
        getRequiredPitches: (state, getters) => {
            return state.indexedPitches[state.currentNoteIndex].pitches;
        },
        isEveryRequiredPitchPressed: (state, getters) => {
            return getters.getRequiredPitches.diff(state.midiPressedPitches).length === 0
                && state.midiPressedPitches.diff(getters.getRequiredPitches).length === 0;
        },
        isCurrentNoteOutOfIndex: state => {
            return state.currentNoteIndex >= state.indexedPitches.length;
        },
        isPitchWrong: (state, getters) => pitch => {
            return getters.getRequiredPitches.indexOf(pitch) === -1;
        },
        getKeySignature: state => {
            return constants.keySignatures[state.selectedKeySignature];
        }
    }
});
