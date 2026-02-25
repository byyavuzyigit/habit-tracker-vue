import { ref, onMounted, onUnmounted } from "vue";
import { storeToRefs } from "pinia";
import { useAuthStore } from "../store/authStore";
import { listenGroups, createGroup, renameGroup, setGroupStatus, removeGroup } from "../services/groups";

// composable for managing groups (either active or completed based on the provided status argument), handles fetching groups in real time, as well as adding, renaming, completing/restoring and deleting groups


export function useGroups(status) {
  const authStore = useAuthStore();
  const { user } = storeToRefs(authStore);

  const groups = ref([]);
  const loading = ref(true);
  const error = ref("");

  let unsubscribe = null;

  onMounted(() => {
    error.value = "";
    loading.value = true;

    if (!user.value) {
      error.value = "Not authenticated";
      loading.value = false;
      return;
    }

    unsubscribe = listenGroups(user.value.uid, status, (data) => {
      groups.value = data;
      loading.value = false;
    });
  });

  onUnmounted(() => {
    if (unsubscribe) unsubscribe();
  });

  async function add(name) {
    if (!user.value) throw new Error("Not authenticated");
    const trimmed = name.trim();
    if (!trimmed) return;
    await createGroup(user.value.uid, trimmed);
  }

  async function rename(groupId, name) {
    if (!user.value) throw new Error("Not authenticated");
    const trimmed = name.trim();
    if (!trimmed) return;
    await renameGroup(user.value.uid, groupId, trimmed);
  }

  async function markCompleted(groupId) {
    if (!user.value) throw new Error("Not authenticated");
    await setGroupStatus(user.value.uid, groupId, "completed");
  }

  async function restoreActive(groupId) {
    if (!user.value) throw new Error("Not authenticated");
    await setGroupStatus(user.value.uid, groupId, "active");
  }

  async function remove(groupId) {
    if (!user.value) throw new Error("Not authenticated");
    await removeGroup(user.value.uid, groupId);
  }

  return {
    groups,
    loading,
    error,
    add,
    rename,
    markCompleted,
    restoreActive,
    remove,
  };
}