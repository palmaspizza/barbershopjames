async function removeLegacyPushRegistration() {
  try {
    localStorage.removeItem('jbPushInvitaciones');
    localStorage.removeItem('jbPushReagendarToken');
  } catch (error) {
    console.error('No se pudieron limpiar los datos locales de Push anteriores:', error);
  }

  if (!('serviceWorker' in navigator)) return;

  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const registration of registrations) {
      const worker = registration.active || registration.waiting || registration.installing;
      if (!worker || new URL(worker.scriptURL).pathname !== '/push-sw.js') continue;
      try {
        const subscription = registration.pushManager
          ? await registration.pushManager.getSubscription()
          : null;
        if (subscription && !(await subscription.unsubscribe())) {
          console.warn('El navegador no confirmó la baja de la suscripción Push antigua.');
        }
      } catch (error) {
        console.error('No se pudo cancelar la suscripción Push anterior:', error);
      }
      if (!(await registration.unregister())) {
        console.warn('El navegador no confirmó la baja del Service Worker Push antiguo.');
      }
    }
  } catch (error) {
    console.error('No se pudo desactivar el Service Worker Push anterior:', error);
  }
}

removeLegacyPushRegistration();
