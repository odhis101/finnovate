# Finnovate

A modern banking application built with React Native and Expo.

## Quick Start

```bash
# Start the development server
npx expo start

# Run on iOS
npx expo start --ios

# Run on Android
npx expo start --android
```

## Environment Setup

1. Copy the environment template:
```bash
cp .env.example .env
```

2. Update the `.env` file with your API URL:
```
EXPO_PUBLIC_API_URL=https://your-api-url.com
```

## Project Structure

See [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) for detailed documentation of the architecture, folder structure, and development guidelines.

## Tech Stack

- **React Native (Expo)** - Mobile framework
- **TypeScript** - Type safety
- **Zustand** - Global state management
- **React Query** - Server state & caching
- **React Navigation v6** - Navigation
- **NativeWind** - Tailwind CSS for React Native
- **React Hook Form + Zod** - Form handling & validation
- **Axios** - HTTP client
- **expo-secure-store** - Encrypted storage
- **expo-local-authentication** - Biometric auth

## Development

### Running the App
The app will start on the "Get Started" onboarding screen with your primary color #8056A4.

### Next Steps
1. Implement authentication screens (Login, Register)
2. Build dashboard with account overview
3. Add account management features
4. Implement transaction functionality

### Code Organization
- **Features**: Self-contained modules in `src/features/`
- **Shared**: Reusable components in `src/shared/`
- **Services**: API, storage, biometrics in `src/services/`
- **Navigation**: Route configuration in `src/navigation/`
- **Theme**: Colors, typography, compositions in `src/theme/`

## Available Scripts

```bash
# Start development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run on web
npm run web

# Type checking
npx tsc --noEmit

# Prebuild for native modules (when needed)
npx expo prebuild
```

## Important Notes

- All sensitive data uses `expo-secure-store` (encrypted)
- Forms use React Hook Form + Zod validation
- API calls use React Query for caching
- TypeScript path aliases configured (@/, @features/, etc.)
- No dummy data - all marked with TODO comments

## Security

- ✅ Encrypted secure storage for tokens
- ✅ Biometric authentication support
- ✅ Environment variables for configuration
- ✅ Type-safe API client with interceptors

---

Built with feature-based architecture for scalability and maintainability.
