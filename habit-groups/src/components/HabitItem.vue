<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  habit: { type: Object, required: true },
  doneToday: { type: Boolean, required: true },
});

const emit = defineEmits(["toggle", "rename", "delete"]);

const editing = ref(false);
const draft = ref(props.habit.title);

// if the habit title changes externally while not editing, update the draft to reflect the new title. if currently editing, ignore external changes to avoid overwriting unsaved edits.
watch(() => props.habit.title, (t) => {
    if (!editing.value) draft.value = t;
  }
);

function startEdit() {
  editing.value = true;
  draft.value = props.habit.title;
}

function save() {
  const next = draft.value.trim();
  if (next && next !== props.habit.title) emit("rename", props.habit.id, next);
  editing.value = false;
}
</script>

<template>
  <div style="border: 1px solid #eee; border-radius: 10px; padding: 12px; display:flex; gap: 10px; align-items:center;">
    <button @click="$emit('toggle', habit.id)" style="min-width: 120px;">
      {{ doneToday ? "Completed ✓" : "Complete today" }}
    </button>

    <div style="flex:1;">
      <div v-if="!editing" style="font-weight: 600;">
        {{ habit.title }}
      </div>

      <div v-else style="display:flex; gap: 8px;">
        <input v-model="draft" style="flex:1;" />
        <button @click="save">Save</button>
        <button @click="editing=false">Cancel</button>
      </div>
    </div>

    <button v-if="!editing" @click="startEdit">Rename</button>
    <button @click="$emit('delete', habit.id)">Delete</button>
  </div>
</template>