import {db} from './firebase';
import {collection, addDoc, doc, updateDoc, deleteDoc, 
    query, where, orderBy, serverTimestamp, onSnapshot} from 'firebase/firestore';

// firestore path: users/{uid}/groups
function groupsCol(uid){
    return collection(db, 'users', uid, 'groups');
}

// listen for real time updates to groups with the specified status (active or completed) and call the provided callback with the updated list of groups whenever it changes
export function listenGroups(uid, status, callback){
    const q = query(groupsCol(uid), where('status', '==', status), orderBy('createdAt', 'desc'));
    
    // real time listener for groups collection with the specified status (active or completed)
    return onSnapshot(q, (snapshot) => {
        const groups = [];
        snapshot.forEach((doc) => {
            groups.push({id: doc.id, ...doc.data()});
        });
        callback(groups);
    });
}

// create new group with given name, returns the created document reference
export async function createGroup(uid, name){
    const now = serverTimestamp();
    return addDoc(groupsCol(uid), {
        name,
        status: 'active',
        createdAt: now,
        updatedAt: now,
        completedAt: null,
    });
}

// rename group (only updates name and updatedAt timestamp)
export async function renameGroup(uid, groupId, newName){
    const ref = doc(db, 'users', uid, 'groups', groupId);
    return updateDoc(ref, {
        name: newName.trim(),
        updatedAt: serverTimestamp(),
    });
}

// change group status (active <-> completed), also updates completedAt timestamp when marking as completed and clears it when marking as active again
export async function setGroupStatus(uid, groupId, newStatus){
    const ref = doc(db, 'users', uid, 'groups', groupId);
    
    const patch = newStatus === 'completed' 
        ? {status: newStatus, completedAt: serverTimestamp(), updatedAt: serverTimestamp()}
        : {status: newStatus, completedAt: null, updatedAt: serverTimestamp()};
    
    return updateDoc(ref, patch);
}

// delete group by id
export async function removeGroup(uid, groupId){
    const ref = doc(db, 'users', uid, 'groups', groupId);
    return deleteDoc(ref);
}