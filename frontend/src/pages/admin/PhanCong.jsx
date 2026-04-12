import { useState, useEffect, useMemo } from 'react';
import { FaBan } from 'react-icons/fa';
import { getDeTais } from '../../services/deTaiService';
import { getKyLvtn } from '../../services/kyLvtnService';
import { getLecturers } from '../../services/giangVienService';

export default function PhanCong() {
  // Đã bỏ tab, chỉ còn 1 vùng bảng phân công
  const [aboutMe] = useState(() => {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) return null;
      const user = typeof userStr === 'string' ? JSON.parse(userStr) : userStr;
      return { ...user, vaiTro: user.role };
    } catch {
      return null;
    }
  });
  const [deTais, setDeTais] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [kyId, setKyId] = useState('');
  const [gvhd, setGvhd] = useState('');
  const [gvpb, setGvpb] = useState('');
  const [trangThai, setTrangThai] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [perPage] = useState(15);
  const [total, setTotal] = useState(0);
  const [kyList, setKyList] = useState([]);
  const [gvList, setGvList] = useState([]);

  
  useEffect(() => {
    getKyLvtn().then(res => setKyList(res?.data || []));
    getLecturers().then(res => setGvList(res?.data || []));
  }, []);

  
  useEffect(() => {
    if (aboutMe?.vaiTro === 'ThuKy') {
      setLoading(true);
      setError(null);
      getDeTais({
        ky_lvtn_id: kyId || undefined,
        maGV_HD: gvhd || undefined,
        maGV_PB: gvpb || undefined,
        trangThai: trangThai || undefined,
        q: search || undefined,
        page,
        per_page: perPage,
      })
        .then((data) => {
          setDeTais(data?.data || []);
          setTotal(data?.total || 0);
          setLoading(false);
        })
        .catch(() => {
          setError('Lỗi tải dữ liệu');
          setLoading(false);
        });
    }
  }, [aboutMe, kyId, gvhd, gvpb, trangThai, search, page, perPage]);

  if (!aboutMe || aboutMe.vaiTro !== 'ThuKy') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] text-slate-500">
        <FaBan size={48} className="mb-2 text-red-400" />
        <div className="text-lg font-semibold">Bạn không có quyền truy cập trang này</div>
      </div>
    );
  }

  const start = (page - 1) * perPage + 1;
  const end = Math.min(page * perPage, total);

  return (
    <div>
      <h2 className="text-xl font-semibold text-slate-800 mb-4">Phân công giảng viên</h2>

      {/* Bộ lọc */}
      <div className="flex items-center gap-4 mb-4 flex-wrap">
        <select
          value={kyId}
          onChange={e => { setKyId(e.target.value); setPage(1); }}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white"
        >
          <option value="">Tất cả kỳ</option>
          {kyList.map(k => (
            <option key={k.id} value={k.id}>{k.ten}</option>
          ))}
        </select>
        <select
          value={gvhd}
          onChange={e => { setGvhd(e.target.value); setPage(1); }}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white"
        >
          <option value="">Tất cả GVHD</option>
          {gvList.map(gv => (
            <option key={gv.maGV} value={gv.maGV}>{gv.tenGV}</option>
          ))}
        </select>
        <select
          value={gvpb}
          onChange={e => { setGvpb(e.target.value); setPage(1); }}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white"
        >
          <option value="">Tất cả GVPB</option>
          {gvList.map(gv => (
            <option key={gv.maGV} value={gv.maGV}>{gv.tenGV}</option>
          ))}
        </select>
        <select
          value={trangThai}
          onChange={e => { setTrangThai(e.target.value); setPage(1); }}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="ChuaPhanCong">Chưa phân công</option>
          <option value="DaPhanCong">Đã phân công</option>
        </select>
        <input
          type="text"
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          placeholder="Tìm kiếm tên đề tài..."
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white"
          style={{ minWidth: 200 }}
        />
      </div>

      <div className="bg-white rounded-lg border border-slate-200 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50">
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Mã đề tài</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Tên đề tài</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">GVHD</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">GVPB</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i}>
                  {[...Array(5)].map((_, ci) => (
                    <td key={ci} className="px-4 py-3 border-t border-slate-100">
                      <div className="bg-slate-100 animate-pulse rounded h-4 w-3/4"></div>
                    </td>
                  ))}
                </tr>
              ))
            ) : deTais.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-16 text-center">
                  <p className="text-slate-500 font-semibold">Chưa có đề tài</p>
                  <p className="text-sm text-slate-400 mt-1">Không có dữ liệu phù hợp bộ lọc.</p>
                </td>
              </tr>
            ) : (
              deTais.map((dt, i) => (
                <tr key={dt.maDeTai} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm text-slate-700 border-t border-slate-100 text-center">{dt.maDeTai}</td>
                  <td className="px-4 py-3 text-sm text-slate-700 border-t border-slate-100">{dt.tenDeTai}</td>
                  <td className="px-4 py-3 text-sm text-slate-700 border-t border-slate-100">{dt.maGV_HD || <span className="text-slate-400">Chưa phân</span>}</td>
                  <td className="px-4 py-3 text-sm text-slate-700 border-t border-slate-100">{dt.maGV_PB || <span className="text-slate-400">Chưa phân</span>}</td>
                  <td className="px-4 py-3 text-sm text-slate-700 border-t border-slate-100 text-center">
                    <button className="text-sm text-blue-600 hover:text-blue-800 px-2 py-1 rounded transition-colors">Chỉnh sửa</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Phân trang giống trang sinh viên */}
      {total > 0 && (
        <div className="flex items-center justify-between mt-4">
          <span className="text-sm text-slate-500">Hiển thị {start}-{end} / {total} đề tài</span>
          <div className="flex gap-1">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 text-sm border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50"
            >
              Trước
            </button>
            {Array.from({ length: Math.ceil(total / perPage) }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1 text-sm border rounded ${page === i + 1 ? 'bg-blue-500 text-white border-blue-500' : 'border-slate-200 hover:bg-slate-50'}`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage(p => Math.min(Math.ceil(total / perPage), p + 1))}
              disabled={page >= Math.ceil(total / perPage)}
              className="px-3 py-1 text-sm border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50"
            >
              Sau
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
