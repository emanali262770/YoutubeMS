import api from '@/utlis/axiosInstance';

export async function getUsers() {
  const response = await api.get('/api/users');
  return response.data;
}

export async function createUser(userData) {
  const response = await api.post('/api/users', userData);
  return response.data;
}

export async function deleteUser(userId) {
  const response = await api.delete(`/api/users/${userId}`);
  return response.data;
}

export async function updateUserChannels(userId, assignedChannels) {
  const response = await api.patch(`/api/users/${userId}/channels`, {
    assignedChannels
  });
  return response.data;
}
