import { ThemeProvider } from '../ThemeProvider';
import { BoardHeader } from '../BoardHeader';

export default function BoardHeaderExample() {
  return (
    <ThemeProvider>
      <div className="bg-background min-h-screen">
        <BoardHeader
          boardName="Team Notes"
          userName="John Doe"
          onAddNote={() => console.log('Add note')}
          onShare={() => console.log('Share board')}
          onSettings={() => console.log('Settings')}
          onSignOut={() => console.log('Sign out')}
        />
      </div>
    </ThemeProvider>
  );
}
