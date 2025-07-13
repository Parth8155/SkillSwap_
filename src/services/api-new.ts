import api from '../config/api';
import { LoginCredentials, RegisterData } from '../types';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  status: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Auth API functions
export const authAPI = {
  login: async (data: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const registerPayload = {
      name: data.name,
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
      role: data.role,
      location: data.location
    };
    const response = await api.post('/auth/register', registerPayload);
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/auth/me');
    return response.data.user;
  },

  refreshToken: async (): Promise<{ token: string }> => {
    const response = await api.post('/auth/refresh');
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  }
};

// Skills API functions
export const skillsAPI = {
  getMySkills: async () => {
    const response = await api.get('/skills/my-skills');
    return response.data;
  },

  searchSkills: async (query: string) => {
    const response = await api.get(`/skills/search?q=${query}`);
    return response.data;
  },

  createSkill: async (skillData: any) => {
    const response = await api.post('/skills', skillData);
    return response.data;
  },

  updateSkill: async (skillId: string, skillData: any) => {
    const response = await api.put(`/skills/${skillId}`, skillData);
    return response.data;
  },

  deleteSkill: async (skillId: string) => {
    const response = await api.delete(`/skills/${skillId}`);
    return response.data;
  },
};

// Swap requests API functions
export const swapAPI = {
  getSwapRequests: async () => {
    const response = await api.get('/swaps');
    return response.data;
  },

  createSwapRequest: async (swapData: any) => {
    const response = await api.post('/swaps', swapData);
    return response.data;
  },

  respondToSwap: async (swapId: string, response: 'accept' | 'reject') => {
    const result = await api.put(`/swaps/${swapId}/respond`, { response });
    return result.data;
  },
};

// Messages API functions
export const messagesAPI = {
  getConversations: async () => {
    const response = await api.get('/messages/conversations');
    return response.data;
  },

  getMessages: async (conversationId: string) => {
    const response = await api.get(`/messages/conversations/${conversationId}`);
    return response.data;
  },

  sendMessage: async (conversationId: string, content: string) => {
    const response = await api.post(`/messages/conversations/${conversationId}`, {
      content,
    });
    return response.data;
  },
};

// Users API functions
export const usersAPI = {
  getProfile: async (userId: string) => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  updateProfile: async (profileData: any) => {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  },

  searchUsers: async (query: string) => {
    const response = await api.get(`/users/search?q=${query}`);
    return response.data;
  },
};
