import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

// administrator
import Users from "../views/administrator/Users.vue";
import ServiceProvider from "../views/administrator/ServiceProvider.vue";

// admin
import UsersAdmin from "../views/admin/Users.vue";
import Services from "../views/admin/Services.vue";
import Loket from "../views/admin/Loket.vue";

// user
import LoketUser from "../views/user/Loket.vue";
import Monitor from "../views/user/Monitor.vue";
import Queue from "../views/user/Queue.vue";

Vue.use(VueRouter);

const routes = [
  { path: "/", name: "Home", component: Home },

  // Administrator
  { path: "/users", name: "Users", component: Users },
  { path: "/service-provider", name: "ServiceProvider", component: ServiceProvider },

  // Admin Web
  { path: "/user-admin", name: "UsersAdmin", component: UsersAdmin },
  { path: "/services", name: "Services", component: Services },
  { path: "/loket", name: "Loket", component: Loket },

  // User
  { path: "/loket-user", name: "LoketUser", component: LoketUser },
  { path: "/monitor", name: "Monitor", component: Monitor },
  { path: "/queue", name: "Queue", component: Queue },

  // catch all redirect
  { path: "*", redirect: "/" }
];

const router = new VueRouter({
  mode: "abstract",
  routes
});

export default router;
