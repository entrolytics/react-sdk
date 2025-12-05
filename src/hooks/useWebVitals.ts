import { useCallback, useEffect, useRef } from 'react';
import { useEntrolyticsContext } from '../context.js';

export type WebVitalMetric = 'LCP' | 'INP' | 'CLS' | 'TTFB' | 'FCP';
export type WebVitalRating = 'good' | 'needs-improvement' | 'poor';
export type NavigationType =
  | 'navigate'
  | 'reload'
  | 'back-forward'
  | 'back-forward-cache'
  | 'prerender'
  | 'restore';

export interface WebVitalData {
  /** Metric name (LCP, INP, CLS, TTFB, FCP) */
  metric: WebVitalMetric;
  /** Metric value in milliseconds (or unitless for CLS) */
  value: number;
  /** Performance rating */
  rating: WebVitalRating;
  /** Delta from previous measurement */
  delta?: number;
  /** Unique metric ID for deduplication */
  id?: string;
  /** Navigation type */
  navigationType?: NavigationType;
  /** Attribution data from web-vitals library */
  attribution?: Record<string, unknown>;
}

export interface UseWebVitalsOptions {
  /** Auto-initialize web-vitals library integration (default: true) */
  autoInit?: boolean;
  /** Report all metrics, not just when they change (default: false) */
  reportAllChanges?: boolean;
}

/**
 * Hook for tracking Web Vitals metrics
 *
 * @example
 * // Auto-integration with web-vitals library
 * import { useWebVitals } from '@entrolytics/react';
 *
 * function App() {
 *   useWebVitals(); // Auto-tracks all Core Web Vitals
 *   return <div>...</div>;
 * }
 *
 * @example
 * // Manual tracking
 * import { useWebVitals } from '@entrolytics/react';
 * import { onLCP, onINP, onCLS } from 'web-vitals';
 *
 * function App() {
 *   const { trackVital } = useWebVitals({ autoInit: false });
 *
 *   useEffect(() => {
 *     onLCP((metric) => trackVital({
 *       metric: 'LCP',
 *       value: metric.value,
 *       rating: metric.rating
 *     }));
 *   }, [trackVital]);
 *
 *   return <div>...</div>;
 * }
 */
export function useWebVitals(options: UseWebVitalsOptions = {}) {
  const { autoInit = true, reportAllChanges = false } = options;
  const { config, isReady } = useEntrolyticsContext();
  const initialized = useRef(false);

  const trackVital = useCallback(
    async (data: WebVitalData) => {
      if (typeof window === 'undefined') return;

      const host = config.host || 'https://ng.entrolytics.click';
      const payload = {
        website: config.websiteId,
        metric: data.metric,
        value: data.value,
        rating: data.rating,
        delta: data.delta,
        id: data.id,
        navigationType: data.navigationType,
        attribution: data.attribution,
        url: window.location.href,
        path: window.location.pathname,
      };

      try {
        await fetch(`${host}/api/collect/vitals`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          keepalive: true,
        });
      } catch (err) {
        console.error('[Entrolytics] Failed to track vital:', err);
      }
    },
    [config.websiteId, config.host],
  );

  // Auto-initialize web-vitals integration
  useEffect(() => {
    if (!autoInit || !isReady || initialized.current) return;
    if (typeof window === 'undefined') return;

    initialized.current = true;

    // Dynamic import web-vitals if available
    import('web-vitals')
      .then(({ onCLS, onINP, onLCP, onFCP, onTTFB }) => {
        const reportOpts = { reportAllChanges };

        onLCP((metric) => {
          trackVital({
            metric: 'LCP',
            value: metric.value,
            rating: metric.rating,
            delta: metric.delta,
            id: metric.id,
            navigationType: metric.navigationType as NavigationType,
            attribution: metric.attribution as Record<string, unknown>,
          });
        }, reportOpts);

        onINP((metric) => {
          trackVital({
            metric: 'INP',
            value: metric.value,
            rating: metric.rating,
            delta: metric.delta,
            id: metric.id,
            navigationType: metric.navigationType as NavigationType,
            attribution: metric.attribution as Record<string, unknown>,
          });
        }, reportOpts);

        onCLS((metric) => {
          trackVital({
            metric: 'CLS',
            value: metric.value,
            rating: metric.rating,
            delta: metric.delta,
            id: metric.id,
            navigationType: metric.navigationType as NavigationType,
            attribution: metric.attribution as Record<string, unknown>,
          });
        }, reportOpts);

        onFCP((metric) => {
          trackVital({
            metric: 'FCP',
            value: metric.value,
            rating: metric.rating,
            delta: metric.delta,
            id: metric.id,
            navigationType: metric.navigationType as NavigationType,
            attribution: metric.attribution as Record<string, unknown>,
          });
        }, reportOpts);

        onTTFB((metric) => {
          trackVital({
            metric: 'TTFB',
            value: metric.value,
            rating: metric.rating,
            delta: metric.delta,
            id: metric.id,
            navigationType: metric.navigationType as NavigationType,
            attribution: metric.attribution as Record<string, unknown>,
          });
        }, reportOpts);
      })
      .catch(() => {
        // web-vitals not installed, that's ok - user can track manually
        console.debug('[Entrolytics] web-vitals not found. Use trackVital() for manual tracking.');
      });
  }, [autoInit, isReady, trackVital, reportAllChanges]);

  return { trackVital };
}
