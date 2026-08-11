import api from '@/utlis/axiosInstance';




export async function loginUser(email, password) {
  const response = await api.post('/api/auth/login', {
    email,
    password
  });

  return response.data;
}

export async function logoutUser() {
  const response = await api.post('/api/auth/logout');
  return response.data;
}
