import type { MouseEvent, ReactElement } from 'react';
import { cloneElement, isValidElement, useCallback } from 'react';
import { type EventData, useEntrolyticsContext } from '../context.js';

type ClickHandler = (event: MouseEvent) => void;
type ClickableElementProps = { onClick?: ClickHandler };

function isClickableElement(element: ReactElement): element is ReactElement<ClickableElementProps> {
  return isValidElement<ClickableElementProps>(element);
}

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
      if (isClickableElement(children)) {
        const onClick = children.props.onClick;
        if (onClick) {
          onClick(e);
        }
      }
    },
    [event, data, track, children],
  );

  if (!isClickableElement(children)) {
    console.warn('TrackClick requires a valid React element as child');
    return children;
  }

  return cloneElement(children, {
    onClick: handleClick,
  });
}
