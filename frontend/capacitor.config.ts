import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.thermosafe.app',
  appName: 'ThermoSafe',
  webDir: 'dist',
  server: {
    // In production native builds, the app loads from the bundled dist/ folder.
    // For live-reload during development, uncomment the url below:
    // url: 'http://YOUR_LOCAL_IP:5173',
    androidScheme: 'https',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#A5D2FC',
      showSpinner: true,
      spinnerColor: '#2563EB',
      androidScaleType: 'CENTER_CROP',
    },
    StatusBar: {
      style: 'LIGHT',
      backgroundColor: '#A5D2FC',
      overlaysWebView: false,
    },
    Keyboard: {
      resize: 'body',
      resizeOnFullScreen: true,
    },
  },
  ios: {
    contentInset: 'automatic',
    allowsLinkPreview: true,
    scrollEnabled: true,
  },
  android: {
    allowMixedContent: false,
    useLegacyBridge: false,
  },
};

export default config;
