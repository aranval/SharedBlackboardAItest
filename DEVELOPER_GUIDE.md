# Developer Quick Start Guide

**For developers taking over or contributing to the Cozy Notes PWA project**

---

## 🚀 Getting Started in 5 Minutes

### 1. Prerequisites
```bash
node -v    # Should be 20.x
npm -v     # Should be 9.x+
```

### 2. Clone & Install
```bash
git clone <repo-url>
cd cozy-notes-pwa
npm install
```

### 3. Configure Firebase
Create `.env` file:
```bash
VITE_FIREBASE_API_KEY=your-key
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_APP_ID=your-app-id
```

### 4. Run Development Server
```bash
npm run dev
```

Visit: `http://localhost:5000`

---

## 🏗️ Architecture Overview

```
User Actions → React Components → Custom Hooks → Firebase SDK → Firestore
                                                            ↓
                                              Real-time Listeners
                                                            ↓
                                              State Updates → UI Re-render
```

**Key Concepts:**
- **No global state library** - React hooks + Firestore listeners handle everything
- **Real-time first** - All data updates via `onSnapshot` listeners
- **Optimistic UI** - Changes appear immediately, sync in background
- **Offline-first** - IndexedDB persistence via Firebase SDK

---

## 📂 File Organization

### Where to Find Things

| Need to... | Go to... |
|------------|----------|
| Add a new component | `client/src/components/` |
| Modify Firebase logic | `client/src/hooks/` |
| Change authentication | `client/src/hooks/useAuth.ts` |
| Update board operations | `client/src/hooks/useBoard.ts` |
| Modify note CRUD | `client/src/hooks/useNotes.ts` |
| Update security rules | `firestore.rules` |
| Modify routing | `client/src/App.tsx` |
| Add a new page | `client/src/pages/` |
| Change styles | `client/src/index.css` or Tailwind classes |
| Configure PWA | `public/manifest.json` and `public/sw.js` |

### Key Files to Understand

**1. `client/src/lib/firebase.ts`**
```typescript
// Firebase initialization + offline persistence setup
// ⚠️ CRITICAL: Don't modify unless you know what you're doing
export const auth = getAuth(app);
export const db = getFirestore(app);
enableIndexedDbPersistence(db);  // Enables offline mode
```

**2. `client/src/hooks/useAuth.ts`**
```typescript
// Manages authentication state
// - signInWithGoogle() - Redirect-based Google Sign-In
// - signInAnonymouslyUser() - Auto anonymous sign-in
// - signOut() - Clear auth state
// Returns: { user, loading, signInWithGoogle, signInAnonymouslyUser, signOut }
```

**3. `client/src/hooks/useBoard.ts`**
```typescript
// Board operations
// - createBoard(name, userId) - Creates board with random 8-char ID
// - joinBoard(boardId, userId) - Adds user to board members
// - updateBoardName(boardId, name) - Renames board
// Real-time listener on board document
```

**4. `client/src/hooks/useNotes.ts`**
```typescript
// Notes CRUD + real-time sync
// - addNote(boardId, userId, noteData)
// - updateNote(boardId, noteId, updates)
// - deleteNote(boardId, noteId)
// - togglePin(boardId, noteId, isPinned)
// - clearAllNotes(boardId)
// Real-time listener on notes subcollection
```

**5. `firestore.rules`**
```javascript
// Security rules - CRITICAL for production
// - All operations require authentication
// - Board access restricted to members
// - Self-service join only (can't add others)
// - Immutable fields protected (createdBy, createdAt)
```

---

## 🔧 Common Tasks

### Adding a New Component

**1. Create component file:**
```bash
touch client/src/components/MyComponent.tsx
```

**2. Use shadcn/ui for UI primitives:**
```typescript
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export function MyComponent() {
  return (
    <Dialog>
      <DialogContent>
        <Button>Click Me</Button>
      </DialogContent>
    </Dialog>
  );
}
```

**3. Import shadcn components if needed:**
```bash
npx shadcn@latest add button
npx shadcn@latest add dialog
```

### Adding a New Page

**1. Create page file:**
```bash
touch client/src/pages/MyPage.tsx
```

