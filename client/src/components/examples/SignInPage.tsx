import { ThemeProvider } from '../ThemeProvider';
import { SignInPage } from '../SignInPage';

export default function SignInPageExample() {
  return (
    <ThemeProvider>
      <SignInPage
        onGoogleSignIn={() => console.log('Google sign in')}
        onJoinBoard={(code) => console.log('Join board:', code)}
        onCreateBoard={() => console.log('Create board')}
      />
    </ThemeProvider>
  );
}
