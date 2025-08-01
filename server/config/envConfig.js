import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

/**
 * Environment Configuration Handler
 * Supports LOCAL, DEV, and PROD environments with different configurations
 */

const DEFAULT_ENV = 'DEV';
const SELECTED_ENV = process.env.SELECTED_ENV || DEFAULT_ENV;

// CORS Origins configuration for each environment
const CORS_ORIGINS = {
  LOCAL: ['http://localhost:3001', 'https://nongpanya.sit.kmutt.ac.th'],
  DEV: [
    'http://localhost:3001', 
    'https://nongpanya.sit.kmutt.ac.th'
  ],
  PROD: [
    'https://nongpanya.sit.kmutt.ac.th',
  ]
};

// Default ports for each environment
const DEFAULT_PORTS = {
  LOCAL: 3000,
  DEV: 3000,
  PROD: 3000
};

/**
 * Get environment variable with prefix based on selected environment
 * @param {string} key - The environment variable key (without prefix)
 * @param {string} defaultValue - Default value if not found
 * @param {boolean} globalOnly - If true, only check for non-prefixed variable
 * @returns {string} The environment variable value
 */
function getEnvVar(key, defaultValue = null, globalOnly = false) {
  if (globalOnly) {
    // For global variables, only check the non-prefixed version
    const value = process.env[key] || defaultValue;
    
    if (!value && defaultValue === null) {
      // Only log in non-production environments
      if (SELECTED_ENV !== 'PROD') {
        console.warn(`⚠️  Missing global environment variable: ${key}`);
      }
    }
    
    return value;
  }
  
  // For environment-specific variables, try prefixed first, then fallback to non-prefixed
  const prefixedKey = `${SELECTED_ENV}_${key}`;
  const value = process.env[prefixedKey] || process.env[key] || defaultValue;
  
  if (!value && defaultValue === null) {
    // Only log in non-production environments
    if (SELECTED_ENV !== 'PROD') {
      console.warn(`⚠️  Missing environment variable: ${prefixedKey} (or ${key})`);
    }
  }
  
  return value;
}

/**
 * Get configuration object based on selected environment
 * @returns {object} Configuration object
 */
export function getConfig() {
  const config = {
    environment: SELECTED_ENV,
    port: getEnvVar('PORT', null, true) || DEFAULT_PORTS[SELECTED_ENV],
    websocketPort: getEnvVar('WEBSOCKET_PORT', '3002'),
    
    // Database configuration
    database: {
      url: getEnvVar('DATABASE_URL'),
    },
    
    // Board/Hardware configuration
    board: {
      url: getEnvVar('BOARD_URL'),
    },
    
    // Microsoft OAuth configuration (global variables)
    microsoft: {
      clientId: getEnvVar('MICROSOFT_CLIENT_ID', null, true),
      clientSecret: getEnvVar('MICROSOFT_CLIENT_SECRET', null, true),
      authUrl: getEnvVar('MICROSOFT_AUTH_URL', null, true),
      tokenUrl: getEnvVar('MICROSOFT_TOKEN_URL', null, true),
      callbackUrl: getEnvVar('MICROSOFT_CALLBACK_URL'),
    },
    
    // JWT configuration (global secret)
    jwt: {
      secret: getEnvVar('JWT_SECRET', null, true),
      expiresIn: getEnvVar('JWT_EXPIRES_IN', '24h'),
      refreshSecret: getEnvVar('JWT_REFRESH_SECRET'),
      refreshExpiresIn: getEnvVar('JWT_REFRESH_EXPIRES_IN', '7d'),
    },
    
    // Security configuration
    security: {
      bcryptSaltRounds: parseInt(getEnvVar('BCRYPT_SALT_ROUNDS', '10')),
      sessionSecret: getEnvVar('SESSION_SECRET'),
    },
    
    // CORS configuration
    cors: {
      origins: CORS_ORIGINS[SELECTED_ENV] || CORS_ORIGINS.PROD,
    },
    
    // Logging configuration
    logging: {
      level: getEnvVar('LOG_LEVEL', 'info'),
      enableConsole: getEnvVar('ENABLE_CONSOLE_LOGGING', 'true') === 'true',
      enableFile: getEnvVar('ENABLE_FILE_LOGGING', 'false') === 'true',
    },
  };
  
  // Validate required configurations
  validateConfig(config);
  
  return config;
}

/**
 * Get CORS origins for the selected environment
 * @returns {string[]} Array of allowed origins
 */
export function getCorsOrigins() {
  return CORS_ORIGINS[SELECTED_ENV] || CORS_ORIGINS.LOCAL;
}

/**
 * Get current environment
 * @returns {string} Current environment (LOCAL, DEV, PROD)
 */
export function getCurrentEnvironment() {
  return SELECTED_ENV;
}

/**
 * Check if running in development mode
 * @returns {boolean} True if in LOCAL or DEV environment
 */
export function isDevelopment() {
  return SELECTED_ENV === 'LOCAL' || SELECTED_ENV === 'DEV';
}

/**
 * Check if running in production mode
 * @returns {boolean} True if in PROD environment
 */
export function isProduction() {
  return SELECTED_ENV === 'PROD';
}

/**
 * Validate required configuration values
 * @param {object} config - Configuration object to validate
 */
function validateConfig(config) {
  const missingVars = [];
  
  // Check critical environment variables
  if (!config.database.url) {
    missingVars.push(`${SELECTED_ENV}_DATABASE_URL`);
  }
  
  if (!config.jwt.secret) {
    missingVars.push('JWT_SECRET');
  }
  
  // Warn about missing Microsoft OAuth (might not be needed in all setups)
  if (!config.microsoft.clientId) {
    if (SELECTED_ENV !== 'PROD') {
      console.warn(`Missing Microsoft OAuth configuration: MICROSOFT_CLIENT_ID`);
    }
  }
  
  if (!config.microsoft.callbackUrl) {
    if (SELECTED_ENV !== 'PROD') {
      console.warn(`Missing Microsoft OAuth callback URL: ${SELECTED_ENV}_MICROSOFT_CALLBACK_URL`);
    }
  }
  
  if (missingVars.length > 0) {
    console.error(`Missing critical environment variables for ${SELECTED_ENV}:`, missingVars);
    if (isProduction()) {
      throw new Error(`Missing critical environment variables: ${missingVars.join(', ')}`);
    }
  }
}

// Export default configuration getter
export default getConfig;