**2. Add route in `App.tsx`:**
```typescript
import MyPage from "@/pages/MyPage";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/board/:id" component={BoardPage} />
      <Route path="/my-page" component={MyPage} />  {/* Add this */}
      <Route component={NotFound} />
    </Switch>
  );
}
```

### Modifying Firestore Structure

**⚠️ IMPORTANT: Always update security rules when changing data structure**

**1. Update TypeScript interface:**
```typescript
// In client/src/hooks/useNotes.ts
export interface FirestoreNote {
  id: string;
  title?: string;
  content: string;
  color: NoteColor;
  isPinned: boolean;
  newField: string;  // Add this
  createdBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

**2. Update Firestore write operations:**
```typescript
const addNote = async (boardId: string, userId: string, noteData) => {
  await addDoc(notesRef, {
    ...noteData,
    newField: "default value",  // Add this
    isPinned: false,
    createdBy: userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};
```

**3. Update security rules if needed:**
```javascript
// In firestore.rules
allow create: if isBoardMember(boardId)
  && request.resource.data.createdBy == request.auth.uid
  && request.resource.data.keys().hasAll(['content', 'color', 'newField']);  // Validate new field
```

**4. Deploy security rules:**
```bash
# Go to Firebase Console → Firestore Database → Rules
# Copy firestore.rules content → Paste → Publish
```

### Adding a New Firebase Hook

**Example: `useSettings.ts` for user preferences**

```typescript
// client/src/hooks/useSettings.ts
import { useState, useEffect } from "react";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface UserSettings {
  theme: "light" | "dark";
  notifications: boolean;
}

export function useSettings(userId: string | null) {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const settingsRef = doc(db, "users", userId, "settings", "preferences");
    
    const unsubscribe = onSnapshot(settingsRef, (snapshot) => {
      if (snapshot.exists()) {
        setSettings(snapshot.data() as UserSettings);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [userId]);

  const updateSettings = async (updates: Partial<UserSettings>) => {
    if (!userId) return;
    const settingsRef = doc(db, "users", userId, "settings", "preferences");
    await setDoc(settingsRef, updates, { merge: true });
  };

  return { settings, loading, updateSettings };
}
```

---

## 🎨 Styling Guide

### Using Tailwind CSS

**Color Classes:**
```tsx
// Use predefined note colors
<div className="bg-note-pink dark:bg-note-dark-pink">

// Use theme colors
<div className="bg-background text-foreground">

// Hover states
<Button className="hover:scale-105 transition">
```

**Responsive Design:**
```tsx
// Mobile-first approach
<div className="p-4 md:p-6 lg:p-8">
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
```

**Dark Mode:**
```tsx
// Automatically switches based on theme
<div className="bg-white dark:bg-gray-800 text-black dark:text-white">
```

### Adding Custom Colors

**1. Define in `tailwind.config.ts`:**
```typescript
colors: {
  "my-color": "hsl(200 50% 90%)",
}
```

**2. Use in components:**
```tsx
<div className="bg-my-color">
```

### shadcn/ui Component Customization

**All shadcn components are in `client/src/components/ui/`**
- Fully customizable (you own the code)
- Built on Radix UI primitives
- Styled with Tailwind

**Example: Customize Button**
```typescript
// client/src/components/ui/button.tsx
const buttonVariants = cva(
  "base classes...",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        cozy: "bg-note-pink text-gray-800 hover:bg-note-lavender",  // Add custom variant
      },
    },
  }
);
```

---

## 🔥 Firebase Operations

### Firestore Queries

**Basic Query:**
```typescript
const notesRef = collection(db, "boards", boardId, "notes");
const q = query(notesRef, orderBy("createdAt", "desc"));

const unsubscribe = onSnapshot(q, (snapshot) => {
  const notes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  setNotes(notes);
});
```

**Filtered Query:**
```typescript
const q = query(
  notesRef,
  where("isPinned", "==", true),
  orderBy("createdAt", "desc"),
  limit(10)
);
```

**Composite Queries (Require Indexes):**
```typescript
// This will fail without a Firestore index
const q = query(
  notesRef,
  where("color", "==", "pink"),
  orderBy("createdAt", "desc")
);

// Firebase Console will show index creation link in error
```

### Authentication Operations

**Check Auth State:**
```typescript
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("Signed in:", user.uid);
  } else {
    console.log("Signed out");
  }
});
```

**Upgrade Anonymous to Google:**
```typescript
import { linkWithRedirect, GoogleAuthProvider } from "firebase/auth";

