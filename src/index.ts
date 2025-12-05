// Components
export type { AnalyticsProps } from './components/Analytics.js';
export { Analytics } from './components/Analytics.js';
export type { OutboundLinkProps } from './components/OutboundLink.js';
export { OutboundLink } from './components/OutboundLink.js';
export type { TrackClickProps } from './components/TrackClick.js';
export { TrackClick } from './components/TrackClick.js';
// TrackEvent is an alias for TrackClick
export type { TrackEventProps } from './components/TrackEvent.js';
export { TrackEvent } from './components/TrackEvent.js';

// Provider & Context
export type {
  EntrolyticsConfig,
  EntrolyticsContextValue,
  EntrolyticsProviderProps,
  EventData,
} from './context.js';
export { EntrolyticsProvider, useEntrolyticsContext } from './context.js';

// Core Hooks
export { useEntrolytics } from './hooks/useEntrolytics.js';
export { useIdentify } from './hooks/useIdentify.js';
export { useTrackEvent } from './hooks/useTrackEvent.js';
export { useTrackOutboundLink } from './hooks/useTrackOutboundLink.js';
export { useTrackPageView } from './hooks/useTrackPageView.js';
export { useTrackRevenue } from './hooks/useTrackRevenue.js';

// Phase 2: Web Vitals & Form Tracking
export type {
  WebVitalMetric,
  WebVitalRating,
  NavigationType,
  WebVitalData,
  UseWebVitalsOptions,
} from './hooks/useWebVitals.js';
export { useWebVitals } from './hooks/useWebVitals.js';

export type {
  FormEventType,
  FormEventData,
  UseFormTrackingOptions,
} from './hooks/useFormTracking.js';
export { useFormTracking } from './hooks/useFormTracking.js';
