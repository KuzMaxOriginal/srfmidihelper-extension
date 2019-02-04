import Vue from "vue";
import Vuex from "vuex";

import constants from "./constants";
import router, {calculateRoute} from "./router";
import {storage, native} from "../common";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        deviceList: [],
        deviceSelected: null,
        isConnectedToHost: false,
        isSheetGenerated: false,
        popupLastRoute: "loading",

        isInitialized: false,
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
        },
        [constants.SET_LAST_ROUTE](state, routeName) {
            state.popupLastRoute = routeName;
            storage.update({popupLastRoute: routeName});
        },
        [constants.SET_INITIALIZED](state, initialized) {
            state.isInitialized = initialized;
        }
    },
    actions: {
        [constants.SYNC_STORAGE](context) {
            storage.get([
                "deviceList",
                "deviceSelected",
                "isSheetGenerated",
                "isConnectedToHost",
                "popupLastRoute"
            ], (result) => {
                context.commit(constants.SET_VALUES_FROM_STORAGE, result);
                calculateRoute(context);

                context.commit(constants.SET_INITIALIZED, true);
            });
        },
        [constants.UPDATE_DEVICE_LIST](context) {
            native.listDevices();
        },
        [constants.SELECT_DEVICE](context) {
            native.listenDevice();
            context.dispatch(constants.PUSH_ROUTE, "runtime");
        },
        [constants.PUSH_ROUTE](context, routeName) {
            if (context.state.isInitialized) {
                context.commit(constants.SET_LAST_ROUTE, routeName);
            }

            router.push({name: routeName});
        }
    }
});
