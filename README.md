# SuperNotes - React Native Notes App

A beautiful and modern notes app built with React Native, Expo, and Firebase.

## Features

- 📝 **Create, Edit & Delete Notes** - Full CRUD operations for notes
- ❤️ **Favorites System** - Mark and filter favorite notes
- 🏷️ **Categories** - Organize notes by categories (Personal, Work, Study, etc.)
- 🔍 **Search** - Search through notes by title, content, or category
- 👤 **User Authentication** - Secure login and signup with Firebase Auth
- ☁️ **Cloud Sync** - All data synced with Firebase Firestore
- 📱 **Cross Platform** - Works on iOS, Android, and Web
- 🎨 **Modern UI** - Beautiful Material Design with custom styling

## Tech Stack

- **React Native** - Cross-platform mobile development
- **Expo** - Development platform and tools
- **Firebase** - Backend services (Auth, Firestore)
- **React Native Paper** - Material Design components
- **Expo Router** - File-based routing
- **TypeScript** - Type safety

## Setup Instructions

### 1. Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- Firebase account

### 2. Clone and Install

```bash
git clone <repository-url>
cd SuperNotes
npm install
```

### 3. Firebase Setup

1. **Create a Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Authentication (Email/Password)
   - Create a Firestore database

2. **Configure Firebase**
   - Update `lib/firebase.ts` with your Firebase config:
   ```typescript
   const firebaseConfig = {
     apiKey: "your-api-key",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "123456789",
     appId: "your-app-id"
   };
   ```

3. **Firestore Rules**
   - Set up Firestore security rules:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
       match /notes/{noteId} {
         allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
       }
     }
   }
   ```

### 4. Run the App

```bash
# Start the development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on Web
npm run web
```

## Project Structure

```
SuperNotes/
├── app/                    # Expo Router screens
│   ├── (tabs)/            # Tab navigation screens
│   ├── auth.tsx           # Authentication screen
│   ├── create-note.tsx    # Create/edit note screen
│   └── note/[id].tsx      # Note detail screen
├── components/            # Reusable components
├── contexts/              # React Context providers
│   ├── AuthContext.tsx    # Authentication context
│   └── NotesContext.tsx   # Notes management context
├── lib/                   # Library configurations
│   └── firebase.ts        # Firebase configuration
├── services/              # API services
│   ├── notesService.ts    # Notes CRUD operations
│   └── userService.ts     # User authentication
├── types/                 # TypeScript type definitions
│   └── index.ts           # Data models
└── assets/                # Static assets
```

## Data Models

### Note
```typescript
interface Note {
  id: string;
  title: string;
  content: string;
  preview: string;
  label: string;
  date: string;
  image?: string;
  isFavorite: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### User
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: Date;
}
```

## Features in Detail

### Authentication
- Email/password authentication
- User registration and login
- Secure user data storage
- Automatic session management

### Notes Management
- Create notes with title, content, and category
- Edit existing notes
- Delete notes
- Mark notes as favorites
- Search functionality
- Category-based organization

### UI/UX
- Modern Material Design
- Smooth animations and transitions
- Responsive layout
- Loading states and error handling
- Empty state illustrations

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue in the GitHub repository or contact the development team.
