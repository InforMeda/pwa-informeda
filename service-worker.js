self.addEventListener('push', function(event) {
  console.log('[Service Worker] Push Received.');
  let title = 'Novo Alerta InforMeda';
  let options = {
    body: 'Tem uma nova notificação do seu contabilista.',
    icon: 'https://cdn-icons-png.flaticon.com/512/625/625597.png',
    badge: 'https://cdn-icons-png.flaticon.com/512/625/625597.png',
    vibrate: [200, 100, 200]
  };

  if (event.data) {
    try {
      const data = event.data.json();
      if(data.title) title = data.title;
      if(data.body) options.body = data.body;
      if(data.url) options.data = { url: data.url };
    } catch(e) {
      options.body = event.data.text();
    }
  }

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {
  console.log('[Service Worker] Notification click Received.');
  event.notification.close();

  const urlToOpen = event.notification.data && event.notification.data.url 
                    ? event.notification.data.url 
                    : '/';

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(windowClients => {
      // Verifica se já há um separador aberto com este URL
      for (var i = 0; i < windowClients.length; i++) {
        var client = windowClients[i];
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      // Se não, abre uma nova janela
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
