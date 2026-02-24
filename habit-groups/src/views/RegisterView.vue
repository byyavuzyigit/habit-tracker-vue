<script setup>
import { ref } from "vue";
import { register } from "../services/auth";

// ref() is used to create reactive variables in vue's composition API. it allows the component to reactively update the ui when the value changes.
const email = ref("");
const password = ref("");
const error = ref("");
const loading = ref(false);

async function onSubmit() {
  error.value = "";
  loading.value = true;
  try {
    await register(email.value.trim(), password.value);
  } catch (e) {
    error.value = e?.message ?? "Register failed";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div style="padding: 24px; max-width: 420px;">
    <h1>Register</h1>

    <form @submit.prevent="onSubmit" style="display: grid; gap: 12px; margin-top: 16px;">
      <label>
        Email
        <input v-model="email" type="email" autocomplete="email" required style="width: 100%;" />
      </label>

      <label>
        Password
        <input v-model="password" type="password" autocomplete="new-password" minlength="6" required style="width: 100%;" />
      </label>

      <button type="submit" :disabled="loading">
        {{ loading ? "Creating..." : "Create account" }}
      </button>

      <p v-if="error" style="color: #b00020;">{{ error }}</p>
    </form>
  </div>
</template>