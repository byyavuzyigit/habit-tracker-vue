import { ref, onMounted, onUnmounted } from "vue";
import { storeToRefs } from "pinia";
import { useAuthStore } from "../store/authStore";
import {
  listenHabits,
  createHabit,
  renameHabit,
  removeHabit,
  getCompletionForDay,
  setCompletedForDay,
  deleteCompletionForDay,
} from "../services/habits";
import { todayKey } from "../utils/date";

export function useHabits(groupId) {
  const authStore = useAuthStore();
  const { user } = storeToRefs(authStore);

  const habits = ref([]);
  const loading = ref(true);
  const error = ref("");

  // local cache: habitId -> boolean (completed today)
  const completedToday = ref({});

  let unsubscribe = null;

  async function refreshCompletedFlags(list) {
    if (!user.value) 
        return;
    const uid = user.value.uid;
    const key = todayKey();

    // fetch completion status for all habits in the list in parallel and update the completedToday map
    const entries = await Promise.all(
      list.map(async (h) => {
        const done = await getCompletionForDay(uid, groupId, h.id, key);
        return [h.id, done];
      })
    );

    completedToday.value = Object.fromEntries(entries);
  }

  onMounted(() => {
    error.value = "";
    loading.value = true;

    if (!user.value) {
      error.value = "Not authenticated";
      loading.value = false;
      return;
    }

    unsubscribe = listenHabits(user.value.uid, groupId, async (data) => {
      habits.value = data;
      loading.value = false;
      // update today flags whenever habits list changes
      await refreshCompletedFlags(data);
    });
  });

  onUnmounted(() => {
    if (unsubscribe) unsubscribe();
  });

  async function add(title) {
    if (!user.value) throw new Error("Not authenticated");
    const t = title.trim();
    if (!t) return;
    await createHabit(user.value.uid, groupId, t);
  }

  async function rename(habitId, title) {
    if (!user.value) throw new Error("Not authenticated");
    const t = title.trim();
    if (!t) 
        return;
    await renameHabit(user.value.uid, groupId, habitId, t);
  }

  async function remove(habitId) {
    if (!user.value) throw new Error("Not authenticated");
    await removeHabit(user.value.uid, groupId, habitId);
  }

  // toggle completion status for today for the specified habit, also updates the local completedToday map to reflect the change immediately in the UI without waiting for the real-time update from Firestore (which will also update it eventually to ensure consistency)
  async function toggleToday(habitId) {
    if (!user.value) throw new Error("Not authenticated");
    const uid = user.value.uid;
    const key = todayKey();

    const isDone = !!completedToday.value[habitId];

    if (isDone) {
      await deleteCompletionForDay(uid, groupId, habitId, key);
      completedToday.value = { ...completedToday.value, [habitId]: false };
    } else {
      await setCompletedForDay(uid, groupId, habitId, key, true);
      completedToday.value = { ...completedToday.value, [habitId]: true };
    }
  }

  return {
    habits,
    loading,
    error,
    completedToday,
    add,
    rename,
    remove,
    toggleToday,
  };
}