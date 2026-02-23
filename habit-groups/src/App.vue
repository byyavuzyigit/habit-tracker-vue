<script setup>
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <div style="padding: 16px; border-bottom: 1px solid #eee;">
    <RouterLink to="/" style="margin-right: 12px;">Home</RouterLink>
    <RouterLink to="/completed" style="margin-right: 12px;">Completed</RouterLink>
    <RouterLink to="/login" style="margin-right: 12px;">Login</RouterLink>
    <RouterLink to="/register">Register</RouterLink>
  </div>

  <RouterView />
</template>