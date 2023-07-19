self.addEventListener('push', (event) => {
  const { title, ...options } = event.data.json();
  event.waitUntil(
    clients.matchAll().then((clientList) => {
      if (clientList.length > 0) {
      } else {
        self.registration.showNotification(title, options);
      }
    })
  );
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data.url)
    );
});
