import api from '@/utlis/axiosInstance';

export async function getActivityLogs(filters = {}) {
  const response = await api.get('/api/activity-logs', {
    params: filters
  });
  return response.data;
}

export async function deleteActivityLogs(ids = []) {
  const response = await api.delete('/api/activity-logs', {
    data: { ids }
  });
  return response.data;
}
