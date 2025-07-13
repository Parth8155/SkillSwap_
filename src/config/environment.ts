// Environment configuration
export const config = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  SOCKET_URL: import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000',
  IS_DEVELOPMENT: import.meta.env.DEV,
  IS_PRODUCTION: import.meta.env.PROD,
};

// API endpoints
export const endpoints = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    me: '/auth/me',
    refresh: '/auth/refresh',
  },
  users: {
    profile: '/users/profile',
    search: '/users/search',
    byId: (id: string) => `/users/${id}`,
  },
  skills: {
    base: '/skills',
    mySkills: '/skills/my-skills',
    search: '/skills/search',
    byId: (id: string) => `/skills/${id}`,
  },
  swaps: {
    base: '/swaps',
    respond: (id: string) => `/swaps/${id}/respond`,
  },
  messages: {
    conversations: '/messages/conversations',
    byConversation: (id: string) => `/messages/conversations/${id}`,
  },
  health: '/health',
};

export default config;
