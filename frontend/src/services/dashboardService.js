import api from './api';

export async function getGiaiDoan() {
  const res = await api.get('/giai-doan');
  return res.data;
}

export async function getDeTaiStats() {
  const res = await api.get('/de-tai/stats');
  return res.data;
}

export async function getStudentStats() {
  const res = await api.get('/students/stats');
  return res.data;
}
