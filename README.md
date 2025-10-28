# Cozy Notes — Shared Notes Board (PWA)

Cozy Notes is a Progressive Web App for a private, two‑person shared notes board. It uses Firebase Firestore for real‑time sync with offline caching and offers optional Google Sign‑In. The UI is clean, minimal, and pastel‑themed with light/dark mode.

## Current Features

- 🎨 **Pastel UI**: Light/dark mode, cozy palette
- 🔄 **Real‑time sync**: Live updates via Firestore listeners
- 📱 **PWA install**: Add to home screen, standalone display
- 🔌 **Offline support**: IndexedDB persistence + service worker
- 🔐 **Auth**: Google Sign‑In or automatic Anonymous auth
- 📝 **Notes**: Optional title, content, 5 colors, pin/unpin
- 💾 **Export / Import**: Board JSON export and import
- 🎯 **Board sharing**: Join via a shareable board code

## Quick Start

### Prerequisites
- Node.js 18+
- A Firebase project (Firestore + Authentication enabled)

### Environment variables
Create a `.env.local` at the repository root (or set env vars in your host):

```bash
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_APP_ID=your-app-id
```

Notes:
- Vite reads `VITE_*` env vars at dev/build time. The app consumes these in `client/src/lib/firebase.ts`.
- Ensure your dev and deploy domains are listed under Firebase Auth → Settings → Authorized domains.

### Install and run (development)

```bash
npm install
npm run dev
```

This starts an Express server with Vite in middleware mode. Open the printed URL.

### Build and serve (production)

```bash
npm run build   # builds client to dist/public and bundles the server
npm start       # serves on PORT (default 5000)
```

## Firebase Setup

1) Create a Firebase project and a Web App
- In the Firebase console, add a Web app (</>) and note `projectId`, `apiKey`, `appId`.

2) Configure Authentication
- Enable the Google provider in Authentication → Sign‑in method
- Add authorized domains for local/dev/prod

3) Create a Firestore database
- Start in Production mode
- Choose a region close to you

4) Deploy Firestore rules
- Open Firestore → Rules, copy the contents of `firestore.rules` from this repo, and Publish

## Security Model (Firestore Rules)

The rules in `firestore.rules` enforce member‑only access and a safe join flow.

- **Authentication requirements**
  - All operations require Firebase Auth (Google or Anonymous)
  - Anonymous sign‑in is used transparently when needed

- **Board access control**
  - Only board members can read board and notes data
  - No board enumeration (reads require membership)
  - Join by code: users can self‑add only themselves

- **Allowed operations**
  - Create: Authenticated user becomes `createdBy` and first member
  - Read: Members only
  - Join: Self‑addition only; existing members unchanged
  - Update: Members can edit mutable fields (not `members`/`createdBy`/`createdAt`)
  - Delete: Creator only

- **Immutable fields**
  - `createdBy`, `createdAt`, and `members` (except self‑join) cannot be changed

See the rule helpers `isBoardMember(boardId)` and `isJoiningBoard()` in `firestore.rules` for the exact logic.

Limitations for this MVP:
- No member removal or explicit invite acceptance flow
- Board code sharing is trust‑based; anyone with the code can request access (rules still require joining user to be authenticated and only self‑add)

## Data Model

- Collection: `boards`
  - Document: `{boardId}`
    - Fields: `name: string`, `createdBy: string`, `createdAt: Timestamp`, `members: string[]`
- Subcollection: `boards/{boardId}/notes`
  - Document: `{noteId}`
    - Fields: `title?: string`, `content: string`, `color: 'pink'|'blue'|'lavender'|'mint'|'peach'`, `isPinned: boolean`, `createdBy: string`, `createdAt: Timestamp`, `updatedAt: Timestamp`

## Using the App

### Home
- Sign in with Google (optional)
- Join a board by code
- Create a new board (anonymous auth is used if not signed in)

### Board
- Header actions: Share (copy code/link), Settings (rename, export/import, clear), Theme toggle, Sign out
- Notes grid: Pinned notes appear first; others are newest‑first
- Create/Edit: Title (optional), Content, Color, Pin/Unpin
- Export: Downloads current board’s notes as JSON
- Import: Upload JSON of notes to add

## Offline and PWA

- Firestore IndexedDB persistence is enabled for offline data and write queueing
- Minimal service worker caches core shell files (`/`, `index.html`, `manifest.json`)
- Automatic sync when the network returns

### Install as PWA
- On Android/iOS: Use “Add to Home Screen” or Install prompt in your browser
- On Desktop: Look for the install icon in the address bar

## Project Structure

```text
client/                 # React app (Vite root)
  index.html
  src/
    App.tsx            # App router and providers
    main.tsx           # Entry point
    index.css          # Theme tokens and base styles
    lib/firebase.ts    # Firebase init + offline persistence
    hooks/             # useAuth, useBoard, useNotes
    components/        # UI components and dialogs
    pages/             # HomePage, BoardPage
public/
  manifest.json        # PWA manifest (icons/colors)
  sw.js                # Minimal service worker
firestore.rules         # Firestore security rules
server/                 # Express server & Vite integration
vite.config.ts          # Vite config (root=client, outDir=dist/public)
package.json            # Scripts: dev/build/start
```

## Configuration Map

- `VITE_FIREBASE_PROJECT_ID` → Firebase project ID (env var)
- `VITE_FIREBASE_API_KEY` → Web API key (env var)
- `VITE_FIREBASE_APP_ID` → Web app ID (env var)
- `client/src/lib/firebase.ts` → Reads env and enables IndexedDB persistence
- `firestore.rules` → Copy to Firebase Console → Firestore → Rules → Publish
- `public/manifest.json` → Name, colors, icons (replace with your icons)
- `client/index.html` → Registers `sw.js`

## Known Limitations (current state)

1. **No Android home screen widget**: This PWA replaces the requested native widget for now
2. **No drag‑to‑reorder**: Only pin/unpin; non‑pinned are newest‑first
3. **Member management**: No removal or roles; join is self‑add only
4. **Board codes**: Anyone with the code can request to join (membership still required for reads)
5. **Service worker**: Minimal pre‑cache; relies on Firestore’s offline cache for data
6. **Assets**: Replace manifest icons for production branding
7. **Tests**: Automated tests not yet included (see checklist below)

## E2E Test Checklist (manual)

- **Auth**
  - Fresh browser: create board → anonymous sign‑in occurs
  - Google Sign‑In succeeds and user appears in header
- **Board**
  - Create board → code saved to localStorage → route `/board/:id`
  - Join board with code from a second browser/device
  - Rename board (Settings) persists across devices
- **Notes**
  - Add, edit, delete, pin/unpin; updates appear on second device
  - Export JSON downloads; Import JSON creates notes
- **Offline**
  - Go offline → add/edit notes → reconnect → changes sync
- **Security** (with rules deployed)
  - Non‑member cannot read `boards/:id` or its `notes`
  - Member cannot modify `members`, `createdBy`, `createdAt`
  - Join flow allows only self‑addition; existing members unaffected
- **PWA**
  - Install prompt appears; app launches standalone; theme color applies

## License

MIT — see `package.json` license field. Add a `LICENSE` file with MIT text if you need an explicit file.

## Troubleshooting

- Check Firebase Console: Auth domains, Rules published, errors in Logs
- Check browser console/network tab for client errors
- Verify env variables are present at dev/build time
- Ensure your dev/prod hosts are in Firebase Auth → Authorized domains
