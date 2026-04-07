import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  useReactTable, getCoreRowModel, getPaginationRowModel, flexRender,
} from '@tanstack/react-table';
import { HiOutlineXMark, HiOutlineExclamationTriangle } from 'react-icons/hi2';
import { getStudents, importStudents, createStudent, updateStudent, deleteStudent } from '../../services/sinhVienService';
import { getKyLvtn } from '../../services/kyLvtnService';
import { getLecturers } from '../../services/giangVienService';

export default function SinhVien() {
  const queryClient = useQueryClient();

  const [kyId, setKyId] = useState('');
  const [lop, setLop] = useState('');
  const [gvhdId, setGvhdId] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const [showImportModal, setShowImportModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);

  const { data: kyList } = useQuery({
    queryKey: ['kyLvtn'],
    queryFn: getKyLvtn,
  });

  const { data: gvList } = useQuery({
    queryKey: ['giangvien'],
    queryFn: getLecturers,
  });

  const { data: svData, isLoading } = useQuery({
    queryKey: ['sinhvien', { ky_id: kyId, lop, gvhd_id: gvhdId, search, page }],
    queryFn: () => getStudents({ ky_id: kyId || undefined, lop: lop || undefined, gvhd_id: gvhdId || undefined, search: search || undefined, page }),
  });

  const columns = useMemo(() => [
    { accessorKey: 'mssv', header: 'MSSV' },
    { accessorKey: 'hoTen', header: 'Ho ten' },
    { accessorKey: 'lop', header: 'Lop' },
    { accessorKey: 'email', header: 'Email' },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex gap-3">
          <button onClick={() => openEdit(row.original)} className="text-sm text-blue-600 hover:text-blue-800">Sua</button>
          <button onClick={() => { setDeleteItem(row.original); setShowDeleteConfirm(true); }} className="text-sm text-red-500 hover:text-red-700">Xoa</button>
        </div>
      ),
    },
  ], []);

  const tableData = svData?.data || [];
  const total = svData?.total || 0;
  const perPage = svData?.per_page || 15;

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: Math.ceil(total / perPage),
  });

  const lopList = useMemo(() => {
    if (!tableData.length) return [];
    const set = new Set(tableData.map(s => s.lop).filter(Boolean));
    return [...set];
  }, [tableData]);

  const deleteMut = useMutation({
    mutationFn: (mssv) => deleteStudent(mssv),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sinhvien'] });
      setShowDeleteConfirm(false);
      setDeleteItem(null);
    },
  });

  function openEdit(item) {
    setEditItem(item);
    setShowFormModal(true);
  }

  function openCreate() {
    setEditItem(null);
    setShowFormModal(true);
  }

  const start = (page - 1) * perPage + 1;
  const end = Math.min(page * perPage, total);

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900 mb-6">Sinh vien</h1>

      <div className="flex items-center gap-4 mb-4 flex-wrap">
        <select
          value={kyId}
          onChange={e => { setKyId(e.target.value); setPage(1); }}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white"
        >
          <option value="">Tat ca ky</option>
          {kyList?.data?.map(k => (
            <option key={k.id} value={k.id}>{k.ten}</option>
          ))}
        </select>

        <select
          value={lop}
          onChange={e => { setLop(e.target.value); setPage(1); }}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white"
        >
          <option value="">Tat ca lop</option>
          {lopList.map(l => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>

        <select
          value={gvhdId}
          onChange={e => { setGvhdId(e.target.value); setPage(1); }}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white"
        >
          <option value="">Tat ca GVHD</option>
          {gvList?.data?.map(gv => (
            <option key={gv.maGV} value={gv.maGV}>{gv.tenGV}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Tim theo MSSV, ho ten..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          className="border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none flex-1 min-w-[200px]"
        />

        <button
          onClick={() => setShowImportModal(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          Import Excel
        </button>
        <button
          onClick={openCreate}
          className="border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          Them sinh vien
        </button>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map(hg => (
              <tr key={hg.id} className="bg-slate-50">
                {hg.headers.map(header => (
                  <th key={header.id} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i}>
                  {columns.map((_, ci) => (
                    <td key={ci} className="px-4 py-3 border-t border-slate-100">
                      <div className="bg-slate-100 animate-pulse rounded h-4 w-3/4"></div>
                    </td>
                  ))}
                </tr>
              ))
            ) : tableData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-16 text-center">
                  <p className="text-slate-500 font-semibold">Chua co sinh vien</p>
                  <p className="text-sm text-slate-400 mt-1">Import danh sach sinh vien tu file Excel de bat dau.</p>
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map(row => (
                <tr key={row.id} className="hover:bg-slate-50">
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="px-4 py-3 text-sm text-slate-700 border-t border-slate-100">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {total > 0 && (
        <div className="flex items-center justify-between mt-4">
          <span className="text-sm text-slate-500">Hien thi {start}-{end} / {total} sinh vien</span>
          <div className="flex gap-1">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 text-sm border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50"
            >
              Truoc
            </button>
            {[...Array(Math.ceil(total / perPage))].map((_, i) => (
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

      {showImportModal && <ImportModal kyList={kyList?.data || []} onClose={() => setShowImportModal(false)} />}

      {showFormModal && (
        <FormModal
          editItem={editItem}
          kyList={kyList?.data || []}
          onClose={() => { setShowFormModal(false); setEditItem(null); }}
        />
      )}

      {showDeleteConfirm && deleteItem && (
        <DeleteConfirm
          item={deleteItem}
          loading={deleteMut.isPending}
          onConfirm={() => deleteMut.mutate(deleteItem.mssv)}
          onCancel={() => { setShowDeleteConfirm(false); setDeleteItem(null); }}
        />
      )}
    </div>
  );
}

function ImportModal({ kyList, onClose }) {
  const queryClient = useQueryClient();
  const [file, setFile] = useState(null);
  const [selectedKy, setSelectedKy] = useState('');
  const [result, setResult] = useState(null);

  const importMut = useMutation({
    mutationFn: () => importStudents(file, selectedKy),
    onSuccess: (data) => {
      setResult(data);
      queryClient.invalidateQueries({ queryKey: ['sinhvien'] });
    },
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-xl p-6 max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600" aria-label="Dong">
          <HiOutlineXMark size={20} />
        </button>

        <h2 className="text-xl font-semibold text-slate-900 mb-4">Import danh sach sinh vien</h2>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-slate-700 mb-1">Ky LVTN</label>
          <select
            value={selectedKy}
            onChange={e => setSelectedKy(e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white"
          >
            <option value="">Chon ky...</option>
            {kyList.map(k => (
              <option key={k.id} value={k.id}>{k.ten}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-slate-700 mb-1">File Excel</label>
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={e => setFile(e.target.files[0] || null)}
            className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
          />
        </div>

        <button
          onClick={() => importMut.mutate()}
          disabled={!file || !selectedKy || importMut.isPending}
          className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          {importMut.isPending ? 'Dang xu ly...' : 'Import'}
        </button>

        {importMut.isError && (
          <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg mt-4">
            Khong the import file. Vui long thu lai.
          </div>
        )}

        {result && (
          <div className="mt-4">
            {result.imported > 0 && (
              <div className="bg-green-50 text-green-700 text-sm px-4 py-3 rounded-lg">
                Da import {result.imported} sinh vien thanh cong.
              </div>
            )}
            {result.errors?.length > 0 && (
              <div className="mt-3 border border-amber-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-amber-50">
                      <th className="px-3 py-2 text-left text-xs font-semibold text-amber-700">Dong</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-amber-700">Loi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.errors.map((err, i) => (
                      <tr key={i} className="border-t border-amber-100">
                        <td className="px-3 py-2 text-sm text-slate-700">{err.row}</td>
                        <td className="px-3 py-2 text-sm text-slate-700">{err.message}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function FormModal({ editItem, kyList, onClose }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    mssv: editItem?.mssv || '',
    hoTen: editItem?.hoTen || '',
    lop: editItem?.lop || '',
    email: editItem?.email || '',
    ky_lvtn_id: editItem?.ky_lvtn_id || '',
  });
  const [errors, setErrors] = useState({});

  const createMut = useMutation({
    mutationFn: (data) => createStudent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sinhvien'] });
      onClose();
    },
    onError: (err) => {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {});
      }
    },
  });

  const updateMut = useMutation({
    mutationFn: (data) => updateStudent(editItem.mssv, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sinhvien'] });
      onClose();
    },
    onError: (err) => {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {});
      }
    },
  });

  const loading = createMut.isPending || updateMut.isPending;

  function handleSubmit(e) {
    e.preventDefault();
    setErrors({});
    if (editItem) {
      updateMut.mutate({ hoTen: form.hoTen, lop: form.lop, email: form.email, ky_lvtn_id: form.ky_lvtn_id });
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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600" aria-label="Dong">
          <HiOutlineXMark size={20} />
        </button>

        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          {editItem ? 'Sua sinh vien' : 'Them sinh vien'}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-slate-700 mb-1">MSSV</label>
            <input
              type="text"
              value={form.mssv}
              onChange={e => handleChange('mssv', e.target.value)}
              disabled={!!editItem || loading}
              className={`w-full border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50 ${errors.mssv ? 'border-red-300' : 'border-slate-200'}`}
            />
            {errors.mssv && <p className="text-red-500 text-xs mt-1">{errors.mssv[0]}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-slate-700 mb-1">Ho ten</label>
            <input
              type="text"
              value={form.hoTen}
              onChange={e => handleChange('hoTen', e.target.value)}
              disabled={loading}
              className={`w-full border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50 ${errors.hoTen ? 'border-red-300' : 'border-slate-200'}`}
            />
            {errors.hoTen && <p className="text-red-500 text-xs mt-1">{errors.hoTen[0]}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-slate-700 mb-1">Lop</label>
            <input
              type="text"
              value={form.lop}
              onChange={e => handleChange('lop', e.target.value)}
              disabled={loading}
              className={`w-full border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50 ${errors.lop ? 'border-red-300' : 'border-slate-200'}`}
            />
            {errors.lop && <p className="text-red-500 text-xs mt-1">{errors.lop[0]}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-slate-700 mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={e => handleChange('email', e.target.value)}
              disabled={loading}
              className={`w-full border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50 ${errors.email ? 'border-red-300' : 'border-slate-200'}`}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email[0]}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-slate-700 mb-1">Ky LVTN</label>
            <select
              value={form.ky_lvtn_id}
              onChange={e => handleChange('ky_lvtn_id', e.target.value)}
              disabled={loading}
              className={`w-full border rounded-lg px-3 py-3 text-sm bg-white disabled:opacity-50 ${errors.ky_lvtn_id ? 'border-red-300' : 'border-slate-200'}`}
            >
              <option value="">Chon ky...</option>
              {kyList.map(k => (
                <option key={k.id} value={k.id}>{k.ten}</option>
              ))}
            </select>
            {errors.ky_lvtn_id && <p className="text-red-500 text-xs mt-1">{errors.ky_lvtn_id[0]}</p>}
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button type="button" onClick={onClose} className="border border-slate-200 text-slate-700 hover:bg-slate-50 px-4 py-2 text-sm rounded-lg">
              Huy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Dang luu...' : 'Luu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DeleteConfirm({ item, loading, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onCancel}>
      <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4 text-center" onClick={e => e.stopPropagation()}>
        <HiOutlineExclamationTriangle className="text-red-500 mx-auto mb-3" size={40} />
        <h3 className="text-xl font-semibold text-slate-900">Xoa sinh vien?</h3>
        <p className="text-sm text-slate-500 mt-2">
          Ban co chac muon xoa sinh vien {item.hoTen} ({item.mssv})? Hanh dong nay khong the hoan tac.
        </p>
        <div className="flex justify-center gap-3 mt-6">
          <button onClick={onCancel} className="border border-slate-200 text-slate-700 hover:bg-slate-50 px-4 py-2 text-sm rounded-lg">
            Huy
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Dang xoa...' : 'Xoa'}
          </button>
        </div>
      </div>
    </div>
  );
}
