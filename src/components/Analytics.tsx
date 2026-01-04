import type { ReactNode } from 'react';
import type { EntrolyticsConfig } from '../context.js';
import { EntrolyticsProvider } from '../context.js';

export interface AnalyticsProps extends Partial<EntrolyticsConfig> {
  /**
   * Website ID - defaults to REACT_APP_ENTROLYTICS_WEBSITE_ID or VITE_ENTROLYTICS_WEBSITE_ID
   */
  websiteId?: string;
  /**
   * API host - defaults to REACT_APP_ENTROLYTICS_HOST or VITE_ENTROLYTICS_HOST
   */
  host?: string;
  /**
   * Optional children to wrap (rarely needed)
   */
  children?: ReactNode;
}

/**
 * Zero-config Analytics component that automatically reads from environment variables.
 *
 * @example
 * ```tsx
 * // For Create React App
 * import { Analytics } from '@entrolytics/react';
 *
 * function App() {
 *   return (
 *     <>
 *       <YourApp />
 *       <Analytics />
 *     </>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // For Vite
 * import { Analytics } from '@entrolytics/react';
 *
 * function App() {
 *   return (
 *     <>
 *       <YourApp />
 *       <Analytics />
 *     </>
 *   );
 * }
 * ```
 *
 * Environment variables:
 * - Create React App: REACT_APP_ENTROLYTICS_WEBSITE_ID, REACT_APP_ENTROLYTICS_HOST
 * - Vite: VITE_ENTROLYTICS_WEBSITE_ID, VITE_ENTROLYTICS_HOST
 */
export function Analytics({ websiteId, host, children, ...config }: AnalyticsProps) {
  // Support both Create React App (REACT_APP_) and Vite (VITE_) env vars
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const globalThis = typeof window !== 'undefined' ? window : ({} as any);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const processEnv = (globalThis as any).process?.env || {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const importMetaEnv = (import.meta as any).env || {};

  const finalWebsiteId =
    websiteId ||
    processEnv.REACT_APP_ENTROLYTICS_WEBSITE_ID ||
    importMetaEnv.VITE_ENTROLYTICS_WEBSITE_ID;

  const finalHost =
    host || processEnv.REACT_APP_ENTROLYTICS_HOST || importMetaEnv.VITE_ENTROLYTICS_HOST;

  // Show helpful warnings in development
  const isDev = processEnv.NODE_ENV === 'development' || importMetaEnv.DEV;

  if (isDev && !finalWebsiteId) {
    console.warn(
      '[Entrolytics] Missing environment variable. Add one of the following to your .env file:\n' +
        '  - Create React App: REACT_APP_ENTROLYTICS_WEBSITE_ID\n' +
        '  - Vite: VITE_ENTROLYTICS_WEBSITE_ID\n' +
        'Or pass websiteId as a prop.',
    );
    return null;
  }

  // In production, silently skip if no website ID
  if (!finalWebsiteId) {
    return null;
  }

  return (
    <EntrolyticsProvider websiteId={finalWebsiteId} host={finalHost} {...config}>
      {children}
    </EntrolyticsProvider>
  );
}
