import {storage} from "../common";
import store from "./store";
import constants from "./constants";
import {
    abcjsMidiToPitch,
    makeSVG,
    showDialog,
    alteratedPitchIncrement,
    abcjsPitchDuration,
    abcjsGetMidiPitches
} from "./utils";

export function initTabPort() {
    let port = chrome.runtime.connect();

    port.onMessage.addListener(function (msg) {
        if (msg.type === "midi_message") {
            storage.get('isSheetGenerated', function (result) {
                if (!result.isSheetGenerated)
                    return;

                if (msg.message.status === 9) {

                    // Close opened dialog on C4 note
                    if (store.getters.isDialogOpened) {
                        if (msg.message.data1 === 60) {
                            store.commit(constants.store.CLOSE_DIALOG);
                        }
                    } else if (store.state.currentNoteIndex === -1) {
                        store.commit(constants.store.INCREMENT_CURRENT_NOTE);
                    } else {
                        store.commit(constants.store.ADD_PRESSED_PITCH, msg.message.data1);

                        if (store.getters.isEveryRequiredPitchPressed) {

                            // Handle the situation when legato style is playing and holding more than one note
                            store.commit(constants.store.RESET_PRESSED_PITCHES);

                            if (store.getters.isNextNoteOutOfIndex) {
                                store.commit(constants.store.RESET_CURRENT_NOTE);
                                store.commit(constants.store.RESET_WRONG_NOTES_COUNT);

                                store.commit(constants.store.SET_DIALOG,
                                    showDialog("Congratulations!",
                                    "You've reached the end of the piano piece!"
                                    + "\n\nErrors: " + store.state.wrongNotesCount + "."));
                            } else {
                                store.commit(constants.store.INCREMENT_CURRENT_NOTE);
                            }
                        } else {
                            if (store.getters.isPitchWrong(msg.message.data1)) {
                                store.commit(constants.store.INCREMENT_WRONG_NOTES_COUNT);
                                store.commit(constants.store.ADD_DRAWN_NOTE, msg.message.data1);
                            }
                        }
                    }
                } else if (msg.message.status === 8) {
                    store.commit(constants.store.REMOVE_DRAWN_NOTE, msg.message.data1);
                    store.commit(constants.store.REMOVE_PRESSED_PITCH, msg.message.data1);
                }
            });
        }
    });

    return port;
}

export function repaintSVG() {
    let rootSvgElement = document.querySelector("#staffDiv svg");

    if (rootSvgElement === null
        || store.state.currentNoteIndex === -1
        || store.state.indexedPitches.length === 0)
        return;

    rootSvgElement.querySelectorAll(".abcjs-note")
        .setAttribute("fill", constants.svg.noteFillDefault);

    store.getters.getRequiredNoteNodes.forEach(function (value) {
        value.setAttribute("fill", constants.svg.noteFillHighlighted);
    });

    // Remove previous drawn notes and lines
    rootSvgElement.querySelectorAll('.srfmh-wrong_note').remove();

    store.state.drawnNotes.forEach(function (drawingNote) {

        // Set up note, which will be used as relative pitch for drawing the note
        let relativeNote = store.getters.getRequiredNoteNodes[0];
        store.getters.getRequiredNoteNodes.forEach(function (noteNode) {
            if (noteNode.classList.contains("abcjs-v0") && drawingNote >= 60
                || noteNode.classList.contains("abcjs-v1") && drawingNote < 60) {
                relativeNote = noteNode;
            }
        });

        let abcjsPitch = abcjsMidiToPitch(drawingNote, store.getters.getKeySignature);
        let alteratedIncrement = alteratedPitchIncrement(drawingNote, store.getters.getKeySignature);
        let splittedCurrentNotePath = relativeNote.getAttribute("d").split(" ");
        let relativeNoteX = splittedCurrentNotePath[1];
        let relativeNoteY = parseFloat(splittedCurrentNotePath[2].slice(0, splittedCurrentNotePath[2].length - 1)); // remove 'c' at the end

        let relativePitchIndex;
        for (let i = 0; i < relativeNote.classList.length; i++) {
            if (relativeNote.classList[i].startsWith('abcjs-p')) {
                relativePitchIndex = parseInt(relativeNote.classList[i].slice(7));
                break;
            }
        }

        // Draw new lines (if needed)

        let isRightHand = relativeNote.classList.contains("abcjs-v0");

        let newLinesDirectionUp = isRightHand
            ? abcjsPitch > 10
            : abcjsPitch > -2;

        let newLinesCount = Math.floor(isRightHand
            ? Math.max(2 + abcjsPitch * (-1), abcjsPitch - 10)
            : Math.max(2 + abcjsPitch, abcjsPitch * (-1) - 10) / 2);

        let newLineX = relativeNoteX - 10;
        let newLinesOffsetY = relativeNoteY
            + 3.875 * (1 + (newLinesDirectionUp ? -2 : 2) + (isRightHand
                ? (newLinesDirectionUp ? relativePitchIndex - 10 : relativePitchIndex - 2)
                : (newLinesDirectionUp ? relativePitchIndex + 2 : relativePitchIndex + 10)));

        for (let i = 0; i < newLinesCount; i++) {
            let newLineY = newLinesOffsetY + (newLinesDirectionUp ? -3.875 * 2 * i : 3.875 * 2 * i);

            let newLinePath = "m " + newLineX + " " + newLineY + constants.svg.newLinePath;
            let newLineElement = makeSVG('path', {
                d: newLinePath,
                stroke: constants.svg.noteFillWrong,
                fill: 'none',
                'fill-opacity': constants.svg.noteOpacityWrong,
                class: 'srfmh-wrong_note srfmh-wrong_note-line'
            });

            rootSvgElement.appendChild(newLineElement);
        }

        // Draw note

        let notePath;
        let noteX = relativeNoteX;
        let noteY = relativeNoteY - 3.875 * (abcjsPitch - relativePitchIndex);

        if (alteratedIncrement === 1) {
            noteY -= 3.875 * 2 - 1;
            noteX -= 10.61;
            notePath = "m " + noteX + " " + noteY + constants.svg.wrongNoteSharpPath
                + "m 10.93999999999994 -3.509999999999991" + constants.svg.wrongNotePath;
        } else if (alteratedIncrement === -1) {
            // TODO: draw flat
        } else {
            notePath = "m " + noteX + " " + noteY + constants.svg.wrongNotePath;
        }

        let noteElement = makeSVG('path', {
            d: notePath,
            stroke: 'none',
            fill: constants.svg.noteFillWrong,
            'fill-opacity': constants.svg.noteOpacityWrong,
            class: 'srfmh-wrong_note'
        });

        rootSvgElement.appendChild(noteElement);
    });
}

