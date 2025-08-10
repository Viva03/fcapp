import { Slot } from './slotGenerator';

const MOCK_DELAY = 1000; // Simulate network delay

interface LoginResponse {
  success: boolean;
  token?: string;
  error?: string;
}

interface ApiResponse {
  success: boolean;
  error?: string;
}

export const api = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
    
    // Mock validation
    if (email.endsWith('@college.edu') && password) {
      return {
        success: true,
        token: 'mock-token'
      };
    }
    
    return {
      success: false,
      error: 'Invalid credentials'
    };
  },

  getSlots: async (): Promise<Slot[]> => {
    await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
    return []; // This will be populated by the frontend
  },

  bookSlot: async (date: string, time: string): Promise<ApiResponse> => {
    await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
    return {
      success: true
    };
  },

  cancelBooking: async (date: string, time: string): Promise<ApiResponse> => {
    await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
    return {
      success: true
    };
  }
};
