// Firebase Configuration
// -------------------------------------------------------
// Create a .env file in frontend/ with these variables:
//
//   REACT_APP_FIREBASE_API_KEY=your_api_key
//   REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
//   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
//   REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
//   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
//   REACT_APP_FIREBASE_APP_ID=your_app_id
// -------------------------------------------------------

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || 'demo-api-key',
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || 'demo.firebaseapp.com',
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || 'sparknet-demo',
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || 'sparknet-demo.appspot.com',
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || '000000000000',
  appId: process.env.REACT_APP_FIREBASE_APP_ID || '1:000000000000:web:0000000000000000',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
