/**
 * Token utility functions for role-based authentication
 */

/**
 * Check if a user role should receive a permanent token
 * @param {string} role - User role
 * @returns {boolean} - True if user should get permanent token
 */
export const shouldGetPermanentToken = (role) => {
  return role === 'screen';
};

