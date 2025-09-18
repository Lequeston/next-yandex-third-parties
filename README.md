# Next.js Yandex Third Parties

Yandex integrations for Next.js applications. Provides easy-to-use components and utilities for integrating Yandex Metrika analytics into your Next.js project.

## Installation

```bash
npm install next-yandex-third-parties
# or
yarn add next-yandex-third-parties
# or
pnpm add next-yandex-third-parties
```

## Quick Start

### 1. Add Yandex Metrika to your app

Add the `YandexMetrika` component to your root layout or `_app.tsx`:

```tsx
import { YandexMetrika } from 'next-yandex-third-parties'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <YandexMetrika
          tagId={12345678} // Replace with your Yandex Metrika counter ID
          initParameters={{
            clickmap: true,
            trackLinks: true,
            accurateTrackBounce: true,
            webvisor: true
          }}
        />
      </body>
    </html>
  )
}
```

### 2. Track custom events

```tsx
import { sendYAEvent, reachGoal, userParams } from 'next-yandex-third-parties'

function MyComponent() {
  const handleClick = () => {
    // Track a custom event
    sendYAEvent('hit', '/virtual-page')

    // Track a goal
    reachGoal('button_click', { user_type: 'premium' })

    // Set user parameters
    userParams({ user_id: '12345', subscription: 'premium' })
  }

  return <button onClick={handleClick}>Track Event</button>
}
```

## API Reference

### YandexMetrika Component

Main component for initializing Yandex Metrika tracking.

```tsx
<YandexMetrika
  tagId={number}           // Required: Your Yandex Metrika counter ID
  initParameters={object}  // Optional: Initialization parameters
  scriptSrc={string}       // Optional: Custom script source URL
/>
```

#### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `tagId` | `number` | Yes | Your Yandex Metrika counter ID |
| `initParameters` | `InitParameters` | No | Counter initialization parameters |
| `scriptSrc` | `string` | No | Custom Yandex Metrika script URL (default: `https://mc.yandex.ru/metrika/tag.js`) |

#### InitParameters

```tsx
interface InitParameters {
  clickmap?: boolean              // Click map tracking
  trackLinks?: boolean           // Track external links
  accurateTrackBounce?: boolean  // Accurate bounce rate
  webvisor?: boolean            // Session recordings
  trackHash?: boolean           // Track hash changes
  ecommerce?: boolean | string  // E-commerce tracking
  // ... and more
}
```

### Tracking Functions

#### sendYAEvent()

Send custom events to Yandex Metrika:

```tsx
sendYAEvent('hit', url, options)
sendYAEvent('reachGoal', goalName, params, callback)
sendYAEvent('userParams', params)
// ... any other Yandex Metrika method
```

#### reachGoal()

Track goal completion:

```tsx
reachGoal('goal_name')
reachGoal('goal_name', { param1: 'value1' })
reachGoal('goal_name', { param1: 'value1' }, () => {
  console.log('Goal tracked!')
})
```

#### userParams()

Set user parameters:

```tsx
userParams({
  user_id: '12345',
  user_type: 'premium',
  age: 30
})
```

#### setUserID()

Set user ID:

```tsx
setUserID('user123')
```

#### notBounce()

Mark session as non-bounce:

```tsx
notBounce()
notBounce({ callback: () => console.log('Not bounce tracked') })
```

## Examples

### E-commerce Tracking

```tsx
import { sendYAEvent } from 'next-yandex-third-parties'

// Track purchase
sendYAEvent('reachGoal', 'purchase', {
  order_id: '12345',
  revenue: 99.99,
  currency: 'USD'
})

// Track product view
sendYAEvent('hit', '/product/123', {
  product_id: '123',
  product_name: 'Cool Product',
  category: 'Electronics'
})
```

### Page View Tracking

```tsx
import { useEffect } from 'react'
import { sendYAEvent } from 'next-yandex-third-parties'

function MyPage() {
  useEffect(() => {
    sendYAEvent('hit', window.location.pathname)
  }, [])

  return <div>My Page Content</div>
}
```

### Custom User Tracking

```tsx
import { userParams, setUserID } from 'next-yandex-third-parties'

function UserProfile({ user }) {
  useEffect(() => {
    setUserID(user.id)
    userParams({
      user_type: user.subscription,
      registration_date: user.createdAt,
      total_orders: user.ordersCount
    })
  }, [user])

  return <div>User Profile</div>
}
```

## Requirements

- Next.js 13.0.0 or higher
- React 18.2.0 or higher
- TypeScript 4.0+ (optional, but recommended)

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please read our contributing guidelines and submit pull requests to our repository.

## Development

This project uses Gulp for building and TypeScript compilation.

### Setup

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Watch for changes during development
npm run watch

# Clean build directory
npm run clean
```

### Build Scripts

- `npm run build` - Clean and compile TypeScript to JavaScript
- `npm run compile` - Compile TypeScript without cleaning
- `npm run clean` - Remove dist directory
- `npm run watch` - Watch for file changes and auto-compile

### Project Structure

```
src/
├── index.tsx              # Main exports
├── YandexMetrika.tsx      # Core component
└── types/                 # TypeScript definitions
    ├── yandexMetrika.ts   # Component props types
    ├── parameters.ts      # Parameter types
    ├── events.ts         # Event types
    ├── options.ts        # Options types
    └── ym.ts            # Yandex Metrika API types
```

## Support

- 📖 [Yandex Metrika Documentation](https://yandex.com/support/metrica/)
- 🐛 [Report Issues](https://github.com/Lequeston/next-yandex-third-parties/issues)
- 💬 [Discussions](https://github.com/Lequeston/next-yandex-third-parties/discussions)