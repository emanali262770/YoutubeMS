import api from '@/utlis/axiosInstance';

export async function getNotifications() {
  const response = await api.get('/api/notifications');
  return response.data;
}

export async function acceptNotification(notificationId) {
  const response = await api.patch(`/api/notifications/${notificationId}/accept`);
  return response.data;
}
