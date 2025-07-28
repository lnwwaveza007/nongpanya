// Configuration file for environment variables
// Supports LOCAL, DEV, and PROD environments

type Environment = 'LOCAL' | 'DEV' | 'PROD';

const DEFAULT_ENV: Environment = 'DEV';
const SELECTED_ENV: Environment = (import.meta.env.VITE_SELECTED_ENV as Environment) || DEFAULT_ENV;

// Environment-specific configurations
const environmentConfigs = {
  LOCAL: {
    websocket: {
      endpoint: "ws://localhost:3001"
    },
    api: {
      url: "http://localhost:3000/api"
    },
    app: {
      url: "http://localhost:5173"
    }
  },
  DEV: {
    websocket: {
      endpoint: "ws://nongpanya.sit.kmutt.ac.th:3001"
    },
    api: {
      url: "http://localhost:3000/api"
    },
    app: {
      url: "http://localhost:5173"
    }
  },
  PROD: {
    websocket: {
      endpoint: "wss://nongpanya.sit.kmutt.ac.th:3001"
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