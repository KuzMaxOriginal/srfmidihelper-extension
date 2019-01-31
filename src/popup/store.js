import Vue from "vue";
import Vuex from "vuex";

import constants from "./constants";
import router from "./router";
import { storage, native } from "../common";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
    	deviceList: [],
        deviceSelected: null
    },
    mutations: {
        [constants.SET_DEVICE_LIST] (state, deviceList) {
        	state.deviceList = deviceList;
            storage.update({deviceList: deviceList});
        },
        [constants.SET_DEVICE_SELECTED] (state, deviceSelected) {
            state.deviceSelected = deviceSelected;
            storage.update({deviceSelected: deviceSelected});
        },
        [constants.SET_VALUES_FROM_STORAGE] (state, storageValues) {
            for (let key in storageValues) {
                state[key] = storageValues[key];
            }

            if (state.connectedToHost && router.currentRoute.name === "loading") {
                router.push({name: "select-device"});
            }
        }
    },
    actions: {
        [constants.SYNC_STORAGE] (context) {
            storage.get(["deviceList", "deviceSelected"], (result) => {
                context.commit(constants.SET_VALUES_FROM_STORAGE, result);
            });
        },
        [constants.UPDATE_DEVICE_LIST] (context) {
            native.listDevices();
        },
        [constants.SELECT_DEVICE] (context) {
            native.listenDevice();
        }
    }
});
