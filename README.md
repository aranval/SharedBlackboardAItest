# Cozy Notes - Shared Notes Board PWA

A beautiful Progressive Web App for real-time shared notes between two users, built with React, Firebase Firestore, and featuring offline support with beautiful pastel colors.

## Current Project Status

This repository contains a working PWA (React + Firebase). It does not include the Flutter/Android native application or the Android home screen widget. The PWA can be installed on Android as a home screen app via the browser (Add to Home Screen).

## Features (Implemented)

- 🎨 **Beautiful Pastel Design** - Cozy colors with light and dark mode
- 🔄 **Real-time Sync** - Firestore listeners update instantly across devices
- 📱 **PWA Support** - Install to Android/iOS/desktop home screen
- 🔌 **Offline Mode** - IndexedDB caching + background re-sync
- 🔐 **Auth Options** - Google Sign-In and anonymous access
- 📝 **Notes** - Title, content, pastel color, pin/unpin
- 💾 **Export/Import** - Board JSON export/import
- 🎯 **Board Sharing** - Join via shareable board code

## Not Yet Implemented

- Drag-and-drop note reordering (pinning groups notes only)
- Native Android home screen widget (requires native code)
- Flutter mobile app and APK build
- Automated tests (unit/integration); manual checklist provided in TESTING.md
- App icons for PWA (provide `public/icon-192.png` and `public/icon-512.png`)
- Board deletion UI (rules permit creator delete; UI pending)

## Firebase Setup

### 1. Create Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" and follow the setup wizard
3. Once created, click "Add app" and select Web (</>)

### 2. Configure Firebase Authentication

1. In your Firebase project, go to **Authentication** → **Sign-in method**
2. Enable **Google** sign-in provider
3. Enable **Anonymous** sign-in provider
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
2. Add your dev URL (e.g., `localhost` for local, your Replit domain)
3. Add your production domain (e.g., `your-app.replit.app`)

### 6. Get Firebase Configuration

1. Go to **Project Settings** (gear icon) → **General**
2. Scroll to "Your apps" and find your web app
3. In "SDK setup and configuration", note these values:
   - `projectId`
   - `apiKey`
   - `appId`

### 7. Configure Environment Variables

Create a `.env` file in the repository root (or add Replit Secrets):

```
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_API_KEY=your-web-api-key
VITE_FIREBASE_APP_ID=your-app-id
```

The client reads these via `client/src/lib/firebase.ts`.

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
- **Service Worker**: PWA caching for offline access (basic cache-first strategy)
- **Automatic Sync**: Changes sync automatically when back online

## PWA Installation

### On Android/iOS:
1. Open the app in your mobile browser
2. Look for "Add to Home Screen" or "Install App" prompt
3. Follow the prompts to install
4. Add icons at `public/icon-192.png` and `public/icon-512.png` for full install fidelity

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

# Serve production build
npm start
```

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **State**: React Hooks + Real-time Firestore listeners
- **PWA**: Service Workers + Web App Manifest

## Data Model

- `boards/{boardId}`: `{ name, createdBy, createdAt, members: string[] }`
- `boards/{boardId}/notes/{noteId}`: `{ title?, content, color, isPinned, createdBy, createdAt, updatedAt }`

See `client/src/hooks/useBoard.ts` and `client/src/hooks/useNotes.ts`.

## Known Limitations

1. **Board Security**: Board codes provide access to anyone who has them
2. **Member Limits**: No enforced limit on board members
3. **Storage Limits**: Subject to Firestore free tier limits
4. **Offline Conflicts**: Last write wins in conflict scenarios
5. **PWA Icons**: Provide app icons in `public/` to avoid default placeholders
6. **No Native Widget**: Android home screen widget (native) not included
7. **No Flutter APK**: This repo targets PWA only

## File Map: Where to Configure Things

- `client/src/lib/firebase.ts`: Reads Firebase config from `VITE_FIREBASE_*` env vars
- `firestore.rules`: Firestore security rules to deploy in Firebase Console
- `public/manifest.json`: PWA metadata; update name/colors; ensure icons exist
- `public/sw.js`: Simple cache-first service worker (customize as needed)
- `client/index.html`: Registers the service worker and loads fonts
- `client/src/pages/HomePage.tsx`: Create/join board flows and sign-in handling
- `client/src/pages/BoardPage.tsx`: Main board UI, export/import, settings
- `client/src/components/*`: UI components (cards, dialogs, header, theme)

## Testing

Automated tests are not yet included. Use the manual end-to-end checklist in `TESTING.md`.

## License

MIT — see `LICENSE` in this repository.

## Support

For issues or questions:
1. Check the Firebase Console for errors
2. Check browser console for client-side errors
3. Verify Firestore rules are correctly deployed
4. Ensure authorized domains are configured

---

Built with ❤️ using React, Firebase, and cozy pastel colors
