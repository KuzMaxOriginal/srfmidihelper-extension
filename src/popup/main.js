import Vue from "vue";

import App from "./App.vue";
import router from "./router";
import store from "./store";
import constants from "./constants.js";
import {messaging} from "../common";

import "font-awesome/scss/font-awesome.scss";

Vue.config.productionTip = false;

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount("#app");

messaging.addMessageHandler(function (request) {
    if (request.type === "storage_updated") {
        store.dispatch(constants.SYNC_STORAGE);
    }
});

messaging.sendMessage({
    type: "storage_updated"
});

store.dispatch(constants.PUSH_ROUTE, "loading");