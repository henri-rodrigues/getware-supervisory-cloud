/**
 * Firebase Integration Module for Getware Supervisory Cloud
 * Supports Firestore (Metadata & Devices) and Realtime Database (10Hz Telemetry & Alarms)
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';

// Firebase configuration (uses environment variables or fallback values for prototyping)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDemoKeyForGetwareSupervisoryCloud",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "getware-supervisory.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "getware-supervisory",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "getware-supervisory.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1234567890",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1234567890:web:abcdef123456"
};

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);
export const rtdb = getDatabase(app);

export const isFirebaseConfigured = Boolean(import.meta.env.VITE_FIREBASE_API_KEY);