const upgradeToGoogle = async () => {
  if (auth.currentUser?.isAnonymous) {
    await linkWithRedirect(auth.currentUser, new GoogleAuthProvider());
  }
};
```

---

## 🧪 Testing (Not Implemented Yet)

### Recommended Testing Setup

**1. Install testing libraries:**
```bash
npm install -D @testing-library/react @testing-library/jest-dom jest @types/jest
```

**2. Example unit test:**
```typescript
// client/src/hooks/__tests__/useAuth.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { useAuth } from '../useAuth';

test('should sign in anonymously', async () => {
  const { result } = renderHook(() => useAuth());
  
  await result.current.signInAnonymouslyUser();
  
  await waitFor(() => {
    expect(result.current.user).not.toBeNull();
    expect(result.current.user?.isAnonymous).toBe(true);
  });
});
```

**3. Example E2E test:**
```typescript
// tests/e2e/board.spec.ts (Playwright)
import { test, expect } from '@playwright/test';

test('should create and join board', async ({ page, context }) => {
  // Device 1: Create board
  await page.goto('/');
  await page.click('text=Create New Board');
  await expect(page).toHaveURL(/\/board\/[A-Z0-9]{8}/);
  
  const boardCode = await page.locator('[data-testid="board-code"]').textContent();
  
  // Device 2: Join board
  const page2 = await context.newPage();
  await page2.goto('/');
  await page2.fill('input[name="boardCode"]', boardCode);
  await page2.click('text=Join Board');
  
  await expect(page2).toHaveURL(`/board/${boardCode}`);
});
```

---

## 🐛 Debugging Tips

### Firebase Connection Issues

**Check Firestore connection:**
```typescript
// In browser console:
import { db } from "./lib/firebase";
import { getDoc, doc } from "firebase/firestore";

getDoc(doc(db, "boards", "TEST1234"))
  .then(snap => console.log(snap.exists() ? snap.data() : "Not found"))
  .catch(err => console.error(err));
```

**Check auth state:**
```typescript
// In browser console:
import { auth } from "./lib/firebase";
console.log(auth.currentUser);
```

### Real-time Listener Issues

**Debug listener activity:**
```typescript
const unsubscribe = onSnapshot(
  notesRef,
  (snapshot) => {
    console.log("Snapshot received:", snapshot.docs.length, "docs");
    console.log("Metadata:", snapshot.metadata);
    console.log("Doc changes:", snapshot.docChanges());
  },
  (error) => {
    console.error("Listener error:", error);
  }
);
```

### Offline Persistence Issues

**Check IndexedDB:**
1. Open DevTools → Application → IndexedDB
2. Look for `firestore` database
3. Expand to see cached documents

**Clear cache:**
```typescript
// In browser console:
import { clearIndexedDbPersistence } from "firebase/firestore";
import { db } from "./lib/firebase";

clearIndexedDbPersistence(db)
  .then(() => console.log("Cache cleared"))
  .catch(err => console.error(err));
```

### Security Rules Testing

**Test rules in Firebase Console:**
1. Go to Firestore Database → Rules
2. Click "Rules Playground" tab
3. Simulate operations with different auth states

**Debug rules in code:**
```typescript
// Add logging to understand permission errors
try {
  await addDoc(notesRef, noteData);
} catch (error) {
  if (error.code === 'permission-denied') {
    console.log("Auth state:", auth.currentUser);
    console.log("Attempting to write:", noteData);
    console.log("Board ID:", boardId);
  }
}
```

---

## 📝 Code Style & Conventions

### Naming Conventions

```typescript
// Components: PascalCase
export function NoteCard() {}

// Hooks: camelCase with "use" prefix
export function useAuth() {}

// Functions: camelCase
function generateBoardId() {}

// Constants: UPPER_SNAKE_CASE
const MAX_MEMBERS = 10;

// Types/Interfaces: PascalCase
interface Note {}
type NoteColor = "pink" | "blue";
```

### Import Order

```typescript
// 1. React imports
import { useState, useEffect } from "react";

