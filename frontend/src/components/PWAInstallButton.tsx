import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { promptInstall } from '@/pwa';
import { Button } from './ui/button';

export default function PWAInstallButton() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    const checkInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isInApp = (window.navigator as any).standalone === true;
      return isStandalone || isInApp;
    };

    setIsInstalled(checkInstalled());

    // Show prompt after 3 seconds if not installed
    const timer = setTimeout(() => {
      if (!checkInstalled() && !localStorage.getItem('pwa-prompt-dismissed')) {
        setShowPrompt(true);
      }
    }, 3000);

    // Listen for app installed event
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowPrompt(false);
    });

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const handleInstall = async () => {
    const installed = await promptInstall();
    if (installed) {
      setShowPrompt(false);
      setIsInstalled(true);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  if (isInstalled) {
    return null;
  }

  if (!showPrompt) {
    return (
      <Button
        id="pwa-install-button"
        onClick={handleInstall}
        className="fixed bottom-6 right-6 bg-purple-500 hover:bg-purple-600 text-white shadow-lg z-50 hidden"
      >
        <Download className="w-4 h-4 mr-2" />
        Installer l'app
      </Button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm">
      <div className="bg-slate-900 border border-purple-500/30 rounded-lg shadow-2xl p-6 relative animate-slide-up">
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <Download className="w-6 h-6 text-purple-400" />
          </div>

          <div className="flex-1">
            <h3 className="text-white font-semibold mb-1">
              Installer YNOT
            </h3>
            <p className="text-slate-400 text-sm mb-4">
              Accédez rapidement à vos concerts préférés directement depuis votre écran d'accueil
            </p>

            <div className="flex gap-2">
              <Button
                onClick={handleInstall}
                className="bg-purple-500 hover:bg-purple-600 text-white flex-1"
              >
                Installer
              </Button>
              <Button
                onClick={handleDismiss}
                variant="outline"
                className="border-slate-700 text-slate-300 hover:bg-slate-800"
              >
                Plus tard
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-800">
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              ✓ Mode hors ligne
            </span>
            <span className="flex items-center gap-1">
              ✓ Notifications
            </span>
            <span className="flex items-center gap-1">
              ✓ Accès rapide
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
