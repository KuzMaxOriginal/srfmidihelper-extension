import Vue from "vue";
import Vuex from "vuex";

import constants from "./constants";
import { repaintSVG } from "./core";
import {storage} from "../common";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        currentNoteIndex: 0,
        wrongNotesCount: 0,
        drawnNotes: [],
        indexedPitches: [],
        midiPressedPitches: [],
        selectedKeySignature: null,
        dialog: null
    },
    mutations: {
        [constants.store.INCREMENT_CURRENT_NOTE](state) {
            state.currentNoteIndex++;
            repaintSVG();
        },
        [constants.store.RESET_CURRENT_NOTE](state) {
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
        [constants.store.SET_VALUES_FROM_STORAGE](state, storageValues) {
            for (let key in storageValues) {
                if (state.hasOwnProperty(key)) {
                    state[key] = storageValues[key];
                }
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
        },
        [constants.store.SET_KEY_SIGNATURE](state, keySignature) {
            state.selectedKeySignature = keySignature;
        },
        [constants.store.SET_DIALOG] (state, dialog) {
            state.dialog = dialog;
        },
        [constants.store.CLOSE_DIALOG] (state) {
            state.dialog.close();
            state.dialog = null;
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
        isNextNoteOutOfIndex: state => {
            return state.currentNoteIndex + 1 >= state.indexedPitches.length;
        },
        isPitchWrong: (state, getters) => pitch => {
            return getters.getRequiredPitches.indexOf(pitch) === -1;
        },
        getKeySignature: state => {
            return constants.keySignatures[state.selectedKeySignature];
        },
        isDialogOpened: state => {
            return state.dialog !== null;
        }
    },
    actions: {
        [constants.store.SYNC_STORAGE](context) {
            storage.get([
                "currentNoteIndex",
                "wrongNotesCount"
            ], (result) => {
                context.commit(constants.store.SET_VALUES_FROM_STORAGE, result);
            });
        },
    }
});
