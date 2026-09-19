// sw.js - Background Notification Handler
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// जब बैकग्राउंड या लॉक स्क्रीन में नया ऑर्डर आए
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'NEW_ORDER_ALERT') {
    const options = {
      body: `नया ऑर्डर आया है: ₹${event.data.amount || ''} - तुरंत पिक करें!`,
      icon: 'logo.png',
      badge: 'logo.png',
      vibrate: [500, 200, 500, 200, 800, 400, 1000],
      tag: 'new-order-alert',
      renotify: true,
      requireInteraction: true, // जब तक राइडर स्क्रीन न छुए, लॉक स्क्रीन पर बजता रहे
      sound: 'alert.mp3',
      data: { url: '/rider.html' }
    };

    self.registration.showNotification('🚨 BABA FOOD: नया ऑर्डर!', options);
  }
});

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
        return clients.openWindow('rider.html');
      }
    })
  );
});
