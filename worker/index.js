self.addEventListener('push', (event) => {
  const { title, ...options } = event.data.json();
  console.log('[Service Worker] Push Received.', event.data.text());
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
    console.log('[Service Worker] Notification click Received.');
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data.url)
    );
    }
);
