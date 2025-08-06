// تنفيذ بعد تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // شريط التنقل المتحرك
    const navbar = document.querySelector('.navbar');
    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('.nav-list');
    
    // إضافة تأثير التمرير لشريط التنقل
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // تبديل قائمة الهاتف
    menuToggle.addEventListener('click', function() {
        navList.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });
    
    // إغلاق القائمة عند النقر على رابط
    document.querySelectorAll('.nav-list a').forEach(link => {
        link.addEventListener('click', () => {
            navList.classList.remove('active');
            menuToggle.classList.remove('active');
        });
    });
    
    // السلايدر الرئيسي
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.prev-slide');
    const nextBtn = document.querySelector('.next-slide');
    let currentSlide = 0;
    
    function showSlide(n) {
        slides.forEach(slide => slide.classList.remove('active'));
        currentSlide = (n + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');
    }
    
    function nextSlide() {
        showSlide(currentSlide + 1);
    }
    
    function prevSlide() {
        showSlide(currentSlide - 1);
    }
    
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    
    // تشغيل السلايدر تلقائياً
    let slideInterval = setInterval(nextSlide, 5000);
    
    // إيقاف السلايدر عند تمرير الماوس فوقه
    const heroSlider = document.querySelector('.hero-slider');
    heroSlider.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });
    
    heroSlider.addEventListener('mouseleave', () => {
        slideInterval = setInterval(nextSlide, 5000);
    });
    
    // عداد الإحصائيات
    const counters = document.querySelectorAll('.counter');
    const speed = 200;
    
    function animateCounters() {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            const increment = target / speed;
            
            if (count < target) {
                counter.innerText = Math.ceil(count + increment);
                setTimeout(animateCounters, 1);
            } else {
                counter.innerText = target;
            }
        });
    }
    
    // تشغيل العداد عند التمرير إلى القسم
    window.addEventListener('scroll', function() {
        const statsSection = document.querySelector('.stats-section');
        const sectionPos = statsSection.getBoundingClientRect().top;
        const screenPos = window.innerHeight / 1.3;
        
        if (sectionPos < screenPos) {
            animateCounters();
            // إزالة الحدث بعد التشغيل مرة واحدة
            window.removeEventListener('scroll', this);
        }
    });
    
    // تبويب التقنيات
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            tabBtns.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            this.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // الأسئلة الشائعة
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            this.classList.toggle('active');
            const answer = this.nextElementSibling;
            
            if (this.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
            } else {
                answer.style.maxHeight = '0';
            }
        });
    });
    
    // تحميل المدونة من Firebase
    if (document.getElementById('blog-posts')) {
        loadBlogPosts();
    }
});

// تحميل مقالات المدونة
function loadBlogPosts() {
    const blogContainer = document.getElementById('blog-posts');
    
    db.collection('blog-posts').orderBy('date', 'desc').limit(3).get()
    .then(snapshot => {
        snapshot.forEach(doc => {
            const post = doc.data();
            const postDate = post.date.toDate();
            const formattedDate = postDate.toLocaleDateString('ar-EG', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            const postElement = `
                <div class="blog-post">
                    <div class="post-image">
                        <img src="${post.image}" alt="${post.title}">
                    </div>
                    <div class="post-content">
                        <div class="post-meta">
                            <span><i class="far fa-calendar-alt"></i> ${formattedDate}</span>
                            <span><i class="far fa-folder"></i> ${post.category}</span>
                        </div>
                        <h3 class="post-title">${post.title}</h3>
                        <p class="post-excerpt">${post.excerpt}</p>
                        <a href="blog-single.html?id=${doc.id}" class="read-more">اقرأ المزيد <i class="fas fa-arrow-left"></i></a>
                    </div>
                </div>
            `;
            
            blogContainer.innerHTML += postElement;
        });
    })
    .catch(error => {
        console.error('Error loading blog posts: ', error);
    });
}


document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
        const answer = button.nextElementSibling;
        const isActive = button.classList.contains('active');
        
        // إغلاق جميع الإجابات الأخرى
        document.querySelectorAll('.faq-question').forEach(item => {
            if (item !== button) {
                item.classList.remove('active');
                item.nextElementSibling.style.maxHeight = null;
            }
        });
        
        // فتح/إغلاق الإجابة الحالية
        button.classList.toggle('active');
        
        if (!isActive) {
            answer.style.maxHeight = answer.scrollHeight + 'px';
        } else {
            answer.style.maxHeight = null;
        }
    });
});




document.addEventListener('DOMContentLoaded', function() {
    // الحصول على جميع أزرار التبويبات
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    // إضافة مستمع حدث لكل زر
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // إزالة الفئة active من جميع الأزرار
            tabButtons.forEach(btn => {
                btn.classList.remove('active');
            });
            
            // إضافة الفئة active للزر المحدد
            this.classList.add('active');
            
            // الحصول على معرف التبويب المرتبط بالزر
            const tabId = this.getAttribute('data-tab');
            
            // إخفاء جميع محتويات التبويبات
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // إظهار محتوى التبويب المحدد فقط
            document.getElementById(tabId).classList.add('active');
        });
    });
});