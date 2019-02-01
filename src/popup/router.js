import Vue from "vue";
import Router from "vue-router";

import Runtime from "./views/Runtime";
import Loading from "./views/Loading"
import NoSheetsYet from "./views/NoSheetsYet";
import SelectDevice from "./views/SelectDevice.vue";

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
        },
        {
            path: "/no-sheets-yet",
            name: "no-sheets-yet",
            component: NoSheetsYet
        },
        {
            path: "/runtime",
            name: "runtime",
            component: Runtime
        }
    ]
});
