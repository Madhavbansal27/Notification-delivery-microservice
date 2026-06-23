import { api } from './config';

export const authApi = {
  register: (data: any) => api.post('/api/auth/register', data),
  login: (data: any) => api.post('/api/auth/login', data),
};

export const notificationApi = {
  send: (data: {
    userId: string;
    type: string;
    channel: string;
    priority: string;
    title: string;
    body: string;
    metadata?: any;
  }) => api.post('/api/notifications', data),

  getByUser: (userId: string, page: number, limit: number, status?: string) =>
    api.get(`/api/notifications/${userId}`, { 
      params: { page, limit, ...(status && status !== 'ALL' ? { status } : {}) } 
    }),

  getById: (id: string) => api.get(`/api/notifications/detail/${id}`),
};

export const statsApi = {
  getQueues: () => api.get('/api/stats/queues'),
  getDelivery: () => api.get('/api/stats/delivery'),
  getFailed: () => api.get('/api/stats/failed'),
};

export const userApi = {
  getPreferences: (userId: string) => api.get(`/api/users/${userId}/preferences`),
  updatePreferences: (userId: string, data: any) => api.put(`/api/users/${userId}/preferences`, data),
};
