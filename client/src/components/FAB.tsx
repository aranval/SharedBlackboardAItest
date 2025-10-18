import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface FABProps {
  onClick?: () => void;
}

export function FAB({ onClick }: FABProps) {
  return (
    <Button
      size="icon"
      className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-xl z-40 hover:scale-105 transition-transform"
      onClick={onClick}
      data-testid="button-add-note"
    >
      <Plus className="h-6 w-6" />
      <span className="sr-only">Add note</span>
    </Button>
  );
}
