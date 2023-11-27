import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.goldengooseinstitute.app',
  appName: 'The Golden Goose Institute App',
  webDir: 'build',
  server: {
    androidScheme: 'https'
  }
};

export default config;
