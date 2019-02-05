import {storage} from "../common";
import store from "./store";
import constants from "./constants";
import {
    abcjsMidiToPitch,
    makeSVG,
    showDialog,
    alteratedPitchIncrement,
    abcjsPitchDuration,
    abcjsGetMidiPitches,
    naturalMidiIncrement
} from "./utils";

export function initTabPort() {
    let port = chrome.runtime.connect();

    port.onMessage.addListener(function (msg) {
        if (msg.type === "storage_updated") {
            store.dispatch(constants.store.SYNC_STORAGE);
        }
    });

    store.commit(constants.store.SET_TAB_PORT, port);
    store.dispatch(constants.store.SET_RUNTIME_LISTENER, function (msg) {
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
                                store.commit(constants.store.SET_DIALOG,
                                    showDialog("Congratulations!",
                                        "You've reached the end of the piano piece!"
                                        + "\n\nErrors: " + store.state.wrongNotesCount + ".",
                                        "Close (C4)", () => {
                                            store.commit(constants.store.CLOSE_DIALOG);
                                        }));

                                store.commit(constants.store.RESET_CURRENT_NOTE);
                                store.commit(constants.store.RESET_WRONG_NOTES_COUNT);
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
}

export function repaintSVG() {
    let rootSvgElement = document.querySelector("#staffDiv svg");

    if (rootSvgElement === null)
        return;

    // Remove previous drawn notes and lines
    rootSvgElement.querySelectorAll('.srfmh-wrong_note').remove();

    // Set notes fill to default
    rootSvgElement.querySelectorAll(".abcjs-note")
        .setAttribute("fill", constants.svg.noteFillDefault);

    if (store.state.currentNoteIndex === -1
        || store.state.indexedPitches.length === 0
        || !store.state.isSwitchedOn)
        return;

    // Highlight current notes

    store.getters.getRequiredNoteNodes.forEach(function (value) {
        value.setAttribute("fill", store.state.noteFillHighlighted);
    });

    // Set up note, which will be used as relative pitch for drawing wrong notes and staff lines
    // LH = 'Left Hand', RH = 'Right Hand'

    let relativeNoteNodeRH = store.getters.getRequiredNoteNodes[0],
        relativeNoteNodeLH = relativeNoteNodeRH;

    store.getters.getRequiredNoteNodes.forEach(function (noteNode) {
        if (noteNode.classList.contains("abcjs-v0")) {
            relativeNoteNodeRH = noteNode;
        } else if (noteNode.classList.contains("abcjs-v1")) {
            relativeNoteNodeLH = noteNode;
        }
    });

    let [relativeNoteRH, relativeNoteLH] = [relativeNoteNodeRH, relativeNoteNodeLH].map((relativeNoteNode) => {
        let splittedCurrentNotePath = relativeNoteNode.getAttribute("d").split(" ");
        let relativeNoteX = parseFloat(splittedCurrentNotePath[1]);
        let relativeNoteY = parseFloat(splittedCurrentNotePath[2].slice(0, splittedCurrentNotePath[2].length - 1)); // remove 'c' at the end
        let containsDot = relativeNoteNode.getAttribute("d").indexOf(constants.svg.dotPath) !== -1;

        let relativePitchIndex;
        for (let i = 0; i < relativeNoteNode.classList.length; i++) {
            if (relativeNoteNode.classList[i].startsWith('abcjs-p')) {
                relativePitchIndex = parseInt(relativeNoteNode.classList[i].slice(7));
                break;
            }
        }

        if (containsDot) {
            relativeNoteY -= 2.37;
        }

        return {
            noteNode: relativeNoteNode,
            noteX: relativeNoteX,
            noteY: relativeNoteY,
            pitch: relativePitchIndex
        };
    });

    // Draw wrong notes

    let newLines = {
        upRH: 0,
        downRH: 0,
        upLH: 0,
        downLH: 0
    };

    store.state.drawnNotes.forEach(function (drawingNote) {
        let abcjsPitch = abcjsMidiToPitch(drawingNote, store.getters.getKeySignature);
        let naturalIncrement = naturalMidiIncrement(drawingNote);
        let alteratedIncrement = alteratedPitchIncrement(abcjsPitch, store.getters.getKeySignature);
        let isRightHand = relativeNoteRH.noteNode === relativeNoteLH.noteNode
            ? relativeNoteRH.noteNode.classList.contains("abcjs-v0") : drawingNote >= 60;

        // Add information about drawing lines

        let newLinesDirectionUp = isRightHand
            ? abcjsPitch > 10
            : abcjsPitch > -2;

        let newLinesCount = Math.floor((isRightHand
            ? Math.max(2 + abcjsPitch * (-1), abcjsPitch - 10)
            : Math.max(2 + abcjsPitch, abcjsPitch * (-1) - 10)) / 2);

        if (isRightHand) {
            if (newLinesDirectionUp) {
                newLines.upRH = Math.max(newLines.upRH, newLinesCount);
            } else {
                newLines.downRH = Math.max(newLines.downRH, newLinesCount);
            }
        } else {
            if (newLinesDirectionUp) {
                newLines.upLH = Math.max(newLines.upLH, newLinesCount);
            } else {
                newLines.downLH = Math.max(newLines.downLH, newLinesCount);
            }
        }

        // Draw note

        let notePath;
        let noteX = isRightHand ? relativeNoteRH.noteX : relativeNoteLH.noteX;
        let noteY = isRightHand
            ? relativeNoteRH.noteY - 3.875 * (abcjsPitch - relativeNoteRH.pitch)
            : relativeNoteLH.noteY - 3.875 * (abcjsPitch - relativeNoteLH.pitch);

        if (alteratedIncrement === naturalIncrement) {

            // Draw simple note
            notePath = "m " + noteX + " " + noteY + constants.svg.wrongNotePath;

        } else if (naturalIncrement === 0) {

            // Draw 'natural'
            noteY -= 3.875 * 2 - 1;
            noteX -= 13.61;
            notePath = "m " + noteX + " " + noteY + constants.svg.wrongNoteNaturalPath
                + "m 10.879999999999995 -1.0500000000000114" + constants.svg.wrongNotePath;
        } else {

            // Draw 'sharp'
            noteY -= 3.875 * 2 - 1;
            noteX -= 10.61;
            notePath = "m " + noteX + " " + noteY + constants.svg.wrongNoteSharpPath
                + "m 10.93999999999994 -3.509999999999991" + constants.svg.wrongNotePath;
        }

        let noteElement = makeSVG('path', {
            d: notePath,
            stroke: 'none',
            fill: store.state.noteFillWrong,
            'fill-opacity': constants.svg.noteOpacityWrong,
            class: 'srfmh-wrong_note'
        });

        rootSvgElement.appendChild(noteElement);
    });

    // Draw new lines (if needed)

    function drawNewLine(newLineX, newLineY) {
        let newLinePath = "m " + newLineX + " " + newLineY + constants.svg.newLinePath;
        let newLineElement = makeSVG('path', {
            d: newLinePath,
            stroke: store.state.noteFillWrong,
            fill: 'none',
            'fill-opacity': constants.svg.noteOpacityWrong,
            class: 'srfmh-wrong_note srfmh-wrong_note-line'
        });

        rootSvgElement.appendChild(newLineElement);
    }

    let newLineX = relativeNoteRH.noteX - 10;

    // Right hand new lines

    let newLinesOffsetUpRH = relativeNoteRH.noteY + 3.875 * (relativeNoteRH.pitch - 11);
    let newLinesOffsetDownRH = relativeNoteRH.noteY + 3.875 * (relativeNoteRH.pitch + 1);

    for (let i = 0; i < newLines.upRH; i++) {
        drawNewLine(newLineX, newLinesOffsetUpRH - 3.875 * 2 * i);
    }

    for (let i = 0; i < newLines.downRH; i++) {
        drawNewLine(newLineX, newLinesOffsetDownRH + 3.875 * 2 * i);
    }

    // Left hand new lines

    let newLinesOffsetUpLH = relativeNoteRH.noteY + 3.875 * (relativeNoteLH.pitch + 1);
    let newLinesOffsetDownLH = relativeNoteRH.noteY + 3.875 * (relativeNoteLH.pitch + 13);

    for (let i = 0; i < newLines.upLH; i++) {
        drawNewLine(newLineX, newLinesOffsetUpLH - 3.875 * 2 * i);
    }

    for (let i = 0; i < newLines.downLH; i++) {
        drawNewLine(newLineX, newLinesOffsetDownLH + 3.875 * 2 * i);
    }
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
    store.dispatch(constants.store.SET_INJECT_XHR_LISTENER, (event) => {
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