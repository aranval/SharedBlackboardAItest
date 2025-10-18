# Cozy Notes - Shared Notes Board PWA

## Overview

Cozy Notes is a Progressive Web App (PWA) for real-time shared note-taking between users. The application features a beautiful pastel-themed design with offline support, real-time synchronization via Firebase Firestore, and flexible authentication options (Google Sign-In or anonymous access). Users can create, organize, and share notes with customizable colors, pinning capabilities, and drag-to-reorder functionality.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build Tools**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server with HMR support
- Wouter for lightweight client-side routing
- TanStack Query for server state management and caching

**UI Component System**
- Radix UI primitives for accessible, unstyled component foundations
- Tailwind CSS with custom design tokens for styling
- Custom pastel color palette with light/dark mode support defined in CSS variables
- Shadcn/ui component library pattern with customizable variants using class-variance-authority

**State Management**
- React hooks for local component state
- Custom hooks (useAuth, useBoard, useNotes) for domain-specific logic
- Context API for theme management (ThemeProvider)
- Firebase real-time listeners for synchronized state across clients

**Design System**
- Follows "Cozy Shared Notes PWA" design guidelines (design_guidelines.md)
- Pastel color palette with distinct light/dark mode themes
- Inter/Plus Jakarta Sans typography
- Responsive grid layout (masonry-style for notes)
- Consistent spacing system using Tailwind units

### Backend Architecture

**Server Framework**
- Express.js as the HTTP server
- Currently minimal backend with placeholder routes
- Development/production mode handling with Vite integration in dev mode

**Data Storage Strategy**
- In-memory storage (MemStorage class) for user data on the server side
- Primary data persistence through Firebase Firestore (client-side)
- Drizzle ORM configured for PostgreSQL (schema defined but not actively used)
- IndexedDB persistence enabled for offline support via Firestore

**Authentication & Authorization**
- Firebase Authentication handles user identity
- Google OAuth provider for social sign-in
- Anonymous authentication for boardless access
- Firestore security rules enforce data access patterns (referenced in README)

### PWA Capabilities

**Offline Support**
- Service Worker (sw.js) for asset caching and offline functionality
- Firestore IndexedDB persistence for data availability offline
- Automatic sync when connection restored

**Installability**
- Web App Manifest (manifest.json) defines PWA metadata
- App icons (192x192, 512x512) for home screen installation
- Standalone display mode for native-like experience

### Data Architecture

**Firestore Schema**
- Collections: `boards` (top-level) and `boards/{boardId}/notes` (subcollection)
- Board documents contain: id, name, createdBy, createdAt, members[]
- Note documents contain: id, title, content, color, isPinned, createdBy, createdAt, updatedAt
- Real-time synchronization via onSnapshot listeners

**Local Storage Usage**
- Current board ID stored in localStorage for session persistence
- Theme preference stored in localStorage

## External Dependencies

### Third-Party Services

**Firebase Platform**
- Firebase Authentication: User identity management with Google OAuth and anonymous auth
- Cloud Firestore: Real-time NoSQL database with offline persistence
- Requires environment variables: VITE_FIREBASE_API_KEY, VITE_FIREBASE_PROJECT_ID, VITE_FIREBASE_APP_ID
- Security rules must be configured in Firebase Console (see firestore.rules)

**Google Fonts**
- Inter and Plus Jakarta Sans font families loaded via Google Fonts CDN

### Database Options

**Configured but Inactive**
- Drizzle ORM setup for PostgreSQL (drizzle.config.ts, shared/schema.ts)
- @neondatabase/serverless driver available
- User schema defined with Drizzle but not actively used
- Migration directory configured (./migrations)

**Note**: The application currently uses Drizzle schema definitions but relies entirely on Firebase Firestore for data persistence. The PostgreSQL setup exists as infrastructure but is not connected to the application logic.

### Key npm Packages

**UI & Interaction**
- @radix-ui/* - Accessible component primitives
- @tanstack/react-query - Async state management
- wouter - Client-side routing
- react-hook-form with @hookform/resolvers - Form handling
- cmdk - Command palette component
- embla-carousel-react - Carousel functionality

**Styling**
- tailwindcss - Utility-first CSS framework
- class-variance-authority - Component variant management
- clsx & tailwind-merge - Conditional class merging

**Firebase**
- firebase - Client SDK for Authentication and Firestore
- Offline persistence enabled via IndexedDbPersistence

**Development Tools**
- @replit/vite-plugin-* - Replit-specific development enhancements
- tsx - TypeScript execution for development server
- esbuild - Production build bundling