import { useState } from 'react';
import { SettingsDialog } from '../SettingsDialog';
import { Button } from '@/components/ui/button';

export default function SettingsDialogExample() {
  const [open, setOpen] = useState(true);

  return (
    <div className="p-6 bg-background">
      <Button onClick={() => setOpen(true)}>Open Settings</Button>
      <SettingsDialog
        open={open}
        onOpenChange={setOpen}
        boardName="My Board"
        onUpdateBoardName={(name) => console.log('Update name:', name)}
        onExport={() => console.log('Export board')}
        onImport={(file) => console.log('Import file:', file.name)}
        onClearBoard={() => console.log('Clear board')}
      />
    </div>
  );
}
