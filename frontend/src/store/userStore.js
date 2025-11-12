import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUserStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,

      signIn: async (email, password) => {
        // Mock authentication - replace with actual API call
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        const mockUser = {
          id: '1',
          email,
          name: email.split('@')[0],
        };
        const mockToken = 'mock-jwt-token-' + Date.now();

        set({ user: mockUser, token: mockToken });
        return { success: true, user: mockUser };
      },

      signUp: async (email, password, name) => {
        // Mock registration - replace with actual API call
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        const mockUser = {
          id: Date.now().toString(),
          email,
          name,
        };
        const mockToken = 'mock-jwt-token-' + Date.now();

        set({ user: mockUser, token: mockToken });
        return { success: true, user: mockUser };
      },

      signOut: () => {
        set({ user: null, token: null });
      },

      updateProfile: async (updates) => {
        // Mock profile update
        await new Promise((resolve) => setTimeout(resolve, 500));
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        }));
        return { success: true };
      },
    }),
    {
      name: 'user-storage',
    }
  )
);
