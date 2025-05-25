import { createRouter, createWebHistory } from "vue-router";
// import Style from "@/views/StyleView.vue";
import Home from "@/views/HomeView.vue"; 

const routes = [
  // {
  //   meta: {
  //     title: "Select style",
  //   },
  //   path: "/",
  //   name: "style",
  //   component: Style,
  // },

  {
    meta: {
      title: "Login",
    },
    path: "/login",
    name: "login",
    component: () => import("@/views/LoginView.vue"),
  },
  {
    meta: {
      title: "Dashboard",
    },
    path: "/",
    name: "dashboard",
    component: Home,
  }, 
  {
    meta: {
      title: "Client",
    },
    path: "/Utilisateurs",
    name: "Utilisateurs ",
  component: () => import("@/views/Utilisateurs/UtilisateursView.vue"),
  }, 
  {
    meta: {
      title: "Error",
    },
    path: "/error",
    name: "error",
    component: () => import("@/views/ErrorView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 };
  },
});
 
export default router;
