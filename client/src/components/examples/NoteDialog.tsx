import { useState } from 'react';
import { NoteDialog } from '../NoteDialog';
import { Button } from '@/components/ui/button';

export default function NoteDialogExample() {
  const [open, setOpen] = useState(true);

  return (
    <div className="p-6 bg-background">
      <Button onClick={() => setOpen(true)}>Open Dialog</Button>
      <NoteDialog
        open={open}
        onOpenChange={setOpen}
        onSave={(note) => {
          console.log('Saved note:', note);
          setOpen(false);
        }}
      />
    </div>
  );
}
