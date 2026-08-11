import api from '@/utlis/axiosInstance';

export async function getContentOptions() {
  const response = await api.get('/api/contents/options');
  return response.data;
}

export async function checkSourceUrl(sourceUrl) {
  const response = await api.get('/api/contents/check-source-url', {
    params: { sourceUrl }
  });
  return response.data;
}

export async function getContents(filters = {}) {
  const response = await api.get('/api/contents', {
    params: filters
  });
  return response.data;
}

export async function getCompletedContents(filters = {}) {
  const response = await api.get('/api/contents/completed-work', {
    params: filters
  });
  return response.data;
}

export async function createContent(contentData) {
  const response = await api.post('/api/contents', contentData);
  return response.data;
}

export async function updateContent(contentId, contentData) {
  const response = await api.patch(`/api/contents/${contentId}`, contentData);
  return response.data;
}

export async function deleteContent(contentId) {
  const response = await api.delete(`/api/contents/${contentId}`);
  return response.data;
}

export async function getActivityHistory(contentId) {
  const response = await api.get(`/api/contents/${contentId}/activity-history`);
  return response.data;
}
