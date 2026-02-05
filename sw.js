// sw.js
const CACHE_NAME = 'russian-app-v1';
const STATIC_ASSETS = [
    './',
    './index.html',
    './manifest.json',
    './assets/css/style.css',
    './assets/js/app.js',
    './assets/fonts/CharisSIL-Regular.woff2',
    './data.json'
];

// 安装时缓存核心资源
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
    );
});

// 激活时清理旧缓存
self.addEventListener('activate', event => {
    console.log('Service Worker 激活成功');
});

// 拦截请求：音频文件采用“先看缓存，没有再联网”的策略
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request).then(networkResponse => {
                return caches.open(CACHE_NAME).then(cache => {
                    // 只缓存 MP3 文件，节省空间
                    if (event.request.url.endsWith('.mp3')) {
                        cache.put(event.request, networkResponse.clone());
                    }
                    return networkResponse;
                });
            });
        })
    );
});
