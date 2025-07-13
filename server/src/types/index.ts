import { Document, Types } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
  avatar?: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  phone?: string;
  location?: string;
  bio?: string;
  skillsOffered: Types.ObjectId[];
  skillsWanted: Types.ObjectId[];
  rating: number;
  completedSwaps: number;
  joinedDate: Date;
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  lastActive: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISkill extends Document {
  name: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  description: string;
  tags: string[];
  userId: Types.ObjectId;
  type: 'offered' | 'wanted';
  createdAt: Date;
  updatedAt: Date;
}

export interface ISkillSwap extends Document {
  requester: Types.ObjectId;
  provider: Types.ObjectId;
  skillOffered: Types.ObjectId;
  skillWanted: Types.ObjectId;
  status: 'pending' | 'accepted' | 'in-progress' | 'completed' | 'cancelled';
  message: string;
  sessionDate?: Date;
  rating?: number;
  feedback?: string;
  isPublic?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMessage extends Document {
  senderId: Types.ObjectId;
  receiverId: Types.ObjectId;
  conversationId: Types.ObjectId;
  content: string;
  read: boolean;
  type: 'text' | 'swap-request' | 'system';
  createdAt: Date;
  updatedAt: Date;
}

export interface IConversation extends Document {
  participants: Types.ObjectId[];
  lastMessage?: Types.ObjectId;
  unreadCount: Map<string, number>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAchievement extends Document {
  title: string;
  description: string;
  icon: string;
  category: 'swaps' | 'learning' | 'teaching' | 'community';
  requiredCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserAchievement extends Document {
  userId: Types.ObjectId;
  achievementId: Types.ObjectId;
  unlockedAt: Date;
  createdAt: Date;
}

export interface INotification extends Document {
  userId: Types.ObjectId;
  title: string;
  message: string;
  type: 'swap-request' | 'swap-accepted' | 'swap-completed' | 'message' | 'achievement' | 'system';
  relatedId?: Types.ObjectId;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Request/Response Types
export interface AuthRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
  location?: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar?: string;
    status: string;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
    totalItems: number;
  };
}

export interface SearchQuery {
  q?: string;
  category?: string;
  level?: string;
  location?: string;
  tags?: string[];
  page?: number;
  limit?: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
  type: 'text' | 'swap-request' | 'system';
}

export interface SocketUser {
  userId: string;
  socketId: string;
  status: 'online' | 'away' | 'busy' | 'offline';
}

export type PageType = 'dashboard' | 'my-skills' | 'find-skills' | 'swap-requests' | 'messages' | 'profile' | 'settings';
