// ------------------------------
// استيراد Firebase (v9 modular)
// ------------------------------

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import { getFirestore, serverTimestamp, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-storage.js";

// ------------------------------
// إعداد Firebase App
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

// تهيئة Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const storage = getStorage(app);

// ------------------------------
// إرسال نموذج الخدمة
// ------------------------------

function setupServiceForms() {
  const serviceForms = document.querySelectorAll('[id$="-form"]');

  serviceForms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // const user = auth.currentUser;
      // if (!user) {
      //   alert('يجب تسجيل الدخول أولاً');
      //   window.location.href = 'dashboard/auth.html';
      //   return;
      // }

      const formData = new FormData(form);
      const serviceData = {
        
        userName: formData.get('name'),
        userEmail: formData.get('email'),
        userPhone: formData.get('phone'),
        service: form.id.replace('-form', '').replace(/-/g, ' '),
        details: {},
        status: 'pending',
        createdAt: serverTimestamp()
      };

      // إضافة الحقول الخاصة بالخدمة
      for (let [key, value] of formData.entries()) {
        if (key !== 'name' && key !== 'email' && key !== 'phone' && key !== 'files') {
          serviceData.details[key] = value;
        }
      }

      // رفع الملفات إذا وجدت
      const files = formData.getAll('files');
      if (files.length > 0 && files[0].name) {
        try {
          const storageRef = ref(storage, `service-requests/${user.uid}/${Date.now()}_${files[0].name}`);
          const snapshot = await uploadBytes(storageRef, files[0]);
          const downloadURL = await getDownloadURL(snapshot.ref);

          serviceData.attachments = [downloadURL];

          await saveServiceRequest(serviceData);
          alert('تم إرسال طلبك بنجاح! سيتصل بك فريقنا قريباً.');
          form.reset();

        } catch (error) {
          console.error('Error uploading file:', error);
          alert('حدث خطأ أثناء رفع الملف. يرجى المحاولة مرة أخرى.');
        }

      } else {
        try {
          await saveServiceRequest(serviceData);
          alert('تم إرسال طلبك بنجاح! سيتصل بك فريقنا قريباً.');
          form.reset();
        } catch (error) {
          console.error('Error saving request:', error);
          alert('حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.');
        }
      }
    });
  });
}

// ------------------------------
// حفظ طلب الخدمة في Firestore
// ------------------------------

function saveServiceRequest(serviceData) {
  return addDoc(collection(db, 'requests'), serviceData);
}

// ------------------------------
// إرسال نموذج التواصل
// ------------------------------

const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const contactData = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      subject: formData.get('subject'),
      message: formData.get('message'),
      date: serverTimestamp(),
      read: false
    };

    try {
      await addDoc(collection(db, 'contacts'), contactData);
      alert('تم إرسال رسالتك بنجاح! سنرد عليك في أقرب وقت ممكن.');
      contactForm.reset();
    } catch (error) {
      console.error('Error sending message:', error);
      alert('حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.');
    }
  });
}

// ------------------------------
// تنفيذ بعد تحميل الصفحة
// ------------------------------

document.addEventListener('DOMContentLoaded', function () {
  setupServiceForms();
});
