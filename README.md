# @entrolytics/react

React SDK for [Entrolytics](https://ng.entrolytics.click) - First-party growth analytics for the edge.

> **Note:** For Next.js applications, use [@entrolytics/nextjs](https://www.npmjs.com/package/@entrolytics/nextjs) instead.

## Installation

```bash
npm install @entrolytics/react
# or
pnpm add @entrolytics/react
```

## Quick Start

```tsx
import { Analytics, useTrackEvent } from '@entrolytics/react';

function App() {
  return (
    <>
      <YourApp />
      <Analytics />
    </>
  );
}

function CheckoutButton() {
  const trackEvent = useTrackEvent();

  return (
    <button onClick={() => trackEvent('checkout_start', { cart_value: 99.99 })}>
      Checkout
    </button>
  );
}
```

The `<Analytics />` component automatically reads from your `.env` file:

```bash
# Create React App
REACT_APP_ENTROLYTICS_NG_WEBSITE_ID=your-website-id
REACT_APP_ENTROLYTICS_HOST=https://ng.entrolytics.click

# Vite
VITE_ENTROLYTICS_NG_WEBSITE_ID=your-website-id
VITE_ENTROLYTICS_HOST=https://ng.entrolytics.click
```

## API Reference

### Analytics

Zero-config component (recommended):

```tsx
<Analytics />
```

With optional configuration:

```tsx
<Analytics
  autoTrack={true}
  respectDnt={false}
  domains={['example.com']}
  useEdgeRuntime={true}  // Use edge-optimized endpoints (default: true)
/>
```

The `<Analytics />` component supports the same props as `<EntrolyticsProvider>`. See [Runtime Configuration](#runtime-configuration) below for details on the `useEdgeRuntime` option.

### EntrolyticsProvider

Wrap your app with the provider to enable analytics.

```tsx
<EntrolyticsProvider
  websiteId="your-website-id"
  host="https://ng.entrolytics.click"  // Optional, for self-hosted
  autoTrack={true}                   // Auto-track page views (default: true)
  respectDnt={false}                 // Respect Do Not Track (default: false)
  domains={['example.com']}          // Cross-domain tracking (optional)
  useEdgeRuntime={true}              // Use edge-optimized endpoints (default: true)
>
  <App />
</EntrolyticsProvider>
```

#### Runtime Configuration

The `useEdgeRuntime` prop controls which tracking script is loaded:

**Edge Runtime (default)** - Optimized for speed and global distribution:
```tsx
<EntrolyticsProvider
  websiteId="your-website-id"
  useEdgeRuntime={true} // or omit (default)
>
  <App />
</EntrolyticsProvider>
```

- **Latency**: Sub-50ms response times globally
- **Best for**: Production apps, globally distributed users
- **Endpoint**: Uses `/api/send-native` for edge-to-edge communication

**Node.js Runtime** - Full-featured with advanced capabilities:
```tsx
<EntrolyticsProvider
  websiteId="your-website-id"
  useEdgeRuntime={false}
>
  <App />
</EntrolyticsProvider>
```

- **Features**: ClickHouse export, MaxMind GeoIP (city-level accuracy)
- **Best for**: Self-hosted deployments, advanced analytics requirements
- **Endpoint**: Uses `/api/send` for Node.js runtime

**When to use Node.js runtime**:
- Self-hosted deployments without edge runtime support
- Applications requiring ClickHouse data export
- Need for advanced geo-targeting with MaxMind
- Custom server-side analytics workflows

### Hooks

#### useTrackEvent

Track custom events.

```tsx
const trackEvent = useTrackEvent();

trackEvent('button_click', {
  variant: 'primary',
  location: 'hero'
});
```

#### useTrackPageView

Track page views in SPAs (use with react-router).

```tsx
import { useLocation } from 'react-router-dom';
import { useTrackPageView } from '@entrolytics/react';

function PageTracker() {
  const location = useLocation();
  useTrackPageView(location.pathname);
  return null;
}
```

#### useIdentify

Identify users for logged-in tracking.

```tsx
const identify = useIdentify();

useEffect(() => {
  if (user) {
    identify(user.id, {
      email: user.email,
      plan: user.subscription
    });
  }
}, [user, identify]);
```

#### useEntrolytics

Access all Entrolytics functionality.

```tsx
const { track, identify, config, isLoaded } = useEntrolytics();
```

### Components

#### TrackClick

Wrapper component that tracks clicks on its child.

```tsx
import { TrackClick } from '@entrolytics/react';

<TrackClick event="cta_click" data={{ variant: 'hero' }}>
  <button>Get Started</button>
</TrackClick>
```

#### OutboundLink

Link component that automatically tracks outbound clicks.

```tsx
import { OutboundLink } from '@entrolytics/react';

<OutboundLink href="https://github.com/..." event="github_click">
  View on GitHub
</OutboundLink>
```

## TypeScript

Full TypeScript support with exported types:

```tsx
import type {
  EntrolyticsConfig,
  EntrolyticsProviderProps,
  TrackClickProps,
  OutboundLinkProps
} from '@entrolytics/react';
```

## Bundle Size

This package is tree-shakeable and optimized for minimal bundle size:

- Provider + useTrackEvent: ~1.2KB gzipped
- Full package: ~2KB gzipped

## License

MIT License - see [LICENSE](LICENSE) file for details.
