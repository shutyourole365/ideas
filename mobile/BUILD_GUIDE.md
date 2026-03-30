# Mobile App Build Guide

This guide walks you through building and releasing the Unified Dashboard mobile app for iOS and Android using Expo Application Services (EAS).

## Prerequisites

1. **Node.js** 18+ and npm
2. **EAS CLI** installed globally:
   ```bash
   npm install -g eas-cli
   ```
3. **Expo Account** (free at https://expo.dev)
4. **Apple Developer Account** (for iOS) - $99/year
5. **Google Play Developer Account** (for Android) - $25 one-time

## Setup

### 1. Install Dependencies

```bash
cd mobile
npm install
```

### 2. Create Expo Account & Link Project

```bash
npx expo login
npx eas build:configure
```

This will:
- Authenticate with your Expo account
- Update `eas.json` with your project ID
- Initialize build configuration

### 3. Update app.json

The following fields are already configured:
- **iOS Bundle ID**: `com.unifieddashboard.app`
- **Android Package**: `com.unifieddashboard.app`

Change these if you have your own app identity.

## Building

### Development Build (for testing)

```bash
# Build for both platforms
npm run build:all

# Or build individually
npm run build:ios
npm run build:android
```

### Preview Build (distribution-ready, unsigned)

```bash
eas build --platform all --profile preview
```

### Production Build (signed & store-ready)

Before production builds, you need to configure signing:

#### iOS Production Build

1. Generate signing credentials:
   ```bash
   eas credentials
   ```
   - Select "iOS"
   - Choose "Production" credentials
   - Create new Apple Distribution Certificate (requires Apple Developer account)

2. Build:
   ```bash
   npm run build:ios
   ```

#### Android Production Build

1. Configure Google Play signing:
   ```bash
   eas credentials
   ```
   - Select "Android"
   - Upload existing keystore OR generate new one
   - Save credentials securely

2. Build:
   ```bash
   npm run build:android
   ```

## Submitting to App Stores

### App Store (iOS)

1. Update `eas.json` with your App Store Connect App ID
2. Submit build:
   ```bash
   eas submit --platform ios --latest
   ```

### Google Play (Android)

1. Ensure your Google Play service account is configured in `eas.json`
2. Submit build:
   ```bash
   eas submit --platform android --latest
   ```

## Features

The mobile app includes:

- **Dashboard**: View live data from 21 integrated platforms
- **Token Management**: Securely store API tokens using encrypted device storage
- **Settings**: Configure tokens per platform
- **Offline Support**: Basic caching via AsyncStorage
- **Responsive UI**: Optimized for phones and tablets

## Testing

### Local Development

```bash
# Start dev server
npm run start

# Launch on iOS simulator
npm run ios

# Launch on Android emulator
npm run android
```

### Expo Go (Device Testing)

1. Download Expo Go app on your phone
2. Run `npm run start`
3. Scan QR code with your phone

## Troubleshooting

### Build Fails with "Certificate Error"

- Re-generate credentials: `eas credentials --platform ios --reset`
- Ensure Apple Developer account is active

### Android Build Size Too Large

- Enable ProGuard: Update `eas.json` with build options
- Use store app format: `"useCompilationCache": true`

### Token Storage Issues

- The app uses `expo-secure-store` for encrypted storage
- Tokens persist across app restarts
- Clear with: `Settings > Clear App Data`

## Environment Variables

Create `.env.local` in the mobile directory:

```env
EXPO_PUBLIC_API_URL=https://your-api.com
EXPO_PUBLIC_APP_NAME=Unified Dashboard
```

(Only `EXPO_PUBLIC_*` variables are accessible in the app)

## Support

- **Expo Docs**: https://docs.expo.dev
- **EAS Docs**: https://docs.expo.dev/eas
- **React Native**: https://reactnative.dev

## Version Management

Update version in:
1. `package.json` - npm version
2. `app.json` - app version
3. `eas.json` - build settings

Then rebuild and re-submit to stores.

## Security Notes

- ✅ Tokens stored encrypted with `expo-secure-store`
- ✅ No tokens logged or transmitted insecurely
- ✅ HTTPS only for API calls
- ✅ Supports token rotation via settings

---

**Ready to build?** Start with:
```bash
cd mobile
npm install
npx eas build --platform all --profile preview
```
