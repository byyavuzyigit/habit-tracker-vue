<script setup>
defineProps({ id: { type: String, required: true } });
</script>

<template>
  <div style="padding: 24px;">
    <h1>Group Detail</h1>
    <p>Group ID: {{ id }}</p>
  </div>
</template>