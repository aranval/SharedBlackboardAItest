import { NotesGrid } from '../NotesGrid';

export default function NotesGridExample() {
  const mockNotes = [
    {
      id: "1",
      title: "Meeting Notes",
      content: "Discuss project timeline and deliverables",
      color: "pink" as const,
      isPinned: true,
      createdAt: new Date(),
    },
    {
      id: "2",
      content: "Buy groceries: milk, eggs, bread",
      color: "blue" as const,
      isPinned: false,
      createdAt: new Date(),
    },
    {
      id: "3",
      title: "Book Recommendations",
      content: "1. The Midnight Library\n2. Project Hail Mary\n3. Klara and the Sun",
      color: "lavender" as const,
      isPinned: true,
      createdAt: new Date(),
    },
  ];

  return (
    <div className="bg-background min-h-screen py-8">
      <NotesGrid
        notes={mockNotes}
        onEdit={(note) => console.log('Edit:', note)}
        onDelete={(id) => console.log('Delete:', id)}
        onTogglePin={(id) => console.log('Toggle pin:', id)}
      />
    </div>
  );
}
