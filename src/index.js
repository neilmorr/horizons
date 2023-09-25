import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/10.1.0/firebase-storage.js';

// Initialize Firebase
const firebaseConfig = {
  // Your Firebase config object
  apiKey: "AIzaSyCcCB8xX0-xJbmRhzzgqk0A_EaN6na9vVY",
    authDomain: "eternal-byte-345004.firebaseapp.com",
    projectId: "eternal-byte-345004",
    storageBucket: "eternal-byte-345004.appspot.com",
    messagingSenderId: "1038047289352",
    appId: "1:1038047289352:web:0e69c2ce527f260cc971bd",
    measurementId: "G-ZKFHD90Q8K"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app); // Initialize Firebase Storage
const storageBucket = firebaseConfig.storageBucket;

export { app, db, storage, storageBucket }; // Export app, db and storage variables
