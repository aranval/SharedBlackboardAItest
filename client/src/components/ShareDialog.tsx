import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  boardId: string;
}

export function ShareDialog({ open, onOpenChange, boardId }: ShareDialogProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = `${window.location.origin}/board/${boardId}`;

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] rounded-3xl p-8" data-testid="share-dialog">
        <DialogHeader>
          <DialogTitle>Share Board</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="board-code">Board Code</Label>
            <div className="flex gap-2">
              <Input
                id="board-code"
                value={boardId}
                readOnly
                className="rounded-xl font-mono"
                data-testid="input-board-code"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(boardId)}
                className="shrink-0 rounded-lg hover-elevate active-elevate-2"
                data-testid="button-copy-code"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Share this code with someone to give them access to this board
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="share-url">Share Link</Label>
            <div className="flex gap-2">
              <Input
                id="share-url"
                value={shareUrl}
                readOnly
                className="rounded-xl text-sm"
                data-testid="input-share-url"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(shareUrl)}
                className="shrink-0 rounded-lg hover-elevate active-elevate-2"
                data-testid="button-copy-url"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
