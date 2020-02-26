import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import About from "../views/About.vue";

import Users from "../views/user/Users.vue";

Vue.use(VueRouter);

const routes = [
  { path: "/", name: "Home", component: Home },
  { path: "/about", name: "About", component: About },
  { path: "/users", name: "Users", component: Users },

  // catch all redirect
  { path: "*", redirect: "/" }
];

const router = new VueRouter({
  mode: "abstract",
  routes
});

export default router;
