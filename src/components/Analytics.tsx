import type { ReactNode } from 'react';
import type { EntrolyticsConfig } from '../context.js';
import { EntrolyticsProvider } from '../context.js';

export interface AnalyticsProps extends Partial<EntrolyticsConfig> {
  /**
   * Website ID - defaults to VITE_ENTROLYTICS_WEBSITE_ID
   */
  websiteId?: string;
  /**
   * API host - defaults to VITE_ENTROLYTICS_HOST
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
 * - Vite: VITE_ENTROLYTICS_WEBSITE_ID, VITE_ENTROLYTICS_HOST
 */
export function Analytics({ websiteId, host, children, ...config }: AnalyticsProps) {
  type ImportMetaEnv = Record<string, string | boolean | undefined>;
  type GlobalWithProcess = typeof globalThis & {
    process?: {
      env?: Record<string, string | undefined>;
    };
  };

  const globalRef =
    typeof window !== 'undefined'
      ? (window as GlobalWithProcess)
      : (globalThis as GlobalWithProcess);
  const processEnv = globalRef.process?.env ?? {};
  const importMetaEnv = (import.meta as ImportMeta & { env?: ImportMetaEnv }).env ?? {};

  const viteWebsiteId =
    typeof importMetaEnv.VITE_ENTROLYTICS_WEBSITE_ID === 'string'
      ? importMetaEnv.VITE_ENTROLYTICS_WEBSITE_ID
      : undefined;
  const viteHost =
    typeof importMetaEnv.VITE_ENTROLYTICS_HOST === 'string'
      ? importMetaEnv.VITE_ENTROLYTICS_HOST
      : undefined;

  const finalWebsiteId = websiteId || viteWebsiteId;
  const finalHost = host || viteHost;

  // Show helpful warnings in development
  const isDev = processEnv.NODE_ENV === 'development' || importMetaEnv.DEV === true;

  if (isDev && !finalWebsiteId) {
    console.warn(
      '[Entrolytics] Missing environment variable. Add VITE_ENTROLYTICS_WEBSITE_ID to your .env file\n' +
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
