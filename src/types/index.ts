export interface User {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  email: string;
  phone: string;
  location: string;
  bio: string;
  skillsOffered: Skill[];
  skillsWanted: Skill[];
  rating: number;
  completedSwaps: number;
  joinedDate: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  description: string;
  tags: string[];
}

export interface SkillSwap {
  id: string;
  requester: User;
  provider: User;
  skillOffered: Skill;
  skillWanted: Skill;
  status: 'pending' | 'accepted' | 'in-progress' | 'completed' | 'cancelled';
  timestamp: string;
  message: string;
  sessionDate?: string;
  rating?: number;
  feedback?: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
  type: 'text' | 'swap-request' | 'system';
}

export interface Conversation {
  id: string;
  participants: User[];
  lastMessage: Message;
  unreadCount: number;
  messages: Message[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
  category: 'swaps' | 'learning' | 'teaching' | 'community';
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
  location: string;
}

export type PageType = 'dashboard' | 'my-skills' | 'find-skills' | 'swap-requests' | 'messages' | 'profile' | 'settings';