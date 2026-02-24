import { createRouter, createWebHistory } from "vue-router";

import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import HomeView from "../views/HomeView.vue";
import CompletedView from "../views/CompletedView.vue";
import GroupDetailView from "../views/GroupDetailView.vue";

import { useAuthStore } from "../store/authStore";

const routes = [
  { path: "/login", name: "login", component: LoginView, meta: { guestOnly: true } },
  { path: "/register", name: "register", component: RegisterView, meta: { guestOnly: true } },
  { path: "/", name: "home", component: HomeView, meta: { requiresAuth: true } },
  { path: "/completed", name: "completed", component: CompletedView, meta: { requiresAuth: true } },
  { path: "/group/:id", name: "group", component: GroupDetailView, props: true, meta: { requiresAuth: true } }, // props: true -> automatically pass route params as props to the component (id in this case)
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to) => {
  const authStore = useAuthStore();
  authStore.init(); // make sure auth listener is set up and has checked for existing user

  // wait for auth to finish initializing before allowing navigation (important for initial page load to correctly redirect based on auth status)
  if (!authStore.ready) {
    await new Promise((resolve) => {
      const stop = authStore.$subscribe(() => {
        if (authStore.ready) {
          stop(); // stop watching for changes once ready
          resolve();
        }
      });
    });
  }

  const loggedIn = authStore.isLoggedIn;

  // trying to access a page that requires auth but not logged in, redirect to login
  if (to.meta.requiresAuth && !loggedIn) {
    return {name: "login"};
  }
  // user logged in but trying to access guest only page (login / register), redirect to home
  if (to.meta.guestOnly && loggedIn) {
    return {name: "home"};
  }
});