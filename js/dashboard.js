// dashboard.js
import { db } from './firebase.js';
import { collection, query, where, getDocs, orderBy, limit } from 'https://www.gstatic.com/firebasejs/9.6.0/firebase-firestore.js';

async function fetchUserData(userId) {
    try {
        // جلب الطلبات الأخيرة
        const requestsQuery = query(
            collection(db, 'requests'),
            where('userId', '==', userId),
            orderBy('createdAt', 'desc'),
            limit(5)
        );
        
        const requestsSnapshot = await getDocs(requestsQuery);
        const requestsList = document.getElementById('recent-requests-list');
        requestsList.innerHTML = '';
        
        requestsSnapshot.forEach(doc => {
            const request = doc.data();
            requestsList.appendChild(createRequestElement(request));
        });

        // جلب الرسائل الأخيرة
        const messagesQuery = query(
            collection(db, 'messages'),
            where('userId', '==', userId),
            where('read', '==', false),
            orderBy('timestamp', 'desc'),
            limit(5)
        );
        
        const messagesSnapshot = await getDocs(messagesQuery);
        const messagesList = document.getElementById('recent-messages-list');
        messagesList.innerHTML = '';
        
        messagesSnapshot.forEach(doc => {
            const message = doc.data();
            messagesList.appendChild(createMessageElement(message));
        });

        // تحديث الإحصائيات
        updateStatistics(requestsSnapshot.size, messagesSnapshot.size);
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
}

function createRequestElement(request) {
    const element = document.createElement('div');
    element.className = 'request-item';
    
    const statusClass = request.status === 'مكتمل' ? 'completed' : 
                       request.status === 'ملغى' ? 'cancelled' : 'in-progress';
    
    element.innerHTML = `
        <div class="request-service">
            <i class="fas ${getServiceIcon(request.serviceType)}"></i>
            <span>${request.serviceType}</span>
        </div>
        <div class="request-date">${formatDate(request.createdAt)}</div>
        <div class="request-status ${statusClass}">${request.status}</div>
    `;
    
    return element;
}

function createMessageElement(message) {
    const element = document.createElement('div');
    element.className = 'message-item';
    
    element.innerHTML = `
        <div class="message-sender">
            <i class="fas fa-user"></i>
            <span>${message.sender || 'الدعم الفني'}</span>
        </div>
        <div class="message-preview">${message.content.substring(0, 50)}...</div>
        <div class="message-time">${formatDate(message.timestamp)}</div>
    `;
    
    return element;
}

function updateStatistics(totalRequests, unreadMessages) {
    document.getElementById('total-requests').textContent = totalRequests;
    document.getElementById('unread-messages').textContent = unreadMessages;
    
    // يمكنك إضافة المزيد من الإحصائيات هنا بناءً على البيانات
}

function getServiceIcon(serviceType) {
    const icons = {
        'تطبيق جوال': 'fa-mobile-alt',
        'موقع إلكتروني': 'fa-laptop-code',
        'تأشيرة': 'fa-passport',
        'تصميم جرافيك': 'fa-palette',
        'استضافة': 'fa-server'
    };
    return icons[serviceType] || 'fa-clipboard-list';
}

function formatDate(timestamp) {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    return date.toLocaleDateString('ar-SA');
}