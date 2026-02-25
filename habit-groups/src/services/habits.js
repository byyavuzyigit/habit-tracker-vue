import { db } from "./firebase";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  setDoc,
  getDoc,
} from "firebase/firestore";

// returns a collection reference for the habits subcollection of a specific group
function habitsCol(uid, groupId) {
  return collection(db, "users", uid, "groups", groupId, "habits");
}

// returns a document reference for a specific habit in a group
function habitDoc(uid, groupId, habitId) {
  return doc(db, "users", uid, "groups", groupId, "habits", habitId);
}

// returns a document reference for the completion status of a specific habit on a specific day (identified by dayKey) - used for tracking daily completions of habits
function completionDoc(uid, groupId, habitId, dayKey) {
  return doc(db, "users", uid, "groups", groupId, "habits", habitId, "completions", dayKey);
}

// listens for real time updates to the list of habits in a specific group and calls the provided callback with the updated list whenever it changes
export function listenHabits(uid, groupId, callback) {
  const q = query(habitsCol(uid, groupId), orderBy("createdAt", "asc"));

  return onSnapshot(q, (snapshot) => {
    const habits = [];
    snapshot.forEach((doc) => {
      habits.push({ id: doc.id, ...doc.data() });
    });
    callback(habits);
  });
}

export async function createHabit(uid, groupId, title) {
  const now = serverTimestamp();
  return addDoc(habitsCol(uid, groupId), {
    title: title.trim(),
    createdAt: now,
    updatedAt: now,
  });
}

export async function renameHabit(uid, groupId, habitId, title) {
  return updateDoc(habitDoc(uid, groupId, habitId), {
    title: title.trim(),
    updatedAt: serverTimestamp(),
  });
}

export async function removeHabit(uid, groupId, habitId) {
  return deleteDoc(habitDoc(uid, groupId, habitId));
}

// mark completion for a specific day (idempotent)
export async function setCompletedForDay(uid, groupId, habitId, dayKey, done) {
  const ref = completionDoc(uid, groupId, habitId, dayKey);

  if (!done) {
    return;
  }

  // setDoc with merge makes it safe if doc exists
  return setDoc(
    ref,
    { value: true, completedAt: serverTimestamp() },
    { merge: true }
  );
}

// used to check if completed today
export async function getCompletionForDay(uid, groupId, habitId, dayKey) {
  const snap = await getDoc(completionDoc(uid, groupId, habitId, dayKey));
  return snap.exists();
}

export async function deleteCompletionForDay(uid, groupId, habitId, dayKey) {
  return deleteDoc(completionDoc(uid, groupId, habitId, dayKey));
}