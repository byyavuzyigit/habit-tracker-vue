<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const props = defineProps({
  group: { type: Object, required: true },
  status: { type: String, required: true }, // "active" or "completed"
});

// define the events that this component can emit to its parent. these events correspond to user actions like renaming, completing, restoring or deleting a group.
const emit = defineEmits(["rename", "complete", "restore", "delete"]);

const editing = ref(false);
const nameDraft = ref(props.group.name);

function open() {
  router.push({ name: "group", params: { id: props.group.id } });
}

function startEdit() {
  editing.value = true;
  nameDraft.value = props.group.name;
}

async function saveEdit() {
  const next = nameDraft.value.trim();
  // emit only if the name has changed and not empty.
  if (next && next !== props.group.name){
    emit("rename", props.group.id, next);
  } 
  editing.value = false;
}
</script>

<template>
  <div style="border: 1px solid #eee; border-radius: 10px; padding: 12px; display: grid; gap: 10px;">
    <div style="display:flex; align-items:center; justify-content:space-between; gap: 12px;">
      <div style="flex: 1;">
        <div v-if="!editing" style="font-weight: 700; cursor:pointer;" @click="open">
          {{ group.name }}
        </div>

        <div v-else style="display:flex; gap: 8px;">
          <input v-model="nameDraft" style="flex:1;" />
          <button @click="saveEdit">Save</button>
          <button @click="editing=false">Cancel</button>
        </div>
      </div>

      <button v-if="!editing" @click="startEdit">Rename</button>
    </div>

    <div style="display:flex; gap: 8px; flex-wrap: wrap;">
      <button v-if="status === 'active'" @click="$emit('complete', group.id)">Mark Completed</button>
      <button v-else @click="$emit('restore', group.id)">Restore Active</button>

      <button @click="$emit('delete', group.id)" style="margin-left:auto;">Delete</button>
    </div>
  </div>
</template>