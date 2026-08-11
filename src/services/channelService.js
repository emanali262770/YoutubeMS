import api from '@/utlis/axiosInstance';

export async function getChannels() {
  const response = await api.get('/api/channels');
  return response.data;
}

export async function createChannel(channelData) {
  const response = await api.post('/api/channels', channelData);
  return response.data;
}
