import constants from "./constants";

export function makeSVG(tag, attrs) {
    let el = document.createElementNS('http://www.w3.org/2000/svg', tag);

    for (let k in attrs)
        el.setAttribute(k, attrs[k]);

    return el;
}

export function addTextToElement(text, element) {
    let splittedText = text.split("\n");

    for (let i = 0; i < splittedText.length - 1; i++) {
        element.appendChild(document.createTextNode(splittedText[i]));
        element.appendChild(document.createElement("br"));
    }

    element.appendChild(document.createTextNode(splittedText[splittedText.length - 1]));
}

export function showDialog(title, message, closeBtn, closeCallback) {
    let dialogElement = document.createElement("div"),
        dialogTitleElement = document.createElement("div"),
        dialogBodyElement = document.createElement("div"),
        dialogPanelCloseButtonElement = document.createElement("button"),
        dialogPanelElement = document.createElement("div"),
        overlayElement = document.createElement("div");

    // Dialog title

    dialogTitleElement.className = "srfmh-dialog-title";
    addTextToElement(title, dialogTitleElement);

    // Dialog body

    dialogBodyElement.className = "srfmh-dialog-body";
    addTextToElement(message, dialogBodyElement);

    // Dialog buttons panel

    dialogPanelCloseButtonElement.className = "srfmh-dialog-panel-button";
    addTextToElement(closeBtn, dialogPanelCloseButtonElement);
    dialogPanelCloseButtonElement.onclick = closeCallback;

    dialogPanelElement.className = "srfmh-dialog-panel";
    dialogPanelElement.appendChild(dialogPanelCloseButtonElement);

    // Dialog element

    dialogElement.className = "srfmh-dialog";
    dialogElement.appendChild(dialogTitleElement);
    dialogElement.appendChild(dialogBodyElement);
    dialogElement.appendChild(dialogPanelElement);
    document.body.appendChild(dialogElement);

    // Overlay

    overlayElement.className = "srfmh-overlay";
    document.body.appendChild(overlayElement);

    return {
        el: dialogElement,
        close() {
            dialogElement.remove();
            overlayElement.remove();
        }
    };
}

export function abcjsPitchDuration(noteNode) {
    let duration = 1;

    for (let i = 0; i < noteNode.classList.length; i++) {
        if (noteNode.classList[i].startsWith('abcjs-d0-')) {
            duration = parseFloat('0.' + noteNode.classList[i].split('-')[2]);
        }
    }

    return duration;
}

export function abcjsMidiToPitch(midiPitch, keySignature) {
    let pitchMidiToAbcjsMap = {
        0: 0, 1: 0,
        2: 1, 3: 1,
        4: 2,
        5: 3, 6: 3,
        7: 4, 8: 4,
        9: 5, 10: 5,
        11: 6
    };

    return pitchMidiToAbcjsMap[midiPitch % 12] + (Math.floor(midiPitch / 12) - 5) * 7;
}

export function abcjsGetMidiPitches(noteNode, keySignature) {
    let pitches = [];

    for (let i = 0; i < noteNode.classList.length; i++) {
        if (noteNode.classList[i].startsWith('abcjs-p')) {
            let pitchIndex = parseInt(noteNode.classList[i].slice(7));
            let pitchModdedIndex = pitchIndex >= 0 ? pitchIndex % 7
                : (pitchIndex % 7 === 0 ? 0 : (7 + pitchIndex % 7));

            let pitchIndexMidiOffset = {
                0: 0,
                1: 2,
                2: 4,
                3: 5,
                4: 7,
                5: 9,
                6: 11
            };

            let pitchMidiIndex = pitchIndexMidiOffset[pitchModdedIndex]
                + alteratedPitchIncrement(pitchIndex, keySignature)
                + (Math.floor(pitchIndex / 7) + 5) * 12;

            pitches.push(pitchMidiIndex);
        }
    }

    return pitches;
}

export function naturalMidiIncrement(midiPitch) {
    return constants.pitchNamesMap[midiPitch % 12].indexOf("#") !== -1 ? 1 : 0;
}

export function alteratedPitchIncrement(pitch, keySignature) {
    let result = 0;
    let noteName = constants.pitchNames[(pitch + 2) % 7];

    keySignature.sharp.forEach(function (value) {
        if (noteName === value) {
            result = 1;
        }
    });

    keySignature.flat.forEach(function (value) {
        if (noteName === value) {
            result = -1;
        }
    });

    return result;
}

export function injectJS(scriptURL) {
    let scriptElement = document.createElement('script');
    scriptElement.setAttribute('type', 'text/javascript');
    scriptElement.setAttribute('src', scriptURL);

    let headElement = document.getElementsByTagName('head')[0];
    headElement.insertBefore(scriptElement, headElement.firstChild);
}