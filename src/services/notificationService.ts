import { mockGetNotifications, mockMarkNotificationRead } from '@/api/mockApi';

export const getNotifications = (userId: string) => mockGetNotifications(userId);
export const markNotificationRead = (id: string) => mockMarkNotificationRead(id);
