# SharedNotes

A web application for private, real-time shared note boards. Built with React, Firebase, and Tailwind CSS.

## Features

- **Real-time Collaboration**: Notes sync instantly across devices.
- **Offline Persistence**: View and edit notes even when offline.
- **Optional Authentication**: Use Google Sign-In or create/join boards anonymously.
- **Board Management**: Create new boards or join existing ones with a unique ID.
- **CRUD for Notes**: Create, read, update, and delete notes.
- **Export/Import**: Backup and restore your notes as JSON files.
- **Minimalist Dark Theme**: Clean, simple, and easy on the eyes.

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Backend**: Firebase (Firestore, Authentication)
- **UI Components**: shadcn/ui

## Firebase Setup

To run this project, you need to set up a Firebase project.

1.  **Create a Firebase Project**:
    - Go to the [Firebase Console](https://console.firebase.google.com/).
    - Click "Add project" and follow the setup steps.

2.  **Set up a Web App**:
    - In your Firebase project dashboard, click the Web icon (`</>`) to add a new web app.
    - Register your app. You don't need to add the Firebase SDKs manually.
    - After registering, you'll see your Firebase configuration object.

3.  **Configure Firebase in the App**:
    - Open `client/src/firebase/firebase.ts`.
    - You will see a `firebaseConfig` object with `TODO` markers.
    - Replace the placeholder values with your actual Firebase project configuration keys.

    ```typescript
    // client/src/firebase/firebase.ts
    // TODO: Replace with your own Firebase configuration
    const firebaseConfig = {
      apiKey: "YOUR_API_KEY",
      authDomain: "YOUR_AUTH_DOMAIN",
      projectId: "YOUR_PROJECT_ID",
      storageBucket: "YOUR_STORAGE_BUCKET",
      messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
      appId: "YOUR_APP_ID"
    };
    ```

4.  **Enable Firebase Services**:
    - In the Firebase Console, navigate to the **Authentication** section.
    - Go to the "Sign-in method" tab and enable **Google** as a sign-in provider.
    - Navigate to the **Firestore Database** section.
    - Click "Create database" and start in **production mode**. You will set up security rules next.

5.  **Set up Firestore Security Rules**:
    - In the Firestore Database section, go to the **Rules** tab.
    - Copy the contents of the `firestore.rules` file from this repository and paste them into the rules editor.
    - Click **Publish**.

    ```
    // firestore.rules
    rules_version = '2';
    service cloud.firestore {
      match /databases/{database}/documents {
        match /boards/{boardId}/notes/{noteId} {
          // Anyone can read notes on a board
          allow read: if true;
          
          // Anyone can create a note
          allow create: if true;

          // Only the author can update or delete their note
          allow update, delete: if request.auth != null && request.auth.uid == resource.data.author.uid;
        }
      }
    }
    ```

## Development

To run the application locally:

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Start the Development Server**:
    ```bash
    npm run start
    ```
    - The application will be available at `http://localhost:3000`.
    - The API server (if any) runs on `http://localhost:3001`.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
