import { defineStore } from "pinia";
import { subscribeToAuth, logout as fbLogout } from "../services/auth";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null, // firabase user object or null
    ready: false, // whether firabase has finished initializing and checking for an existing user (for router to wait for initial auth check)
  }),

  getters: {
    isLoggedIn: (state) => !!state.user, // first ! to convert the value to boolean, second ! to invert it back to the original boolean value (true if user exists, false if null)
  },

  actions: {
    init() {
      // set up listener once
      if (this.ready) {
        return;
      }

      subscribeToAuth((user) => {
        this.user = user ?? null;
        this.ready = true;
      });
    },

    async logout() {
      await fbLogout();
    },
  },
});