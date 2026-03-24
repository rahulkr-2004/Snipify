import { db } from '../firebase';
import { 
  collection, doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc, 
  query, where, orderBy, serverTimestamp, increment 
} from 'firebase/firestore';

export const dbService = {
  // ======================
  // USERS CRUD
  // ======================
  async getUser(userId) {
    const userSnap = await getDoc(doc(db, 'users', userId));
    return userSnap.exists() ? userSnap.data() : null;
  },

  async updateUser(userId, data) {
    await setDoc(doc(db, 'users', userId), data, { merge: true });
  },

  // ======================
  // FOLDERS CRUD
  // ======================
  async createFolder(userId, name) {
    const foldersRef = collection(db, 'folders');
    const newFolderRef = doc(foldersRef);
    const folderData = {
      userId,
      name,
      createdAt: serverTimestamp()
    };
    await setDoc(newFolderRef, folderData);
    return { id: newFolderRef.id, ...folderData };
  },

  async getUserFolders(userId) {
    const q = query(collection(db, 'folders'), where('userId', '==', userId));
    const snapshot = await getDocs(q);
    const folders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // Sort client-side to avoid Firebase composite index requirement
    return folders.sort((a, b) => {
      const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
      const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
      return timeA - timeB;
    });
  },

  async updateFolder(folderId, name) {
    const folderRef = doc(db, 'folders', folderId);
    await updateDoc(folderRef, { name });
  },

  async deleteFolder(folderId) {
    await deleteDoc(doc(db, 'folders', folderId));
  },

  // ======================
  // SNIPPETS CRUD
  // ======================
  async createSnippet(userId, data) {
    const snippetsRef = collection(db, 'snippets');
    const newSnippetRef = doc(snippetsRef);
    const snippetData = {
      userId,
      title: data.title || "Untitled Snippet",
      description: data.description || "",
      code: data.code || "",
      language: data.language || "javascript",
      tags: data.tags || [],
      folderId: data.folderId || null,
      isFavorite: data.isFavorite || false,
      visibility: data.visibility || "private",
      copies: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    await setDoc(newSnippetRef, snippetData);
    return { id: newSnippetRef.id, ...snippetData };
  },

  async getUserSnippets(userId) {
    const q = query(collection(db, 'snippets'), where('userId', '==', userId));
    const snapshot = await getDocs(q);
    const userSnippets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // Sort client-side down (newest first) to avoid Firebase composite index requirement
    return userSnippets.sort((a, b) => {
      const timeA = a.updatedAt?.toMillis ? a.updatedAt.toMillis() : 0;
      const timeB = b.updatedAt?.toMillis ? b.updatedAt.toMillis() : 0;
      return timeB - timeA;
    });
  },

  async getPublicSnippets() {
    const q = query(collection(db, 'snippets'), where('visibility', '==', 'public'));
    const snapshot = await getDocs(q);
    const publicSnippets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // Sort client-side down (newest first)
    return publicSnippets.sort((a, b) => {
      const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
      const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
      return timeB - timeA;
    });
  },
  
  async updateSnippet(snippetId, data) {
    const snippetRef = doc(db, 'snippets', snippetId);
    await updateDoc(snippetRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
  },

  async incrementCopyCount(snippetId) {
    const snippetRef = doc(db, 'snippets', snippetId);
    await updateDoc(snippetRef, {
      copies: increment(1)
    });
  },

  async deleteSnippet(snippetId) {
    await deleteDoc(doc(db, 'snippets', snippetId));
  }
};
