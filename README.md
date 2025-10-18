# Cozy Notes - Shared Notes Board PWA

A beautiful Progressive Web App for real-time shared notes between two users, built with React, Firebase Firestore, and featuring offline support with beautiful pastel colors.

## Features

- 🎨 **Beautiful Pastel Design** - Cozy colors with light and dark mode support
- 🔄 **Real-time Synchronization** - Changes appear instantly across all devices
- 📱 **PWA Support** - Install on your phone's home screen
- 🔌 **Offline Mode** - Full offline support with automatic sync when back online
- 🔐 **Flexible Authentication** - Google Sign-In or anonymous board access
- 📝 **Rich Note Features** - Titles, colors, pinning, drag-to-reorder
- 💾 **Export/Import** - Backup your notes as JSON
- 🎯 **Board Sharing** - Share with simple board codes

## Firebase Setup

### 1. Create Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" and follow the setup wizard
3. Once created, click "Add app" and select Web (</>)

### 2. Configure Firebase Authentication

1. In your Firebase project, go to **Authentication** → **Sign-in method**
2. Enable **Google** sign-in provider
3. Click **Save**

### 3. Configure Firestore Database

1. Go to **Firestore Database** in the Firebase console
2. Click "Create database"
3. Start in **production mode** (we'll add rules next)
4. Choose a location close to your users

### 4. Add Firestore Security Rules

1. In Firestore Database, go to the **Rules** tab
2. Copy the contents of `firestore.rules` from this project
3. Click **Publish** to deploy the rules

### 5. Configure Authorized Domains

1. Go to **Authentication** → **Settings** → **Authorized domains**
2. Add your Replit dev URL (e.g., `your-repl-name.repl.co`)
3. After deployment, add your production domain (e.g., `your-app.replit.app`)

### 6. Get Firebase Configuration

1. Go to **Project Settings** (gear icon) → **General**
2. Scroll to "Your apps" and find your web app
3. In "SDK setup and configuration", note these values:
   - `projectId`
   - `apiKey`
   - `appId`

### 7. Add Secrets to Replit

The following secrets are already configured (you added them earlier):
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_APP_ID`

## How to Use

### Creating a Board

1. Click "Create New Board" on the home page
2. You'll be redirected to your new board with a unique board code
3. Share the board code with someone to collaborate

### Joining a Board

1. Get a board code from someone
2. Enter the code on the home page
3. Click "Join Board"

### Using Google Sign-In (Optional)

1. Click "Sign in with Google"
2. After signing in, create or join boards
3. Your identity will be associated with the notes you create

### Working with Notes

- **Add Note**: Click the + button (bottom right)
- **Edit Note**: Hover over a note and click the edit icon
- **Delete Note**: Hover over a note and click the trash icon
- **Pin Note**: Hover over a note and click the pin icon
- **Change Color**: When editing, select from 5 pastel colors

### Board Settings

- **Rename Board**: Settings → Update board name
- **Export**: Settings → Export Board as JSON
- **Import**: Settings → Import Board from JSON
- **Clear**: Settings → Clear All Notes

## Offline Support

The app works fully offline thanks to:
- **Firestore Persistence**: Local caching of all data
- **Service Worker**: PWA caching for offline access
- **Automatic Sync**: Changes sync automatically when back online

## PWA Installation

### On Android/iOS:
1. Open the app in your mobile browser
2. Look for "Add to Home Screen" or "Install App" prompt
3. Follow the prompts to install

### On Desktop:
1. Look for the install icon in your browser's address bar
2. Click to install the app

## Firestore Security Rules

The security rules in `firestore.rules` provide comprehensive access control:

### Security Model

**Authentication Requirements:**
- 🔐 All operations require Firebase Authentication (Google or Anonymous)
- 👤 Anonymous users are automatically signed in for ease of use
- 🔄 Users can upgrade from anonymous to Google Sign-In

**Board Access Control:**
- 👥 Only board members can read board data and notes
- 🔒 No unauthorized enumeration of boards (privacy-first)
- 📋 Board codes enable joining when shared by existing members

**Protected Operations:**
- ✅ **Create**: Authenticated users can create boards and auto-join as members
- ✅ **Read**: Only board members can view boards and notes
- ✅ **Join**: Users can add themselves to a board (self-addition only)
- ✅ **Update**: Members can edit board name and notes (not membership)
- ✅ **Delete**: Only the board creator can delete the board

**Immutable Fields (Tamper-Proof):**
- 🛡️ `createdBy` - Board ownership cannot be transferred
- 🛡️ `createdAt` - Timestamp preserved for audit trail
- 🛡️ `members` - Can only be modified via secure join flow

**Security Guarantees:**
- ✅ No membership hijacking (existing members cannot be removed)
- ✅ No privilege escalation (cannot change board ownership)
- ✅ No unauthorized access (strict member-only reads)
- ✅ Safe join flow (users can only add themselves, no bulk additions)

### Recommended Improvements for Production
- Add member limits per board (currently unlimited)
- Implement board expiration for inactive boards
- Add server-side rate limiting
- Implement explicit invitation system with notifications
- Add member removal functionality (creator-only)

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **State**: React Hooks + Real-time Firestore listeners
- **PWA**: Service Workers + Web App Manifest

## Known Limitations

1. **Board Security**: Board codes provide access to anyone who has them
2. **Member Limits**: No enforced limit on board members
3. **Storage Limits**: Subject to Firestore free tier limits
4. **Offline Conflicts**: Last write wins in conflict scenarios

## License

MIT License - feel free to use this for personal projects!

## Support

For issues or questions:
1. Check the Firebase Console for errors
2. Check browser console for client-side errors
3. Verify Firestore rules are correctly deployed
4. Ensure authorized domains are configured

---

Built with ❤️ using React, Firebase, and cozy pastel colors
