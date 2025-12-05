import { useCallback } from 'react';
import type { EventData } from '../context.js';
import { useEntrolyticsContext } from '../context.js';

/**
 * Hook for tracking outbound link clicks
 *
 * Use this to track when users click links that navigate away from your site
 *
 * @example
 * ```tsx
 * function ExternalLink({ href, children }) {
 *   const trackOutboundLink = useTrackOutboundLink();
 *
 *   const handleClick = () => {
 *     trackOutboundLink(href);
 *   };
 *
 *   return (
 *     <a href={href} target="_blank" rel="noopener" onClick={handleClick}>
 *       {children}
 *     </a>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With additional tracking data
 * function PartnerLink({ partner }) {
 *   const trackOutboundLink = useTrackOutboundLink();
 *
 *   const handleClick = () => {
 *     trackOutboundLink(partner.url, {
 *       partnerId: partner.id,
 *       partnerName: partner.name,
 *       placement: 'sidebar'
 *     });
 *   };
 *
 *   return (
 *     <a href={partner.url} onClick={handleClick}>
 *       Visit {partner.name}
 *     </a>
 *   );
 * }
 * ```
 */
export function useTrackOutboundLink() {
  const { trackOutboundLink } = useEntrolyticsContext();

  return useCallback(
    (url: string, data?: EventData) => {
      trackOutboundLink(url, data);
    },
    [trackOutboundLink],
  );
}
