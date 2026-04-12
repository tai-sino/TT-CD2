import api from './api';

export async function getDeTais(params) {
  const res = await api.get('/de-tai', { params });
  return res.data;
}

export async function updateDeTai(id, data) {
  const res = await api.put(`/de-tai/${id}`, data);
  return res.data;
}

export async function createDeTai(data) {
  const res = await api.post('/de-tai', data);
  return res.data;
}

export async function deleteDeTai(id) {
  const res = await api.delete(`/de-tai/${id}`);
  return res.data;
}
