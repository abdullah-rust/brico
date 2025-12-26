// src/services/AuthService.ts
import { SecureStoragePlugin } from "capacitor-secure-storage-plugin";

export const AuthService = {
  // Generic Set Token
  async setToken(keyName: string, token: string) {
    try {
      await SecureStoragePlugin.set({
        key: keyName,
        value: token,
      });
      return true;
    } catch (e) {
      console.error(`${keyName} save nahi ho saka`, e);
      return false;
    }
  },

  // Generic Get Token
  async getToken(keyName: string) {
    try {
      const { value } = await SecureStoragePlugin.get({ key: keyName });
      return value;
    } catch (e) {
      return null;
    }
  },

  // Generic Clear Token
  async clearToken(keyName: string) {
    try {
      await SecureStoragePlugin.remove({ key: keyName });
      return true;
    } catch (e) {
      return false;
    }
  },

  // Simple clear all tokens function
  async clearAllTokens() {
    try {
      await AuthService.clearToken("access_token");
      await AuthService.clearToken("refresh_token");
      return true;
    } catch (e) {
      return false;
    }
  },
};
