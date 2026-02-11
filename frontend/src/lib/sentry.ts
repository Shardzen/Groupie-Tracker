import * as Sentry from '@sentry/react';
import {
  createRoutesFromChildren,
  matchRoutes,
  useLocation,
  useNavigationType,
} from 'react-router-dom';
import { useEffect } from 'react';

export const initSentry = () => {
  if (import.meta.env.MODE === 'production' && import.meta.env.VITE_SENTRY_DSN) {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      environment: import.meta.env.MODE,
      release: `groupietracker-frontend@${import.meta.env.VITE_APP_VERSION || '2.0.0'}`,

      integrations: [
        Sentry.reactRouterV6BrowserTracingIntegration({
          useEffect,
          useLocation,
          useNavigationType,
          createRoutesFromChildren,
          matchRoutes,
        }),

        Sentry.breadcrumbsIntegration({
          console: true,
          dom: true,
          fetch: true,
          history: true,
          sentry: true,
          xhr: true,
        }),

        Sentry.httpClientIntegration({
          failedRequestStatusCodes: [[400, 599]],
        }),
      ],

      tracesSampleRate: import.meta.env.MODE === 'production' ? 0.1 : 1.0,
      tracePropagationTargets: [
        'localhost',
        /^https:\/\/groupietracker-api\.westeurope\.azurecontainer\.io/,
        /^https:\/\/api\.groupietracker\.fr/,
      ],

      ignoreErrors: [
        'top.GLOBALS',
        'originalCreateNotification',
        'canvas.contentDocument',
        'MyApp_RemoveAllHighlights',
        'atomicFindClose',
        'NetworkError',
        'Network request failed',
        'Failed to fetch',
        'Load failed',
        'AbortError',
        'The user aborted a request',
        /stripe/i,
        'ResizeObserver loop limit exceeded',
        'ResizeObserver loop completed with undelivered notifications',
      ],

      denyUrls: [
        /extensions\//i,
        /^chrome:\/\//i,
        /^moz-extension:\/\//i,
        /^safari-extension:\/\//i,
        /google-analytics\.com/i,
        /googletagmanager\.com/i,
        /doubleclick\.net/i,
      ],

      beforeSend(event, hint) {
        if (event.request) {
          if (event.request.headers) {
            delete event.request.headers['Authorization'];
            delete event.request.headers['Cookie'];
          }

          if (event.request.url) {
            event.request.url = event.request.url.replace(
              /([?&])(token|password|api_key|secret)=[^&]*/gi,
              '$1$2=REDACTED'
            );
          }
        }

        if (hint.originalException instanceof Error) {
          const message = hint.originalException.message;
          if (message.includes('stripe') || message.includes('payment')) {
            event.tags = {
              ...event.tags,
              payment_error: true,
            };
          }
        }

        if (event.exception?.values?.[0]?.value?.includes('404')) {
          const url = event.request?.url || '';
          if (url.includes('/api/artists/') || url.includes('/api/concerts/')) {
            return null;
          }
        }

        return event;
      },

      beforeBreadcrumb(breadcrumb) {
        if (breadcrumb.category === 'console' && breadcrumb.level === 'log') {
          if (import.meta.env.MODE === 'production') {
            return null;
          }
        }

        if (breadcrumb.category === 'fetch') {
          if (breadcrumb.data?.url) {
            breadcrumb.data.url = breadcrumb.data.url.replace(
              /([?&])(email|phone|name)=[^&]*/gi,
              '$1$2=REDACTED'
            );
          }
        }

        return breadcrumb;
      },

      initialScope: {
        tags: {
          app: 'groupietracker-frontend',
          platform: 'web',
        },
      },
    });

    console.log('✅ Sentry initialized successfully');
  } else {
    console.warn('⚠️ Sentry not initialized (missing DSN or dev mode)');
  }
};

export const setSentryUser = (user: { id: number; email: string; name?: string } | null) => {
  if (user) {
    Sentry.setUser({
      id: user.id.toString(),
      email: user.email,
      username: user.name,
    });
  } else {
    Sentry.setUser(null);
  }
};

export const setSentryContext = (name: string, context: Record<string, any>) => {
  Sentry.setContext(name, context);
};

export const logSentryError = (error: Error, level: Sentry.SeverityLevel = 'error') => {
  Sentry.captureException(error, { level });
};

export const logSentryMessage = (message: string, level: Sentry.SeverityLevel = 'info') => {
  Sentry.captureMessage(message, level);
};

export const startSentryTransaction = (name: string, op: string = 'custom') => {
  return Sentry.startTransaction({ name, op });
};

export default {
  initSentry,
  setSentryUser,
  setSentryContext,
  logSentryError,
  logSentryMessage,
  startSentryTransaction,
};
