import Vue from "vue";
import Vuex from "vuex";

import constants from "./constants";
import {initTabPort, initXHRResponseHandler, repaintSVG} from "./core";
import {messaging, storage} from "../common";
import {injectJS} from "./utils";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        currentNoteIndex: 0,
        wrongNotesCount: 0,
        isSwitchedOn: false,
        noteFillHighlighted: null,
        noteFillWrong: null,

        tabPort: null,
        tabPortMessageListener: null,
        injectXHRListener: null,
        prevIsSwitchedOn: true,
        drawnNotes: [],
        indexedPitches: [],
        midiPressedPitches: [],
        selectedKeySignature: null,
        dialog: null
    },
    mutations: {
        [constants.store.INCREMENT_CURRENT_NOTE](state) {
            state.currentNoteIndex++;
            storage.update({currentNoteIndex: state.currentNoteIndex});
            repaintSVG();
        },
        [constants.store.RESET_CURRENT_NOTE](state) {
            state.currentNoteIndex = 0;
            storage.update({currentNoteIndex: state.currentNoteIndex});
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
            storage.update({wrongNotesCount: state.wrongNotesCount});
        },
        [constants.store.RESET_WRONG_NOTES_COUNT](state) {
            state.wrongNotesCount = 0;
            storage.update({wrongNotesCount: state.wrongNotesCount});
        },
        [constants.store.SET_KEY_SIGNATURE](state, keySignature) {
            state.selectedKeySignature = keySignature;
        },
        [constants.store.SET_DIALOG](state, dialog) {
            state.dialog = dialog;
        },
        [constants.store.CLOSE_DIALOG](state) {
            state.dialog.close();
            state.dialog = null;
        },
        [constants.store.SET_IS_SWITCHED_ON](state, isSwitchedOn) {
            state.isSwitchedOn = isSwitchedOn;
        },
        [constants.store.SET_PREV_IS_SWITCHED_ON](state, prevIsSwitchedOn) {
            state.prevIsSwitchedOn = prevIsSwitchedOn;
        },
        [constants.store.SET_TAB_PORT](state, tabPort) {
            state.tabPort = tabPort;
        },
        [constants.store.SET_TAB_PORT_MESSAGE_LISTENER](state, callback) {
            state.tabPortMessageListener = callback;
        },
        [constants.store.SET_INJECT_XHR_LISTENER](state, callback) {
            state.injectXHRListener = callback;
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
        [constants.store.SWITCH_ON](context) {
            initTabPort();
            initXHRResponseHandler();

            messaging.sendMessage({
                type: "storage_updated"
            });

            context.commit(constants.store.SET_IS_SWITCHED_ON, true);
        },
        [constants.store.SWITCH_OFF](context) {
            context.dispatch(constants.store.REMOVE_RUNTIME_LISTENER);
            context.dispatch(constants.store.REMOVE_INJECT_XHR_LISTENER);

            context.commit(constants.store.RESET_CURRENT_NOTE);
            context.commit(constants.store.RESET_WRONG_NOTES_COUNT);

            context.commit(constants.store.SET_IS_SWITCHED_ON, false);

            repaintSVG();
        },
        [constants.store.SYNC_STORAGE](context) {
            storage.get([
                "currentNoteIndex",
                "wrongNotesCount",
                "isSwitchedOn",
                "noteFillHighlighted",
                "noteFillWrong"
            ], (result) => {
                context.commit(constants.store.SET_VALUES_FROM_STORAGE, result);

                if (result.isSwitchedOn !== context.state.prevIsSwitchedOn) {
                    if (result.isSwitchedOn) {
                        context.dispatch(constants.store.SWITCH_ON);
                    } else {
                        context.dispatch(constants.store.SWITCH_OFF);
                    }

                    context.commit(constants.store.SET_PREV_IS_SWITCHED_ON, result.isSwitchedOn);
                }
            });
        },

        [constants.store.SET_RUNTIME_LISTENER](context, callback) {
            context.dispatch(constants.store.REMOVE_RUNTIME_LISTENER);
            context.state.tabPort.onMessage.addListener(callback);
            context.commit(constants.store.SET_TAB_PORT_MESSAGE_LISTENER, callback);
        },
        [constants.store.REMOVE_RUNTIME_LISTENER](context) {
            if (context.state.tabPortMessageListener !== null) {
                context.state.tabPort.onMessage.removeListener(context.state.tabPortMessageListener);
                context.commit(constants.store.SET_TAB_PORT_MESSAGE_LISTENER, null);
            }
        },

        [constants.store.SET_INJECT_XHR_LISTENER](context, callback) {
            context.dispatch(constants.store.REMOVE_INJECT_XHR_LISTENER);
            document.addEventListener('injectXHR', callback);
            context.commit(constants.store.SET_INJECT_XHR_LISTENER, callback);
        },
        [constants.store.REMOVE_INJECT_XHR_LISTENER](context) {
            if (context.state.injectXHRListener !== null) {
                document.removeEventListener('injectXHR', context.state.injectXHRListener);
                context.commit(constants.store.SET_INJECT_XHR_LISTENER, null);
            }
        }
    }
});
