import { useState } from "react";
import { useLocation } from "wouter";
import { SignInPage } from "@/components/SignInPage";
import { useAuth } from "@/hooks/useAuth";
import { useBoard } from "@/hooks/useBoard";
import { useToast } from "@/hooks/use-toast";

export default function HomePage() {
  const [, setLocation] = useLocation();
  const { user, signInWithGoogle, signInAnonymouslyUser } = useAuth();
  const { createBoard, joinBoard } = useBoard(null);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      await signInWithGoogle();
    } catch (error) {
      console.error("Sign in error:", error);
      toast({
        title: "Sign in failed",
        description: "Please try again",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleCreateBoard = async () => {
    try {
      setIsLoading(true);
      
      // Ensure user is authenticated (sign in anonymously if not)
      let currentUser = user;
      if (!currentUser) {
        currentUser = await signInAnonymouslyUser();
      }
      
      if (!currentUser) {
        throw new Error("Authentication required");
      }
      
      const boardId = await createBoard("My Cozy Board", currentUser.uid);
      
      localStorage.setItem("currentBoardId", boardId);
      
      setLocation(`/board/${boardId}`);
    } catch (error) {
      console.error("Create board error:", error);
      toast({
        title: "Failed to create board",
        description: "Please try again",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleJoinBoard = async (boardCode: string) => {
    try {
      setIsLoading(true);
      
      // Ensure user is authenticated (sign in anonymously if not)
      let currentUser = user;
      if (!currentUser) {
        currentUser = await signInAnonymouslyUser();
      }
      
      if (!currentUser) {
        throw new Error("Authentication required");
      }
      
      await joinBoard(boardCode.toUpperCase(), currentUser.uid);
      
      localStorage.setItem("currentBoardId", boardCode.toUpperCase());
      
      setLocation(`/board/${boardCode.toUpperCase()}`);
    } catch (error) {
      console.error("Join board error:", error);
      toast({
        title: "Failed to join board",
        description: error instanceof Error ? error.message : "Please check the board code and try again",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <SignInPage
      onGoogleSignIn={handleGoogleSignIn}
      onJoinBoard={handleJoinBoard}
      onCreateBoard={handleCreateBoard}
    />
  );
}
