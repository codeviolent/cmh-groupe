// ------------------------------
// استيراد Firebase v9 Modular
// ------------------------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

// ------------------------------
// إعدادات Firebase الخاصة بك
// ------------------------------
const firebaseConfig = {
    apiKey: "AIzaSyATtfSHgXS2KfWXxQDZZEPgXI1Zo1dyehE",
    authDomain: "khidma-58caa.firebaseapp.com",
    projectId: "khidma-58caa",
    storageBucket: "khidma-58caa.firebasestorage.app",
    messagingSenderId: "1091814213057",
    appId: "1:1091814213057:web:9adb99a2c2023e995b1b40",
    measurementId: "G-T51K0BKQQD"
};

// تهيئة التطبيق
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ------------------------------
// تسجيل الدخول
// ------------------------------
const loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = loginForm['email'].value.trim();
    const password = loginForm['password'].value;

    signInWithEmailAndPassword(auth, email, password)
      .then((cred) => {
        console.log('User logged in:', cred.user);
        window.location.href = 'index.html'; // عدل الرابط إذا لزم
      })
      .catch((error) => {
        console.error('Login error:', error);
        alert(error.message);
      });
  });
}

// ------------------------------
// التسجيل (إنشاء حساب جديد)
// ------------------------------
const signupForm = document.getElementById('signup-form');
if (signupForm) {
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = signupForm['email'].value.trim();
    const password = signupForm['password'].value;
    const name = signupForm['name'].value.trim();
    const phone = signupForm['phone'].value.trim();

    createUserWithEmailAndPassword(auth, email, password)
      .then((cred) => {
        return setDoc(doc(db, 'users', cred.user.uid), {
          name: name,
          email: email,
          phone: phone,
          createdAt: serverTimestamp()
        });
      })
      .then(() => {
        console.log('User registered successfully');
        window.location.href = 'index.html'; // عدل الرابط إذا لزم
      })
      .catch((error) => {
        console.error('Signup error:', error);
        alert(error.message);
      });
  });
}

// ------------------------------
// تسجيل الخروج
// ------------------------------
const logoutButtons = document.querySelectorAll('#logout-btn, #user-menu-logout');
logoutButtons.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    signOut(auth)
      .then(() => {
        console.log('User signed out');
        window.location.href = 'index.html'; // عدل الرابط إذا لزم
      })
      .catch((error) => {
        console.error('Sign out error:', error);
      });
  });
});

// ------------------------------
// إعادة تعيين كلمة المرور
// ------------------------------
const resetForm = document.getElementById('reset-form');
if (resetForm) {
  resetForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = resetForm['email'].value.trim();

    sendPasswordResetEmail(auth, email)
      .then(() => {
        alert('تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني');
        resetForm.reset();
      })
      .catch((error) => {
        console.error('Reset password error:', error);
        alert(error.message);
      });
  });
}
