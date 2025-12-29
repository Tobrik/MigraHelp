# Firebase Setup & Deployment Guide

This guide will help you set up Firebase for MigraHelp and deploy it to Firebase Hosting.

## Prerequisites

- Node.js 16+ installed
- npm or yarn package manager
- A Google account
- Firebase CLI installed globally (`npm install -g firebase-tools`)

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter "migrahelp" as the project name
4. Click "Continue"
5. Choose your preferred analytics settings (optional)
6. Click "Create project"
7. Wait for the project to be created (usually 1-2 minutes)

## Step 2: Set Up Firebase Services

### Enable Firestore Database

1. In Firebase Console, go to **Firestore Database**
2. Click "Create database"
3. Choose **Start in production mode** (we'll set rules later)
4. Select your region (e.g., `europe-west1` for Europe)
5. Click "Enable"

### Enable Authentication (Optional for future)

1. Go to **Authentication**
2. Click "Get started"
3. Click on "Email/Password"
4. Enable it
5. Click "Save"

### Enable Storage (Optional)

1. Go to **Storage**
2. Click "Get started"
3. Choose "Start in production mode"
4. Select the same region as Firestore
5. Click "Done"

## Step 3: Get Firebase Configuration

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll down to "Your apps" section
3. Find your web app or create one if needed
4. Copy the Firebase config object

## Step 4: Set Up Environment Variables

1. Create a `.env.local` file in the project root:

```bash
cp .env.example .env.local
```

2. Open `.env.local` and fill in your Firebase configuration:

```
VITE_FIREBASE_API_KEY=your_api_key_from_firebase
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

## Step 5: Initialize Firebase CLI

1. Open terminal in the project directory
2. Run:

```bash
firebase login
```

This will open your browser to authenticate with Firebase.

## Step 6: Initialize Firebase in Your Project

```bash
firebase init
```

When prompted:
- Select "Firestore, Hosting, Functions, Storage"
- Choose your Firebase project
- Use default settings for most options
- When asked about the public directory, enter: `dist`
- Configure as a single-page app (SPA): Choose **Yes**

## Step 7: Deploy Firestore Rules

The `firestore.rules` file is already configured in the project. To deploy it:

```bash
firebase deploy --only firestore:rules
```

## Step 8: Build and Deploy to Firebase Hosting

1. First, build the project:

```bash
npm run build
```

This creates a `dist` folder with optimized production files.

2. Deploy to Firebase Hosting:

```bash
firebase deploy --only hosting
```

Your app will be available at: `https://your-project-id.web.app`

## Step 9: Add Data to Firestore

The application currently uses local data from `data.ts`. To use Firestore:

1. Go to Firestore Database in Firebase Console
2. Create a new collection called `restaurants`
3. Add your restaurant documents
4. Create a new collection called `documentProcedures`
5. Add your procedure documents
6. Create a new collection called `helpCenters`
7. Add your help center documents

### Example Restaurant Document:
```json
{
  "name": "Плов City",
  "address": "пр. Абая, 45",
  "cuisine": "Узбекская",
  "avgPrice": 3500,
  "currency": "KZT",
  "budget": "budget",
  "phone": "+7 (727) 300-11-11",
  "website": "https://example.com",
  "lat": 43.235935,
  "lng": 76.940186
}
```

## Step 10: Update Components to Use Firestore (Optional)

To use Firestore data instead of local data, update your components to use the services in `services/firestoreService.ts`:

```typescript
import { restaurantsService } from '../services/firestoreService';

// In your component:
useEffect(() => {
  restaurantsService.getAll().then(setRestaurants);
}, []);
```

## Deployment Commands

```bash
# Build for production
npm run build

# Deploy everything
firebase deploy

# Deploy only hosting
firebase deploy --only hosting

# Deploy only Firestore rules
firebase deploy --only firestore:rules

# View logs
firebase functions:log

# Connect to emulator (for local development)
firebase emulators:start
```

## Environment Variables

The app reads Firebase configuration from environment variables. Make sure to:

1. Create `.env.local` file
2. Add all `VITE_FIREBASE_*` variables
3. Never commit `.env.local` to version control

The `.gitignore` should already include `.env.local`.

## Multi-Language Support

The app supports 5 languages:
- **RU** - Русский (Russian)
- **KK** - Қазақша (Kazakh)
- **EN** - English
- **UZ** - Ўзбек (Uzbek)
- **TJ** - Тоҷикӣ (Tajik)

Users can switch languages in the Sidebar. The selected language is saved in localStorage.

## Firestore Security Rules

The `firestore.rules` file includes:
- **Public read access**: Everyone can read restaurants, procedures, and help centers
- **Admin write access**: Only authenticated admin users can modify data
- **User data**: Each user can only access and modify their own documents

To set up admin users:

1. In Firebase Console, go to **Authentication**
2. Create a test user
3. Go to **Firestore** → **Data**
4. Create a document at path: `users/{userId}/admin` with `{ isAdmin: true }`

## Troubleshooting

### Firebase Config Not Loading

- Check that `.env.local` file exists
- Verify all `VITE_FIREBASE_*` variables are set
- Make sure variable names match exactly

### Firestore Errors

- Check Firestore rules are deployed: `firebase deploy --only firestore:rules`
- Verify collection names match exactly (case-sensitive)
- Check that you have read permissions for collections

### Deployment Fails

- Run `firebase login` again to refresh credentials
- Check that `dist` folder exists (run `npm run build` first)
- Verify project ID in `.firebaserc` matches your Firebase project

### Build Errors

- Delete `node_modules` and run `npm install`
- Clear Vite cache: `rm -rf .vite`
- Run `npm run build` again

## Firebase Pricing

- **Firestore**: Free tier includes 50,000 reads/day, 20,000 writes/day
- **Hosting**: 10 GB/month free bandwidth
- **Storage**: 5 GB free storage

## Next Steps

1. Populate your Firestore database with restaurant and procedure data
2. Set up user authentication if needed
3. Create an admin panel for managing data
4. Set up Firebase Cloud Functions for backend logic
5. Configure analytics to track user behavior

## Support

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Hosting Guide](https://firebase.google.com/docs/hosting)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
