import api from './api';

export async function getLecturers() {
  const res = await api.get('/giang-vien');
  return res.data;
}

export async function createLecturer(data) {
  const res = await api.post('/giang-vien', data);
  return res.data;
}

export async function updateLecturer(maGV, data) {
  const res = await api.put(`/giang-vien/${maGV}`, data);
  return res.data;
}

export async function deleteLecturer(maGV) {
  const res = await api.delete(`/giang-vien/${maGV}`);
  return res.data;
}
