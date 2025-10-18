import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { Plus, Share2, Settings, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface BoardHeaderProps {
  boardName?: string;
  userName?: string;
  userPhoto?: string;
  onAddNote?: () => void;
  onShare?: () => void;
  onSettings?: () => void;
  onSignOut?: () => void;
}

export function BoardHeader({
  boardName = "My Board",
  userName,
  userPhoto,
  onAddNote,
  onShare,
  onSettings,
  onSignOut,
}: BoardHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold text-foreground" data-testid="board-name">
            {boardName}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={onShare}
            className="rounded-lg hover-elevate active-elevate-2"
            data-testid="button-share"
          >
            <Share2 className="h-5 w-5" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={onSettings}
            className="rounded-lg hover-elevate active-elevate-2"
            data-testid="button-settings"
          >
            <Settings className="h-5 w-5" />
          </Button>

          <ThemeToggle />

          {userName && (
            <div className="flex items-center gap-2 ml-2">
              <Avatar className="h-9 w-9" data-testid="user-avatar">
                {userPhoto && <AvatarImage src={userPhoto} alt={userName} />}
                <AvatarFallback>{userName.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <Button
                variant="ghost"
                size="icon"
                onClick={onSignOut}
                className="hover-elevate active-elevate-2"
                data-testid="button-signout"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
