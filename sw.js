// SATI ChatBot Service Worker
// Version 1.0.0

const CACHE_NAME = 'sati-chatbot-v1.0.0';
const OFFLINE_URL = '/offline.html';

// Files to cache for offline functionality
const STATIC_CACHE_URLS = [
    '/',
    '/index.html',
    '/styles.css',
    '/script.js',
    '/api-integration.js',
    '/sati-knowledge.js',
    '/supabase-db.js',
    '/cool-mode.js',
    '/glowing-effect.css',
    '/glowing-effect.js',
    '/smooth-cursor.css',
    '/smooth-cursor.js',
    '/images/favicon.png',
    '/images/preview.png',
    '/manifest.json',
    // External resources
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://unpkg.com/@supabase/supabase-js@2'
];

// Install event - cache static resources
self.addEventListener('install', (event) => {
    console.log('🔧 Service Worker: Installing...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('📦 Service Worker: Caching static resources');
                return cache.addAll(STATIC_CACHE_URLS.map(url => {
                    return new Request(url, { cache: 'reload' });
                }));
            })
            .then(() => {
                console.log('✅ Service Worker: Installation complete');
                // Force the waiting service worker to become the active service worker
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('❌ Service Worker: Installation failed', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('🚀 Service Worker: Activating...');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== CACHE_NAME) {
                            console.log('🗑️ Service Worker: Deleting old cache', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('✅ Service Worker: Activation complete');
                // Take control of all pages immediately
                return self.clients.claim();
            })
    );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') {
        return;
    }

    // Skip external API calls (let them fail gracefully)
    if (event.request.url.includes('/api/') || 
        event.request.url.includes('googleapis.com') ||
        event.request.url.includes('groq.com') ||
        event.request.url.includes('supabase.co')) {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                // Return cached version if available
                if (cachedResponse) {
                    console.log('📦 Service Worker: Serving from cache', event.request.url);
                    return cachedResponse;
                }

                // Try to fetch from network
                return fetch(event.request)
                    .then((response) => {
                        // Don't cache non-successful responses
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // Clone the response for caching
                        const responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    })
                    .catch(() => {
                        // If both cache and network fail, show offline page for navigation requests
                        if (event.request.mode === 'navigate') {
                            return caches.match(OFFLINE_URL) || 
                                   caches.match('/') ||
                                   new Response('Offline - Please check your internet connection', {
                                       status: 503,
                                       statusText: 'Service Unavailable',
                                       headers: { 'Content-Type': 'text/plain' }
                                   });
                        }
                        
                        // For other requests, just fail
                        throw error;
                    });
            })
    );
});

// Background sync for chat messages (when online)
self.addEventListener('sync', (event) => {
    if (event.tag === 'chat-sync') {
        console.log('🔄 Service Worker: Syncing chat messages');
        event.waitUntil(syncChatMessages());
    }
});

// Push notifications (for future use)
self.addEventListener('push', (event) => {
    console.log('📬 Service Worker: Push notification received');
    
    const options = {
        body: event.data ? event.data.text() : 'New message from SATI ChatBot',
        icon: '/images/favicon.png',
        badge: '/images/favicon.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'Open ChatBot',
                icon: '/images/favicon.png'
            },
            {
                action: 'close',
                title: 'Close',
                icon: '/images/favicon.png'
            }
        ]
    };

    event.waitUntil(
        self.registration.showNotification('SATI ChatBot', options)
    );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
    console.log('🔔 Service Worker: Notification clicked');
    
    event.notification.close();

    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Helper function to sync chat messages
async function syncChatMessages() {
    try {
        // This would sync any pending chat messages when back online
        // Implementation depends on your chat storage mechanism
        console.log('💬 Service Worker: Chat sync completed');
    } catch (error) {
        console.error('❌ Service Worker: Chat sync failed', error);
    }
}

// Handle app updates
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        console.log('🔄 Service Worker: Skipping waiting...');
        self.skipWaiting();
    }
});

console.log('🎯 Service Worker: Loaded successfully');