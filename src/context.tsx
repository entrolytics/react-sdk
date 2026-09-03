import type { ReactNode } from 'react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

const DEFAULT_HOST = 'https://api.entrolytics.click';
const SCRIPT_ID = 'entrolytics-script';

import type { EventPayload } from '@entrolytics/shared';

// Extract the properties type from EventPayload for easier usage
export type EventData = NonNullable<EventPayload['properties']>;

export interface EntrolyticsConfig {
  websiteId: string;
  host?: string;
  clientKey: string;
  autoTrack?: boolean;
  respectDnt?: boolean;
  domains?: string[];
  /** Custom tag for A/B testing */
  tag?: string;
  /** Strip query parameters from URLs */
  excludeSearch?: boolean;
  /** Strip hash from URLs */
  excludeHash?: boolean;
  /** Callback before sending data */
  beforeSend?: (type: string, payload: unknown) => unknown | null;
}

interface EntrolyticsInstance {
  track: (eventName?: string | object, eventData?: EventData) => void;
  identify: (data: EventData) => void;
}

export interface EntrolyticsContextValue {
  config: EntrolyticsConfig;
  isLoaded: boolean;
  isReady: boolean;
  track: (eventName: string, eventData?: EventData) => void;
  trackPageView: (url?: string, referrer?: string) => void;
  trackRevenue: (eventName: string, revenue: number, currency?: string, data?: EventData) => void;
  trackOutboundLink: (url: string, data?: EventData) => void;
  identify: (data: EventData) => void;
  identifyUser: (userId: string, traits?: EventData) => void;
  setTag: (tag: string) => void;
}

const EntrolyticsContext = createContext<EntrolyticsContextValue | null>(null);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

declare global {
  interface Window {
    entrolytics?: EntrolyticsInstance;
  }
}

export interface EntrolyticsProviderProps {
  children: ReactNode;
  websiteId: string;
  host?: string;
  clientKey: string;
  autoTrack?: boolean;
  respectDnt?: boolean;
  domains?: string[];
  tag?: string;
  excludeSearch?: boolean;
  excludeHash?: boolean;
  beforeSend?: (type: string, payload: unknown) => unknown | null;
}

export function EntrolyticsProvider({
  children,
  websiteId,
  host = DEFAULT_HOST,
  clientKey,
  autoTrack = true,
  respectDnt = false,
  domains,
  tag,
  excludeSearch = false,
  excludeHash = false,
  beforeSend,
}: EntrolyticsProviderProps) {
  const [isLoaded, setIsLoaded] = useState(
    () => typeof document !== 'undefined' && document.getElementById(SCRIPT_ID) !== null,
  );
  const tagRef = useRef(tag);

  // Inject tracking script
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    if (document.getElementById(SCRIPT_ID)) {
      return undefined;
    }

    const script = document.createElement('script');
    script.id = SCRIPT_ID;

    script.src = `${host.replace(/\/$/, '')}/script.js`;
    script.defer = true;
    script.dataset.websiteId = websiteId;
    script.dataset.clientKey = clientKey;

    if (!autoTrack) {
      script.dataset.autoTrack = 'false';
    }
    if (respectDnt) {
      script.dataset.doNotTrack = 'true';
    }
    if (domains && domains.length > 0) {
      script.dataset.domains = domains.join(',');
    }
    if (tag) {
      script.dataset.tag = tag;
    }
    if (excludeSearch) {
      script.dataset.excludeSearch = 'true';
    }
    if (excludeHash) {
      script.dataset.excludeHash = 'true';
    }

    script.onload = () => {
      setIsLoaded(true);
    };

    document.head.appendChild(script);

    return () => {
      const existingScript = document.getElementById(SCRIPT_ID);
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [websiteId, clientKey, host, autoTrack, respectDnt, domains, tag, excludeSearch, excludeHash]);

  const waitForTracker = useCallback((callback: () => void) => {
    if (typeof window === 'undefined') return;

    const tryExecute = () => {
      if (window.entrolytics) {
        callback();
      } else {
        setTimeout(tryExecute, 100);
      }
    };

    tryExecute();
  }, []);

  const track = useCallback(
    (eventName: string, eventData?: EventData) => {
      waitForTracker(() => {
        let payload: unknown = { name: eventName, data: eventData };

        if (beforeSend) {
          payload = beforeSend('event', payload);
          if (payload === null) return;
        }

        const outgoingName =
          isRecord(payload) && typeof payload.name === 'string' ? payload.name : eventName;
        const outgoingData = isRecord(payload) && isRecord(payload.data) ? payload.data : eventData;
        window.entrolytics?.track(
          outgoingName,
          tagRef.current ? { ...outgoingData, tag: tagRef.current } : outgoingData,
        );
      });
    },
    [waitForTracker, beforeSend],
  );

  const trackPageView = useCallback(
    (url?: string, referrer?: string) => {
      waitForTracker(() => {
        const payload: Record<string, unknown> = {};
        if (url) payload.url = url;
        if (referrer) payload.referrer = referrer;
        if (tagRef.current) payload.tag = tagRef.current;

        window.entrolytics?.track(payload);
      });
    },
    [waitForTracker],
  );

  const trackRevenue = useCallback(
    (eventName: string, revenue: number, currency = 'USD', data?: EventData) => {
      waitForTracker(() => {
        const eventData: EventData = {
          ...data,
          revenue,
          currency,
        };

        if (tagRef.current) {
          eventData.tag = tagRef.current;
        }

        window.entrolytics?.track(eventName, eventData);
      });
    },
    [waitForTracker],
  );

  const trackOutboundLink = useCallback(
    (url: string, data?: EventData) => {
      waitForTracker(() => {
        window.entrolytics?.track('outbound-link-click', {
          ...data,
          url,
        });
      });
    },
    [waitForTracker],
  );

  const identify = useCallback(
    (data: EventData) => {
      waitForTracker(() => {
        window.entrolytics?.identify(data);
      });
    },
    [waitForTracker],
  );

  const identifyUser = useCallback(
    (userId: string, traits?: EventData) => {
      waitForTracker(() => {
        window.entrolytics?.identify({ id: userId, ...traits });
      });
    },
    [waitForTracker],
  );

  const setTag = useCallback((newTag: string) => {
    tagRef.current = newTag;
  }, []);

  const value = useMemo<EntrolyticsContextValue>(
    () => ({
      config: {
        websiteId,
        host,
        clientKey,
        autoTrack,
        respectDnt,
        domains,
        tag,
        excludeSearch,
        excludeHash,
        beforeSend,
      },
      isLoaded,
      isReady: isLoaded,
      track,
      trackPageView,
      trackRevenue,
      trackOutboundLink,
      identify,
      identifyUser,
      setTag,
    }),
    [
      websiteId,
      host,
      clientKey,
      autoTrack,
      respectDnt,
      domains,
      tag,
      excludeSearch,
      excludeHash,
      beforeSend,
      isLoaded,
      track,
      trackPageView,
      trackRevenue,
      trackOutboundLink,
      identify,
      identifyUser,
      setTag,
    ],
  );

  return <EntrolyticsContext.Provider value={value}>{children}</EntrolyticsContext.Provider>;
}

export function useEntrolyticsContext() {
  const context = useContext(EntrolyticsContext);
  if (!context) {
    throw new Error('useEntrolyticsContext must be used within EntrolyticsProvider');
  }
  return context;
}
