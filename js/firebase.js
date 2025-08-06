




// firebase.js
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js';
import { 
    getAuth, 
    GoogleAuthProvider,
    signInWithPopup,
    signOut
} from 'https://www.gstatic.com/firebasejs/9.6.0/firebase-auth.js';
import { 
    getFirestore,
    doc,
    setDoc,
    getDoc
} from 'https://www.gstatic.com/firebasejs/9.6.0/firebase-firestore.js';

const firebaseConfig = {
    apiKey: "AIzaSyATtfSHgXS2KfWXxQDZZEPgXI1Zo1dyehE",
    authDomain: "khidma-58caa.firebaseapp.com",
    projectId: "khidma-58caa",
    storageBucket: "khidma-58caa.firebasestorage.app",
    messagingSenderId: "1091814213057",
    appId: "1:1091814213057:web:9adb99a2c2023e995b1b40",
    measurementId: "G-T51K0BKQQD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

export { auth, db, provider, signInWithPopup, signOut, doc, setDoc, getDoc };