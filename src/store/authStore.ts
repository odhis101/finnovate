import { create } from 'zustand';
import { secureStorage, STORAGE_KEYS } from '../services/storage/secureStorage';
import type { User } from '../services/api/types';

interface AuthState {
  token: string | null;
  user: User | null;
  lastLogin: string | null;
  isAuthenticated: boolean;
  lastKnownFirstname: string | null;
  // Persisted across sessions — set after onboarding completes
  storedUsername: string | null;
  hasCompletedOnboarding: boolean;

  setAuth: (token: string, user: User, lastLogin: string) => Promise<void>;
  clearAuth: () => Promise<void>;
  hydrateFromStorage: () => Promise<void>;
  setStoredUsername: (username: string) => Promise<void>;
  setHasCompletedOnboarding: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  lastLogin: null,
  isAuthenticated: false,
  lastKnownFirstname: null,
  storedUsername: null,
  hasCompletedOnboarding: false,

  setAuth: async (token, user, lastLogin) => {
    await Promise.all([
      secureStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token),
      secureStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user)),
      secureStorage.setItem(STORAGE_KEYS.LAST_LOGIN, lastLogin),
      secureStorage.setItem(STORAGE_KEYS.LAST_KNOWN_NAME, user.firstname),
    ]);
    set({ token, user, lastLogin, isAuthenticated: true, lastKnownFirstname: user.firstname });
  },

  clearAuth: async () => {
    // Intentionally keep LAST_KNOWN_NAME so greeting persists across sessions
    await Promise.all([
      secureStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN),
      secureStorage.removeItem(STORAGE_KEYS.USER_DATA),
      secureStorage.removeItem(STORAGE_KEYS.LAST_LOGIN),
    ]);
    set({ token: null, user: null, lastLogin: null, isAuthenticated: false });
  },

  hydrateFromStorage: async () => {
    const [token, userStr, lastLogin, lastKnownFirstname, storedUsername, hasCompletedOnboardingStr] =
      await Promise.all([
        secureStorage.getItem(STORAGE_KEYS.AUTH_TOKEN),
        secureStorage.getItem(STORAGE_KEYS.USER_DATA),
        secureStorage.getItem(STORAGE_KEYS.LAST_LOGIN),
        secureStorage.getItem(STORAGE_KEYS.LAST_KNOWN_NAME),
        secureStorage.getItem(STORAGE_KEYS.STORED_USERNAME),
        secureStorage.getItem(STORAGE_KEYS.HAS_COMPLETED_ONBOARDING),
      ]);

    const hasCompletedOnboarding = hasCompletedOnboardingStr === 'true';

    // Never auto-restore isAuthenticated — user must re-enter PIN on every app open.
    // Only restore persistent profile data so the greeting and org picker work.
    set({
      token: null,
      user: null,
      lastLogin: null,
      isAuthenticated: false,
      lastKnownFirstname: lastKnownFirstname ?? null,
      storedUsername,
      hasCompletedOnboarding,
    });
  },

  setStoredUsername: async (username) => {
    await secureStorage.setItem(STORAGE_KEYS.STORED_USERNAME, username);
    set({ storedUsername: username });
  },

  setHasCompletedOnboarding: async () => {
    await secureStorage.setItem(STORAGE_KEYS.HAS_COMPLETED_ONBOARDING, 'true');
    set({ hasCompletedOnboarding: true });
  },
}));
