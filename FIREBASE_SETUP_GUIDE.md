# 🔥 Firebase Configuration Guide

**Complete step-by-step guide to configure Firebase for your Cozy Notes PWA**

---

## 🚨 TROUBLESHOOTING AUTHENTICATION ERRORS?

**If you're seeing errors like:**
- ❌ `auth/unauthorized-domain`
- ❌ `auth/admin-restricted-operation`

**👉 See `FIREBASE_AUTH_TROUBLESHOOTING.md` for quick fixes!**

The most common issues are:
1. Your domain not being added to Authorized domains (Step 7 below)
2. Anonymous authentication not being enabled (Step 2 below)

---

## ✅ Firebase Package Status

**Firebase is already installed!** ✅
- Package: `firebase@12.4.0` (in package.json)
- No need to run `npm install firebase`

---

## 📋 Firebase Setup Checklist

- [ ] Step 1: Create Firebase project
- [ ] Step 2: Enable Authentication (Google + Anonymous)
- [ ] Step 3: Create Firestore database
- [ ] Step 4: Deploy security rules
- [ ] Step 5: Get Firebase config values
- [ ] Step 6: Add secrets to Replit
- [ ] Step 7: Configure authorized domains
- [ ] Step 8: Test the app

---

## 🚀 Step-by-Step Instructions

### Step 1: Create Firebase Project

1. **Go to Firebase Console:**
   - Visit: https://console.firebase.google.com/
   - Sign in with your Google account

2. **Create a new project:**
   - Click **"Add project"** or **"Create a project"**
   - Enter a project name (e.g., "Cozy Notes PWA")
   - Click **Continue**

3. **Google Analytics (Optional):**
   - Toggle off if you don't need analytics
   - Or leave it on and select/create an Analytics account
   - Click **Create project**

4. **Wait for project creation:**
   - Takes ~30 seconds
   - Click **Continue** when done

