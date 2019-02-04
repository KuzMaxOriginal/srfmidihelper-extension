import {messaging} from "../common";

import "./extend_vanilla";
import {injectJS} from "./utils";
import constants from "./constants";
import store from "./store";

injectJS(chrome.extension.getURL('js/inject.js'));

store.dispatch(constants.store.SWITCH_ON);
