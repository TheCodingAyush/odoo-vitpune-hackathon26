import { create } from "zustand";

export type Role = "admin" | "manager" | "employee" | null;

interface UserDetails {
  id: string;
  name: string;
  email: string;
  role: Role;
  tenantId: string | null;
  tenantName: string | null;
}

interface AuthState {
  user: UserDetails | null;
  isAuthenticated: boolean;
  token: string | null;
  sessionExpiresAt: number | null;
  lastActive: number | null;
  login: (user: UserDetails, token: string) => void;
  logout: () => void;
  pingActivity: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => {
  // Initialize from localStorage
  const stored = typeof window !== "undefined" ? localStorage.getItem("enterprise_auth") : null;
  const initial = stored ? JSON.parse(stored) : { 
    user: null, 
    isAuthenticated: false, 
    token: null, 
    sessionExpiresAt: null, 
    lastActive: null 
  };
  
  return {
    ...initial,
    login: (user, token) => {
      const sessionExpiresAt = Date.now() + 1000 * 60 * 60; // 1 hour session
      const newState = { 
        user, 
        isAuthenticated: true, 
        token,
        sessionExpiresAt,
        lastActive: Date.now()
      };
      localStorage.setItem("enterprise_auth", JSON.stringify(newState));
      set(newState);
    },
    logout: () => {
      const newState = { 
        user: null, 
        isAuthenticated: false, 
        token: null,
        sessionExpiresAt: null,
        lastActive: null
      };
      localStorage.removeItem("enterprise_auth");
      set(newState);
    },
    pingActivity: () => {
      const { isAuthenticated, sessionExpiresAt } = get()
      if (isAuthenticated) {
        // Enforce hard timeout
        if (sessionExpiresAt && Date.now() > sessionExpiresAt) {
          get().logout()
          return
        }
        set({ lastActive: Date.now() })
      }
    }
  };
});

// Mock App State
interface AppState {
  currency: string;
  setCurrency: (c: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  currency: "USD",
  setCurrency: (currency) => set({ currency }),
}));
