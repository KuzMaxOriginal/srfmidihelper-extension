import Vue from "vue";
import Router from "vue-router";

import SelectDevice from "./views/SelectDevice.vue";
import Loading from "./views/Loading"

Vue.use(Router);

export default new Router({
    base: "",
    routes: [
        {
            path: "/select-device",
            name: "select-device",
            component: SelectDevice
        },
        {
            path: "/loading",
            name: "loading",
            component: Loading
        }
    ]
});
