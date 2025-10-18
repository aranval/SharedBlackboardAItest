# 🔥 Firebase Quick Start Cheat Sheet

**Ultra-condensed Firebase setup for Cozy Notes PWA**

---

## ✅ Prerequisites

- ✅ Firebase package already installed (`firebase@12.4.0`)
- ✅ No need to run `npm install firebase`

---

## 🚀 5-Step Setup (15 minutes)

### 1️⃣ CREATE PROJECT (3 min)
```
https://console.firebase.google.com/
→ Add project
→ Name it (e.g., "Cozy Notes")
→ Disable Analytics (optional)
→ Click Web icon (</>)
→ Register app
```

### 2️⃣ ENABLE AUTH (2 min)
```
Firebase Console
→ Authentication
→ Sign-in method
→ Enable "Google" (select support email)
→ Enable "Anonymous"
```

### 3️⃣ CREATE FIRESTORE (2 min)
```
Firebase Console
→ Firestore Database
→ Create database
→ Production mode
→ Choose location (e.g., us-central1)
→ Enable

Then go to Rules tab:
→ Copy content from your firestore.rules file
→ Paste and Publish
```

### 4️⃣ GET CONFIG (2 min)
```
Firebase Console
→ Project Settings (⚙️)
→ Your apps → Web app
→ SDK setup → Config

Copy these 3 values:
- apiKey: "AIza..."
- projectId: "your-project-id"
- appId: "1:123..."
```

### 5️⃣ ADD SECRETS (2 min)

**In Replit:**
```
Tools → Secrets (🔒)

Add 3 secrets:
Key: VITE_FIREBASE_API_KEY
Value: <paste apiKey>

Key: VITE_FIREBASE_PROJECT_ID  
Value: <paste projectId>

Key: VITE_FIREBASE_APP_ID
Value: <paste appId>
```

**Or in `.env` file:**
```bash
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_APP_ID=your-app-id
```

### 6️⃣ AUTHORIZE DOMAIN (2 min)
```
Firebase Console
→ Authentication
→ Settings tab
→ Authorized domains
→ Add domain: your-repl-name.replit.app
→ Add domain: localhost
```

### 7️⃣ RESTART & TEST (2 min)
```bash
# Restart your app
# Then test:
→ Open app
→ Create Board
→ Add a note
→ Open in another browser
→ Join board with code
→ Verify real-time sync
```

---

## 🎯 Quick Test Checklist

| Test | Expected Result |
|------|-----------------|
| Click "Create Board" | ✅ Gets 8-char code, redirects to board |
| Add a note | ✅ Note appears immediately |
| Open 2nd browser, join with code | ✅ Can join successfully |
| Add note in browser #1 | ✅ Appears in browser #2 instantly |
| Check console (F12) | ✅ No red errors |

---

## 🐛 Common Issues

| Error | Fix |
|-------|-----|
| "Permission denied" | Deploy firestore.rules in Firebase Console |
| "Unauthorized domain" | Add your domain to Authorized domains |
| "API key not valid" | Check VITE_FIREBASE_API_KEY is correct |
| Variables undefined | Restart app, check variable names have `VITE_` prefix |

---

## 📍 Important URLs

- **Firebase Console:** https://console.firebase.google.com/
- **Your Project Settings:** Console → ⚙️ icon
- **Authentication:** Console → Build → Authentication
- **Firestore:** Console → Build → Firestore Database
- **Rules:** Firestore → Rules tab
- **Authorized Domains:** Authentication → Settings → Authorized domains

---

## 🔑 Secret Names (MUST BE EXACT)

```
VITE_FIREBASE_API_KEY        ← Starts with "AIza"
VITE_FIREBASE_PROJECT_ID     ← Your project name
VITE_FIREBASE_APP_ID         ← Starts with "1:"
```

⚠️ **Must have `VITE_` prefix!**  
⚠️ **All uppercase!**  
⚠️ **Underscores, not dashes!**

---

## 📚 Full Guide

For detailed instructions and troubleshooting, see:
**`FIREBASE_SETUP_GUIDE.md`**

---

**Setup Time:** ~15 minutes  
**Difficulty:** Easy 🟢  
**Cost:** Free (Spark plan)
