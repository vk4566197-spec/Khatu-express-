// sw.js - Background Notification & Wake Handler
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Jab naya order aaye toh vibration aur persistent banner throw karein
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'NEW_ORDER_ALERT') {
    const amount = event.data.amount ? `₹${event.data.amount}` : '';
    const options = {
      body: `🚨 naya order aaya hai: ${amount} - turant pickup karein!`,
      icon: 'logo.png',
      badge: 'logo.png',
      vibrate: [500, 200, 500, 200, 800, 400, 1000],
      tag: 'baba-rider-order',
      renotify: true,
      requireInteraction: true, // Rider jab tak click na kare screen par tika rahega
      data: { url: './rider.html' }
    };

    self.registration.showNotification('🛵 BABA FOOD: NEW ORDER ALERT!', options);
  }
});

// Notification par tap karte hi rider dashboard open/focus hoga
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes('rider.html') && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('./rider.html');
      }
    })
  );
});
