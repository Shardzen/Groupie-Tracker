// global.d.ts
interface Navigator {
  standalone?: boolean;
  share?: (data?: ShareData) => Promise<void>; // Added for shareContent
  setAppBadge?: (count: number) => Promise<void>; // Added for Badging API
  clearAppBadge?: () => Promise<void>; // Added for Badging API
}

interface Window {
  // Define for 'beforeinstallprompt' event
  addEventListener(type: 'beforeinstallprompt', listener: (event: BeforeInstallPromptEvent) => void): void;
  removeEventListener(type: 'beforeinstallprompt', listener: (event: BeforeInstallPromptEvent) => void): void;
}

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>;
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

// Extend ServiceWorkerRegistration for Background Sync API
interface ServiceWorkerRegistration {
  readonly sync: SyncManager;
}

interface SyncManager {
  register(tag: string): Promise<void>;
}
