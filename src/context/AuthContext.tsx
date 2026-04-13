import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import type { User, UserRole } from '@/types';
import * as authService from '@/services/authService';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}

type AuthAction =
  | { type: 'LOGIN_SUCCESS'; user: User }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; loading: boolean };

const initialState: AuthState = { user: null, isAuthenticated: false, loading: true };

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_SUCCESS': return { user: action.user, isAuthenticated: true, loading: false };
    case 'LOGOUT': return { user: null, isAuthenticated: false, loading: false };
    case 'SET_LOADING': return { ...state, loading: action.loading };
    default: return state;
  }
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  role: UserRole | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    authService.getCurrentUser().then(user => {
      if (user) dispatch({ type: 'LOGIN_SUCCESS', user });
      else dispatch({ type: 'SET_LOADING', loading: false });
    });
  }, []);

  const login = useCallback(async (email: string, password: string, role: UserRole) => {
    const user = await authService.login(email, password, role);
    dispatch({ type: 'LOGIN_SUCCESS', user });
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    dispatch({ type: 'LOGOUT' });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout, role: state.user?.role ?? null }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
