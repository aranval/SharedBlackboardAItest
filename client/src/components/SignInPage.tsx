import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StickyNote } from "lucide-react";
import { SiGoogle } from "react-icons/si";
import { useState } from "react";

interface SignInPageProps {
  onGoogleSignIn?: () => void;
  onJoinBoard?: (boardId: string) => void;
  onCreateBoard?: () => void;
}

export function SignInPage({ onGoogleSignIn, onJoinBoard, onCreateBoard }: SignInPageProps) {
  const [boardCode, setBoardCode] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-secondary/20 to-background">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="p-4 rounded-3xl bg-primary/10">
              <StickyNote className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground">Cozy Notes</h1>
          <p className="text-muted-foreground">
            Your shared notes board for two
          </p>
        </div>

        <Card className="p-6 rounded-3xl space-y-6">
          <div className="space-y-4">
            <Button
              className="w-full gap-2 rounded-full"
              onClick={onGoogleSignIn}
              data-testid="button-google-signin"
            >
              <SiGoogle className="h-4 w-4" />
              Sign in with Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="board-code">Join with Board Code</Label>
                <Input
                  id="board-code"
                  placeholder="Enter board code..."
                  value={boardCode}
                  onChange={(e) => setBoardCode(e.target.value)}
                  className="rounded-xl"
                  data-testid="input-board-code"
                />
              </div>
              <Button
                variant="outline"
                className="w-full rounded-full hover-elevate active-elevate-2"
                onClick={() => onJoinBoard?.(boardCode)}
                disabled={!boardCode.trim()}
                data-testid="button-join-board"
              >
                Join Board
              </Button>
            </div>

            <Button
              variant="outline"
              className="w-full rounded-full hover-elevate active-elevate-2"
              onClick={onCreateBoard}
              data-testid="button-create-board"
            >
              Create New Board
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
