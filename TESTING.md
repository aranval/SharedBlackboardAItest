# Cozy Notes PWA — Manual E2E Test Checklist

This checklist validates core functionality against the current implementation (React PWA + Firebase).

## Prerequisites
- Firebase project configured (Auth: Google + Anonymous; Firestore: rules deployed)
- Environment variables set: `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_APP_ID`
- App running locally (`npm run dev`) or deployed

## 1) Authentication
- Anonymous sign-in occurs automatically when creating/joining a board
- Google Sign-In redirects and returns with a signed-in user
- After sign-out, revisit home page; cannot access board without rejoining

## 2) Board Lifecycle
- Create Board: From home page, click "Create New Board"; user is added as member; redirected to `/board/{ID}`
- Join Board: Copy board ID from Share dialog; in another browser/device, enter code on home page; verify access
- Membership: Existing member cannot modify `members` except via their own join; creator shown as `createdBy`

## 3) Notes CRUD
- Create Note: Click + FAB, enter content and (optional) title, pick pastel color, Save
- Edit Note: Hover card, click edit, change fields, Save
- Delete Note: Hover card, click trash; card disappears
- Pin/Unpin: Hover card, click pin; pinned section renders separate from others

## 4) Real-time Sync
- Open two sessions on the same board (different browser or device)
- Create, edit, delete, and pin notes in session A; verify instant updates in session B

## 5) Offline Support
- With the board page open, disconnect network
- Create a few notes; verify they appear locally
- Reconnect; verify notes are persisted to Firestore on reconnect

## 6) Export/Import
- Export: From Settings → Export Board as JSON; download file
- Import: From Settings → Import Board from JSON; choose exported file; verify notes are added

## 7) PWA Installability
- Lighthouse → PWA category: app is installable (ensure icons present in `public/`)
- Mobile Chrome: Use "Add to Home screen"; open standalone

## 8) Security Rules Smoke Tests (via Firestore emulator or production)
- Non-member read blocked: Attempt to read board without membership
- Non-member write blocked: Attempt to write note or update board without membership
- Member update allowed: Update `name` field; verify success
- Members field immutable (except self-join): Existing member cannot alter `members`

## 9) Regression Checks
- Refresh at `/board/{ID}` deep link; board loads
- Service worker does not break app updates (force refresh works)

## Known Gaps
- No drag-and-drop reordering
- No automated CI tests
- Native Android widget and Flutter build not included
