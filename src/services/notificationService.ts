import { api } from '@/api';
import type { Notification } from '@/types';

export const getNotifications = async (userId: string): Promise<Notification[]> => {
  try {
    const response = await api.notifications.getNotifications(userId);
    
    // Map backend response to frontend format
    const mappedNotifications = (response.data || []).map((notif: any) => ({
      id: notif.id,
      userId: userId,
      title: notif.title,
      message: notif.message,
      type: notif.notification_type,
      read: !!notif.read_at,
      createdAt: notif.created_at,
    }));
    
    return mappedNotifications;
  } catch (error) {
    console.warn('Failed to fetch notifications:', error);
    return [];
  }
};

export const markNotificationRead = async (id: string): Promise<void> => {
  try {
    await api.notifications.markRead(id);
  } catch (error) {
    console.warn('Failed to mark notification as read:', error);
  }
};
