import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { Note, NoteColor } from "./NoteCard";
import { cn } from "@/lib/utils";

interface NoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (note: Partial<Note>) => void;
  note?: Note | null;
}

const colors: { value: NoteColor; label: string }[] = [
  { value: "pink", label: "Pink" },
  { value: "blue", label: "Blue" },
  { value: "lavender", label: "Lavender" },
  { value: "mint", label: "Mint" },
  { value: "peach", label: "Peach" },
];

export function NoteDialog({ open, onOpenChange, onSave, note }: NoteDialogProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedColor, setSelectedColor] = useState<NoteColor>("pink");

  useEffect(() => {
    if (note) {
      setTitle(note.title || "");
      setContent(note.content);
      setSelectedColor(note.color);
    } else {
      setTitle("");
      setContent("");
      setSelectedColor("pink");
    }
  }, [note, open]);

  const handleSave = () => {
    if (!content.trim()) return;
    
    onSave({
      ...(note && { id: note.id }),
      title: title.trim() || undefined,
      content: content.trim(),
      color: selectedColor,
      isPinned: note?.isPinned || false,
    });
    
    onOpenChange(false);
  };

  const colorClasses: Record<NoteColor, string> = {
    pink: "bg-note-pink dark:bg-note-dark-pink",
    blue: "bg-note-blue dark:bg-note-dark-blue",
    lavender: "bg-note-lavender dark:bg-note-dark-lavender",
    mint: "bg-note-mint dark:bg-note-dark-mint",
    peach: "bg-note-peach dark:bg-note-dark-peach",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] rounded-3xl p-8" data-testid="note-dialog">
        <DialogHeader>
          <DialogTitle>{note ? "Edit Note" : "New Note"}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title (optional)</Label>
            <Input
              id="title"
              placeholder="Enter a title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-xl"
              data-testid="input-note-title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-32 rounded-xl resize-none"
              data-testid="input-note-content"
            />
          </div>

          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex gap-2">
              {colors.map((color) => (
                <button
                  key={color.value}
                  className={cn(
                    "w-10 h-10 rounded-full border-2 transition-all hover-elevate active-elevate-2",
                    colorClasses[color.value],
                    selectedColor === color.value
                      ? "border-foreground scale-110"
                      : "border-transparent"
                  )}
                  onClick={() => setSelectedColor(color.value)}
                  aria-label={color.label}
                  data-testid={`color-${color.value}`}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-full"
              data-testid="button-cancel"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!content.trim()}
              className="rounded-full"
              data-testid="button-save"
            >
              {note ? "Save Changes" : "Create Note"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