export function generateIndexedPitches() {
    function makeDurationArray(elements, durationArray) {
        let currentTime = 0;

        elements.forEach(function (noteNode) {
            let noteDuration = abcjsPitchDuration(noteNode) * 1e6;

            if (noteNode.classList.contains("abcjs-note")) {
                let notePithces = abcjsGetMidiPitches(noteNode, store.getters.getKeySignature);

                durationArray.push({
                    noteNode: noteNode,
                    pitches: notePithces,
                    time: currentTime
                });
            }

            currentTime += noteDuration;
        });
    }

    let rootSvgElement = document.querySelector("#staffDiv svg");

    if (rootSvgElement === null)
        return;

    storage.update({isSheetGenerated: true});

    let durationArray = [];
    makeDurationArray(rootSvgElement.querySelectorAll(".abcjs-note.abcjs-v0, .abcjs-rest.abcjs-v0"), durationArray);
    makeDurationArray(rootSvgElement.querySelectorAll(".abcjs-note.abcjs-v1, .abcjs-rest.abcjs-v1"), durationArray);

    durationArray.sort(function (a, b) {
        return a.time - b.time;
    });

    let indexedPitches = [];

    let prevTime = 0;
    let i = 0;
    durationArray.forEach(function (value) {
        if (prevTime !== value.time) {
            i++;
        }

        if (indexedPitches[i] === undefined) {
            indexedPitches[i] = {pitches: [], noteNodes: []};
        }

        indexedPitches[i].pitches = indexedPitches[i].pitches.concat(value.pitches);
        indexedPitches[i].noteNodes = indexedPitches[i].noteNodes.concat(value.noteNode);
        prevTime = value.time;
    });

    store.commit(constants.store.RESET_CURRENT_NOTE);
    store.commit(constants.store.SET_INDEXED_PITHCES, indexedPitches);
}

// XHR response handler for retrieving ABCJS information

export function initXHRResponseHandler() {
    document.addEventListener('injectXHR', (event) => {
        if (event.detail.responseURL.startsWith(constants.appUrl + "/abc")) {
            let parsedResponse = JSON.parse(event.detail.response);
            let parsedStaff = parsedResponse.staff.split("\n");

            parsedStaff.forEach(function (line) {
                if (line.startsWith("K:")) {
                    store.commit(constants.store.SET_KEY_SIGNATURE, line.slice(2).trim());
                }
            });

            setTimeout(function () {
                generateIndexedPitches();
            }, 300);
        }
    });
}