import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import type { Notification } from '@/types';
import * as notificationService from '@/services/notificationService';
import { useAuth } from './AuthContext';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
}

type NotifAction =
  | { type: 'SET'; notifications: Notification[] }
  | { type: 'MARK_READ'; id: string };

function notifReducer(state: NotificationState, action: NotifAction): NotificationState {
  switch (action.type) {
    case 'SET': return { notifications: action.notifications, unreadCount: action.notifications.filter(n => !n.read).length };
    case 'MARK_READ': {
      const updated = state.notifications.map(n => n.id === action.id ? { ...n, read: true } : n);
      return { notifications: updated, unreadCount: updated.filter(n => !n.read).length };
    }
    default: return state;
  }
}

interface NotificationContextType extends NotificationState {
  markRead: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(notifReducer, { notifications: [], unreadCount: 0 });
  const { user } = useAuth();

  const refresh = useCallback(async () => {
    if (!user) return;
    const notifs = await notificationService.getNotifications(user.id);
    dispatch({ type: 'SET', notifications: notifs });
  }, [user]);

  useEffect(() => { refresh(); }, [refresh]);

  const markRead = useCallback(async (id: string) => {
    await notificationService.markNotificationRead(id);
    dispatch({ type: 'MARK_READ', id });
  }, []);

  return (
    <NotificationContext.Provider value={{ ...state, markRead, refresh }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
}
