import * as SecureStore from 'expo-secure-store';

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_ID: 'user_id',
  BIOMETRIC_ENABLED: 'biometric_enabled',
} as const;

export const secureStorage = {
  /**
   * Save a value to secure storage
   */
  async setItem(key: string, value: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error(`Error saving ${key} to secure storage:`, error);
      throw error;
    }
  },

  /**
   * Get a value from secure storage
   */
  async getItem(key: string): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error(`Error retrieving ${key} from secure storage:`, error);
      return null;
    }
  },

  /**
   * Remove a value from secure storage
   */
  async removeItem(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error(`Error removing ${key} from secure storage:`, error);
      throw error;
    }
  },

  /**
   * Clear all secure storage (use with caution)
   */
  async clear(): Promise<void> {
    try {
      const keys = Object.values(STORAGE_KEYS);
      await Promise.all(keys.map((key) => SecureStore.deleteItemAsync(key)));
    } catch (error) {
      console.error('Error clearing secure storage:', error);
      throw error;
    }
  },
};
