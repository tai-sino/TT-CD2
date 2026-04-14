import api from './api';

// Cập nhật điểm và nhận xét giữa kỳ cho đề tài
export async function updateGiuaKy(deTaiId, data) {
  const res = await api.put(`/de-tai/${deTaiId}`, data);
  return res.data;
}
