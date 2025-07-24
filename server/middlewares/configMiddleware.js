import { getConfig } from '../config/envConfig.js';

/**
 * Middleware to attach configuration to request object
 */
export function attachConfig(req, res, next) {
  req.config = getConfig();
  next();
}

export default attachConfig;
