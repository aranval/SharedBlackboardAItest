import { useState } from 'react';
import { ShareDialog } from '../ShareDialog';
import { Button } from '@/components/ui/button';

export default function ShareDialogExample() {
  const [open, setOpen] = useState(true);

  return (
    <div className="p-6 bg-background">
      <Button onClick={() => setOpen(true)}>Open Share Dialog</Button>
      <ShareDialog
        open={open}
        onOpenChange={setOpen}
        boardId="abc-123-xyz"
      />
    </div>
  );
}