5. **Add a Web App:**
   - On the project overview page, click the **Web icon** (`</>`)
   - Enter app nickname: "Cozy Notes Web"
   - ⚠️ **DO NOT** check "Firebase Hosting" (we're using Replit)
   - Click **Register app**

6. **Skip the SDK setup:**
   - Firebase will show you config code
   - **Don't copy it yet** - we'll get these values in Step 5
   - Click **Continue to console**

---

### Step 2: Enable Authentication

1. **Navigate to Authentication:**
   - In the left sidebar, click **"Build"** → **"Authentication"**
   - Click **"Get started"** if this is your first time

2. **Enable Google Sign-In:**
   - Click the **"Sign-in method"** tab
   - Click **"Google"** from the providers list
   - Toggle **"Enable"** to ON
   - **Project support email:** Select your email from dropdown
   - Click **"Save"**

3. **Enable Anonymous Sign-In:**
   - Still in the **"Sign-in method"** tab
   - Click **"Anonymous"** from the providers list
   - Toggle **"Enable"** to ON
   - Click **"Save"**

4. **Verify both are enabled:**
   - You should see both "Google" and "Anonymous" with status **"Enabled"**

---

### Step 3: Create Firestore Database

1. **Navigate to Firestore:**
   - In the left sidebar, click **"Build"** → **"Firestore Database"**
   - Click **"Create database"**

2. **Choose location:**
   - **Production mode** (we'll add rules next)
   - Click **Next**

3. **Select a location:**
   - Choose a location close to your users
   - Recommended: `us-central1` (Iowa) or `europe-west1` (Belgium)
   - ⚠️ **Cannot be changed later!**
   - Click **Enable**

4. **Wait for database creation:**
   - Takes ~1 minute
   - You'll see an empty database screen

---

### Step 4: Deploy Security Rules

1. **Go to Rules tab:**
   - In Firestore Database, click the **"Rules"** tab at the top

2. **Copy the rules:**
   - Open `firestore.rules` from your project
   - Copy the entire contents (it should start with `rules_version = '2';`)

3. **Paste in Firebase Console:**
   - Delete the default rules in the Firebase Console
   - Paste your copied rules
   - The editor should show no errors

4. **Publish the rules:**
   - Click **"Publish"** button
   - Confirm the warning dialog
   - You should see "Rules published successfully"

5. **Verify rules are active:**
   - The "Last deployed" timestamp should be recent
   - Rules should show your custom rules with helper functions

---

### Step 5: Get Firebase Configuration Values

1. **Go to Project Settings:**
   - Click the **gear icon** ⚙️ in the left sidebar (next to "Project Overview")
   - Select **"Project settings"**

2. **Scroll to "Your apps":**
   - You should see your web app listed
   - Under "SDK setup and configuration", select **"Config"** (not npm)

3. **Copy these THREE values:**
   ```javascript
   const firebaseConfig = {
     apiKey: "AIza...",           // ← Copy this
     authDomain: "...",
     projectId: "cozy-notes-xxx",  // ← Copy this
     storageBucket: "...",
     messagingSenderId: "...",
     appId: "1:123...",            // ← Copy this
   };
   ```

   **You need:**
   - ✅ `apiKey` (starts with "AIza")
   - ✅ `projectId` (your project name with random suffix)
   - ✅ `appId` (starts with "1:" followed by numbers)

4. **Keep this tab open** - you'll need these values in the next step

---

### Step 6: Add Secrets to Replit

**If using Replit:**

1. **Open Replit Secrets:**
   - In your Replit workspace, click the **lock icon** 🔒 in the left sidebar
   - Or go to the **Tools** menu → **Secrets**

2. **Add three secrets:**

   **Secret 1:**
   - Key: `VITE_FIREBASE_API_KEY`
   - Value: `<paste your apiKey>`
   - Click **Add secret**

   **Secret 2:**
   - Key: `VITE_FIREBASE_PROJECT_ID`
   - Value: `<paste your projectId>`
   - Click **Add secret**

   **Secret 3:**
   - Key: `VITE_FIREBASE_APP_ID`
   - Value: `<paste your appId>`
   - Click **Add secret**

3. **Verify all three secrets are added:**
   - You should see three items in your Secrets list
   - ⚠️ Names must match EXACTLY (including `VITE_` prefix)

**If using local development (.env file):**

1. **Create `.env` file:**
   ```bash
   touch .env
   ```

2. **Add these lines:**
   ```bash
   VITE_FIREBASE_API_KEY=your-api-key-here
   VITE_FIREBASE_PROJECT_ID=your-project-id-here
   VITE_FIREBASE_APP_ID=your-app-id-here
   ```

3. **Replace values:**
   - Paste your actual values (no quotes needed)
   - Save the file

4. **Add to .gitignore:**
   ```bash
   echo ".env" >> .gitignore
   ```

---

### Step 7: Configure Authorized Domains

**This step prevents authentication errors!**

1. **Get your Replit domain:**
   - Your app URL looks like: `https://your-repl-name.replit.app`
   - Or the preview domain: `https://your-repl-name-username.replit.dev`
   - Copy the domain (without `https://`)

2. **Go to Firebase Authentication Settings:**
   - Firebase Console → **Authentication** → **Settings** tab
   - Scroll to **"Authorized domains"**

3. **Add your domain:**
   - Click **"Add domain"**
   - Paste your Replit domain (e.g., `shared-board-pjgiemza.replit.app`)
   - Click **Add**

4. **Add localhost (for local development):**
   - Click **"Add domain"** again
   - Enter: `localhost`
   - Click **Add**

5. **Verify domains:**
   - You should see:
     - ✅ `localhost` (status: enabled)
     - ✅ Your Replit domain (status: enabled)
     - ✅ Firebase default domains (already there)

---

### Step 8: Test Your App

1. **Restart your app:**
   ```bash
   # In Replit, click the "Run" button again
   # Or in local terminal:
   npm run dev
   ```

2. **Open your app:**
   - Visit your Replit URL or `http://localhost:5000`

3. **Test basic functionality:**

   **Test 1: Create Board**
   - Click **"Create New Board"**
   - You should be auto-signed in anonymously
   - A board code should appear (8 characters, e.g., `A3F8K2M9`)
   - ✅ Success if you see the board page

   **Test 2: Add Note**
   - Click the **+ button** (bottom right)
   - Add some text
   - Select a color
   - Click **Save**
   - ✅ Success if note appears on the board

   **Test 3: Real-time Sync**
   - Copy the board code
   - Open the app in a **different browser** or **incognito window**
   - Join the board with the code
   - Add a note in one window
   - ✅ Success if the note appears in the other window instantly

   **Test 4: Google Sign-In (Optional)**
   - Click the user icon in the header
   - Click **"Sign in with Google"**
   - Select your Google account
   - ✅ Success if you're redirected back and see your name/photo

4. **Check for errors:**
   - Open browser console (F12 → Console tab)
   - There should be NO red errors
   - ⚠️ Yellow warnings about service worker are OK

---

## 🔍 Verification Checklist

After setup, verify everything is working:

| Check | How to Verify | Expected Result |
|-------|---------------|-----------------|
| **Firebase package** | Check `package.json` | ✅ `firebase: "^12.4.0"` present |
| **Environment variables** | Check Replit Secrets or `.env` | ✅ 3 secrets configured |
| **Authentication enabled** | Firebase Console → Authentication | ✅ Google + Anonymous enabled |
| **Firestore created** | Firebase Console → Firestore | ✅ Database exists, rules deployed |
| **Authorized domains** | Firebase Console → Auth → Settings | ✅ Your domain added |
| **App connects** | Open app, check console | ✅ No Firebase errors |
| **Create board works** | Click "Create Board" | ✅ Board created, code shown |
| **Add note works** | Add a note | ✅ Note appears |
| **Real-time sync** | Test with 2 browsers | ✅ Changes appear instantly |

---

## 🐛 Troubleshooting

### Problem: "Permission Denied" errors in console

**Cause:** Security rules not deployed or incorrect

**Solution:**
1. Go to Firebase Console → Firestore → Rules
2. Verify your custom rules are there (not default rules)
3. Check "Last deployed" timestamp is recent
4. Click "Publish" again if needed

---

### Problem: "Firebase: Error (auth/unauthorized-domain)"

**Cause:** Your domain is not in authorized domains list

**Solution:**
1. Go to Firebase Console → Authentication → Settings → Authorized domains
2. Add your Replit domain (e.g., `your-app.replit.app`)
3. Wait 1-2 minutes for changes to propagate
4. Hard refresh your app (Ctrl+Shift+R or Cmd+Shift+R)

---

### Problem: "Firebase: Error (auth/api-key-not-valid)"

**Cause:** Wrong API key or not set

**Solution:**
1. Check Replit Secrets (or `.env` file)
2. Verify `VITE_FIREBASE_API_KEY` matches your Firebase config
3. Make sure there are NO spaces or quotes around the value
4. Restart your app

---

### Problem: "Cannot read properties of undefined (reading 'uid')"

**Cause:** User not authenticated before board operation

**Solution:**
- This is likely already handled in the code
- Check that anonymous sign-in is enabled in Firebase Console
- Clear browser cache and try again

---

### Problem: App creates board but can't read it

**Cause:** Security rules preventing read access

**Solution:**
1. Check that your Firebase UID is in the board's members array:
   - Firebase Console → Firestore → boards → (your board) → members
   - Should contain your user UID
2. Verify security rules allow member access
3. Check browser console for specific error message

---

### Problem: "Multiple tabs persistence warning"

**Message:** `Multiple tabs open, persistence can only be enabled in one tab`

**This is NORMAL!** ⚠️
- Firestore offline persistence works in one tab at a time
- Other tabs use online mode
- This does NOT break functionality
- You can safely ignore this warning

---

### Problem: Environment variables not loading

**Cause:** Variable names incorrect or app not restarted

**Solution:**

**For Replit:**
1. Variable names MUST start with `VITE_` (uppercase)
2. Names must be EXACT: `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_APP_ID`
3. Click the "Stop" button, then "Run" again

**For local dev:**
1. Make sure `.env` file is in the root directory (next to `package.json`)
2. Restart the dev server: `npm run dev`
3. Check that Vite is loading the variables:
   ```bash
   # You should see "VITE_FIREBASE_*" in the output
   ```

---

### Problem: Real-time sync not working

**Cause:** Multiple possible causes

**Solutions:**

1. **Check both users are board members:**
   - Firebase Console → Firestore → boards → (boardId) → members array
   - Both user UIDs should be listed

2. **Check network connection:**
   - Open Network tab in DevTools
   - Look for WebSocket connections to Firestore
   - Should show "websocket" with green status

3. **Check listener setup:**
   - Browser console should NOT show listener errors
   - Try refreshing both windows

4. **Clear IndexedDB cache:**
   - DevTools → Application → Storage → IndexedDB
   - Right-click "firestore" → Delete database
   - Refresh the page

---

## 📊 Firebase Usage Limits (Free Tier)

Your app uses Firebase's free "Spark" plan:

| Resource | Free Limit | Your Usage | Notes |
|----------|-----------|------------|-------|
| **Authentication** | Unlimited | Low | Google + Anonymous sign-in |
| **Firestore Reads** | 50,000/day | Depends on users | Real-time listeners count as reads |
| **Firestore Writes** | 20,000/day | Low-medium | Each note edit = 1 write |
| **Firestore Storage** | 1 GB | Very low | Text data is tiny |
| **Network Egress** | 10 GB/month | Low | Firestore data transfer |

**Monitor usage:**
- Firebase Console → Usage and billing
- Set up budget alerts to avoid surprise charges
- For 2 users sharing a board, you'll stay well within free limits

---

## 🔐 Security Best Practices

### ✅ What's Already Secure

- ✅ Security rules require authentication
- ✅ Board access restricted to members
- ✅ Immutable fields protected (createdBy, createdAt)
- ✅ Self-service join only (can't add others)

### ⚠️ Additional Recommendations

1. **Rotate API keys periodically:**
   - Create new web app in Firebase Console
   - Update secrets with new keys
   - Delete old web app

2. **Monitor authentication activity:**
   - Firebase Console → Authentication → Users
   - Check for suspicious sign-ins

3. **Set up budget alerts:**
   - Firebase Console → Usage and billing
   - Set alert at 80% of free tier

4. **Keep Firebase SDK updated:**
   ```bash
   npm update firebase
   ```

5. **Review security rules regularly:**
   - Check for new vulnerabilities
   - Test rules with Firebase Emulator

---

## 🎓 Understanding Firebase Configuration

### What Each Secret Does:

**`VITE_FIREBASE_API_KEY`**
- Identifies your Firebase project
- Public value (safe to expose in client)
- Used for Firebase API calls
- NOT a security credential (security is in Firestore rules)

**`VITE_FIREBASE_PROJECT_ID`**
- Your Firebase project identifier
- Used to construct Firestore URLs
- Public value

**`VITE_FIREBASE_APP_ID`**
- Identifies your specific web app within the project
- Used for analytics and crash reporting
- Public value

**Why `VITE_` prefix?**
- Vite (build tool) only exposes env vars with `VITE_` prefix to client code
- Without it, variables won't be available in `import.meta.env`

### How Firebase Is Initialized:

Your app initializes Firebase in `client/src/lib/firebase.ts`:

```typescript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebasestorage.app`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Enables offline mode
enableIndexedDbPersistence(db);
```

---

## 🚀 You're Done!

If all steps completed successfully:
- ✅ Firebase project created
- ✅ Authentication enabled (Google + Anonymous)
- ✅ Firestore database created with security rules
- ✅ Environment variables configured
- ✅ Authorized domains added
- ✅ App tested and working

**Next steps:**
- Share your first board with someone
- Test real-time collaboration
- Explore the app features
- Check the documentation for advanced features

---

## 📞 Need Help?

**Common resources:**
- Firebase Documentation: https://firebase.google.com/docs
- Firebase Console: https://console.firebase.google.com/
- Your project documentation: See `DOCUMENTATION.md`
- Troubleshooting guide: See `DOCUMENTATION.md` → Troubleshooting section

**Debug checklist:**
1. Check browser console for errors
2. Check Firebase Console → Usage for API calls
3. Verify security rules in Firestore → Rules
4. Check authorized domains in Authentication → Settings
5. Verify environment variables are set correctly

---

**Last Updated:** 2025-10-18  
**Firebase SDK Version:** 12.4.0  
**Tested On:** Replit + Local Development
