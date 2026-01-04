<div align="center">
  <img src="https://raw.githubusercontent.com/entrolytics/.github/main/media/entrov2.png" alt="Entrolytics" width="64" height="64">

  [![npm](https://img.shields.io/npm/v/@entrolytics/react-sdk.svg?logo=npm)](https://www.npmjs.com/package/@entrolytics/react-sdk)
  [![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![React](https://img.shields.io/badge/React-18+-61DAFB.svg?logo=react&logoColor=black)](https://react.dev/)

</div>

---

## Overview

**@entrolytics/react-sdk** is the official React SDK for Entrolytics - first-party growth analytics for the edge. Add powerful analytics to your React applications with minimal setup.

**Why use this SDK?**
- Zero-config setup with automatic environment detection
- React hooks for event tracking and user identification
- TypeScript-first with complete type definitions
- Edge-optimized with sub-50ms response times globally

> **Note:** For Next.js applications, use [@entrolytics/nextjs-sdk](https://www.npmjs.com/package/@entrolytics/nextjs-sdk) instead.

## Key Features

<table>
<tr>
<td width="50%">

### Analytics
- Automatic page view tracking
- Custom event tracking
- User identification
- Revenue tracking

</td>
<td width="50%">

### Developer Experience
- React Context + Hooks API
- `<TrackClick>` and `<OutboundLink>` components
- Tree-shakeable (~2KB gzipped)
- Full TypeScript support

</td>
</tr>
</table>

## Quick Start

<table>
<tr>
<td align="center" width="25%">
<img src="https://api.iconify.design/lucide:download.svg?color=%236366f1" width="48"><br>
<strong>1. Install</strong><br>
<code>npm i @entrolytics/react-sdk</code>
</td>
<td align="center" width="25%">
<img src="https://api.iconify.design/lucide:code.svg?color=%236366f1" width="48"><br>
<strong>2. Add Component</strong><br>
<code>&lt;Analytics /&gt;</code>
</td>
<td align="center" width="25%">
<img src="https://api.iconify.design/lucide:settings.svg?color=%236366f1" width="48"><br>
<strong>3. Configure</strong><br>
Set Website ID in <code>.env</code>
</td>
<td align="center" width="25%">
<img src="https://api.iconify.design/lucide:bar-chart-3.svg?color=%236366f1" width="48"><br>
<strong>4. Track</strong><br>
View analytics in dashboard
</td>
</tr>
</table>

## Installation

```bash
npm install @entrolytics/react-sdk
# or
pnpm add @entrolytics/react-sdk
```

```tsx
import { Analytics, useTrackEvent } from '@entrolytics/react-sdk';

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
REACT_APP_ENTROLYTICS_WEBSITE_ID=your-website-id
REACT_APP_ENTROLYTICS_HOST=https://entrolytics.click

# Vite
VITE_ENTROLYTICS_WEBSITE_ID=your-website-id
VITE_ENTROLYTICS_HOST=https://entrolytics.click
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
  host="https://entrolytics.click"  // Optional, for self-hosted
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
