// Import Firebase modules using ES6 imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-firestore.js";

// Your web app's Firebase configuration
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
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.getElementById('contact-form');
  
  if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      // UI Feedback - Loading state
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        جاري الإرسال...
      `;
      
      // Get form data
      const contactData = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim() || 'غير محدد',
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value.trim(),
        timestamp: serverTimestamp(),
        status: 'unread'
      };
      
      // Validate form
      if (!validateContactForm(contactData)) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
        return;
      }
      
      try {
        // Add document to Firestore
        const docRef = await addDoc(collection(db, "contacts"), contactData);
        
        // Success
        showSweetAlert(
          'success',
          'تم بنجاح',
          'تم إرسال رسالتك بنجاح. سنتواصل معك قريباً.',
          'حسناً'
        );
        contactForm.reset();
        
        // Optional: Log the document ID
        console.log("Document written with ID: ", docRef.id);
      } catch (error) {
        console.error("Error adding document: ", error);
        showSweetAlert(
          'error',
          'خطأ',
          'حدث خطأ أثناء إرسال الرسالة. الرجاء المحاولة مرة أخرى.',
          'حسناً'
        );
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }
    });
  }
  
  // Initialize FAQ functionality
  initFAQ();
});

// Form validation function
function validateContactForm(data) {
  if (!data.name || !data.email || !data.subject || !data.message) {
    showSweetAlert(
      'error',
      'حقول مطلوبة',
      'الرجاء ملء جميع الحقول المطلوبة',
      'حسناً'
    );
    return false;
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    showSweetAlert(
      'error',
      'بريد إلكتروني غير صحيح',
      'الرجاء إدخال بريد إلكتروني صحيح',
      'حسناً'
    );
    return false;
  }
  
  return true;
}

// FAQ Accordion functionality
function initFAQ() {
  const faqQuestions = document.querySelectorAll('.faq-question');
  
  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const answer = question.nextElementSibling;
      const isOpen = answer.style.display === 'block';
      
      // Close all other answers
      document.querySelectorAll('.faq-answer').forEach(item => {
        item.style.display = 'none';
        item.previousElementSibling.classList.remove('active');
        item.previousElementSibling.setAttribute('aria-expanded', 'false');
      });
      
      // Toggle current answer
      if (!isOpen) {
        answer.style.display = 'block';
        question.classList.add('active');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });
  
  
}

// Modern alert using SweetAlert2 (you need to include the library)
function showSweetAlert(icon, title, text, confirmButtonText) {
  if (typeof Swal !== 'undefined') {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
      confirmButtonText: confirmButtonText,
      customClass: {
        confirmButton: 'btn btn-primary'
      },
      buttonsStyling: false
    });
  } else {
    // Fallback to basic alert
    alert(`${title}\n\n${text}`);
  }
}