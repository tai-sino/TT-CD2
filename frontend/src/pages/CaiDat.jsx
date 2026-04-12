import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getKyLvtn, createKyLvtn, updateKyLvtn } from '../../services/kyLvtnService';

export default function CaiDat() {
  const queryClient = useQueryClient();

  const { data: kyData, isLoading } = useQuery({
    queryKey: ['kyLvtn'],
    queryFn: getKyLvtn,
  });

  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    ten: '',
    ngay_bat_dau: '',
    ngay_nhan_de_tai: '',
    ngay_cham_50: '',
    ngay_phan_bien: '',
    ngay_bao_ve: '',
    ngay_ket_thuc: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (kyData?.data) {
      const active = kyData.data.find(k => k.is_active);
      if (active && !editId) {
        loadKy(active);
      }
    }
  }, [kyData]);

  function loadKy(ky) {
    setEditId(ky.id);
    setForm({
      ten: ky.ten || '',
      ngay_bat_dau: ky.ngay_bat_dau || '',
      ngay_nhan_de_tai: ky.ngay_nhan_de_tai || '',
      ngay_cham_50: ky.ngay_cham_50 || '',
      ngay_phan_bien: ky.ngay_phan_bien || '',
      ngay_bao_ve: ky.ngay_bao_ve || '',
      ngay_ket_thuc: ky.ngay_ket_thuc || '',
    });
    setErrors({});
  }

  function resetForm() {
    setEditId(null);
    setForm({
      ten: '',
      ngay_bat_dau: '',
      ngay_nhan_de_tai: '',
      ngay_cham_50: '',
      ngay_phan_bien: '',
      ngay_bao_ve: '',
      ngay_ket_thuc: '',
    });
    setErrors({});
  }

  const createMut = useMutation({
    mutationFn: (data) => createKyLvtn(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kyLvtn'] });
      resetForm();
    },
    onError: (err) => {
      if (err.response?.status === 422) setErrors(err.response.data.errors || {});
    },
  });

  const updateMut = useMutation({
    mutationFn: (data) => updateKyLvtn(editId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kyLvtn'] });
    },
    onError: (err) => {
      if (err.response?.status === 422) setErrors(err.response.data.errors || {});
    },
  });

  const loading = createMut.isPending || updateMut.isPending;

  function handleSubmit(e) {
    e.preventDefault();
    setErrors({});
    if (editId) {
      updateMut.mutate(form);
    } else {
      createMut.mutate(form);
    }
  }

  function handleChange(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => { const n = { ...prev }; delete n[field]; return n; });
    }
  }

  const dateFields = [
    { key: 'ngay_bat_dau', label: 'Ngày bắt đầu' },
    { key: 'ngay_nhan_de_tai', label: 'Ngày nhận đề tài' },
    { key: 'ngay_cham_50', label: 'Ngày chấm 50%' },
    { key: 'ngay_phan_bien', label: 'Ngày phản biện' },
    { key: 'ngay_bao_ve', label: 'Ngày bảo vệ' },
    { key: 'ngay_ket_thuc', label: 'Ngày kết thúc' },
  ];

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900 mb-6">Cài đặt kỳ luận văn</h1>

      <div className="bg-white rounded-lg border border-slate-200 p-6 mb-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-slate-700 mb-1">Tên kỳ</label>
            <input
              type="text"
              value={form.ten}
              onChange={e => handleChange('ten', e.target.value)}
              disabled={loading}
              placeholder="VD: HK2 2025-2026"
              className={`w-full border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50 ${errors.ten ? 'border-red-300' : 'border-slate-200'}`}
            />
            {errors.ten && <p className="text-red-500 text-xs mt-1">{errors.ten[0]}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {dateFields.map(({ key, label }) => (
              <div key={key}>
                <label className="block text-sm font-semibold text-slate-700 mb-1">{label}</label>
                <input
                  type="date"
                  value={form[key]}
                  onChange={e => handleChange(key, e.target.value)}
                  disabled={loading}
                  className={`w-full border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50 ${errors[key] ? 'border-red-300' : 'border-slate-200'}`}
                />
                {errors[key] && <p className="text-red-500 text-xs mt-1">{errors[key][0]}</p>}
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Đang lưu...' : editId ? 'Lưu thay đổi' : 'Tạo kỳ mới'}
            </button>
            {editId && (
              <button
                type="button"
                onClick={resetForm}
                className="border border-slate-200 text-slate-700 hover:bg-slate-50 px-4 py-2 text-sm rounded-lg"
              >
                Tạo kỳ mới
              </button>
            )}
          </div>
        </form>
      </div>

      {kyData?.data?.length > 0 && (
        <div className="bg-white rounded-lg border border-slate-200 p-6 overflow-x-auto">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Danh sách kỳ</h2>
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Tên kỳ</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody>
              {kyData.data.map(ky => (
                <tr key={ky.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm text-slate-700 border-t border-slate-100">{ky.ten}</td>
                  <td className="px-4 py-3 border-t border-slate-100">
                    {ky.is_active ? (
                      <span className="bg-green-50 text-green-600 text-xs font-semibold px-2 py-0.5 rounded-full">Đang hoạt động</span>
                    ) : (
                      <span className="bg-slate-100 text-slate-500 text-xs font-semibold px-2 py-0.5 rounded-full">Đã kết thúc</span>
                    )}
                  </td>
                  <td className="px-4 py-3 border-t border-slate-100">
                    <button
                      onClick={() => loadKy(ky)}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Sửa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isLoading && (
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="animate-pulse space-y-3">
            <div className="bg-slate-100 h-4 rounded w-1/3"></div>
            <div className="bg-slate-100 h-4 rounded w-1/2"></div>
          </div>
        </div>
      )}

      {!isLoading && (!kyData?.data || kyData.data.length === 0) && !editId && (
        <div className="text-center py-12">
          <p className="text-slate-500 font-semibold">Chưa có kỳ luận văn</p>
          <p className="text-sm text-slate-400 mt-1">Tạo kỳ luận văn mới để bắt đầu quản lý.</p>
        </div>
      )}
    </div>
  );
}
