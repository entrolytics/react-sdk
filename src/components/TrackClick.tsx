import type { MouseEvent, ReactElement } from 'react';
import { cloneElement, isValidElement, useCallback } from 'react';
import { useEntrolyticsContext, type EventData } from '../context.js';

export interface TrackClickProps {
  /** Event name to track */
  event: string;
  /** Additional event data */
  data?: EventData;
  /** Child element to wrap */
  children: ReactElement;
}

/**
 * Wrapper component that tracks clicks on its child element
 *
 * @example
 * ```tsx
 * <TrackClick event="cta_click" data={{ variant: 'hero' }}>
 *   <button>Get Started</button>
 * </TrackClick>
 * ```
 */
export function TrackClick({ event, data, children }: TrackClickProps) {
  const { track } = useEntrolyticsContext();

  const handleClick = useCallback(
    (e: MouseEvent) => {
      track(event, data);

      // Call original onClick if it exists
      if (isValidElement(children) && (children as any).props.onClick) {
        (children as any).props.onClick(e);
      }
    },
    [event, data, track, children],
  );

  if (!isValidElement(children)) {
    console.warn('TrackClick requires a valid React element as child');
    return children;
  }

  return cloneElement(children, {
    ...(children as any).props,
    onClick: handleClick,
  });
}
