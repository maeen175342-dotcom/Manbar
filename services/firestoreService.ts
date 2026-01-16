
import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy,
  Timestamp 
} from "firebase/firestore";
import { db } from "../firebase/config";
import { LegacyEntry } from "../types";

const COLLECTION_NAME = "legacy_entries";

export const addLegacyEntry = async (content: string, authorName: string) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      content,
      authorName,
      status: 'pending',
      timestamp: Timestamp.now()
    });
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
};

export const getAllLegacyEntries = async (): Promise<LegacyEntry[]> => {
  const q = query(collection(db, COLLECTION_NAME), orderBy("timestamp", "desc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    timestamp: (doc.data().timestamp as Timestamp).toMillis()
  } as LegacyEntry));
};

export const updateLegacyEntry = async (id: string, data: Partial<LegacyEntry>) => {
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, data);
};

export const deleteLegacyEntry = async (id: string) => {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
};
