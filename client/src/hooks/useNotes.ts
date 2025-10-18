import { useState, useEffect } from "react";
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { NoteColor } from "@/components/NoteCard";

export interface FirestoreNote {
  id: string;
  title?: string;
  content: string;
  color: NoteColor;
  isPinned: boolean;
  createdBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export function useNotes(boardId: string | null) {
  const [notes, setNotes] = useState<FirestoreNote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!boardId) {
      setNotes([]);
      setLoading(false);
      return;
    }

    const notesRef = collection(db, "boards", boardId, "notes");
    const notesQuery = query(notesRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      notesQuery,
      (snapshot) => {
        const notesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as FirestoreNote[];
        setNotes(notesData);
        setLoading(false);
      },
      (error) => {
        console.error("Error loading notes:", error);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [boardId]);

  const addNote = async (
    boardId: string,
    userId: string,
    noteData: {
      title?: string;
      content: string;
      color: NoteColor;
    }
  ) => {
    const notesRef = collection(db, "boards", boardId, "notes");
    await addDoc(notesRef, {
      ...noteData,
      isPinned: false,
      createdBy: userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  };

  const updateNote = async (
    boardId: string,
    noteId: string,
    updates: Partial<FirestoreNote>
  ) => {
    const noteRef = doc(db, "boards", boardId, "notes", noteId);
    await updateDoc(noteRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  };

  const deleteNote = async (boardId: string, noteId: string) => {
    const noteRef = doc(db, "boards", boardId, "notes", noteId);
    await deleteDoc(noteRef);
  };

  const togglePin = async (boardId: string, noteId: string, isPinned: boolean) => {
    const noteRef = doc(db, "boards", boardId, "notes", noteId);
    await updateDoc(noteRef, {
      isPinned: !isPinned,
      updatedAt: serverTimestamp(),
    });
  };

  const clearAllNotes = async (boardId: string) => {
    const deletePromises = notes.map((note) => 
      deleteNote(boardId, note.id)
    );
    await Promise.all(deletePromises);
  };

  return {
    notes,
    loading,
    addNote,
    updateNote,
    deleteNote,
    togglePin,
    clearAllNotes,
  };
}
