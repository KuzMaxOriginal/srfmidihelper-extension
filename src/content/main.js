import "./extend_vanilla";
import {injectJS} from "./utils";
import {
    initTabPort,
    initXHRResponseHandler,
    generateIndexedPitches
} from "./core";

injectJS(chrome.extension.getURL('js/inject.js'));
initTabPort();
generateIndexedPitches();
initXHRResponseHandler();