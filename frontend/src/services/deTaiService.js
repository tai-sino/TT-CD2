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

// Approve topic registration form and create DeTai
export async function approveTopicRegistrationForm(id) {
  const res = await api.post(`/topic-registration-form/${id}/approve`);
  return res.data;
}

export async function chamDiemHD(id, data) {
  const res = await api.put(`/de-tai/${id}/cham-diem-hd`, data);
  return res.data;
}

export async function chamDiemPB(id, data) {
  const res = await api.put(`/de-tai/${id}/cham-diem-pb`, data);
  return res.data;
}

export async function exportWordGVHD(deTaiId) {
  const res = await api.get(`/de-tai/${deTaiId}/export/gvhd`, {
    responseType: 'blob',
  });
  const url = window.URL.createObjectURL(new Blob([res.data]));
  const a = document.createElement('a');
  a.href = url;
  a.download = `Phieu_cham_HD_${deTaiId}.docx`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

export async function exportWordGVPB(deTaiId) {
  const res = await api.get(`/de-tai/${deTaiId}/export/gvpb`, {
    responseType: 'blob',
  });
  const url = window.URL.createObjectURL(new Blob([res.data]));
  const a = document.createElement('a');
  a.href = url;
  a.download = `Phieu_cham_PB_${deTaiId}.docx`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}
