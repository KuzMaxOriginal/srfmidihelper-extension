import Vue from "vue";
import Router from "vue-router";
import SelectDevice from "./views/SelectDevice.vue";

Vue.use(Router);

export default new Router({
  base: "",
  routes: [
    {
      path: "/",
      name: "select-device",
      component: SelectDevice
    }
  ]
});
