# Cozy Notes PWA - Complete Documentation

**Version:** 1.0 (MVP)  
**Last Updated:** 2025-10-18  
**Platform:** Progressive Web App (PWA)  
**Deployment:** Replit

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Current State Summary](#current-state-summary)
3. [Architecture](#architecture)
4. [Tech Stack](#tech-stack)
5. [Project Structure](#project-structure)
6. [Implemented Features](#implemented-features)
7. [Firebase Configuration](#firebase-configuration)
8. [Security Model](#security-model)
9. [UI/UX Design](#uiux-design)
10. [Data Models](#data-models)
11. [Hooks & State Management](#hooks--state-management)
12. [PWA Features](#pwa-features)
13. [Known Issues & Limitations](#known-issues--limitations)
14. [Testing Status](#testing-status)
15. [Future Improvements](#future-improvements)
16. [Troubleshooting](#troubleshooting)

---

## Project Overview

**Cozy Notes** is a Progressive Web App designed for real-time collaborative note-taking between two users. Originally requested as a Flutter Android app with home screen widgets, the project was adapted to a PWA architecture due to Replit's platform constraints. The app maintains all core functionality requirements while leveraging web technologies for cross-platform compatibility.

### Project Evolution

- **Original Request:** Flutter Android app with Firebase backend and home screen widgets
- **Platform Pivot:** Replit environment limitations led to PWA approach
- **Current Implementation:** React + Firebase PWA with offline support and installable capabilities

### Key Value Propositions

- ✅ Real-time synchronization between devices
- ✅ Beautiful pastel-themed UI with light/dark mode
- ✅ Full offline functionality with automatic sync
- ✅ Installable on Android/iOS home screens as PWA
- ✅ No-friction authentication (anonymous or Google)
- ✅ Simple board sharing via codes

---

## Current State Summary

### ✅ Fully Implemented

- **Authentication System**
  - Firebase Anonymous Auth (automatic on first use)
  - Google Sign-In with redirect flow
  - Auth state persistence
  
- **Board Management**
  - Create boards with 8-character alphanumeric codes
  - Join boards via code entry
  - Real-time board name editing
  - Board member tracking
  
- **Notes CRUD Operations**
  - Create notes with optional title and content
  - Edit existing notes
  - Delete notes
  - Pin/unpin functionality
  - 5 pastel color options (pink, blue, lavender, mint, peach)
  
- **Real-time Synchronization**
  - Firestore real-time listeners for instant updates
  - Real-time board name changes
  - Real-time note additions/edits/deletions
  
- **Offline Support**
  - Firestore IndexedDB persistence enabled
  - Service Worker for app shell caching
  - Automatic sync on reconnection
  
- **Export/Import**
  - JSON export of all board notes
  - JSON import with validation
  
- **UI Components**
  - Responsive masonry grid layout (1-4 columns)
  - Cozy pastel color scheme
  - Light/dark mode toggle
  - Mobile-optimized touch targets
  - Floating Action Button (FAB) for adding notes
  
- **PWA Features**
  - Web App Manifest configured
  - Installable on mobile devices
  - Standalone display mode
  - Custom app icons (configuration only - icons need generation)

### ⚠️ Partially Implemented

- **Service Worker**
  - Basic structure present in `public/sw.js`
  - Not fully integrated with Vite build process
  - Cache strategy is minimal (install/fetch/activate only)
  
- **PWA Icons**
  - Manifest references `icon-192.png` and `icon-512.png`
  - Icon files not generated yet (need design assets)

### ❌ Not Implemented

- **Home Screen Widget** (original Flutter requirement)
  - Not technically possible with PWA architecture
  - Alternative: PWA can be installed to home screen as full app
  
- **Drag-to-Reorder Notes**
  - UI mockup exists but functionality not connected
  
- **Advanced Conflict Resolution**
  - Currently uses Firestore's last-write-wins approach
  
- **Push Notifications**
  - No notification system for board updates
  
- **Rate Limiting**
  - No client-side or server-side rate limiting
  
- **Member Management UI**
  - Cannot view board members list
  - Cannot remove members
  
- **Board Expiration**
  - No automatic cleanup of inactive boards

---

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────┐
│              Client (React PWA)                  │
│                                                  │
│  ┌──────────────┐  ┌──────────────┐            │
│  │   UI Layer   │  │  PWA Layer   │            │
│  │  (Components)│  │ (Service     │            │
│  │              │  │  Worker)     │            │
│  └──────┬───────┘  └──────────────┘            │
│         │                                        │
│  ┌──────▼───────────────────────────┐          │
│  │   Application Layer               │          │
│  │  - Custom Hooks (useAuth,         │          │
│  │    useBoard, useNotes)            │          │
│  │  - State Management               │          │
│  └──────┬───────────────────────────┘          │
│         │                                        │
│  ┌──────▼───────────────────────────┐          │
│  │   Firebase SDK Layer              │          │
│  │  - Auth (Google + Anonymous)      │          │
│  │  - Firestore (Real-time DB)       │          │
│  │  - Offline Persistence            │          │
│  └──────┬───────────────────────────┘          │
└─────────┼─────────────────────────────────────┘
          │
          │ HTTPS/WebSocket
          │
┌─────────▼─────────────────────────────────────┐
│           Firebase Backend                     │
│                                                │
│  ┌──────────────┐  ┌──────────────┐          │
│  │  Firestore   │  │ Firebase Auth│          │
│  │   Database   │  │   Service    │          │
│  └──────────────┘  └──────────────┘          │
│                                                │
│  Security Rules enforce access control        │
└────────────────────────────────────────────────┘
```

### Data Flow

**Create Note:**
```
User Action → NoteDialog → BoardPage.handleSaveNote() 
→ useNotes.addNote() → Firestore Write 
→ Real-time Listener Update → UI Re-render
```

**Real-time Sync:**
```
Device A: Note Edit → Firestore Update
         ↓
    Firestore Real-time Stream
         ↓
Device B: onSnapshot Trigger → State Update → UI Refresh
```

### Authentication Flow

```
1. User lands on HomePage
2. Check auth state (onAuthStateChanged)
3. If no user:
   - Auto sign-in anonymously on "Create Board" or "Join Board"
   - User can optionally upgrade to Google Sign-In
4. Store auth state in Firebase Auth
5. User navigates to board with authenticated UID
```

---

## Tech Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.3.1 | UI framework |
| **TypeScript** | 5.6.3 | Type safety |
| **Vite** | 5.4.20 | Build tool & dev server |
| **Wouter** | 3.3.5 | Client-side routing |
| **Tailwind CSS** | 3.4.17 | Styling framework |
| **shadcn/ui** | Latest | Component library (Radix UI primitives) |
| **Framer Motion** | 11.13.1 | Animations |
| **Lucide React** | 0.453.0 | Icon library |

### Backend & Services

| Technology | Version | Purpose |
|------------|---------|---------|
| **Firebase** | 12.4.0 | Backend-as-a-Service |
| **Firestore** | Included | Real-time NoSQL database |
| **Firebase Auth** | Included | Authentication (Google + Anonymous) |
| **IndexedDB** | Browser API | Offline persistence |

### State Management

- **React Hooks** - Local component state
- **Custom Hooks** - Shared stateful logic (useAuth, useBoard, useNotes)
- **Firestore Real-time Listeners** - Backend state synchronization
- **TanStack Query** | 5.60.5 | Data fetching/caching (installed but not actively used)

### PWA

- **Service Worker** - App shell caching
- **Web App Manifest** - Installation metadata
- **IndexedDB Persistence** - Offline data storage

### Build & Deployment

- **Replit** - Development & hosting platform
- **esbuild** | 0.25.0 | Server bundling
- **Node.js** | 20.x | Runtime environment

---

## Project Structure

```
/workspace
├── client/                          # Frontend code
│   ├── index.html                   # Entry HTML (includes manifest link)
│   ├── src/
│   │   ├── App.tsx                  # Root component with routing
│   │   ├── main.tsx                 # React app mount point
│   │   ├── index.css                # Global styles + Tailwind imports
│   │   │
│   │   ├── components/              # React components
│   │   │   ├── BoardHeader.tsx      # Top navigation bar
│   │   │   ├── FAB.tsx              # Floating action button (add note)
│   │   │   ├── NoteCard.tsx         # Individual note display
│   │   │   ├── NoteDialog.tsx       # Note creation/edit modal
│   │   │   ├── NotesGrid.tsx        # Masonry grid layout
│   │   │   ├── ShareDialog.tsx      # Board code sharing UI
│   │   │   ├── SettingsDialog.tsx   # Board settings menu
│   │   │   ├── SignInPage.tsx       # Home page with sign-in/board actions
│   │   │   ├── ThemeProvider.tsx    # Dark mode context provider
│   │   │   ├── ThemeToggle.tsx      # Light/dark mode switch
│   │   │   ├── ui/                  # shadcn/ui components
│   │   │   └── examples/            # Example component implementations
│   │   │
│   │   ├── hooks/                   # Custom React hooks
│   │   │   ├── useAuth.ts           # Firebase authentication logic
│   │   │   ├── useBoard.ts          # Board CRUD operations
│   │   │   ├── useNotes.ts          # Notes CRUD + real-time sync
│   │   │   ├── use-toast.ts         # Toast notifications
│   │   │   └── use-mobile.tsx       # Mobile breakpoint detection
│   │   │
│   │   ├── lib/                     # Utility libraries
│   │   │   ├── firebase.ts          # Firebase initialization & config
│   │   │   ├── queryClient.ts       # TanStack Query client
│   │   │   └── utils.ts             # Helper functions (cn, etc.)
│   │   │
│   │   └── pages/                   # Route components
│   │       ├── HomePage.tsx         # Landing/sign-in page (/)
│   │       ├── BoardPage.tsx        # Main board view (/board/:id)
│   │       └── not-found.tsx        # 404 page
│   │
│   └── public/                      # Static assets
│       ├── manifest.json            # PWA manifest
│       └── sw.js                    # Service worker (basic)
│
├── server/                          # Backend code (Express server)
│   ├── index.ts                     # Server entry point
│   ├── routes.ts                    # API routes (not used for Firebase app)
│   ├── storage.ts                   # Storage utilities
│   └── vite.ts                      # Vite dev server integration
│
├── shared/                          # Shared types (client/server)
│   └── schema.ts                    # Data schemas (not actively used)
│
├── firestore.rules                  # Firestore security rules
├── design_guidelines.md             # UI/UX design documentation
├── README.md                        # User-facing setup guide
├── package.json                     # Dependencies & scripts
├── tsconfig.json                    # TypeScript configuration
├── tailwind.config.ts               # Tailwind CSS configuration
├── vite.config.ts                   # Vite build configuration
└── postcss.config.js                # PostCSS configuration
```

### Key Files Explained

| File | Purpose |
|------|---------|
| `client/src/lib/firebase.ts` | Firebase SDK initialization, enables offline persistence |
| `client/src/hooks/useAuth.ts` | Manages user authentication state and sign-in flows |
| `client/src/hooks/useBoard.ts` | Board creation, joining, and real-time board data |
| `client/src/hooks/useNotes.ts` | Notes CRUD operations with Firestore listeners |
| `firestore.rules` | Security rules (see Security Model section) |
| `public/manifest.json` | PWA installation metadata |
| `public/sw.js` | Service worker for offline caching |
| `design_guidelines.md` | Comprehensive UI/UX design specifications |

---

## Implemented Features

### 1. Authentication

**Anonymous Authentication (Default)**
- Automatically triggered on board creation/join
- No user interaction required
- Persists across sessions
- Can be upgraded to Google Sign-In without losing data

**Google Sign-In**
- Redirect-based flow (works on mobile)
- Optional upgrade from anonymous user
- Displays user name and photo in header
- Persists authentication state

**Implementation:**
```typescript
// client/src/hooks/useAuth.ts
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signInAnonymouslyUser = async () => {
    const result = await signInAnonymously(auth);
    return result.user;
  };

  const signInWithGoogle = async () => {
    await signInWithRedirect(auth, googleProvider);
  };
  // ...
}
```

### 2. Board Management

**Board Creation**
- Generates 8-character alphanumeric code (e.g., `A3F8K2M9`)
- Default name: "My Cozy Board" (editable)
- Creator automatically added to members array
- Board ID stored in localStorage for persistence

**Board Joining**
- Enter board code to join
- User automatically added to members array
- Can join multiple boards (switch via URL)
- Board code is case-insensitive

**Board Settings**
- Rename board (real-time sync to all members)
- Export notes as JSON
- Import notes from JSON
- Clear all notes (confirmation dialog recommended but not implemented)

**Implementation:**
```typescript
// client/src/hooks/useBoard.ts
const createBoard = async (name: string, userId: string): Promise<string> => {
  const boardId = generateBoardId(); // 8-char random string
  const boardRef = doc(db, "boards", boardId);
  
  await setDoc(boardRef, {
    name,
    createdBy: userId,
    createdAt: serverTimestamp(),
    members: [userId],
  });

  return boardId;
};
```

### 3. Notes Management

**Note Structure**
- Optional title (string)
- Required content (string)
- Color selection (5 pastel options)
- Pin/unpin flag
- Created by (user UID)
- Timestamps (createdAt, updatedAt)

**CRUD Operations**
- **Create:** FAB button opens dialog → Select color → Add content → Save
- **Read:** Real-time Firestore listener updates notes array
- **Update:** Click note → Edit dialog → Save triggers Firestore update
- **Delete:** Hover over note → Click trash icon → Immediate deletion

**Pin/Unpin**
- Click pin icon on note card
- Pinned notes shown first in grid (not explicitly sorted yet)
- Visual indicator (pin icon remains visible when pinned)

**Color Options**
```typescript
export type NoteColor = "pink" | "blue" | "lavender" | "mint" | "peach";

// Light mode colors:
// - pink: hsl(350 60% 92%)
// - blue: hsl(200 50% 90%)
// - lavender: hsl(280 45% 92%)
// - mint: hsl(140 45% 90%)
// - peach: hsl(45 55% 90%)

// Dark mode colors (muted):
// - pink: hsl(350 35% 25%)
// - blue: hsl(200 30% 28%)
// - lavender: hsl(280 25% 26%)
// - mint: hsl(140 25% 26%)
// - peach: hsl(45 30% 27%)
```

### 4. Real-time Synchronization

**Firestore Real-time Listeners**
- `onSnapshot` for boards and notes collections
- Automatic UI updates when data changes
- Works across multiple devices/browsers simultaneously

**Example Flow:**
1. Device A edits note content
2. Firestore receives update via SDK
3. Device B's `onSnapshot` listener fires
4. React state updates with new data
5. UI re-renders with updated note

**Implementation:**
```typescript
// client/src/hooks/useNotes.ts
useEffect(() => {
  if (!boardId) return;

  const notesRef = collection(db, "boards", boardId, "notes");
  const notesQuery = query(notesRef, orderBy("createdAt", "desc"));

  const unsubscribe = onSnapshot(notesQuery, (snapshot) => {
    const notesData = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as FirestoreNote[];
    setNotes(notesData);
  });

  return unsubscribe; // Cleanup on unmount
}, [boardId]);
```

### 5. Offline Support

**Firestore Offline Persistence**
- Enabled via `enableIndexedDbPersistence()`
- Stores data in browser's IndexedDB
- Queued writes sync when online

**Service Worker**
- Caches app shell (HTML, CSS, JS)
- Basic cache-first strategy
- Activates on install

**User Experience:**
- Offline edits appear immediately (optimistic updates)
- Yellow badge/indicator when offline (not implemented in UI)
- Automatic sync on reconnection (handled by Firestore SDK)

**Known Issue:** Service worker not fully integrated with Vite's build process. App works offline via Firestore persistence, but service worker caching is minimal.

### 6. Export/Import

**Export**
- Generates JSON file with all board notes
- Filename: `<board-name>_export.json`
- Format:
```json
[
  {
    "title": "Note Title",
    "content": "Note content here",
    "color": "pink",
    "isPinned": false,
    "createdAt": "2025-10-18T12:00:00.000Z"
  }
]
```

**Import**
- Upload JSON file via settings dialog
- Validates JSON format
- Adds all notes to current board
- Preserves color and pin status
- Updates timestamps to import time

### 7. UI/UX Features

**Responsive Layout**
- Mobile (< 768px): Single column
- Tablet (768px - 1024px): 2 columns
- Desktop (> 1024px): 3-4 columns

**Dark Mode**
- Toggle in board header
- Persists via localStorage (handled by `next-themes`)
- Muted pastel colors for dark mode

**Animations**
- Card hover effects (subtle scale and shadow)
- Dialog transitions (Radix UI defaults)
- Loading skeletons (not implemented, shows empty state)

**Accessibility**
- Semantic HTML
- ARIA labels (via shadcn/ui components)
- Keyboard navigation support
- Touch targets: 44px minimum (Tailwind's default button sizing)

---

## Firebase Configuration

### Required Environment Variables

Set these in Replit Secrets:

```bash
VITE_FIREBASE_API_KEY=<your-api-key>
VITE_FIREBASE_PROJECT_ID=<your-project-id>
VITE_FIREBASE_APP_ID=<your-app-id>
```

**Where to find these values:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to Project Settings (gear icon) → General
4. Scroll to "Your apps" → Web app
5. Copy `apiKey`, `projectId`, and `appId`

### Firebase Services Setup

**1. Enable Authentication**
- Go to Authentication → Sign-in method
- Enable "Google" provider
- Enable "Anonymous" provider
- Add authorized domains (your Replit domain)

**2. Create Firestore Database**
- Go to Firestore Database
- Click "Create database"
- Start in production mode (rules will be added next)
- Choose a location (e.g., `us-central1`)

**3. Deploy Security Rules**
- Go to Firestore Database → Rules tab
- Copy contents of `firestore.rules` from this project
- Click "Publish"

**4. Add Authorized Domains**
- Go to Authentication → Settings → Authorized domains
- Add your Replit domain (e.g., `shared-board-pjgiemza.replit.app`)
- Add localhost for local development (`localhost`, `127.0.0.1`)

### Firebase SDK Configuration

```typescript
// client/src/lib/firebase.ts
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebasestorage.app`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

// Enable offline persistence
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
  } else if (err.code === 'unimplemented') {
    console.warn('The current browser does not support offline persistence');
  }
});
```

---

## Security Model

### Firestore Security Rules

**File:** `firestore.rules`

**Core Security Principles:**
1. ✅ All operations require authentication (Google or Anonymous)
2. ✅ Board access restricted to members only
3. ✅ No enumeration of boards (can't list all boards)
4. ✅ Immutable fields protected (createdBy, createdAt)
5. ✅ Member self-service only (users add themselves, not others)

### Rule Breakdown

**Board Creation**
```javascript
allow create: if request.auth != null 
  && request.resource.data.createdBy == request.auth.uid
  && request.auth.uid in request.resource.data.members;
```
- Must be authenticated
- Creator UID must match auth UID
- Creator automatically added to members

**Board Reading**
```javascript
allow read: if isBoardMember(boardId);
```
- Only board members can read board data
- Prevents unauthorized board discovery

**Board Joining**
```javascript
function isJoiningBoard() {
  let oldMembers = resource.data.members;
  let newMembers = request.resource.data.members;
  return request.auth != null 
    && request.auth.uid in newMembers          // User is in new members list
    && !(request.auth.uid in oldMembers)       // User was not in old list
    && newMembers.size() == oldMembers.size() + 1  // Only 1 member added
    && newMembers.hasAll(oldMembers)           // Old members preserved
    && newMembers.removeAll(oldMembers) == [request.auth.uid]  // Only self added
    && request.resource.data.diff(resource.data).affectedKeys().hasOnly(['members']);  // Only members changed
}

allow update: if isJoiningBoard() || (isBoardMember(boardId) && ...);
```
- Users can only add themselves (not others)
- Cannot remove existing members
- Cannot modify other fields during join

**Board Updating (Members)**
```javascript
allow update: if ... || (isBoardMember(boardId) 
  && !request.resource.data.diff(resource.data).affectedKeys().hasAny(['members', 'createdBy', 'createdAt']));
```
- Members can update name, but NOT:
  - `members` array (protected from modification)
  - `createdBy` (immutable ownership)
  - `createdAt` (audit trail)

**Board Deletion**
```javascript
allow delete: if isCreator(resource.data.createdBy);
```
- Only the creator can delete the board
- Prevents unauthorized board deletion

**Notes Security**
```javascript
match /notes/{noteId} {
  allow read: if isBoardMember(boardId);
  allow create: if isBoardMember(boardId) && request.resource.data.createdBy == request.auth.uid;
  allow update, delete: if isBoardMember(boardId);
}
```
- All note operations require board membership
- Note creator must match authenticated user on creation
- Any member can edit/delete any note (collaborative model)

### Security Limitations

**Current Vulnerabilities:**
- ❌ No member limit enforcement (could add unlimited users)
- ❌ No rate limiting (could spam board joins)
- ❌ Board codes are guessable (8-character alphanumeric = ~2.8 trillion combinations, but no lockout)
- ❌ No board expiration (inactive boards remain forever)
- ❌ No member removal mechanism (once added, member stays)

**Recommended Production Improvements:**
1. Add server-side Cloud Functions for:
   - Member limit enforcement (e.g., max 10 members)
   - Rate limiting for join operations
   - Board inactivity cleanup (delete boards with no activity in 90 days)
2. Implement invitation system:
   - Replace open join with invite-only model
   - Generate time-limited invite tokens
3. Add member management:
   - Creator can remove members
   - Members can leave boards
4. Enhance board code generation:
   - Use longer codes or UUIDs
   - Add checksum/validation

---

## UI/UX Design

### Color Palette

**Light Mode:**
- Background: `hsl(28 25% 97%)` (soft warm white)
- Secondary Background: `hsl(330 40% 95%)` (blush pink tint)
- Text Primary: `hsl(240 8% 25%)` (warm charcoal)
- Text Secondary: `hsl(240 5% 50%)` (soft gray)
- Accent: `hsl(340 65% 70%)` (rose pink)

**Dark Mode:**
- Background: `hsl(240 8% 18%)` (deep charcoal blue)
- Secondary Background: `hsl(240 10% 22%)` (lighter charcoal)
- Text Primary: `hsl(40 10% 92%)` (warm white)
- Text Secondary: `hsl(240 5% 70%)` (soft light gray)
- Accent: `hsl(340 55% 65%)` (bright rose)

**Note Colors:**
See [Implemented Features → 3. Notes Management](#3-notes-management) for full color definitions.

### Typography

- **Primary Font:** System font stack (defaults to Inter-like fonts)
- **Body Text:** 400 weight, 0.95-1.05rem, 1.6 line-height
- **Note Titles:** 500-600 weight, 1.15rem
- **Headers:** 600-700 weight, 1.75-2.5rem

### Layout System

**Spacing:**
- Card padding: `p-4` (1rem)
- Section padding: `p-6` (1.5rem)
- Page padding: `p-8` (2rem)
- Card gaps: `gap-4` on mobile, `gap-6` on desktop

**Grid Breakpoints:**
```css
Mobile: < 768px  → 1 column
Tablet: 768px+   → 2 columns
Desktop: 1024px+ → 3-4 columns
```

### Component Specifications

**Note Cards:**
- Border radius: `rounded-2xl`
- Shadow: `shadow-md` hover:`shadow-lg`
- Padding: `p-5`
- Hover effect: `scale-[1.02]` (subtle zoom)

**FAB (Floating Action Button):**
- Position: Fixed `bottom-6 right-6`
- Size: `w-14 h-14`
- Shape: `rounded-full`
- Shadow: `shadow-xl`
- Icon: Plus symbol

**Dialogs:**
- Overlay: `backdrop-blur-sm bg-black/20`
- Content: `rounded-3xl max-w-md p-8`
- Centered on screen

**Buttons:**
- Primary: `rounded-full px-6 py-2.5` with accent background
- Secondary: `outline` variant with `border-2 rounded-full`
- Icon buttons: `rounded-lg p-2`

### Responsive Design

**Mobile (<768px):**
- Single column layout
- Full-width cards
- Fixed FAB (thumb-reachable zone)
- Hamburger menu (not implemented, settings in header)

**Tablet (768px+):**
- 2-column masonry grid
- Expanded header with inline actions
- Larger padding (`px-6`)

**Desktop (1024px+):**
- 3-4 column masonry grid
- Prominent hover states
- Maximum container width: `max-w-7xl`
- Larger padding (`px-8` to `px-12`)

### Design Guidelines Reference

See `design_guidelines.md` for comprehensive UI specifications including:
- Animation timing and easing functions
- Accessibility requirements (WCAG AA compliance)
- PWA-specific elements (install prompt, offline indicator)
- Empty state designs
- Loading state patterns

---

## Data Models

### Firestore Collections Structure

```
/boards/{boardId}
  - name: string
  - createdBy: string (user UID)
  - createdAt: Timestamp
  - members: string[] (array of user UIDs)
  
  /notes/{noteId}
    - title?: string (optional)
    - content: string
    - color: "pink" | "blue" | "lavender" | "mint" | "peach"
    - isPinned: boolean
    - createdBy: string (user UID)
    - createdAt: Timestamp
    - updatedAt: Timestamp
```

### TypeScript Interfaces

**Board Model:**
```typescript
// client/src/hooks/useBoard.ts
export interface Board {
  id: string;
  name: string;
  createdBy: string;
  createdAt: Timestamp;
  members: string[];
}
```

**Note Model:**
```typescript
// client/src/hooks/useNotes.ts
export interface FirestoreNote {
  id: string;
  title?: string;
  content: string;
  color: NoteColor;
  isPinned: boolean;
  createdBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type NoteColor = "pink" | "blue" | "lavender" | "mint" | "peach";
```

**User Model (Firebase Auth):**
```typescript
// Firebase Auth User object
interface User {
  uid: string;
  email?: string | null;
  displayName?: string | null;
  photoURL?: string | null;
  isAnonymous: boolean;
  // ... other Firebase Auth properties
}
```

### Data Validation

**Client-Side:**
- TypeScript interfaces provide compile-time validation
- Form validation handled by React Hook Form (via shadcn/ui)
- Board code validation: 8 characters, alphanumeric (uppercase)

**Server-Side (Firestore Rules):**
- Required fields enforced via rules
- `createdBy` must match `request.auth.uid`
- Members array must contain strings
- Timestamps automatically set by `serverTimestamp()`

---

## Hooks & State Management

### Custom Hooks

**1. `useAuth()`**
```typescript
// client/src/hooks/useAuth.ts
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Methods:
  // - signInWithGoogle(): void
  // - signInAnonymouslyUser(): Promise<User>
  // - signOut(): Promise<void>
  
  // State:
  // - user: User | null
  // - loading: boolean
}
```

**Usage:**
```typescript
const { user, loading, signInWithGoogle } = useAuth();

if (loading) return <LoadingSpinner />;
if (!user) return <SignInPage />;
```

**2. `useBoard(boardId)`**
```typescript
// client/src/hooks/useBoard.ts
export function useBoard(boardId: string | null) {
  const [board, setBoard] = useState<Board | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Methods:
  // - createBoard(name, userId): Promise<string> (returns boardId)
  // - joinBoard(boardId, userId): Promise<boolean>
  // - updateBoardName(boardId, name): Promise<void>
  
  // State:
  // - board: Board | null
  // - loading: boolean
  // - error: string | null
}
```

**Usage:**
```typescript
const { board, createBoard, joinBoard } = useBoard(boardId);

const handleCreate = async () => {
  const newBoardId = await createBoard("My Board", user.uid);
  navigate(`/board/${newBoardId}`);
};
```

**3. `useNotes(boardId)`**
```typescript
// client/src/hooks/useNotes.ts
export function useNotes(boardId: string | null) {
  const [notes, setNotes] = useState<FirestoreNote[]>([]);
  const [loading, setLoading] = useState(true);

  // Methods:
  // - addNote(boardId, userId, noteData): Promise<void>
  // - updateNote(boardId, noteId, updates): Promise<void>
  // - deleteNote(boardId, noteId): Promise<void>
  // - togglePin(boardId, noteId, isPinned): Promise<void>
  // - clearAllNotes(boardId): Promise<void>
  
  // State:
  // - notes: FirestoreNote[]
  // - loading: boolean
}
```

**Usage:**
```typescript
const { notes, addNote, deleteNote } = useNotes(boardId);

const handleAdd = async () => {
  await addNote(boardId, user.uid, {
    content: "New note",
    color: "pink",
  });
};
```

### State Management Strategy

**No Global State Library:**
- React Context for theme (ThemeProvider)
- Custom hooks for Firebase state
- Real-time listeners for backend state sync
- localStorage for persistence (boardId, theme)

**Why No Redux/Zustand:**
- Firestore real-time listeners handle most state
- Custom hooks provide sufficient encapsulation
- Minimal prop drilling due to simple component tree

**State Persistence:**
- `localStorage.setItem("currentBoardId", boardId)` - Board selection
- Firebase Auth SDK handles auth token persistence
- Firestore offline persistence handles data caching

---

## PWA Features

### Web App Manifest

**File:** `public/manifest.json`

```json
{
  "name": "Cozy Notes - Shared Notes Board",
  "short_name": "Cozy Notes",
  "description": "Your shared notes board for two with real-time synchronization",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#faf8f6",
  "theme_color": "#f5e6f0",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

**Status:** ⚠️ Icon files not yet generated. Need to create PNG images for icons.

### Service Worker

**File:** `public/sw.js`

**Current Implementation:**
- Basic cache-first strategy
- Caches app shell on install
- Responds with cached assets when offline

**Known Issues:**
- Not integrated with Vite's build process
- Doesn't cache dynamically imported chunks
- No cache versioning strategy beyond `CACHE_NAME`
- No background sync for failed requests

**Recommended Improvements:**
- Use Workbox for advanced caching strategies
- Implement precaching with Vite plugin
- Add background sync for offline writes
- Implement periodic sync for updates

### Installation Experience

**Mobile (Android/iOS):**
1. Visit app in mobile browser (Chrome/Safari)
2. Browser shows "Add to Home Screen" prompt
3. Tap to install → App appears on home screen
4. Opening launches in standalone mode (no browser UI)

**Desktop:**
1. Visit app in Chrome/Edge
2. Look for install icon in address bar
3. Click to install → App appears in app launcher
4. Opens in standalone window

**Current Installation State:**
- ✅ Manifest configured
- ⚠️ Icons missing (need to generate)
- ⚠️ Service worker present but minimal

---

## Known Issues & Limitations

### 🔴 Critical Issues

**1. PWA Icons Missing**
- **Issue:** `icon-192.png` and `icon-512.png` not in `public/` folder
- **Impact:** PWA install prompt may not show on some devices
- **Workaround:** Use placeholder icons or generate from design
- **Fix:** Create icon designs matching pastel aesthetic

**2. Service Worker Not Production-Ready**
- **Issue:** Minimal caching, not integrated with Vite build
- **Impact:** Offline experience depends only on Firestore persistence
- **Workaround:** App still works offline for data, but UI assets may not cache
- **Fix:** Integrate Workbox or Vite PWA plugin

### 🟡 Medium Issues

**3. No Member Management UI**
- **Issue:** Can't view or remove board members
- **Impact:** No way to know who has access or remove unwanted users
- **Workaround:** Create new board and share new code
- **Fix:** Add members list and removal functionality

**4. No Drag-to-Reorder**
- **Issue:** Notes cannot be reordered by dragging
- **Impact:** Pinned notes work, but manual ordering not possible
- **Workaround:** Use pin functionality to prioritize notes
- **Fix:** Implement drag-and-drop with position field in Firestore

**5. No Confirmation Dialogs**
- **Issue:** Destructive actions (delete note, clear board) have no confirmation
- **Impact:** Easy to accidentally delete data
- **Workaround:** Use export regularly as backup
- **Fix:** Add AlertDialog confirmation for destructive actions

**6. Board Code Guessability**
- **Issue:** 8-character codes are relatively short
- **Impact:** Theoretical brute-force risk (low probability)
- **Workaround:** Share codes privately
- **Fix:** Use UUIDs or longer codes (e.g., 16 characters)

### 🟢 Minor Issues

**7. No Loading Skeletons**
- **Issue:** Empty screen while notes load
- **Impact:** Poor perceived performance
- **Workaround:** None (loads quickly on fast connections)
- **Fix:** Add skeleton cards during loading state

**8. No Pin Sort Priority**
- **Issue:** Pinned notes not guaranteed to appear first
- **Impact:** Pinned notes may be mixed with unpinned ones
- **Workaround:** Rely on creation date ordering
- **Fix:** Modify query to orderBy `isPinned` desc, then `createdAt` desc

**9. No Offline Indicator**
- **Issue:** User doesn't know when offline
- **Impact:** May be confused why changes aren't syncing to other device
- **Workaround:** Check browser's network status manually
- **Fix:** Add toast notification or badge when offline

**10. No Mobile Keyboard Handling**
- **Issue:** Keyboard may cover input fields on mobile
- **Impact:** Hard to see what you're typing in note dialog
- **Workaround:** Scroll manually
- **Fix:** Add viewport height adjustment or modal repositioning

### 🔵 Design Gaps

**11. Empty State Graphics**
- **Issue:** Empty board shows generic "No notes" text
- **Impact:** Less engaging first-time experience
- **Workaround:** None
- **Fix:** Add illustration and friendly onboarding copy

**12. No Share via Native Share API**
- **Issue:** Sharing board code requires manual copy/paste
- **Impact:** More friction for mobile users
- **Workaround:** Use copy button
- **Fix:** Add Web Share API integration for mobile

### 🔒 Security Limitations

See [Security Model](#security-model) section for full details:
- No member limits
- No rate limiting
- No board expiration
- No member removal
- Open join model (anyone with code can join)

---

## Testing Status

### ✅ Manual Testing Completed

- **Authentication:**
  - ✅ Anonymous sign-in
  - ✅ Google Sign-In (redirect flow)
  - ✅ Sign-out
  - ✅ Auth state persistence

- **Board Management:**
  - ✅ Create board
  - ✅ Join board with code
  - ✅ Board name updates
  - ✅ Navigation between boards

- **Notes:**
  - ✅ Create note
  - ✅ Edit note
  - ✅ Delete note
  - ✅ Pin/unpin note
  - ✅ Color selection

- **Real-time Sync:**
  - ✅ Multi-device updates (tested with 2 browsers)
  - ✅ Board name changes sync
  - ✅ Note CRUD syncs instantly

- **Export/Import:**
  - ✅ JSON export downloads
  - ✅ JSON import adds notes

- **UI/UX:**
  - ✅ Dark mode toggle
  - ✅ Responsive layout (mobile, tablet, desktop)
  - ✅ Toast notifications

### ❌ Automated Testing Not Implemented

**Unit Tests:**
- No tests for hooks (`useAuth`, `useBoard`, `useNotes`)
- No tests for utility functions
- No tests for components

**Integration Tests:**
- No tests for Firebase integration
- No tests for real-time sync
- No tests for offline behavior

**End-to-End Tests:**
- No Playwright/Cypress tests
- No user flow tests

**Recommended Test Coverage:**
```bash
# Unit tests (Jest + React Testing Library)
- useAuth: Sign-in flows, auth state changes
- useBoard: Create, join, update operations
- useNotes: CRUD operations, real-time listener setup
- Components: Rendering, event handlers, prop handling

# Integration tests (Firebase Emulator)
- Board creation with Firestore
- Note CRUD with real-time sync
- Security rules validation

# E2E tests (Playwright)
- Complete user journey: Sign in → Create board → Add note → See on second device
- Export/import flow
- Dark mode persistence
```

---

## Future Improvements

### 🎯 High Priority

1. **Generate PWA Icons**
   - Design cozy pastel icon (notebook/sticky note aesthetic)
   - Export as 192x192 and 512x512 PNG
   - Add to `public/` folder

2. **Improve Service Worker**
   - Integrate Vite PWA plugin
   - Precache all assets
   - Implement background sync

3. **Add Confirmation Dialogs**
   - Delete note confirmation
   - Clear board confirmation
   - Leave board confirmation (when implemented)

4. **Member Management UI**
   - Show list of board members
   - Creator can remove members
   - Members can leave board

5. **Sort Pinned Notes**
   - Update Firestore query to sort by `isPinned` desc first
   - Pinned notes always at top

### 🚀 Medium Priority

6. **Drag-to-Reorder Notes**
   - Add `position` field to notes
   - Implement drag-and-drop with `dnd-kit` or `react-beautiful-dnd`
   - Update positions on drop

7. **Offline Indicator**
   - Add network status listener
   - Show badge/toast when offline
   - Show sync status in header

8. **Loading Skeletons**
   - Add skeleton cards while notes load
   - Skeleton for board header

9. **Rich Text Support**
   - Add Markdown editor (e.g., `react-md-editor`)
   - Support basic formatting (bold, italic, lists)

10. **Search & Filter**
    - Search notes by content
    - Filter by color
    - Filter by pinned status

### 🎨 Nice to Have

11. **Enhanced Sharing**
    - Web Share API integration
    - QR code generation for board codes
    - Email invitations

12. **Note Templates**
    - Predefined note types (checklist, heading, quote)
    - Quick insert from template library

13. **Collaborative Cursors**
    - Show who's viewing the board (Firestore Presence)
    - Real-time cursor positions (advanced)

14. **Push Notifications**
    - Notify when someone adds/edits a note
    - Requires service worker + Firebase Cloud Messaging

15. **Undo/Redo**
    - Local history of actions
    - Undo delete note within 5 seconds

### 🔒 Security Enhancements

16. **Rate Limiting**
    - Cloud Function to limit join attempts
    - Client-side debouncing for rapid actions

17. **Board Expiration**
    - Auto-delete boards with no activity in 90 days
    - Email warning before deletion

18. **Invite System**
    - Replace open join with invite-only model
    - Time-limited invite tokens
    - Track invite sender

19. **Member Limits**
    - Enforce max 10 members per board
    - Display member count in UI

20. **Audit Log**
    - Track all board actions (create, join, note edits)
    - Display in settings for transparency

---

## Troubleshooting

### Firebase Connection Issues

**Problem:** Firestore errors in console (permission denied, network errors)

**Solutions:**
1. **Check Firestore Rules:**
   - Go to Firebase Console → Firestore Database → Rules
   - Verify rules match `firestore.rules` in project
   - Click "Publish" if rules are outdated

2. **Verify Environment Variables:**
   ```bash
   # In Replit, check Secrets:
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_PROJECT_ID=...
   VITE_FIREBASE_APP_ID=...
   ```

3. **Check Authorized Domains:**
   - Firebase Console → Authentication → Settings → Authorized domains
   - Add your Replit domain (e.g., `shared-board-pjgiemza.replit.app`)

4. **Clear Browser Cache:**
   - Outdated IndexedDB data can cause issues
   - Clear site data in browser DevTools

### Authentication Issues

**Problem:** Google Sign-In fails or gets stuck

**Solutions:**
1. **Check Redirect URI:**
   - Firebase Console → Authentication → Sign-in method → Google
   - Ensure authorized redirect URIs include your domain

2. **Clear Auth State:**
   ```javascript
   // In browser console:
   localStorage.clear();
   location.reload();
   ```

3. **Check Browser Console:**
   - Look for specific error codes
   - Common: `auth/popup-blocked`, `auth/unauthorized-domain`

**Problem:** Anonymous sign-in doesn't work

**Solutions:**
1. **Enable Anonymous Auth:**
   - Firebase Console → Authentication → Sign-in method
   - Enable "Anonymous" provider

2. **Check Network Tab:**
   - Ensure requests to `identitytoolkit.googleapis.com` succeed
   - Look for 403 errors (unauthorized)

### Real-time Sync Issues

**Problem:** Changes on one device don't appear on another

**Solutions:**
1. **Check Board Membership:**
   - Both users must be in the board's `members` array
   - Query Firestore in Firebase Console to verify

2. **Check Firestore Listener:**
   ```javascript
   // In browser console:
   console.log('Active listeners:', db._delegate._firestoreClient);
   ```

3. **Test Network Connection:**
   - Ensure both devices are online
   - Check Firestore Console for live document updates

4. **Clear IndexedDB:**
   - DevTools → Application → Storage → IndexedDB
   - Delete `firestore` database
   - Reload page

### Offline Mode Issues

**Problem:** App doesn't work offline

**Solutions:**
1. **Check IndexedDB:**
   - DevTools → Application → IndexedDB
   - Verify `firestore` database exists and contains data

2. **Service Worker Registration:**
   ```javascript
   // In browser console:
   navigator.serviceWorker.getRegistrations().then(r => console.log(r));
   ```

3. **Test Offline:**
   - DevTools → Network tab → Throttling → Offline
   - Try creating/editing notes (should work)
   - Go online and verify sync

### PWA Installation Issues

**Problem:** "Add to Home Screen" prompt doesn't appear

**Solutions:**
1. **Check Manifest:**
   - DevTools → Application → Manifest
   - Look for errors (missing icons, invalid JSON)

2. **HTTPS Required:**
   - PWA install only works on HTTPS (or localhost)
   - Ensure Replit deployment uses HTTPS

3. **Generate Missing Icons:**
   - Create `public/icon-192.png` and `public/icon-512.png`
   - Use a tool like [Favicon Generator](https://realfavicongenerator.net/)

4. **Incognito Mode:**
   - PWA install may not work in incognito/private browsing

### Performance Issues

**Problem:** App feels slow or notes load slowly

**Solutions:**
1. **Check Firestore Indexes:**
   - Firebase Console → Firestore Database → Indexes
   - Ensure composite index for `boards/{boardId}/notes` on `createdAt desc`

2. **Reduce Notes Count:**
   - Large boards (>100 notes) may slow down
   - Use export/archive old notes
   - Clear board and start fresh

3. **Optimize Queries:**
   - Limit query results (add `.limit(50)` to query)
   - Paginate notes (not currently implemented)

4. **Check Network:**
   - Slow internet affects real-time sync
   - Use offline mode and sync later

### Build Issues

**Problem:** `npm run build` fails

**Solutions:**
1. **Update Dependencies:**
   ```bash
   npm install
   ```

2. **Check TypeScript Errors:**
   ```bash
   npm run check
   ```

3. **Clear Build Cache:**
   ```bash
   rm -rf node_modules/.vite
   npm run build
   ```

4. **Check Node Version:**
   - Requires Node.js 20.x
   - Check with `node -v`

---

## Deployment

### Current Deployment: Replit

**Automatic Deployment:**
- Every push to main branch triggers Replit deployment
- App accessible at: `https://shared-board-pjgiemza.replit.app`
- Environment variables managed in Replit Secrets

**Build Process:**
```bash
# Replit runs on start:
npm run build   # Builds client and server
npm start       # Runs production server
```

### Alternative Deployment Options

**Vercel (Recommended for static hosting):**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

**Firebase Hosting (Best for Firebase projects):**
```bash
# Install Firebase CLI
npm i -g firebase-tools

# Initialize hosting
firebase init hosting

# Deploy
firebase deploy --only hosting
```

**Netlify:**
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

### Environment Variables for Other Platforms

**Vercel/Netlify:**
1. Go to project settings
2. Add environment variables:
   ```
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_PROJECT_ID=...
   VITE_FIREBASE_APP_ID=...
   ```
3. Redeploy

**Firebase Hosting:**
- Environment variables not needed (uses same Firebase project)
- Can use Firebase Functions for server-side logic

---

## Maintenance

### Regular Tasks

**Weekly:**
- Monitor Firebase usage (Authentication, Firestore reads/writes)
- Check browser console for errors in production
- Review user feedback (if collecting)

**Monthly:**
- Update npm dependencies: `npm update`
- Review and rotate API keys (if compromised)
- Check Firestore for orphaned data

**Quarterly:**
- Audit Firestore security rules
- Review and archive old boards (manual process)
- Update documentation with new features

### Monitoring

**Firebase Console:**
- Usage → Authentication: Active users, sign-in methods
- Usage → Firestore: Document reads/writes, storage
- Performance → Hosting: Page load times (if using Firebase Hosting)

**Browser DevTools:**
- Console: JavaScript errors, warnings
- Network: Failed requests, slow responses
- Performance: Rendering bottlenecks

**Replit Dashboard:**
- Uptime monitoring
- Build logs
- Environment variables

---

## Contributing

### Development Setup

**Prerequisites:**
- Node.js 20.x
- npm 9.x+
- Firebase project with Firestore and Auth enabled

**Local Setup:**
```bash
# Clone repository
git clone <repo-url>
cd <repo-name>

# Install dependencies
npm install

# Set environment variables (create .env file)
echo "VITE_FIREBASE_API_KEY=..." >> .env
echo "VITE_FIREBASE_PROJECT_ID=..." >> .env
echo "VITE_FIREBASE_APP_ID=..." >> .env

# Run development server
npm run dev
```

**Development Workflow:**
1. Create feature branch: `git checkout -b feature/my-feature`
2. Make changes and test locally
3. Run type check: `npm run check`
4. Commit changes: `git commit -m "feat: add feature"`
5. Push and create PR: `git push origin feature/my-feature`

### Code Style

- **TypeScript:** Strict mode enabled
- **Formatting:** Prettier (not configured yet, recommend adding)
- **Linting:** ESLint (not configured yet, recommend adding)
- **Naming:**
  - Components: PascalCase (`NoteCard.tsx`)
  - Hooks: camelCase with `use` prefix (`useAuth.ts`)
  - Files: PascalCase for components, camelCase for utilities

### Testing Guidelines

**Unit Tests (when implemented):**
```bash
npm run test            # Run all tests
npm run test:watch      # Watch mode
npm run test:coverage   # Coverage report
```

**E2E Tests (when implemented):**
```bash
npm run test:e2e        # Run Playwright tests
```

---

## License

**MIT License**

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

---

## Appendix

### File Checklist for Manual Review

Files that must be manually edited when setting up a new instance:

- [ ] `.env` or Replit Secrets: Firebase API keys
- [ ] `firestore.rules`: Deploy to Firebase Console
- [ ] `public/icon-192.png`: Generate PWA icon
- [ ] `public/icon-512.png`: Generate PWA icon
- [ ] `client/index.html`: Update meta tags (title, description)
- [ ] `public/manifest.json`: Update app name and description

### Sample Board ID for Testing

For quick local testing without creating a board:

**Board ID:** `TEST1234`
**Note:** This is a placeholder. You'll need to create a board in your Firestore instance.

### Firestore Rules Quick Reference

**Test Rules (Development Only - INSECURE):**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;  // WARNING: Anyone can access all data!
    }
  }
}
```

**Production Rules:**
See `firestore.rules` in project root (already configured securely).

### Resource Links

- **Firebase Console:** https://console.firebase.google.com/
- **Replit Dashboard:** https://replit.com/~
- **Tailwind CSS Docs:** https://tailwindcss.com/docs
- **shadcn/ui Components:** https://ui.shadcn.com/
- **Firestore Security Rules Docs:** https://firebase.google.com/docs/firestore/security/get-started
- **PWA Best Practices:** https://web.dev/pwa-checklist/

---

## Contact & Support

For issues or questions about this documentation:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review Firebase Console for backend errors
3. Check browser console for client-side errors
4. Refer to [Known Issues & Limitations](#known-issues--limitations)

---

**Document End** • Last Updated: 2025-10-18 • Version: 1.0
