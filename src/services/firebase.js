/**
 * Firebase Configuration & Services
 * ----------------------------------
 * Central Firebase setup for HungerBridge app.
 * Uses Firestore for real-time database operations.
 * 
 * SETUP: Replace the firebaseConfig values with your
 * actual Firebase project credentials from the Firebase Console.
 */

import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  doc,
  updateDoc,
  query,
  orderBy,
  where,
  getDocs,
  Timestamp,
} from 'firebase/firestore';

// Firebase config from codex-f73d3 project
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "Enter the API key",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "name.firebaseapp.com",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "name_id",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "name_ID.firebasestorage.app",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "messaging_sender_ID",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || " ",
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID || "",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Reference to the 'donations' collection
const donationsRef = collection(db, 'donations');

/**
 * Add a new donation to Firestore
 * @param {Object} donation - { foodName, quantity, location }
 * @returns {Promise<string>} - Document ID of the new donation
 */
export const addDonation = async (donation) => {
  const now = Timestamp.now();
  // Auto-set expiry to 2 hours from creation
  const expiresAt = new Timestamp(now.seconds + 2 * 60 * 60, now.nanoseconds);

  const docRef = await addDoc(donationsRef, {
    foodName: donation.foodName,
    quantity: donation.quantity,
    location: donation.location,
    createdAt: now,
    expiresAt: expiresAt,
    status: 'available', // available | claimed | expired | assigned
    claimedBy: null,
    assignedVolunteer: null,
  });

  return docRef.id;
};

/**
 * Subscribe to real-time donation updates
 * Only fetches donations that are still 'available'
 * @param {Function} callback - Called with array of donations on each update
 * @returns {Function} unsubscribe - Call to stop listening
 */
export const subscribeToDonations = (callback) => {
  const q = query(
    donationsRef,
    where('status', '==', 'available')
  );

  return onSnapshot(q, (snapshot) => {
    let donations = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    // Sort client-side to avoid Firebase composite index requirement
    donations.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);
    callback(donations);
  });
};

/**
 * Subscribe to ALL donations (for dashboard analytics)
 * @param {Function} callback - Called with array of all donations
 * @returns {Function} unsubscribe
 */
export const subscribeToAllDonations = (callback) => {
  const q = query(donationsRef, orderBy('createdAt', 'desc'));

  return onSnapshot(q, (snapshot) => {
    const donations = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(donations);
  });
};

/**
 * Claim a donation (NGO action)
 * @param {string} donationId - Firestore document ID
 * @param {string} ngoName - Name of the NGO claiming
 */
export const claimDonation = async (donationId, ngoName) => {
  const now = Timestamp.now();
  // Give volunteers 20 minutes to accept the pickup
  const expiresAt = new Timestamp(now.seconds + 20 * 60, now.nanoseconds);

  const donationDoc = doc(db, 'donations', donationId);
  await updateDoc(donationDoc, {
    status: 'claimed',
    claimedBy: ngoName,
    expiresAt: expiresAt,
  });
};

/**
 * Assign a volunteer to a claimed donation
 * @param {string} donationId - Firestore document ID
 * @param {string} volunteerName - Name of the volunteer
 */
export const assignVolunteer = async (donationId, volunteerName) => {
  const donationDoc = doc(db, 'donations', donationId);
  await updateDoc(donationDoc, {
    status: 'assigned',
    assignedVolunteer: volunteerName,
  });
};

/**
 * Subscribe to claimed donations (for volunteer screen)
 * @param {Function} callback
 * @returns {Function} unsubscribe
 */
export const subscribeToClaimedDonations = (callback) => {
  const q = query(
    donationsRef,
    where('status', '==', 'claimed')
  );

  return onSnapshot(q, (snapshot) => {
    let donations = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    // Sort client-side to avoid Firebase composite index requirement
    donations.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);
    callback(donations);
  });
};

export { db, donationsRef };
