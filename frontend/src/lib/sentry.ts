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
    
    // Performance Monitoring
    tracesSampleRate: 1.0, // 100% in production, adjust as needed
    
    // Session Replay
    replaysSessionSampleRate: 0.1, // 10% of sessions
    replaysOnErrorSampleRate: 1.0, // 100% of errors
    
    // Release tracking
    release: import.meta.env.VITE_APP_VERSION || "development",
    
    // Error filtering
    beforeSend(event, hint) {
      // Filter out errors from browser extensions
      if (event.exception?.values?.[0]?.value?.includes('extension://')) {
        return null;
      }
      
      // Filter out network errors that are expected
      if (event.exception?.values?.[0]?.type === 'NetworkError') {
        return null;
      }
      
      return event;
    },
    
    // Set user context
    initialScope: {
      tags: {
        app: "groupie-tracker-frontend",
      },
    },
  });

  console.log("✅ Sentry initialized");
}

// Error boundary helper
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

// Set user context after login
export function setSentryUser(user: { id: number; email: string; name: string }) {
  Sentry.setUser({
    id: user.id.toString(),
    email: user.email,
    username: user.name,
  });
}

// Clear user context on logout
export function clearSentryUser() {
  Sentry.setUser(null);
}

// Capture custom events
export function captureEvent(message: string, level: 'info' | 'warning' | 'error' = 'info') {
  Sentry.captureMessage(message, level);
}
