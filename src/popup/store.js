import Vue from "vue";
import Vuex from "vuex";

import constants from "./constants";
import router from "./router";
import {storage, native} from "../common";

Vue.use(Vuex);

function calculateRoute(state) {
    let finalRoute = router.currentRoute.name;

    if (!state.isSheetGenerated) {
        finalRoute = "no-sheets-yet";
    } else if (state.isSheetGenerated && router.currentRoute.name === "no-sheets-yet") {
        finalRoute = "select-device";
    } else if (!state.isConnectedToHost) {
        finalRoute = "loading";
    } else if (state.isConnectedToHost && router.currentRoute.name === "loading") {
        finalRoute = "select-device";
    }

    console.log(finalRoute, state);

    if (finalRoute !== router.currentRoute.name) {
        router.push({name: finalRoute});
    }
}

export default new Vuex.Store({
    state: {
        deviceList: [],
        deviceSelected: null,
        isConnectedToHost: false,
        isSheetGenerated: false
    },
    mutations: {
        [constants.SET_DEVICE_LIST](state, deviceList) {
            state.deviceList = deviceList;
            storage.update({deviceList: deviceList});
        },
        [constants.SET_DEVICE_SELECTED](state, deviceSelected) {
            state.deviceSelected = deviceSelected;
            storage.update({deviceSelected: deviceSelected});
        },
        [constants.SET_VALUES_FROM_STORAGE](state, storageValues) {
            for (let key in storageValues) {
                if (state.hasOwnProperty(key)) {
                    state[key] = storageValues[key];
                }

            }

            calculateRoute(state);
        }
    },
    actions: {
        [constants.SYNC_STORAGE](context) {
            storage.get([
                "deviceList",
                "deviceSelected",
                "isSheetGenerated",
                "isConnectedToHost"
            ], (result) => {
                context.commit(constants.SET_VALUES_FROM_STORAGE, result);
            });
        },
        [constants.UPDATE_DEVICE_LIST](context) {
            native.listDevices();
        },
        [constants.SELECT_DEVICE](context) {
            native.listenDevice();
            router.push({name: "runtime"});
        }
    }
});
