// Minimal browser shim for @react-native-async-storage/async-storage
// Provides a Promise-based API backed by localStorage for the browser build.

const isBrowser = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const AsyncStorage = {
  async getItem(key: string | null) {
    if (!isBrowser || key === null) return null;
    try {
      const v = window.localStorage.getItem(key);
      return v;
    } catch (e) {
      return null;
    }
  },
  async setItem(key: string, value: string) {
    if (!isBrowser) return;
    try {
      window.localStorage.setItem(key, value);
    } catch (e) {
      // noop
    }
  },
  async removeItem(key: string) {
    if (!isBrowser) return;
    try {
      window.localStorage.removeItem(key);
    } catch (e) {
      // noop
    }
  },
  async clear() {
    if (!isBrowser) return;
    try {
      window.localStorage.clear();
    } catch (e) {
      // noop
    }
  },
  async getAllKeys() {
    if (!isBrowser) return [] as string[];
    try {
      return Object.keys(window.localStorage || {});
    } catch (e) {
      return [];
    }
  }
};

export default AsyncStorage;
module.exports = AsyncStorage;