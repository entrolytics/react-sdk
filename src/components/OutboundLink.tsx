import type { AnchorHTMLAttributes, MouseEvent } from 'react';
import { useCallback } from 'react';
import { useEntrolyticsContext } from '../context.js';

export interface OutboundLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** URL to link to */
  href: string;
  /** Event name (defaults to 'outbound_link') */
  event?: string;
  /** Additional event data */
  data?: Record<string, unknown>;
}

/**
 * Link component that automatically tracks outbound link clicks
 *
 * @example
 * ```tsx
 * <OutboundLink href="https://github.com/..." event="github_click">
 *   View on GitHub
 * </OutboundLink>
 * ```
 *
 * @example
 * ```tsx
 * <OutboundLink
 *   href="https://example.com"
 *   data={{ source: 'footer', type: 'partner' }}
 * >
 *   Partner Site
 * </OutboundLink>
 * ```
 */
export function OutboundLink({
  href,
  event = 'outbound_link',
  data,
  children,
  onClick,
  ...props
}: OutboundLinkProps) {
  const { track } = useEntrolyticsContext();

  const handleClick = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      track(event, {
        url: href,
        ...data,
      });

      // Call original onClick if provided
      if (onClick) {
        onClick(e);
      }
    },
    [event, href, data, track, onClick],
  );

  return (
    <a href={href} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}
