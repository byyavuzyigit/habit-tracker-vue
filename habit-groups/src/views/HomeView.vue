<script setup>
import { ref } from "vue";
import GroupCard from "../components/GroupCard.vue";
import { useGroups } from "../composables/useGroups";

const newGroupName = ref("");
const uiError = ref("");

const {
  groups,
  loading,
  error,
  add,
  rename,
  markCompleted,
  remove,
} = useGroups("active");

async function onCreate() {
  uiError.value = "";
  try {
    await add(newGroupName.value);
    newGroupName.value = "";
  } catch (e) {
    uiError.value = e?.message ?? "Failed to create group";
  }
}
</script>

<template>
  <div style="padding: 24px; max-width: 800px;">
    <h1>Active Groups</h1>

    <div style="margin-top: 16px; display:flex; gap: 8px;">
      <input v-model="newGroupName" placeholder="New group name (e.g., Feb 23)" style="flex: 1;" />
      <button @click="onCreate">Add</button>
    </div>

    <p v-if="error" style="color:#b00020; margin-top: 12px;">{{ error }}</p>
    <p v-if="uiError" style="color:#b00020; margin-top: 12px;">{{ uiError }}</p>

    <p v-if="loading" style="margin-top: 16px;">Loading...</p>

    <div v-else style="margin-top: 16px; display: grid; gap: 12px;">
      <p v-if="groups.length === 0">No active groups yet.</p>

      <!-- when group card emits rename, complete or delete events, the corresponding functions (rename, markCompleted, remove) are called to update the state of the groups accordingly. -->
      <GroupCard
        v-for="g in groups"
        :key="g.id"
        :group="g"
        status="active"
        @rename="rename"
        @complete="markCompleted"
        @delete="remove"
      />
    </div>
  </div>
</template>