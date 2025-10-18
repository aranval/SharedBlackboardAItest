import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, Upload, Trash2 } from "lucide-react";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  boardName?: string;
  onUpdateBoardName?: (name: string) => void;
  onExport?: () => void;
  onImport?: (file: File) => void;
  onClearBoard?: () => void;
}

export function SettingsDialog({
  open,
  onOpenChange,
  boardName = "My Board",
  onUpdateBoardName,
  onExport,
  onImport,
  onClearBoard,
}: SettingsDialogProps) {
  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onImport) {
      onImport(file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] rounded-3xl p-8" data-testid="settings-dialog">
        <DialogHeader>
          <DialogTitle>Board Settings</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="board-name">Board Name</Label>
            <Input
              id="board-name"
              defaultValue={boardName}
              onBlur={(e) => onUpdateBoardName?.(e.target.value)}
              className="rounded-xl"
              data-testid="input-board-name"
            />
          </div>

          <div className="space-y-3">
            <Label>Data Management</Label>
            
            <Button
              variant="outline"
              className="w-full justify-start gap-2 rounded-xl hover-elevate active-elevate-2"
              onClick={onExport}
              data-testid="button-export"
            >
              <Download className="h-4 w-4" />
              Export Board as JSON
            </Button>

            <div>
              <input
                type="file"
                id="import-file"
                accept=".json"
                onChange={handleFileImport}
                className="hidden"
                data-testid="input-import-file"
              />
              <Button
                variant="outline"
                className="w-full justify-start gap-2 rounded-xl hover-elevate active-elevate-2"
                onClick={() => document.getElementById('import-file')?.click()}
                data-testid="button-import"
              >
                <Upload className="h-4 w-4" />
                Import Board from JSON
              </Button>
            </div>

            <Button
              variant="destructive"
              className="w-full justify-start gap-2 rounded-xl"
              onClick={onClearBoard}
              data-testid="button-clear"
            >
              <Trash2 className="h-4 w-4" />
              Clear All Notes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
