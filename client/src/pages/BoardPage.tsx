import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { BoardHeader } from "@/components/BoardHeader";
import { NotesGrid } from "@/components/NotesGrid";
import { FAB } from "@/components/FAB";
import { NoteDialog } from "@/components/NoteDialog";
import { ShareDialog } from "@/components/ShareDialog";
import { SettingsDialog } from "@/components/SettingsDialog";
import { useAuth } from "@/hooks/useAuth";
import { useBoard } from "@/hooks/useBoard";
import { useNotes } from "@/hooks/useNotes";
import { useToast } from "@/hooks/use-toast";
import type { Note } from "@/components/NoteCard";

export default function BoardPage() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const boardId = params.id || localStorage.getItem("currentBoardId");
  
  const { user, signOut } = useAuth();
  const { board, updateBoardName } = useBoard(boardId);
  const { notes, addNote, updateNote, deleteNote, togglePin, clearAllNotes } = useNotes(boardId);
  const { toast } = useToast();

  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  useEffect(() => {
    if (!boardId) {
      setLocation("/");
    }
  }, [boardId, setLocation]);

  const userId = user?.uid || "anonymous";

  const handleSaveNote = async (noteData: Partial<Note>) => {
    if (!boardId) return;

    try {
      if (editingNote) {
        await updateNote(boardId, editingNote.id, {
          title: noteData.title,
          content: noteData.content || "",
          color: noteData.color || "pink",
        });
      } else {
        await addNote(boardId, userId, {
          title: noteData.title,
          content: noteData.content || "",
          color: noteData.color || "pink",
        });
      }
      setEditingNote(null);
    } catch (error) {
      console.error("Error saving note:", error);
      toast({
        title: "Failed to save note",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setNoteDialogOpen(true);
  };

  const handleDeleteNote = async (id: string) => {
    if (!boardId) return;
    
    try {
      await deleteNote(boardId, id);
    } catch (error) {
      console.error("Error deleting note:", error);
      toast({
        title: "Failed to delete note",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleTogglePin = async (id: string) => {
    if (!boardId) return;
    
    const note = notes.find(n => n.id === id);
    if (note) {
      try {
        await togglePin(boardId, id, note.isPinned);
      } catch (error) {
        console.error("Error toggling pin:", error);
      }
    }
  };

  const handleUpdateBoardName = async (name: string) => {
    if (!boardId || !name.trim()) return;
    
    try {
      await updateBoardName(boardId, name);
    } catch (error) {
      console.error("Error updating board name:", error);
      toast({
        title: "Failed to update board name",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleExport = () => {
    const exportData = notes.map(note => ({
      title: note.title,
      content: note.content,
      color: note.color,
      isPinned: note.isPinned,
      createdAt: note.createdAt.toDate().toISOString(),
    }));
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${board?.name.replace(/\s+/g, '_') || 'board'}_export.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async (file: File) => {
    if (!boardId) return;
    
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const importedNotes = JSON.parse(e.target?.result as string);
        
        for (const note of importedNotes) {
          await addNote(boardId, userId, {
            title: note.title,
            content: note.content,
            color: note.color || "pink",
          });
        }
        
        toast({
          title: "Import successful",
          description: `Imported ${importedNotes.length} notes`,
        });
      } catch (err) {
        console.error('Failed to import:', err);
        toast({
          title: "Import failed",
          description: "Please check the file format",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  };

  const handleClearBoard = async () => {
    if (!boardId) return;
    
    try {
      await clearAllNotes(boardId);
      toast({
        title: "Board cleared",
        description: "All notes have been deleted",
      });
    } catch (error) {
      console.error("Error clearing board:", error);
      toast({
        title: "Failed to clear board",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      localStorage.removeItem("currentBoardId");
      localStorage.removeItem("userId");
      setLocation("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Convert Firestore notes to component format
  const displayNotes: Note[] = notes.map(note => ({
    id: note.id,
    title: note.title,
    content: note.content,
    color: note.color,
    isPinned: note.isPinned,
    createdAt: note.createdAt.toDate(),
  }));

  if (!boardId) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <BoardHeader
        boardName={board?.name || "Loading..."}
        userName={user?.displayName || undefined}
        userPhoto={user?.photoURL || undefined}
        onShare={() => setShareDialogOpen(true)}
        onSettings={() => setSettingsDialogOpen(true)}
        onSignOut={handleSignOut}
      />

      <main className="container max-w-7xl mx-auto py-8">
        <NotesGrid
          notes={displayNotes}
          onEdit={handleEditNote}
          onDelete={handleDeleteNote}
          onTogglePin={handleTogglePin}
        />
      </main>

      <FAB onClick={() => {
        setEditingNote(null);
        setNoteDialogOpen(true);
      }} />

      <NoteDialog
        open={noteDialogOpen}
        onOpenChange={setNoteDialogOpen}
        onSave={handleSaveNote}
        note={editingNote}
      />

      <ShareDialog
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        boardId={boardId}
      />

      <SettingsDialog
        open={settingsDialogOpen}
        onOpenChange={setSettingsDialogOpen}
        boardName={board?.name || "My Board"}
        onUpdateBoardName={handleUpdateBoardName}
        onExport={handleExport}
        onImport={handleImport}
        onClearBoard={handleClearBoard}
      />
    </div>
  );
}
