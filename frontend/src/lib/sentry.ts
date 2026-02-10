import * as Sentry from "@sentry/react";

export function initSentry() {
  const sentryDSN = import.meta.env.VITE_SENTRY_DSN;
  
  if (!sentryDSN) {
    console.warn("⚠️ Sentry DSN not configured");
    return;
  }

  Sentry.init({
    dsn: sentryDSN,
    environment: import.meta.env.MODE,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],
    
    tracesSampleRate: 1.0,
  
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    
    release: import.meta.env.VITE_APP_VERSION || "development",
    
    beforeSend(event, hint) {
      if (event.exception?.values?.[0]?.value?.includes('extension://')) {
        return null;
      }
      
      if (event.exception?.values?.[0]?.type === 'NetworkError') {
        return null;
      }
      
      return event;
    },
    
    initialScope: {
      tags: {
        app: "groupie-tracker-frontend",
      },
    },
  });

  console.log("✅ Sentry initialized");
}

export function logError(error: Error, errorInfo?: { componentStack?: string }) {
  console.error("🔥 Error caught:", error);
  
  if (errorInfo?.componentStack) {
    console.error("Component stack:", errorInfo.componentStack);
  }
  
  Sentry.captureException(error, {
    contexts: {
      react: {
        componentStack: errorInfo?.componentStack,
      },
    },
  });
}

export function setSentryUser(user: { id: number; email: string; name: string }) {
  Sentry.setUser({
    id: user.id.toString(),
    email: user.email,
    username: user.name,
  });
}

export function clearSentryUser() {
  Sentry.setUser(null);
}

export function captureEvent(message: string, level: 'info' | 'warning' | 'error' = 'info') {
  Sentry.captureMessage(message, level);
}
