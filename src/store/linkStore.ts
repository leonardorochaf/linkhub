import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Link {
  id: string;
  title: string;
  url: string;
  active: boolean;
}

export interface UserProfile {
  username: string;
  displayName: string;
  description: string;
  avatar?: string;
  theme: 'light' | 'dark';
}

interface LinkStore {
  links: Link[];
  profile: UserProfile;
  authenticated: boolean;
  
  reorderLinks: (links: Link[]) => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  login: (username: string) => void;
  logout: () => void;
}

export const useLinkStore = create<LinkStore>()(
  persist(
    (set) => ({
      links: [],
      profile: {
        username: '',
        displayName: '',
        description: '',
        theme: 'light',
      },
      authenticated: false,
      
      reorderLinks: (links) => set({ links }),
      
      updateProfile: (profile) => set((state) => ({
        profile: { ...state.profile, ...profile },
      })),
      
      login: (username) => set({ 
        authenticated: true, 
        profile: { 
          username, 
          displayName: username.charAt(0).toUpperCase() + username.slice(1),
          description: '',
          theme: 'light'
        } 
      }),
      
      logout: () => set({ authenticated: false }),
    }),
    {
      name: 'link-hub-storage',
    }
  )
);
