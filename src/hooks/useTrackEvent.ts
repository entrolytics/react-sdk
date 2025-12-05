import { useCallback } from 'react';
import type { EventData } from '../context.js';
import { useEntrolyticsContext } from '../context.js';

/**
 * Hook for tracking custom events
 *
 * @example
 * ```tsx
 * function CheckoutButton() {
 *   const trackEvent = useTrackEvent();
 *
 *   const handlePurchase = () => {
 *     trackEvent('purchase', { productId: 'abc123' });
 *   };
 *
 *   return <button onClick={handlePurchase}>Buy Now</button>;
 * }
 * ```
 */
export function useTrackEvent() {
  const { track } = useEntrolyticsContext();

  return useCallback(
    (eventName: string, eventData?: EventData) => {
      track(eventName, eventData);
    },
    [track],
  );
}
