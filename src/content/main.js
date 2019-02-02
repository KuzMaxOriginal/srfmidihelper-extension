import {messaging} from "../common";

import "./extend_vanilla";
import {injectJS} from "./utils";
import constants from "./constants";
import store from "./store";
import {
    initTabPort,
    initXHRResponseHandler,
    generateIndexedPitches
} from "./core";

injectJS(chrome.extension.getURL('js/inject.js'));
initTabPort();
generateIndexedPitches();
initXHRResponseHandler();

messaging.sendMessage({
    type: "storage_updated"
});
