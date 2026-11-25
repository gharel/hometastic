/*
 * Rappels de Nid (importé dans le service worker généré par Workbox).
 * Messages « data » de Firebase Cloud Messaging envoyés par outils/rappels.mjs :
 * { titre, corps, lien, tag }. Un rappel de santé n’a jamais de détail (ADR 0004).
 */
self.addEventListener('push', (evenement) => {
  let message;
  try {
    message = evenement.data ? evenement.data.json() : {};
  } catch {
    message = {};
  }
  const d = message.data || message;
  evenement.waitUntil(
    self.registration.showNotification(d.titre || 'Nid', {
      body: d.corps || '',
      tag: d.tag || undefined,
      icon: 'pwa-192x192.png',
      badge: 'pwa-64x64.png',
      data: { lien: d.lien || './#/a-faire' },
    }),
  );
});

self.addEventListener('notificationclick', (evenement) => {
  evenement.notification.close();
  const lien = new URL(evenement.notification.data?.lien || './', self.registration.scope).href;
  evenement.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((fenetres) => {
      const ouverte = fenetres.find((f) => f.url.startsWith(self.registration.scope));
      if (ouverte) return ouverte.navigate(lien).then((f) => (f || ouverte).focus());
      return self.clients.openWindow(lien);
    }),
  );
});
