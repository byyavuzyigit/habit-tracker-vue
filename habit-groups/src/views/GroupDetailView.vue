<script setup>
import { onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import HabitItem from "../components/HabitItem.vue";
import { useHabits } from "../composables/useHabits";
import { useAuthStore } from "../store/authStore";
import { getGroupById } from "../services/groups";

const props = defineProps({
  id: { type: String, required: true }, // groupId from route
});

const newHabitTitle = ref("");
const uiError = ref("");
const groupName = ref("Group");

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

const {
  habits,
  loading,
  error,
  completedToday,
  add,
  rename,
  remove,
  toggleToday,
} = useHabits(props.id);

async function onCreateHabit() {
  uiError.value = "";
  try {
    await add(newHabitTitle.value);
    newHabitTitle.value = "";
  } catch (e) {
    uiError.value = e?.message ?? "Failed to create habit";
  }
}

onMounted(async () => {
  if (!user.value) return;
  const group = await getGroupById(user.value.uid, props.id);
  if (group?.name) {
    groupName.value = group.name;
  }
});
</script>

<template>
  <div style="padding: 24px; max-width: 800px;">
    <h1>{{ groupName }}</h1>
    <p style="opacity: 0.7;">Group ID: {{ id }}</p>

    <div style="margin-top: 16px; display:flex; gap: 8px;">
      <input v-model="newHabitTitle" placeholder="New habit (e.g., Drink water)" style="flex: 1;" />
      <button @click="onCreateHabit">Add</button>
    </div>

    <p v-if="error" style="color:#b00020; margin-top: 12px;">{{ error }}</p>
    <p v-if="uiError" style="color:#b00020; margin-top: 12px;">{{ uiError }}</p>

    <p v-if="loading" style="margin-top: 16px;">Loading...</p>

    <div v-else style="margin-top: 16px; display: grid; gap: 12px;">
      <p v-if="habits.length === 0">No habits yet.</p>

      <HabitItem
        v-for="h in habits"
        :key="h.id"
        :habit="h"
        :done-today="!!completedToday[h.id]"
        @toggle="toggleToday"
        @rename="rename"
        @delete="remove"
      />
    </div>
  </div>
</template>