// Service Worker بسيط للسماح للتطبيق بالعمل وتجاوز خطأ 404
const CACHE_NAME = 'sudanese-ai-v1';

// تثبيت الـ Service Worker
self.addEventListener('install', (event) => {
    console.log('SW: Installed');
    self.skipWaiting();
});

// تفعيل الـ Service Worker
self.addEventListener('activate', (event) => {
    console.log('SW: Activated');
});

// التعامل مع طلبات الملفات (Fetch)
self.addEventListener('fetch', (event) => {
    // نتركه فارغاً حالياً ليمرر جميع الطلبات للسيرفر بشكل طبيعي
});