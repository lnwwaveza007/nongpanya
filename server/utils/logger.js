import { getCurrentEnvironment } from '../config/envConfig.js';

/**
 * Production-safe console utility
 * Removes console output in production environment
 */
class Logger {
  constructor() {
    this.isProd = getCurrentEnvironment() === 'PROD';
  }

  log(...args) {
    if (!this.isProd) {
      console.log(...args);
    }
  }

  warn(...args) {
    if (!this.isProd) {
      console.warn(...args);
    }
  }

  error(...args) {
    // Always show errors, even in production
    console.error(...args);
  }

  info(...args) {
    if (!this.isProd) {
      console.info(...args);
    }
  }
}

// Export singleton instance
export default new Logger();
