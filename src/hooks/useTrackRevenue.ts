import { useCallback } from 'react';
import type { EventData } from '../context.js';
import { useEntrolyticsContext } from '../context.js';

/**
 * Hook for tracking revenue events
 *
 * Use this to track purchases, subscriptions, and other monetization events
 *
 * @example
 * ```tsx
 * function CheckoutButton({ product }) {
 *   const trackRevenue = useTrackRevenue();
 *
 *   const handlePurchase = async () => {
 *     await processPayment();
 *     trackRevenue('purchase', product.price, 'USD', {
 *       productId: product.id,
 *       productName: product.name,
 *       quantity: 1
 *     });
 *   };
 *
 *   return <button onClick={handlePurchase}>Buy Now - ${product.price}</button>;
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Track subscription revenue
 * function SubscriptionForm() {
 *   const trackRevenue = useTrackRevenue();
 *
 *   const handleSubscribe = async (plan) => {
 *     await createSubscription(plan);
 *     trackRevenue('subscription_started', plan.monthlyPrice, 'USD', {
 *       planId: plan.id,
 *       interval: 'monthly',
 *       trial: false
 *     });
 *   };
 *
 *   return <form onSubmit={handleSubscribe}>...</form>;
 * }
 * ```
 */
export function useTrackRevenue() {
  const { trackRevenue } = useEntrolyticsContext();

  return useCallback(
    (eventName: string, revenue: number, currency = 'USD', data?: EventData) => {
      trackRevenue(eventName, revenue, currency, data);
    },
    [trackRevenue],
  );
}
