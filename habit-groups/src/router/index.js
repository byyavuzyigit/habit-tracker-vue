import { createRouter, createWebHistory } from "vue-router";

import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import HomeView from "../views/HomeView.vue";
import CompletedView from "../views/CompletedView.vue";
import GroupDetailView from "../views/GroupDetailView.vue";

const routes = [
  { path: "/login", name: "login", component: LoginView },
  { path: "/register", name: "register", component: RegisterView },
  { path: "/", name: "home", component: HomeView },
  { path: "/completed", name: "completed", component: CompletedView },
  { path: "/group/:id", name: "group", component: GroupDetailView, props: true }, // props: true -> automatically pass route params as props to the component (id in this case)
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});