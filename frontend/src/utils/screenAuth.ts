import { localSignin, signOut } from '@/api/auth';

// Screen authentication utilities
export const screenAuth = {
  // Check if screen is authenticated
  isAuthenticated: (): boolean => {
    return sessionStorage.getItem('screenAuthenticated') === 'true';
  },

  // Authenticate screen session with API
  authenticate: async (password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await localSignin('screen@mail.com', password);
      
      if (response.data.success && response.data.data.role === 'screen') {
        sessionStorage.setItem('screenAuthenticated', 'true');
        sessionStorage.setItem('screenUser', JSON.stringify(response.data.data));
        return { success: true };
      } else {
        return { success: false, message: 'Invalid credentials or insufficient permissions' };
      }
    } catch (error: unknown) {
      // Screen authentication error
      let errorMessage = 'Authentication failed';
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        errorMessage = axiosError.response?.data?.message || errorMessage;
      }
      
      return { 
        success: false, 
        message: errorMessage
      };
    }
  },

  // Simple authenticate for session storage (backwards compatibility)
  authenticateSession: (): void => {
    sessionStorage.setItem('screenAuthenticated', 'true');
  },

  // Logout from screen session
  logout: async (): Promise<void> => {
    try {
      await signOut();
    } catch {
      // Logout error
    } finally {
      sessionStorage.removeItem('screenAuthenticated');
      sessionStorage.removeItem('screenUser');
    }
  },

  // Get current screen user data
  getScreenUser: () => {
    const userData = sessionStorage.getItem('screenUser');
    return userData ? JSON.parse(userData) : null;
  },

  // Set up automatic logout timer (optional)
  setAutoLogout: (minutes: number = 30): NodeJS.Timeout => {
    return setTimeout(() => {
      screenAuth.logout();
      window.location.href = '/screen/pin';
    }, minutes * 60 * 1000);
  },

  // Clear any existing auto logout timers
  clearAutoLogout: (timerId: NodeJS.Timeout): void => {
    clearTimeout(timerId);
  }
};

export default screenAuth;
