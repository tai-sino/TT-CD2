import api from './api';

export async function getKyLvtn() {
  const res = await api.get('/ky-lvtn');
  return res.data;
}

export async function createKyLvtn(data) {
  const res = await api.post('/ky-lvtn', data);
  return res.data;
}

export async function updateKyLvtn(id, data) {
  const res = await api.put(`/ky-lvtn/${id}`, data);
  return res.data;
}
