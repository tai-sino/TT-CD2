import api from './api';

export async function getStudents(params) {
  const res = await api.get('/students', { params });
  return res.data;
}

export async function importStudents(file, kyLvtnId) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('ky_lvtn_id', kyLvtnId);
  const res = await api.post('/students/import', formData, {
    headers: { 'Content-Type': undefined },
  });
  return res.data;
}

export async function createStudent(data) {
  const res = await api.post('/students', data);
  return res.data;
}

export async function updateStudent(mssv, data) {
  const res = await api.put(`/students/${mssv}`, data);
  return res.data;
}

export async function deleteStudent(mssv) {
  const res = await api.delete(`/students/${mssv}`);
  return res.data;
}

export async function getLopList(params) {
  const res = await api.get('/students/lop-list', { params });
  return res.data;
}
