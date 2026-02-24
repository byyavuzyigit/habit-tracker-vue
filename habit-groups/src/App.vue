<script setup>
import { RouterLink, RouterView, useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useAuthStore } from "./store/authStore";
import { watch } from "vue";

const authStore = useAuthStore();
authStore.init();
const router = useRouter();
const route = useRoute();
// storeToRefs is used to create reactive references to the properties of the authStore. it allows the component to reactively update the ui when the value changes.
const { isLoggedIn } = storeToRefs(authStore);

async function onLogout() {
  await authStore.logout();
}

// Redirect after auth state changes without requiring a manual route change.
watch(
  isLoggedIn,
  async (loggedIn) => {
    if (loggedIn && route.meta.guestOnly) {
      await router.replace({ name: "home" });
      return;
    }

    if (!loggedIn && route.meta.requiresAuth) {
      await router.replace({ name: "login" });
    }
  },
  { immediate: true }
);
</script>

<template>
  <div style="padding: 16px; border-bottom: 1px solid #eee; display: flex; gap: 12px; align-items: center;">
    <RouterLink v-if="isLoggedIn" to="/">Home</RouterLink>
    <RouterLink v-if="isLoggedIn" to="/completed">Completed</RouterLink>

    <RouterLink v-if="!isLoggedIn" to="/login">Login</RouterLink>
    <RouterLink v-if="!isLoggedIn" to="/register">Register</RouterLink>

    <button v-if="isLoggedIn" @click="onLogout" style="margin-left: auto;">
      Logout
    </button>
  </div>

  <RouterView />
</template>
