import React, { useState } from 'react';
import { doc, deleteDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebase/FirebaseProvider';
import { Note } from '@/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trash2, Edit, Save, X } from 'lucide-react';
import { useAuth } from '@/firebase/useAuth';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from 'sonner';

interface NoteCardProps {
  note: Note;
  boardId: string;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, boardId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(note.content);
  const { user } = useAuth();

  const canModify = !user || user?.uid === note.author.uid || note.author.uid === 'anonymous';

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, 'boards', boardId, 'notes', note.id));
      toast.success('Note deleted.');
    } catch (error) {
      console.error("Error deleting document: ", error);
      toast.error('Failed to delete note.');
    }
  };

  const handleUpdate = async () => {
    if (editedContent.trim() === '') return;
    try {
      await updateDoc(doc(db, 'boards', boardId, 'notes', note.id), {
        content: editedContent,
        updatedAt: serverTimestamp(),
      });
      setIsEditing(false);
      toast.success('Note updated.');
    } catch (error) {
      console.error("Error updating document: ", error);
      toast.error('Failed to update note.');
    }
  };

  const getInitials = (name: string) => {
    if (!name) return 'AN';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <Card className="flex flex-col justify-between">
      <CardHeader className="flex-row items-center gap-3 space-y-0 p-4">
        <Avatar>
          <AvatarImage src={note.author.photoURL || undefined} alt={note.author.name} />
          <AvatarFallback>{getInitials(note.author.name)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold">{note.author.name}</p>
          <p className="text-xs text-muted-foreground">
            {note.createdAt?.toDate().toLocaleString()}
          </p>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        {isEditing ? (
          <Textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="min-h-[100px] resize-none"
          />
        ) : (
          <p className="whitespace-pre-wrap">{note.content}</p>
        )}
      </CardContent>
      {canModify && (
        <CardFooter className="flex justify-end gap-2 p-4 pt-0">
          {isEditing ? (
            <>
              <Button variant="ghost" size="icon" onClick={handleUpdate}>
                <Save className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setIsEditing(false)}>
                <X className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete this note.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default NoteCard;
