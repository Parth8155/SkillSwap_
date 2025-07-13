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
    return response.data.data; // Backend returns data inside 'data' property
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
    return response.data.data; // Backend returns data inside 'data' property
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
    // Backend returns { success, data: skills[] }
    return response.data.data;
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

  // Fetch all offered skills for public swap requests
  getOfferedSkills: async () => {
    const response = await api.get('/skills?type=offered');
    return response.data.data;
  },
};

// Swap requests API functions
export const swapAPI = {
  getSwapRequests: async () => {
    const response = await api.get('/swaps');
    // Backend returns { success, data: swaps[] }
    return response.data.data;
  },

  // Get a single swap request between two users (if exists)
  getSwapRequest: async (requesterId: string, providerId: string) => {
    const response = await api.get('/swaps');
    // Backend returns { success, data: swaps[] }
    const swaps = response.data.data as any[];
    return swaps.find(swap => swap.requester.id === requesterId && swap.provider.id === providerId);
  },
  createSwapRequest: async (swapData: any) => {
    const response = await api.post('/swaps', swapData);
    // Backend returns { success, data: swap }
    return response.data.data;
  },

  respondToSwap: async (swapId: string, response: 'accept' | 'reject') => {
    const result = await api.put(`/swaps/${swapId}/respond`, { response });
    // Backend returns { success, data: swap }
    return result.data.data;
  },
  // Fetch public swap requests available to all users
  getPublicSwaps: async () => {
    const response = await api.get('/swaps/public');
    // Backend returns { success, data: swaps[] }
    return response.data.data;
  }
};

// Messages API functions
export const messagesAPI = {
  getConversations: async () => {
    const response = await api.get('/messages/conversations');
    return response.data.data;
  },

  getMessages: async (conversationId: string) => {
    const response = await api.get(`/messages/conversations/${conversationId}`);
    return response.data.data;
  },

  createConversation: async (participantId: string) => {
    const response = await api.post('/messages/conversations', { participantId });
    return response.data.data;
  },

  getUsers: async () => {
    const response = await api.get('/messages/users');
    return response.data.data;
  }
};

// Users API functions
export const usersAPI = {
  getProfile: async (userId: string) => {
    const response = await api.get(`/users/${userId}`);
    // Response structure: { success, data: user }
    return response.data.data;
  },

  updateProfile: async (profileData: any) => {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  },

  searchUsers: async (query: string) => {
    const response = await api.get(`/users/search?q=${query}`);
    return response.data;
  },
  // Get all users with skills
  getAllUsers: async () => {
    const response = await api.get('/users');
    return response.data.data;
  }
};
