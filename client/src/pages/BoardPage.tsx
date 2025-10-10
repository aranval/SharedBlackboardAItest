import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, query, orderBy } from 'firebase/firestore';
import { db } from '@/firebase/FirebaseProvider';
import NoteCard from '@/components/notes/NoteCard';
import AddNote from '@/components/notes/AddNote';
import BoardHeader from '@/components/board/BoardHeader';
import { Note } from '@/types';

const BoardPage = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const navigate = useNavigate();

  if (!boardId) {
    navigate('/');
    return null;
  }

  const notesCollection = collection(db, 'boards', boardId, 'notes');
  const notesQuery = query(notesCollection, orderBy('createdAt', 'desc'));
  const [notesSnapshot, loading, error] = useCollection(notesQuery);

  const notes: Note[] =
    notesSnapshot?.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as Note)) || [];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <BoardHeader boardId={boardId} notes={notes} />
      <main className="p-4">
        <AddNote boardId={boardId} />
        {loading && <p className="text-center">Loading notes...</p>}
        {error && <p className="text-center text-red-500">Error: {error.message}</p>}
        {!loading && notes.length === 0 && (
          <p className="mt-8 text-center text-muted-foreground">
            No notes yet. Be the first to add one!
          </p>
        )}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {notes.map((note) => (
            <NoteCard key={note.id} note={note} boardId={boardId} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default BoardPage;
