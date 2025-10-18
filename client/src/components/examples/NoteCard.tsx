import { NoteCard } from '../NoteCard';

export default function NoteCardExample() {
  return (
    <div className="p-6 bg-background">
      <div className="max-w-sm">
        <NoteCard
          note={{
            id: "1",
            title: "Meeting Notes",
            content: "Discuss project timeline and deliverables. Review budget and resources needed for Q1.",
            color: "pink",
            isPinned: true,
            createdAt: new Date(),
          }}
          onEdit={(note) => console.log('Edit note:', note)}
          onDelete={(id) => console.log('Delete note:', id)}
          onTogglePin={(id) => console.log('Toggle pin:', id)}
        />
      </div>
    </div>
  );
}
