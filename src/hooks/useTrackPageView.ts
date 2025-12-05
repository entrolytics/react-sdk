import { useEffect, useRef } from 'react';
import { useEntrolyticsContext } from '../context.js';

/**
 * Hook for tracking page views in SPAs
 *
 * Use this with react-router or similar routers to track page changes
 *
 * @example
 * ```tsx
 * function PageTracker() {
 *   const location = useLocation();
 *   useTrackPageView(location.pathname);
 *   return null;
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With referrer tracking
 * function PageTracker() {
 *   const location = useLocation();
 *   useTrackPageView(location.pathname, document.referrer);
 *   return null;
 * }
 * ```
 */
export function useTrackPageView(url: string, referrer?: string) {
  const { trackPageView } = useEntrolyticsContext();
  const prevUrlRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    // Only track if URL changed
    if (prevUrlRef.current === url) return;
    prevUrlRef.current = url;

    trackPageView(url, referrer);
  }, [url, referrer, trackPageView]);
}
