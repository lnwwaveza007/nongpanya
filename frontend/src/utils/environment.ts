// Environment utilities for debugging and development

import { config, currentEnvironment, isDevelopment, isProduction } from '../config';

/**
 * Log current environment configuration (only in development)
 */
export function logEnvironmentInfo() {
  // Environment logging disabled
}

/**
 * Get environment-specific debug information
 */
export function getEnvironmentInfo() {
  return {
    environment: currentEnvironment,
    isDevelopment,
    isProduction,
    config: config
  };
}

/**
 * Assert that we're in a specific environment
 */
export function assertEnvironment(expectedEnv: string) {
  if (currentEnvironment !== expectedEnv) {
    throw new Error(`Expected environment ${expectedEnv}, but current environment is ${currentEnvironment}`);
  }
}

/**
 * Check if current environment is one of the specified environments
 */
export function isEnvironment(...envs: string[]) {
  return envs.includes(currentEnvironment);
}
