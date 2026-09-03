import type { ReactNode } from 'react';
import type { EntrolyticsConfig } from '../context.js';
import { EntrolyticsProvider } from '../context.js';

export interface AnalyticsProps extends Omit<EntrolyticsConfig, 'websiteId' | 'clientKey'> {
  /** Website identifier from the Entrolytics dashboard. */
  websiteId: string;
  /** Public browser collection key from the Entrolytics dashboard. */
  clientKey: string;
  /** Optional children to wrap. */
  children?: ReactNode;
}

/**
 * Mount the Entrolytics browser tracker.
 *
 * Pass public configuration explicitly so each application's build system owns
 * environment-variable expansion instead of relying on package-bundler behavior.
 */
export function Analytics({ children, ...config }: AnalyticsProps) {
  return <EntrolyticsProvider {...config}>{children}</EntrolyticsProvider>;
}
