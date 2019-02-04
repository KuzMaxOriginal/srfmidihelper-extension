import Vue from "vue";
import Router from "vue-router";

import Runtime from "./views/Runtime";
import Loading from "./views/Loading"
import NoSheetsYet from "./views/NoSheetsYet";
import SelectDevice from "./views/SelectDevice.vue";
import constants from "./constants";

Vue.use(Router);

export function calculateRoute(context) {
    if (!context.state.isInitialized) {
        context.dispatch(constants.PUSH_ROUTE, context.state.popupLastRoute);
    }

    let finalRoute = router.currentRoute.name;

    if (!context.state.isSheetGenerated) {
        finalRoute = "no-sheets-yet";
    } else if (context.state.isSheetGenerated && router.currentRoute.name === "no-sheets-yet") {
        finalRoute = "select-device";
    } else if (!context.state.isConnectedToHost) {
        finalRoute = "loading";
    } else if (context.state.isConnectedToHost && router.currentRoute.name === "loading") {
        finalRoute = "select-device";
    }

    if (finalRoute !== router.currentRoute.name) {
        context.dispatch(constants.PUSH_ROUTE, finalRoute);
    }
}

let router = new Router({
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

export default router;