// 2. Third-party libraries
import { collection, onSnapshot } from "firebase/firestore";

// 3. Internal utilities
import { db } from "@/lib/firebase";

// 4. Components
import { NoteCard } from "@/components/NoteCard";

// 5. Types
import type { Note } from "@/components/NoteCard";
```

### Component Structure

```typescript
// 1. Imports
import { useState } from "react";

// 2. Types (if not exported)
interface Props {
  title: string;
}

// 3. Component
export function MyComponent({ title }: Props) {
  // 3a. Hooks
  const [state, setState] = useState();
  
  // 3b. Event handlers
  const handleClick = () => {};
  
  // 3c. Effects
  useEffect(() => {}, []);
  
  // 3d. Render
  return <div>{title}</div>;
}
```

---

## 🚀 Deployment

### Deploy to Replit (Current Setup)

**Automatic deployment on push to main:**
```bash
git push origin main
# Replit auto-deploys
```

**Manual deployment:**
```bash
# In Replit shell:
npm run build
npm start
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Link project
vercel link

# Add environment variables
vercel env add VITE_FIREBASE_API_KEY
vercel env add VITE_FIREBASE_PROJECT_ID
vercel env add VITE_FIREBASE_APP_ID

# Deploy
vercel --prod
```

### Deploy to Firebase Hosting

```bash
# Install Firebase CLI
npm i -g firebase-tools

# Login
firebase login

# Initialize hosting
firebase init hosting
# Choose "client/dist" as public directory
# Configure as single-page app: Yes
# Don't overwrite index.html: No

# Build and deploy
npm run build
firebase deploy --only hosting
```

---

## 🔗 Useful Resources

### Documentation
- [Firebase Docs](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [React Docs](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)

### Tools
- [Firebase Console](https://console.firebase.google.com/)
- [Firestore Emulator](https://firebase.google.com/docs/emulator-suite)
- [React DevTools](https://react.dev/learn/react-developer-tools)

### Community
- [Firebase Discord](https://discord.gg/firebase)
- [React Discord](https://discord.gg/react)

---

## 🎯 Quick Wins (Easy Improvements)

**1. Add Loading Skeletons (30 min)**
```typescript
// In NotesGrid.tsx
{loading ? (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
    {[1, 2, 3].map(i => (
      <div key={i} className="bg-card p-5 rounded-2xl animate-pulse">
        <div className="h-6 bg-muted rounded w-3/4 mb-3"></div>
        <div className="h-4 bg-muted rounded w-full"></div>
      </div>
    ))}
  </div>
) : (
  // ... normal notes grid
)}
```

**2. Add Confirmation Dialog (1 hour)**
```typescript
// Use shadcn AlertDialog
import { AlertDialog, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog";

<AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
  <AlertDialogContent>
    <AlertDialogTitle>Delete note?</AlertDialogTitle>
    <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

**3. Sort Pinned Notes First (15 min)**
```typescript
// In useNotes.ts
const notesQuery = query(
  notesRef,
  orderBy("isPinned", "desc"),  // Add this
  orderBy("createdAt", "desc")
);

// Note: This requires a Firestore composite index
// Firebase Console will show index creation link on first query
```

---

## 🆘 Getting Help

**Common Issues:**
1. **Firestore permission errors** → Check `firestore.rules` and auth state
2. **Real-time sync not working** → Verify both users are board members
3. **Build errors** → Run `npm install` and check Node version (should be 20.x)
4. **Service worker issues** → Clear browser cache and hard reload

**Where to Look:**
- Browser console for client-side errors
- Firebase Console → Firestore for data issues
- Firebase Console → Authentication for auth issues
- Network tab for API request failures

**Debug Mode:**
```typescript
// Enable Firestore debug logging
import { enableIndexedDbPersistence } from "firebase/firestore";

enableIndexedDbPersistence(db, { synchronizeTabs: true })
  .then(() => console.log("Persistence enabled"))
  .catch(err => console.error("Persistence error:", err));
```

---

**Ready to build?** Start with `npm run dev` and explore the codebase. Check `DOCUMENTATION.md` for deep dives into specific features.

Good luck! 🚀
