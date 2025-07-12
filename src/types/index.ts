export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  location?: string;
  profilePhoto?: string;
  skillsOffered: Skill[];
  skillsWanted: Skill[];
  availability: string[];
  isPublic: boolean;
  rating: number;
  totalRatings: number;
  isActive: boolean;
  joinDate: string;
  role: 'user' | 'admin';
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  category: string;
}

export interface SwapRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  offeredSkillId: string;
  requestedSkillId: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
  createdDate: string;
  responseDate?: string;
  completedDate?: string;
}

export interface Rating {
  id: string;
  swapRequestId: string;
  fromUserId: string;
  toUserId: string;
  rating: number;
  feedback: string;
  createdDate: string;
}

export interface AdminMessage {
  id: string;
  title: string;
  content: string;
  createdDate: string;
  isActive: boolean;
}

export interface AppState {
  currentUser: User | null;
  users: User[];
  swapRequests: SwapRequest[];
  ratings: Rating[];
  adminMessages: AdminMessage[];
  isLoading: boolean;
  searchTerm: string;
  selectedCategory: string;
}