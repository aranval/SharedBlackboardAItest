import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, Share2, Download, Upload } from 'lucide-react';
import { useAuth } from '@/firebase/useAuth';
import { toast } from 'sonner';
import { Note } from '@/types';
import { collection, writeBatch, doc } from 'firebase/firestore';
import { db } from '@/firebase/FirebaseProvider';

interface BoardHeaderProps {
  boardId: string;
  notes: Note[];
}

const BoardHeader: React.FC<BoardHeaderProps> = ({ boardId, notes }) => {
  const navigate = useNavigate();
  const { user, signInWithGoogle, signOut } = useAuth();

  const copyBoardLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Board link copied to clipboard!');
  };

  const exportNotes = () => {
    const dataStr = JSON.stringify(notes.map(({ id, ...rest }) => rest), null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `sharednotes_${boardId}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    toast.success('Notes exported successfully!');
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const content = e.target?.result;
        const importedNotes = JSON.parse(content as string);
        if (!Array.isArray(importedNotes)) {
          throw new Error('Invalid JSON format.');
        }

        const batch = writeBatch(db);
        const notesCollection = collection(db, 'boards', boardId, 'notes');
        
        importedNotes.forEach(note => {
          const newNoteRef = doc(notesCollection);
          batch.set(newNoteRef, note);
        });

        await batch.commit();
        toast.success('Notes imported successfully!');
      } catch (error) {
        toast.error('Failed to import notes. Please check the file format.');
        console.error(error);
      }
    };
    reader.readAsText(file);
  };

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-background/80 p-4 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
          <Home className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold">Board: {boardId}</h1>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={copyBoardLink}>
          <Share2 className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" onClick={exportNotes} disabled={notes.length === 0}>
          <Download className="h-5 w-5" />
        </Button>
        <label htmlFor="import-notes" className="cursor-pointer">
          <Upload className="h-5 w-5 text-muted-foreground hover:text-foreground" />
          <input id="import-notes" type="file" accept=".json" className="hidden" onChange={handleImport} />
        </label>
        {user ? (
          <Button onClick={signOut} variant="ghost" size="sm">
            Sign Out
          </Button>
        ) : (
          <Button onClick={signInWithGoogle} variant="secondary" size="sm">
            Sign In
          </Button>
        )}
      </div>
    </header>
  );
};

export default BoardHeader;
