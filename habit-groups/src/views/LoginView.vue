<script setup>
import { ref } from "vue";
import { login } from "../services/auth";

const email = ref("");
const password = ref("");
const error = ref("");
const loading = ref(false);

async function onSubmit() {
  error.value = "";
  loading.value = true;
  try {
    await login(email.value.trim(), password.value);
  } catch (e) {
    error.value = e?.message ?? "Login failed";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div style="padding: 24px; max-width: 420px;">
    <h1>Login</h1>

    <form @submit.prevent="onSubmit" style="display: grid; gap: 12px; margin-top: 16px;">
      <label>
        Email
        <input v-model="email" type="email" autocomplete="email" required style="width: 100%;" />
      </label>

      <label>
        Password
        <input v-model="password" type="password" autocomplete="current-password" required style="width: 100%;" />
      </label>

      <button type="submit" :disabled="loading">
        {{ loading ? "Logging in..." : "Login" }}
      </button>

      <p v-if="error" style="color: #b00020;">{{ error }}</p>
    </form>
  </div>
</template>