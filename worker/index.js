self.addEventListener('push', (event) => {
  const { title, ...options } = event.data.json();
  console.log('[Service Worker] Push Received.', event.data.text());

  event.waitUntil(
    //TODO: check if user is currently using the app
    clients.matchAll().then((clientList) => {
      if (clientList.length > 0) {
        console.log('[Service Worker] User is currently using the app, no need for notification.');
      } else {
        self.registration.showNotification(title, options);
      }
    })
  );
});

self.addEventListener('notificationclick', (event) => {
    console.log('[Service Worker] Notification click Received.');
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data.url)
    );
});
