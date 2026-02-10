import { useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { isOnline, watchNetworkStatus } from '@/pwa';

export default function NetworkStatus() {
  const [online, setOnline] = useState(isOnline());
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const unwatch = watchNetworkStatus((status) => {
      setOnline(status);
      setShowNotification(true);

      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 3000);

      return () => clearTimeout(timer);
    });

    return () => {
      if (typeof unwatch === 'function') {
        unwatch();
      }
    };
  }, []);

  if (!showNotification) {
    return null;
  }

  return (
    <div className="fixed top-20 right-6 z-50 animate-slide-down">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg ${
          online
            ? 'bg-green-500/90 text-white'
            : 'bg-red-500/90 text-white'
        }`}
      >
        {online ? (
          <>
            <Wifi className="w-5 h-5" />
            <div>
              <div className="font-semibold">Connexion rétablie</div>
              <div className="text-sm opacity-90">Vous êtes de nouveau en ligne</div>
            </div>
          </>
        ) : (
          <>
            <WifiOff className="w-5 h-5" />
            <div>
              <div className="font-semibold">Hors ligne</div>
              <div className="text-sm opacity-90">Mode offline activé</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
