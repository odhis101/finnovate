# Finnovate - Project Structure

## Overview
Banking application built with React Native (Expo), featuring a feature-based architecture with complete type safety and modern development practices.

## Tech Stack

### Core
- **React Native (Expo)**: Mobile app framework
- **TypeScript**: Type-safe JavaScript
- **React Navigation v6**: Navigation library

### State Management
- **Zustand**: Global state management (lightweight, minimal boilerplate)
- **React Query (TanStack Query)**: Server state management and caching

### Forms & Validation
- **React Hook Form**: Performant form handling
- **Zod**: Schema validation for all forms

### Styling
- **NativeWind**: Tailwind CSS for React Native
- **Composition Classes**: Predefined style combinations for DRY code

### API & Data
- **Axios**: HTTP client with interceptors
- **expo-secure-store**: Encrypted storage for sensitive data
- **expo-local-authentication**: Biometric authentication

## Folder Structure

```
finnovate/
├── src/
│   ├── features/              # Feature-based modules
│   │   ├── onboarding/        # Getting started screens
│   │   │   ├── screens/       # GetStartedScreen
│   │   │   ├── components/    # Feature-specific components
│   │   │   └── index.ts
│   │   ├── auth/              # Authentication feature
│   │   │   ├── screens/       # Login, Register, ForgotPassword
│   │   │   ├── components/
│   │   │   ├── hooks/         # useLogin, useRegister
│   │   │   ├── services/      # Auth API calls
│   │   │   └── index.ts
│   │   ├── dashboard/         # Main dashboard
│   │   ├── accounts/          # Account management
│   │   └── transactions/      # Transaction management
│   │
│   ├── shared/                # Shared across features
│   │   ├── components/        # Button, Input, Card, etc.
│   │   ├── hooks/             # useDebounce, useAsync, etc.
│   │   ├── utils/             # Formatting, validation helpers
│   │   └── providers/         # QueryProvider
│   │
│   ├── navigation/            # Navigation configuration
│   │   ├── AppNavigator.tsx   # Root navigator
│   │   ├── AuthNavigator.tsx  # Auth stack
│   │   └── types.ts           # Navigation types
│   │
│   ├── services/              # External services
│   │   ├── api/
│   │   │   ├── client.ts      # Axios instance with interceptors
│   │   │   └── types.ts       # API response types
│   │   ├── storage/
│   │   │   └── secureStorage.ts  # Secure storage wrapper
│   │   └── biometrics/
│   │       └── biometricAuth.ts  # Biometric authentication
│   │
│   ├── store/                 # Zustand stores
│   │   ├── authStore.ts       # Authentication state
│   │   └── index.ts
│   │
│   ├── theme/                 # Design system
│   │   ├── colors.ts          # Color palette (#8056A4 primary)
│   │   ├── typography.ts      # Font sizes, weights, line heights
│   │   ├── composition.ts     # Reusable NativeWind class combinations
│   │   └── index.ts
│   │
│   └── types/                 # Global TypeScript types
│       └── index.ts           # User, Account, Transaction types
│
├── App.tsx                    # App entry point with providers
├── global.css                 # Tailwind directives
├── tailwind.config.js         # Tailwind configuration
├── babel.config.js            # Babel + NativeWind config
├── tsconfig.json              # TypeScript config with path aliases
├── app.json                   # Expo configuration
└── .env.example               # Environment variables template

```

## Key Concepts

### Path Aliases
TypeScript path aliases are configured for cleaner imports:

```typescript
import { Button } from '@/shared/components';
import { useAuthStore } from '@/store';
import { colors } from '@/theme';
import { apiClient } from '@/services/api';
```

### Theme System
- **Colors**: Primary color #8056A4 with full palette (50-900)
- **Typography**: Predefined font sizes, weights, line heights
- **Composition Classes**: DRY utility combinations in `theme/composition.ts`

Example:
```typescript
<View className={compositions.container}>
  <Pressable className={compositions.buttonPrimary}>
    <Text className={compositions.buttonTextPrimary}>Sign In</Text>
  </Pressable>
</View>
```

### State Management Strategy
- **Zustand**: Client state (auth, UI state, user preferences)
- **React Query**: Server state (API data, caching, mutations)
- **expo-secure-store**: Sensitive data (tokens, biometric settings)

### API Client
Axios client with interceptors configured for:
- Automatic token attachment
- Error handling and transformation
- Request/response logging (TODO)
- Retry logic (TODO)

### Security
- All tokens stored in expo-secure-store (encrypted)
- Biometric authentication support (Touch ID, Face ID)
- No sensitive data in plain storage
- Environment variables for API URLs

## Getting Started

### 1. Install Dependencies
Already done! All packages installed.

### 2. Environment Setup
```bash
cp .env.example .env
# Update EXPO_PUBLIC_API_URL with your API endpoint
```

### 3. Run the App
```bash
npx expo start
```

### 4. Development Workflow
1. Create feature folders as needed
2. Use React Hook Form + Zod for all forms
3. Use React Query for API calls
4. Store auth state in Zustand
5. Use composition classes from theme
6. Follow TypeScript types strictly

## Next Steps

### Feature Implementation Order
1. **Auth Feature**: Login, Register, Forgot Password screens
2. **Dashboard**: Main overview with account balances
3. **Accounts**: List, details, add account
4. **Transactions**: History, details, transfers

### TODO Placeholders
The codebase has TODO comments marking areas for implementation:
- Auth token management in API client
- Navigation after auth success
- Error handling in interceptors
- Form validation schemas (use Zod)
- API endpoint implementations

## Design Decisions

### Why Zustand?
- Lightweight (1kb)
- No boilerplate
- Easy to use with hooks
- Perfect for client state

### Why React Query?
- Automatic caching
- Background refetching
- Optimistic updates
- Built-in loading/error states

### Why NativeWind?
- Familiar Tailwind syntax
- No StyleSheet objects
- Easy responsive design
- Composition classes for DRY code

### Why Feature-Based Structure?
- Scales well
- Easy to find code
- Clear ownership
- Independent features
- Better for team collaboration

## TypeScript Configuration
- Standard mode (not strict mode)
- strictNullChecks enabled
- Path aliases configured
- NativeWind types included

## Important Notes
- **No dummy data**: All placeholders are marked with TODO
- **No fake validation**: Implement Zod schemas when building forms
- **No mock API calls**: Use actual endpoints in services
- **Type safety**: Use provided types, extend as needed
- **Security first**: Always use secure storage for sensitive data
