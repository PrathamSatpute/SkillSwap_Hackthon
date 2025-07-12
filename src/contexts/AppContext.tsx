import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AppState, User, SwapRequest, Rating, AdminMessage } from '../types';

interface AppContextType {
  state: AppState;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Partial<User>) => Promise<boolean>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => void;
  createSwapRequest: (request: Omit<SwapRequest, 'id' | 'createdDate'>) => void;
  updateSwapRequest: (id: string, status: SwapRequest['status']) => void;
  deleteSwapRequest: (id: string) => void;
  addRating: (rating: Omit<Rating, 'id' | 'createdDate'>) => void;
  searchUsers: (term: string, category: string) => void;
  banUser: (userId: string) => void;
  createAdminMessage: (message: Omit<AdminMessage, 'id' | 'createdDate'>) => void;
  getSwapRequestsForUser: (userId: string) => SwapRequest[];
  getUserById: (id: string) => User | undefined;
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialState: AppState = {
  currentUser: null,
  users: [],
  swapRequests: [],
  ratings: [],
  adminMessages: [],
  isLoading: false,
  searchTerm: '',
  selectedCategory: '',
};

type Action =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_CURRENT_USER'; payload: User | null }
  | { type: 'SET_USERS'; payload: User[] }
  | { type: 'ADD_USER'; payload: User }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'SET_SWAP_REQUESTS'; payload: SwapRequest[] }
  | { type: 'ADD_SWAP_REQUEST'; payload: SwapRequest }
  | { type: 'UPDATE_SWAP_REQUEST'; payload: SwapRequest }
  | { type: 'DELETE_SWAP_REQUEST'; payload: string }
  | { type: 'ADD_RATING'; payload: Rating }
  | { type: 'SET_SEARCH'; payload: { term: string; category: string } }
  | { type: 'ADD_ADMIN_MESSAGE'; payload: AdminMessage };

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_CURRENT_USER':
      return { ...state, currentUser: action.payload };
    case 'SET_USERS':
      return { ...state, users: action.payload };
    case 'ADD_USER':
      return { ...state, users: [...state.users, action.payload] };
    case 'UPDATE_USER':
      return {
        ...state,
        users: state.users.map(user =>
          user.id === action.payload.id ? action.payload : user
        ),
        currentUser: state.currentUser?.id === action.payload.id ? action.payload : state.currentUser,
      };
    case 'SET_SWAP_REQUESTS':
      return { ...state, swapRequests: action.payload };
    case 'ADD_SWAP_REQUEST':
      return { ...state, swapRequests: [...state.swapRequests, action.payload] };
    case 'UPDATE_SWAP_REQUEST':
      return {
        ...state,
        swapRequests: state.swapRequests.map(request =>
          request.id === action.payload.id ? action.payload : request
        ),
      };
    case 'DELETE_SWAP_REQUEST':
      return {
        ...state,
        swapRequests: state.swapRequests.filter(request => request.id !== action.payload),
      };
    case 'ADD_RATING':
      return { ...state, ratings: [...state.ratings, action.payload] };
    case 'SET_SEARCH':
      return { ...state, searchTerm: action.payload.term, selectedCategory: action.payload.category };
    case 'ADD_ADMIN_MESSAGE':
      return { ...state, adminMessages: [...state.adminMessages, action.payload] };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load data from localStorage on app start
  useEffect(() => {
    const savedUsers = localStorage.getItem('skillSwap_users');
    const savedSwapRequests = localStorage.getItem('skillSwap_swapRequests');
    const savedRatings = localStorage.getItem('skillSwap_ratings');
    const savedCurrentUser = localStorage.getItem('skillSwap_currentUser');
    const savedAdminMessages = localStorage.getItem('skillSwap_adminMessages');

    let users: User[] = [];
    
    if (savedUsers) {
      users = JSON.parse(savedUsers);
    }
    
    // Ensure demo admin user always exists
    const adminUser: User = {
      id: 'admin-1',
      name: 'Admin User',
      email: 'admin@skillswap.com',
      password: 'admin123',
      skillsOffered: [],
      skillsWanted: [],
      availability: [],
      isPublic: true,
      rating: 5,
      totalRatings: 1,
      isActive: true,
      joinDate: new Date().toISOString(),
      role: 'admin',
    };
    
    // Check if admin user already exists, if not add it
    const adminExists = users.find(u => u.email === 'admin@skillswap.com');
    if (!adminExists) {
      users.push(adminUser);
    }
    
    dispatch({ type: 'SET_USERS', payload: users });

    if (savedSwapRequests) {
      dispatch({ type: 'SET_SWAP_REQUESTS', payload: JSON.parse(savedSwapRequests) });
    }

    if (savedRatings) {
      state.ratings = JSON.parse(savedRatings);
    }

    if (savedCurrentUser) {
      dispatch({ type: 'SET_CURRENT_USER', payload: JSON.parse(savedCurrentUser) });
    }

    if (savedAdminMessages) {
      state.adminMessages = JSON.parse(savedAdminMessages);
    }
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('skillSwap_users', JSON.stringify(state.users));
  }, [state.users]);

  useEffect(() => {
    localStorage.setItem('skillSwap_swapRequests', JSON.stringify(state.swapRequests));
  }, [state.swapRequests]);

  useEffect(() => {
    localStorage.setItem('skillSwap_ratings', JSON.stringify(state.ratings));
  }, [state.ratings]);

  useEffect(() => {
    localStorage.setItem('skillSwap_currentUser', JSON.stringify(state.currentUser));
  }, [state.currentUser]);

  useEffect(() => {
    localStorage.setItem('skillSwap_adminMessages', JSON.stringify(state.adminMessages));
  }, [state.adminMessages]);

  const login = async (email: string, password: string): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    const user = state.users.find(u => u.email === email && u.password === password && u.isActive);
    
    if (user) {
      dispatch({ type: 'SET_CURRENT_USER', payload: user });
      dispatch({ type: 'SET_LOADING', payload: false });
      return true;
    }
    
    dispatch({ type: 'SET_LOADING', payload: false });
    return false;
  };

  const register = async (userData: Partial<User>): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    const existingUser = state.users.find(u => u.email === userData.email);
    if (existingUser) {
      dispatch({ type: 'SET_LOADING', payload: false });
      return false;
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: userData.name || '',
      email: userData.email || '',
      password: userData.password || '',
      location: userData.location,
      profilePhoto: userData.profilePhoto,
      skillsOffered: userData.skillsOffered || [],
      skillsWanted: userData.skillsWanted || [],
      availability: userData.availability || [],
      isPublic: userData.isPublic ?? true,
      rating: 0,
      totalRatings: 0,
      isActive: true,
      joinDate: new Date().toISOString(),
      role: 'user',
    };

    dispatch({ type: 'ADD_USER', payload: newUser });
    dispatch({ type: 'SET_CURRENT_USER', payload: newUser });
    dispatch({ type: 'SET_LOADING', payload: false });
    return true;
  };

  const logout = () => {
    dispatch({ type: 'SET_CURRENT_USER', payload: null });
  };

  const updateProfile = (userData: Partial<User>) => {
    if (state.currentUser) {
      const updatedUser = { ...state.currentUser, ...userData };
      dispatch({ type: 'UPDATE_USER', payload: updatedUser });
    }
  };

  const createSwapRequest = (request: Omit<SwapRequest, 'id' | 'createdDate'>) => {
    const newRequest: SwapRequest = {
      ...request,
      id: `swap-${Date.now()}`,
      createdDate: new Date().toISOString(),
      status: 'pending',
    };
    dispatch({ type: 'ADD_SWAP_REQUEST', payload: newRequest });
  };

  const updateSwapRequest = (id: string, status: SwapRequest['status']) => {
    const request = state.swapRequests.find(r => r.id === id);
    if (request) {
      const updatedRequest = {
        ...request,
        status,
        responseDate: status !== 'pending' ? new Date().toISOString() : request.responseDate,
        completedDate: status === 'completed' ? new Date().toISOString() : request.completedDate,
      };
      dispatch({ type: 'UPDATE_SWAP_REQUEST', payload: updatedRequest });
    }
  };

  const deleteSwapRequest = (id: string) => {
    dispatch({ type: 'DELETE_SWAP_REQUEST', payload: id });
  };

  const addRating = (rating: Omit<Rating, 'id' | 'createdDate'>) => {
    const newRating: Rating = {
      ...rating,
      id: `rating-${Date.now()}`,
      createdDate: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_RATING', payload: newRating });

    // Update user rating
    const user = state.users.find(u => u.id === rating.toUserId);
    if (user) {
      const newTotalRatings = user.totalRatings + 1;
      const newRating = ((user.rating * user.totalRatings) + rating.rating) / newTotalRatings;
      const updatedUser = {
        ...user,
        rating: newRating,
        totalRatings: newTotalRatings,
      };
      dispatch({ type: 'UPDATE_USER', payload: updatedUser });
    }
  };

  const searchUsers = (term: string, category: string) => {
    dispatch({ type: 'SET_SEARCH', payload: { term, category } });
  };

  const banUser = (userId: string) => {
    const user = state.users.find(u => u.id === userId);
    if (user && user.role !== 'admin') {
      const updatedUser = { ...user, isActive: false };
      dispatch({ type: 'UPDATE_USER', payload: updatedUser });
    }
  };

  const createAdminMessage = (message: Omit<AdminMessage, 'id' | 'createdDate'>) => {
    const newMessage: AdminMessage = {
      ...message,
      id: `msg-${Date.now()}`,
      createdDate: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_ADMIN_MESSAGE', payload: newMessage });
  };

  const getSwapRequestsForUser = (userId: string): SwapRequest[] => {
    return state.swapRequests.filter(
      request => request.fromUserId === userId || request.toUserId === userId
    );
  };

  const getUserById = (id: string): User | undefined => {
    return state.users.find(user => user.id === id);
  };

  const resetDemoData = () => {
    // Clear localStorage
    localStorage.removeItem('skillSwap_users');
    localStorage.removeItem('skillSwap_swapRequests');
    localStorage.removeItem('skillSwap_ratings');
    localStorage.removeItem('skillSwap_currentUser');
    localStorage.removeItem('skillSwap_adminMessages');
    
    // Reset state to initial values
    dispatch({ type: 'SET_CURRENT_USER', payload: null });
    dispatch({ type: 'SET_SWAP_REQUESTS', payload: [] });
    dispatch({ type: 'SET_SEARCH', payload: { term: '', category: '' } });
    
    // Re-initialize with demo admin user
    const adminUser: User = {
      id: 'admin-1',
      name: 'Admin User',
      email: 'admin@skillswap.com',
      password: 'admin123',
      skillsOffered: [],
      skillsWanted: [],
      availability: [],
      isPublic: true,
      rating: 5,
      totalRatings: 1,
      isActive: true,
      joinDate: new Date().toISOString(),
      role: 'admin',
    };
    dispatch({ type: 'SET_USERS', payload: [adminUser] });
  };

  const value: AppContextType = {
    state,
    login,
    register,
    logout,
    updateProfile,
    createSwapRequest,
    updateSwapRequest,
    deleteSwapRequest,
    addRating,
    searchUsers,
    banUser,
    createAdminMessage,
    getSwapRequestsForUser,
    getUserById,
    resetDemoData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}