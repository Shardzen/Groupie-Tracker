import { registerSW } from 'virtual:pwa-register';

// Service Worker Registration
export const updateSW = registerSW({
  immediate: true,
  onNeedRefresh() {
    if (confirm('Une nouvelle version est disponible. Voulez-vous mettre à jour ?')) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    console.log('✅ App prête en mode hors ligne');
    showNotification('Mode hors ligne activé', 'L\'application est maintenant accessible sans connexion');
  },
  onRegistered(registration) {
    console.log('✅ Service Worker enregistré:', registration);
    
    // Check for updates every hour
    setInterval(() => {
      registration?.update();
    }, 60 * 60 * 1000);
  },
  onRegisterError(error) {
    console.error('❌ Erreur Service Worker:', error);
  },
});

// Push Notifications
export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.warn('Les notifications ne sont pas supportées');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
}

export function showNotification(title: string, body: string, options?: NotificationOptions) {
  if (Notification.permission === 'granted') {
    const notification = new Notification(title, {
      body,
      icon: '/favicon.svg',
      badge: '/favicon.svg',
      tag: 'ynot-notification',
      requireInteraction: false,
      ...options,
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    // Auto-close after 5 seconds
    setTimeout(() => notification.close(), 5000);
  }
}

// Install Prompt
let deferredPrompt: any = null;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  
  // Show custom install button
  const installButton = document.getElementById('pwa-install-button');
  if (installButton) {
    installButton.style.display = 'block';
  }
});

export async function promptInstall(): Promise<boolean> {
  if (!deferredPrompt) {
    console.warn('Prompt d\'installation non disponible');
    return false;
  }

  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  
  if (outcome === 'accepted') {
    console.log('✅ PWA installée');
    showNotification('Installation réussie', 'YNOT est maintenant installé sur votre appareil');
  }
  
  deferredPrompt = null;
  return outcome === 'accepted';
}

// Background Sync
export async function registerBackgroundSync(tag: string) {
  if ('serviceWorker' in navigator && 'sync' in ServiceWorkerRegistration.prototype) {
    try {
      const registration = await navigator.serviceWorker.ready;
      await (registration as any).sync.register(tag);
      console.log('✅ Background sync enregistré:', tag);
    } catch (error) {
      console.error('❌ Erreur background sync:', error);
    }
  }
}

// Cache Management
export async function clearAppCache() {
  if ('caches' in window) {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map(name => caches.delete(name)));
    console.log('✅ Cache effacé');
  }
}

export async function getCacheSize(): Promise<number> {
  if ('caches' in window) {
    const cacheNames = await caches.keys();
    let totalSize = 0;
    
    for (const name of cacheNames) {
      const cache = await caches.open(name);
      const requests = await cache.keys();
      
      for (const request of requests) {
        const response = await cache.match(request);
        if (response) {
          const blob = await response.blob();
          totalSize += blob.size;
        }
      }
    }
    
    return totalSize;
  }
  return 0;
}

// Network Status
export function isOnline(): boolean {
  return navigator.onLine;
}

export function watchNetworkStatus(callback: (online: boolean) => void) {
  window.addEventListener('online', () => callback(true));
  window.addEventListener('offline', () => callback(false));
  
  return () => {
    window.removeEventListener('online', () => callback(true));
    window.removeEventListener('offline', () => callback(false));
  };
}

// Share API
export async function shareContent(data: ShareData): Promise<boolean> {
  if (navigator.share) {
    try {
      await navigator.share(data);
      return true;
    } catch (error) {
      console.error('Erreur partage:', error);
      return false;
    }
  }
  return false;
}

// App Badge (notifications count)
export async function setAppBadge(count: number) {
  if ('setAppBadge' in navigator) {
    try {
      await (navigator as any).setAppBadge(count);
    } catch (error) {
      console.error('Erreur badge:', error);
    }
  }
}

export async function clearAppBadge() {
  if ('clearAppBadge' in navigator) {
    try {
      await (navigator as any).clearAppBadge();
    } catch (error) {
      console.error('Erreur clear badge:', error);
    }
  }
}

// Initialize PWA features
export function initPWA() {
  console.log('🚀 Initialisation PWA...');
  
  // Request notification permission on user interaction
  document.addEventListener('click', () => {
    requestNotificationPermission();
  }, { once: true });
  
  // Watch network status
  watchNetworkStatus((online) => {
    if (online) {
      showNotification('Connexion rétablie', 'Vous êtes de nouveau en ligne');
    } else {
      showNotification('Hors ligne', 'Mode hors ligne activé');
    }
  });
  
  // Log cache size periodically
  setInterval(async () => {
    const size = await getCacheSize();
    console.log(`📦 Taille du cache: ${(size / 1024 / 1024).toFixed(2)} MB`);
  }, 60000);
  
  console.log('✅ PWA initialisée');
}
