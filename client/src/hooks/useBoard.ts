import { useState, useEffect } from "react";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface Board {
  id: string;
  name: string;
  createdBy: string;
  createdAt: Timestamp;
  members: string[];
}

export function useBoard(boardId: string | null) {
  const [board, setBoard] = useState<Board | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!boardId) {
      setLoading(false);
      return;
    }

    const boardRef = doc(db, "boards", boardId);
    
    const unsubscribe = onSnapshot(
      boardRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setBoard({ id: snapshot.id, ...snapshot.data() } as Board);
          setError(null);
        } else {
          setBoard(null);
          setError("Board not found");
        }
        setLoading(false);
      },
      (err) => {
        console.error("Error loading board:", err);
        setError("Failed to load board");
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [boardId]);

  const createBoard = async (name: string, userId: string): Promise<string> => {
    const boardId = generateBoardId();
    const boardRef = doc(db, "boards", boardId);
    
    await setDoc(boardRef, {
      name,
      createdBy: userId,
      createdAt: serverTimestamp(),
      members: [userId],
    });

    return boardId;
  };

  const joinBoard = async (boardId: string, userId: string): Promise<boolean> => {
    const boardRef = doc(db, "boards", boardId);
    const boardSnap = await getDoc(boardRef);

    if (!boardSnap.exists()) {
      throw new Error("Board not found");
    }

    const boardData = boardSnap.data() as Board;
    if (!boardData.members.includes(userId)) {
      await setDoc(
        boardRef,
        { members: [...boardData.members, userId] },
        { merge: true }
      );
    }

    return true;
  };

  const updateBoardName = async (boardId: string, name: string) => {
    const boardRef = doc(db, "boards", boardId);
    await setDoc(boardRef, { name }, { merge: true });
  };

  return {
    board,
    loading,
    error,
    createBoard,
    joinBoard,
    updateBoardName,
  };
}

function generateBoardId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
