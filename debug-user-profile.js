const { initializeApp } = require('firebase/app');
const { getFirestore, doc, getDoc, setDoc, serverTimestamp } = require('firebase/firestore');
const { getAuth } = require('firebase/auth');

// Firebase config - you'll need to add your actual config
const firebaseConfig = {
  // Add your Firebase config here
  // This should match the config in your .env.local file
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

async function checkAndCreateUserProfile(uid, email) {
  try {
    console.log(`Checking user profile for UID: ${uid}`);
    
    // Check if user profile exists
    const userDoc = await getDoc(doc(db, 'users', uid));
    
    if (userDoc.exists()) {
      console.log('User profile found:', userDoc.data());
      return userDoc.data();
    } else {
      console.log('User profile not found. Creating customer profile...');
      
      // Create customer profile
      const userProfile = {
        uid: uid,
        email: email,
        displayName: email.split('@')[0], // Use email prefix as display name
        role: 'customer',
        permissions: ['view_own_bookings', 'manage_own_profile'],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isActive: true
      };
      
      // Save to Firestore
      await setDoc(doc(db, 'users', uid), userProfile);
      console.log('Customer profile created successfully!');
      
      return userProfile;
    }
  } catch (error) {
    console.error('Error checking/creating user profile:', error);
    throw error;
  }
}

// Example usage:
// Replace with the actual UID from Firebase Authentication
const userUID = 'REPLACE_WITH_ACTUAL_UID';
const userEmail = 'simbataisa@gmail.com';

if (userUID !== 'REPLACE_WITH_ACTUAL_UID') {
  checkAndCreateUserProfile(userUID, userEmail)
    .then(() => {
      console.log('Process completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Process failed:', error);
      process.exit(1);
    });
} else {
  console.log('Please replace REPLACE_WITH_ACTUAL_UID with the actual Firebase Auth UID');
  console.log('You can find this in the Firebase Console under Authentication > Users');
}