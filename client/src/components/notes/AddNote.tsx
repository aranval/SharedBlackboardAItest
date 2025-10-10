import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebase/FirebaseProvider';
import { useAuth } from '@/firebase/useAuth';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

interface AddNoteProps {
  boardId: string;
}

const AddNote: React.FC<AddNoteProps> = ({ boardId }) => {
  const [content, setContent] = useState('');
  const { user } = useAuth();

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim() === '') return;

    try {
      await addDoc(collection(db, 'boards', boardId, 'notes'), {
        content: content.trim(),
        createdAt: serverTimestamp(),
        author: user ? {
          uid: user.uid,
          name: user.displayName || 'Authenticated User',
          photoURL: user.photoURL,
        } : {
          uid: 'anonymous',
          name: 'Anonymous',
        },
      });
      setContent('');
      toast.success('Note added!');
    } catch (error) {
      console.error('Error adding note: ', error);
      toast.error('Failed to add note.');
    }
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <form onSubmit={handleAddNote} className="space-y-4">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write a new note..."
            className="min-h-[80px] resize-none"
          />
          <Button type="submit" className="w-full bg-teal-400 hover:bg-teal-500 text-black">
            Add Note
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddNote;
