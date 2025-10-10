import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { nanoid } from 'nanoid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/firebase/useAuth';
import { Separator } from '@/components/ui/separator';

const HomePage = () => {
  const navigate = useNavigate();
  const [boardId, setBoardId] = useState('');
  const { user, signInWithGoogle, signOut } = useAuth();

  const createNewBoard = () => {
    const newBoardId = nanoid(10);
    navigate(`/board/${newBoardId}`);
  };

  const joinBoard = (e: React.FormEvent) => {
    e.preventDefault();
    if (boardId.trim()) {
      navigate(`/board/${boardId.trim()}`);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            SharedNotes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Button onClick={createNewBoard} className="w-full bg-teal-400 hover:bg-teal-500 text-black">
            Create a New Board
          </Button>

          <div className="flex items-center space-x-2">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground">OR</span>
            <Separator className="flex-1" />
          </div>

          <form onSubmit={joinBoard} className="space-y-4">
            <Input
              type="text"
              value={boardId}
              onChange={(e) => setBoardId(e.target.value)}
              placeholder="Enter Board ID to join"
              className="text-center"
            />
            <Button type="submit" variant="outline" className="w-full">
              Join Board
            </Button>
          </form>

          <Separator />

          <div className="text-center">
            {user ? (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Signed in as {user.displayName || user.email}
                </p>
                <Button onClick={signOut} variant="ghost" className="w-full">
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button onClick={signInWithGoogle} variant="secondary" className="w-full">
                Sign In with Google
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HomePage;
