# Unified Dashboard Mobile App

React Native mobile app for managing 21 platforms from your phone.

## Features

- 📱 **iOS & Android** - Native apps for both platforms
- 🔐 **Secure Storage** - Tokens encrypted on device
- 🔍 **Search** - Quickly find any platform
- ⚡ **Real-time Sync** - See live data from all services
- 📊 **All 21 Platforms** - GitHub, Vercel, Stripe, AWS, and more

## Installation

### Prerequisites
- Node.js 16+
- Expo CLI: `npm install -g expo-cli`

### Setup

```bash
cd mobile
npm install
```

## Running

```bash
# Start development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on Web
npm run web
```

## Building for Production

### iOS
```bash
npm run build:ios
```

### Android
```bash
npm run build:android
```

### Both
```bash
npm run build:all
```

## Project Structure

```
mobile/
├── app/
│   ├── _layout.tsx      # Navigation setup
│   ├── index.tsx        # Home screen (all platforms)
│   └── settings.tsx     # Token management
├── assets/              # Icons, splash screens
├── app.json             # Expo configuration
└── package.json         # Dependencies
```

## Security

- All tokens stored using **expo-secure-store**
- Device-level encryption
- No data sent to servers (uses web API endpoints)
- Secure storage survives app updates

## Supported Platforms

1. GitHub
2. Vercel
3. Netlify
4. Stripe
5. Supabase
6. Bolt
7. Google Cloud
8. Claude
9. Datadog
10. Sentry
11. Linear
12. Auth0
13. Slack
14. SendGrid
15. AWS
16. DigitalOcean
17. MongoDB
18. Redis
19. Plausible
20. Segment
21. Vault

## Development Notes

- Uses Expo Router for navigation
- React Native for cross-platform compatibility
- TypeScript for type safety
- Secure storage for sensitive tokens

## Future Enhancements

- [ ] Notifications for alerts
- [ ] Offline mode with caching
- [ ] Biometric authentication
- [ ] Platform-specific dashboards
- [ ] Deep linking to web app
- [ ] Dark mode support
