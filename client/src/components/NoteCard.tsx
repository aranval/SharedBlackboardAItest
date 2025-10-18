import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pin, Trash2, Edit } from "lucide-react";
import { cn } from "@/lib/utils";

export type NoteColor = "pink" | "blue" | "lavender" | "mint" | "peach";

export interface Note {
  id: string;
  title?: string;
  content: string;
  color: NoteColor;
  isPinned: boolean;
  createdAt: Date;
}

interface NoteCardProps {
  note: Note;
  onEdit?: (note: Note) => void;
  onDelete?: (id: string) => void;
  onTogglePin?: (id: string) => void;
}

export function NoteCard({ note, onEdit, onDelete, onTogglePin }: NoteCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const colorClasses = {
    pink: "bg-note-pink dark:bg-note-dark-pink",
    blue: "bg-note-blue dark:bg-note-dark-blue",
    lavender: "bg-note-lavender dark:bg-note-dark-lavender",
    mint: "bg-note-mint dark:bg-note-dark-mint",
    peach: "bg-note-peach dark:bg-note-dark-peach",
  };

  return (
    <Card
      className={cn(
        "p-5 space-y-3 rounded-2xl border-0 shadow-md hover:shadow-lg transition-all duration-150 group relative overflow-visible",
        colorClasses[note.color]
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-testid={`note-card-${note.id}`}
    >
      {note.isPinned && (
        <Pin className="absolute top-3 right-3 h-4 w-4 text-foreground/60" data-testid={`pin-indicator-${note.id}`} />
      )}
      
      <div className="space-y-2">
        {note.title && (
          <h3 className="text-lg font-semibold text-foreground line-clamp-2" data-testid={`note-title-${note.id}`}>
            {note.title}
          </h3>
        )}
        <p className="text-sm text-foreground/80 whitespace-pre-wrap line-clamp-6" data-testid={`note-content-${note.id}`}>
          {note.content}
        </p>
      </div>

      <div
        className={cn(
          "flex items-center gap-1 transition-opacity",
          isHovered ? "opacity-100" : "opacity-0"
        )}
      >
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover-elevate active-elevate-2"
          onClick={() => onTogglePin?.(note.id)}
          data-testid={`button-pin-${note.id}`}
        >
          <Pin className={cn("h-4 w-4", note.isPinned && "fill-current")} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover-elevate active-elevate-2"
          onClick={() => onEdit?.(note)}
          data-testid={`button-edit-${note.id}`}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover-elevate active-elevate-2"
          onClick={() => onDelete?.(note.id)}
          data-testid={`button-delete-${note.id}`}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
