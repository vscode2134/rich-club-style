import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Admin, AuthState } from '@/types';

type AuthAction =
  | { type: 'LOGIN'; payload: { admin: Admin; token: string } }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean };

interface AuthContextState extends AuthState {
  isLoading: boolean;
}

const initialState: AuthContextState = {
  admin: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
};

function authReducer(state: AuthContextState, action: AuthAction): AuthContextState {
  switch (action.type) {
    case 'LOGIN':
      return {
        admin: action.payload.admin,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'LOGOUT':
      return {
        admin: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}

interface AuthContextType extends AuthContextState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'richclub_auth';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      const savedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
      if (savedAuth) {
        try {
          const { token } = JSON.parse(savedAuth);
          // Verify token with backend
          const response = await fetch('/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.ok) {
            const admin = await response.json();
            dispatch({ type: 'LOGIN', payload: { admin, token } });
          } else {
            localStorage.removeItem(AUTH_STORAGE_KEY);
            dispatch({ type: 'LOGOUT' });
          }
        } catch (e) {
          console.error('Auth check failed:', e);
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Invalid credentials');
    }

    const { admin, token } = await response.json();
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ token }));
    dispatch({ type: 'LOGIN', payload: { admin, token } });
  };

  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
