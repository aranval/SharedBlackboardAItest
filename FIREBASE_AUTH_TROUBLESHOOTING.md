# 🔥 Firebase Authentication Errors - Quick Fix Guide

**You're seeing these errors because Firebase authentication needs to be properly configured in the Firebase Console.**

---

## 🚨 Critical: Two Required Firebase Console Changes

### ❌ Error 1: `auth/unauthorized-domain`
```
Error signing in with Google: FirebaseError: Firebase: Error (auth/unauthorized-domain)
```

**What it means:** Your current domain is not authorized to use Firebase Authentication.

**Fix: Add Your Domain to Authorized Domains**

1. **Get your current domain:**
   - Look at your browser's address bar
   - Copy the domain part (without `https://`)
   - Examples:
     - `localhost:5173` (local dev)
     - `your-app.replit.dev` (Replit preview)
     - `your-app.replit.app` (Replit production)
     - Any custom domain you're using

2. **Go to Firebase Console:**
   - Visit: https://console.firebase.google.com/
   - Select your project

3. **Navigate to Authentication Settings:**
   - Click **"Authentication"** in left sidebar
   - Click the **"Settings"** tab (next to "Users")
   - Scroll down to **"Authorized domains"** section

4. **Add your domain:**
   - Click **"Add domain"** button
   - Paste your domain (e.g., `your-app.replit.dev`)
   - **DO NOT include** `https://` or `http://`
   - Click **"Add"**

5. **Wait 1-2 minutes** for changes to propagate

6. **Hard refresh your app:**
   - Windows/Linux: `Ctrl + Shift + R`
   - Mac: `Cmd + Shift + R`

**Example authorized domains you might need:**
```
localhost
localhost:5173
your-app.replit.dev
your-app.replit.app
```

---

### ❌ Error 2: `auth/admin-restricted-operation`
```
Error signing in anonymously: FirebaseError: Firebase: Error (auth/admin-restricted-operation)
```

**What it means:** Anonymous authentication is disabled in your Firebase project.

**Fix: Enable Anonymous Authentication**

1. **Go to Firebase Console:**
   - Visit: https://console.firebase.google.com/
   - Select your project

2. **Navigate to Authentication:**
   - Click **"Authentication"** in left sidebar
   - Click the **"Sign-in method"** tab

3. **Enable Anonymous Sign-In:**
   - Find **"Anonymous"** in the providers list
   - Click on **"Anonymous"**
   - Toggle **"Enable"** to ON
   - Click **"Save"**

4. **Verify it's enabled:**
   - You should see "Anonymous" with status **"Enabled"** ✅

5. **Refresh your app** and try again

---

## ⚡ Quick Fix Checklist

Complete these steps in order:

- [ ] **Step 1:** Go to Firebase Console → Authentication → Settings → Authorized domains
- [ ] **Step 2:** Add your current domain (check browser address bar)
- [ ] **Step 3:** Go to Firebase Console → Authentication → Sign-in method
- [ ] **Step 4:** Enable "Anonymous" provider
- [ ] **Step 5:** Enable "Google" provider (if not already enabled)
- [ ] **Step 6:** Wait 1-2 minutes
- [ ] **Step 7:** Hard refresh your app (Ctrl+Shift+R)
- [ ] **Step 8:** Test creating a board

---

## ✅ Verification: Test Your App

After making the changes above, test these actions:

### Test 1: Create Board (Tests Anonymous Auth)
1. Open your app
2. Click **"Create New Board"**
3. **Expected:** Board is created, you get an 8-character code
4. **If error:** Check that Anonymous auth is enabled

### Test 2: Google Sign-In (Tests Authorized Domain)
1. Click the user icon in header
2. Click **"Sign in with Google"**
3. **Expected:** Google sign-in popup appears
4. **If error:** Check that your domain is in Authorized domains list

### Test 3: Check Console
1. Open browser DevTools (F12)
2. Go to Console tab
3. **Expected:** No red Firebase errors
4. **OK to ignore:** Yellow warnings about service worker

---

## 🔍 Understanding the Errors

### Why `auth/unauthorized-domain` happens:
- Firebase requires all domains to be explicitly allowed for security
- This prevents your Firebase project from being used on unauthorized sites
- Every domain you use (dev, staging, production) needs to be added

### Why `auth/admin-restricted-operation` happens:
- Anonymous authentication is disabled by default in new Firebase projects
- Your app uses anonymous auth to let users create/join boards without signing in
- This must be explicitly enabled in Firebase Console

---

## 🐛 Still Having Issues?

### Issue: "I added the domain but still getting unauthorized-domain error"

**Solutions:**
1. Wait 2-3 minutes for Firebase to propagate changes
2. Do a hard refresh: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
3. Clear browser cache:
   - DevTools (F12) → Application → Storage → Clear site data
4. Try incognito/private browsing window
5. Double-check the domain name matches exactly (no typos)
6. Make sure you didn't include `https://` or trailing slashes

### Issue: "Anonymous auth is enabled but still getting admin-restricted-operation"

**Solutions:**
1. Verify in Firebase Console → Authentication → Sign-in method that it shows "Enabled"
2. Wait 2-3 minutes after enabling
3. Check Firebase Console → Authentication → Settings → Advanced:
   - Make sure no restrictions are enabled
4. Try signing out and back in to Firebase Console
5. Check browser console for more specific error messages

### Issue: "Google sign-in works but anonymous doesn't" (or vice versa)

**This means:**
- One provider is configured correctly
- The other needs attention

**Solution:**
1. Go to Firebase Console → Authentication → Sign-in method
2. Check BOTH providers show "Enabled"
3. For Google: Make sure support email is set
4. For Anonymous: Just needs to be toggled on

---

## 📋 Firebase Console Quick Links

**Your Firebase Project:**
- Console home: https://console.firebase.google.com/
- Your project: https://console.firebase.google.com/project/YOUR_PROJECT_ID

**Where to make changes:**
- **Authorized domains:** Console → Authentication → Settings → Authorized domains
- **Anonymous auth:** Console → Authentication → Sign-in method → Anonymous
- **Google auth:** Console → Authentication → Sign-in method → Google

---

## ⚠️ About the manifest.json Error

```
manifest.json:1 Manifest: Line: 1, column: 1, Syntax error
```

**This error is usually harmless and caused by:**
- Browser caching an old version
- Development server serving an error page as manifest.json
- Browser trying to parse manifest before it's ready

**Fix:**
1. Hard refresh: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
2. Clear browser cache
3. Restart your dev server

**The manifest.json file itself is correct** - this is not a real syntax error in your code.

---

## 🎯 Summary: What You Need to Do

**Two required Firebase Console changes:**

1. **Enable Anonymous Authentication**
   - Firebase Console → Authentication → Sign-in method → Anonymous → Enable

2. **Add Your Domain to Authorized Domains**
   - Firebase Console → Authentication → Settings → Authorized domains → Add domain

**Then:**
- Wait 1-2 minutes
- Hard refresh your app
- Test creating a board

---

## 📚 Additional Resources

For complete Firebase setup instructions, see:
- **Quick start:** `FIREBASE_QUICK_START.md`
- **Detailed guide:** `FIREBASE_SETUP_GUIDE.md`
- **Full documentation:** `DOCUMENTATION.md`

---

**Last Updated:** 2025-10-18  
**Applies to:** Firebase SDK 12.4.0+  
**Required for:** Google Sign-In + Anonymous Authentication
