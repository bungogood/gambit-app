import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.bungogood.gambit',
  appName: 'gambit',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
