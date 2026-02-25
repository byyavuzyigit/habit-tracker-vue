<script setup>
import GroupCard from "../components/GroupCard.vue";
import { useGroups } from "../composables/useGroups";

const {
  groups,
  loading,
  error,
  rename,
  restoreActive,
  remove,
} = useGroups("completed");
</script>

<template>
  <div style="padding: 24px; max-width: 800px;">
    <h1>Completed Groups</h1>

    <p v-if="error" style="color:#b00020; margin-top: 12px;">{{ error }}</p>
    <p v-if="loading" style="margin-top: 16px;">Loading...</p>

    <div v-else style="margin-top: 16px; display: grid; gap: 12px;">
      <p v-if="groups.length === 0">No completed groups yet.</p>

      <GroupCard
        v-for="g in groups"
        :key="g.id"
        :group="g"
        status="completed"
        @rename="rename"
        @restore="restoreActive"
        @delete="remove"
      />
    </div>
  </div>
</template>