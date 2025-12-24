import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.example.brico",
  appName: "brico",
  webDir: "dist",

  server: {
    url: "http://192.168.100.5:5173/",
    cleartext: true,
  },
};

export default config;
