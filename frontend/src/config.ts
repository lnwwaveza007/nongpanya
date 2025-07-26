// Configuration file for environment variables
// Supports LOCAL, DEV, and PROD environments

type Environment = 'LOCAL' | 'DEV' | 'PROD';

const DEFAULT_ENV: Environment = 'DEV';
const SELECTED_ENV: Environment = (import.meta.env.VITE_SELECTED_ENV as Environment) || DEFAULT_ENV;

// Environment-specific configurations
const environmentConfigs = {
  LOCAL: {
    mqtt: {
      endpoint: "ws://localhost:9001",
      username: "mqttuser",
      password: "1234"
    },
    api: {
      url: "http://localhost:3000/api"
    },
    app: {
      url: "http://localhost:5173"
    }
  },
  DEV: {
    mqtt: {
      endpoint: "ws://nongpanya.sit.kmutt.ac.th:9001/mqtt",
      username: "mqttuser", 
      password: "nongpanya"
    },
    api: {
      url: "http://localhost:3000/api"
    },
    app: {
      url: "http://localhost:5173"
    }
  },
  PROD: {
    mqtt: {
      endpoint: "wss://nongpanya.sit.kmutt.ac.th:9001/mqtt",
      username: "mqttuser",
      password: "nongpanya"
    },
    api: {
      url: "https://nongpanya.sit.kmutt.ac.th/api"
    },
    app: {
      url: "https://nongpanya.sit.kmutt.ac.th"
    }
  }
} as const;

// Get configuration for current environment
export const config = environmentConfigs[SELECTED_ENV];

// Export environment information
export const currentEnvironment = SELECTED_ENV;
export const isDevelopment = SELECTED_ENV === 'LOCAL';
export const isProduction = SELECTED_ENV === 'PROD';

// Type definitions for better TypeScript support
export type Config = typeof config;
export type { Environment };