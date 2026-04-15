import { useState, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDeTais } from '../services/deTaiService';
import { getKyLvtn } from '../services/kyLvtnService';
import { chamDiemGK } from '../services/giuaKyService';
import { getLecturers } from '../services/giangVienService';

const tieuChiLabels = [
  'Phân tích yêu cầu',
  'Thiết kế hệ thống',
  'Hiện thực',
  'Báo cáo / thuyết minh',
  'Trình bày / demo',
];

const defaultTieuChi = { tc1: '', tc2: '', tc3: '', tc4: '', tc5: '' };

function tinhTong(tieuChi) {
  const vals = Object.values(tieuChi).map(v => parseFloat(v) || 0);
  if (vals.length === 0) return 0;
  const sum = vals.reduce((a, b) => a + b, 0);
  return Math.round((sum / vals.length) * 10) / 10;
}

export default function GiuaKy() {
	const queryClient = useQueryClient();
	const [editDeTai, setEditDeTai] = useState(null);
	const [editForm, setEditForm] = useState({});
	const [showEditModal, setShowEditModal] = useState(false);
	const [saveSuccess, setSaveSuccess] = useState(false);

	const updateMut = useMutation({
		mutationFn: ({ deTaiId, data }) => chamDiemGK(deTaiId, data),
		onSuccess: () => {
			setSaveSuccess(true);
			queryClient.invalidateQueries(['deTais']);
			setTimeout(() => {
				setShowEditModal(false);
				setEditDeTai(null);
				setEditForm({});
				setSaveSuccess(false);
			}, 1500);
		},
	});

	const [kyId, setKyId] = useState('');
	const [search, setSearch] = useState('');
	const [page, setPage] = useState(1);

	const getCurrentMaGV = () => {
		try {
			const user = JSON.parse(localStorage.getItem('user'));
			return user ? user.id : '';
		} catch {
			return '';
		}
	};
	const [selectedGVHD, setSelectedGVHD] = useState(getCurrentMaGV());

	useEffect(() => {
		setSelectedGVHD(getCurrentMaGV());
	}, []);

	const { data: kyList } = useQuery({
		queryKey: ['kyLvtn'],
		queryFn: getKyLvtn,
	});

	const { data: lecturerList } = useQuery({
		queryKey: ['giangVien'],
		queryFn: getLecturers,
	});

	const gvhdMap = useMemo(() => {
		if (!lecturerList?.data) return {};
		const map = {};
		for (const gv of lecturerList.data) {
			map[gv.maGV] = gv.tenGV;
		}
		return map;
	}, [lecturerList]);

	const { data: deTaiData, isLoading } = useQuery({
		queryKey: ['deTais', { ky_id: kyId, q: search, page, maGV_HD: selectedGVHD }],
		queryFn: () => getDeTais({ ky_id: kyId || undefined, q: search || undefined, page, maGV_HD: selectedGVHD || undefined }),
	});

	const tableData = deTaiData?.data || [];
	const total = deTaiData?.total || 0;
	const perPage = deTaiData?.per_page || 15;

	function openEdit(deTai) {
		setEditDeTai(deTai);
		let tieuChi = { ...defaultTieuChi };
		let nhanXet = deTai.nhanXetGiuaKy ?? '';

		if (deTai.tieuChiGK) {
			tieuChi = { ...defaultTieuChi, ...deTai.tieuChiGK };
		}

		const tong = tinhTong(tieuChi);
		setEditForm({ tieu_chi: tieuChi, tong_diem: tong, nhan_xet: nhanXet });
		setSaveSuccess(false);
		setShowEditModal(true);
	}

	function handleTieuChiChange(key, val) {
		setEditForm(f => {
			const tieuChi = { ...f.tieu_chi, [key]: val };
			const tong = tinhTong(tieuChi);
			return { ...f, tieu_chi: tieuChi, tong_diem: tong };
		});
	}

	const trangThaiGiuaKy = editForm.tong_diem >= 5 ? 'Đạt' : 'Không đạt';

	return (
		<div>
			<h1 className="text-xl font-semibold text-slate-900 mb-6">Danh sách đề tài giữa kỳ</h1>
			<div className="flex items-center gap-4 mb-4 flex-wrap">
				<select
					value={kyId}
					onChange={e => { setKyId(e.target.value); setPage(1); }}
					className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white"
				>
					<option value="">Tất cả kỳ</option>
					{kyList?.data?.map(k => (
						<option key={k.id} value={k.id}>{k.ten}</option>
					))}
				</select>

				<select
					value={selectedGVHD}
					onChange={e => { setSelectedGVHD(e.target.value); setPage(1); }}
					className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white"
				>
					<option value="">Tất cả GVHD</option>
					{lecturerList?.data?.map(gv => (
						<option key={gv.maGV} value={gv.maGV}>{gv.tenGV}</option>
					))}
				</select>

				<input
					value={search}
					onChange={e => setSearch(e.target.value)}
					placeholder="Tìm kiếm đề tài..."
					className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white"
				/>
			</div>

			<div className="bg-white rounded-lg border border-slate-200 overflow-x-auto">
				<table className="w-full">
					<thead>
						<tr className="bg-slate-50">
							<th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Tên đề tài</th>
							<th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">GVHD</th>
							<th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Sinh viên</th>
							<th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Điểm giữa kỳ</th>
							<th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Trạng thái</th>
							<th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Thao tác</th>
						</tr>
					</thead>
					<tbody>
						{isLoading ? (
							[...Array(5)].map((_, i) => (
								<tr key={i}>
									{[...Array(6)].map((_, ci) => (
										<td key={ci} className="px-4 py-3 border-t border-slate-100">
											<div className="bg-slate-100 animate-pulse rounded h-4 w-3/4"></div>
										</td>
									))}
								</tr>
							))
						) : tableData.length === 0 ? (
							<tr>
								<td colSpan={6} className="px-4 py-16 text-center">
									<p className="text-slate-500 font-semibold">Chưa có đề tài</p>
									<p className="text-sm text-slate-400 mt-1">Không có dữ liệu phù hợp.</p>
								</td>
							</tr>
						) : (
							tableData.map(deTai => {
								const trangThai = deTai.trangThaiGiuaKy;
								return (
									<tr key={deTai.maDeTai} className="hover:bg-slate-50">
										<td className="px-4 py-3 text-sm text-slate-700 border-t border-slate-100 font-semibold whitespace-nowrap align-middle">{deTai.tenDeTai}</td>
										<td className="px-4 py-3 text-sm text-slate-700 border-t border-slate-100 whitespace-nowrap align-middle">
											{deTai.maGV_HD && gvhdMap[deTai.maGV_HD]
												? gvhdMap[deTai.maGV_HD]
												: (deTai.maGV_HD || <span className="text-slate-400 italic">Chưa có</span>)}
										</td>
										<td className="px-4 py-3 text-sm text-slate-700 border-t border-slate-100 align-middle">
											{Array.isArray(deTai.sinhViens) && deTai.sinhViens.length > 0 ? (
												<div className="flex flex-col gap-1">
													{deTai.sinhViens.map(sv => (
														<span key={sv.mssv} className="block text-slate-700">
															{sv.hoTen} (<span className="font-medium text-slate-800">{sv.mssv}</span>)
														</span>
													))}
												</div>
											) : <span className="text-slate-400 italic">Chưa có</span>}
										</td>
										<td className="px-4 py-3 text-sm text-slate-700 border-t border-slate-100 text-center align-middle">
											{deTai.diemGiuaKy !== undefined && deTai.diemGiuaKy !== null
												? <span className="font-semibold text-blue-600">{deTai.diemGiuaKy}</span>
												: <span className="text-slate-400 italic">Chưa có</span>}
										</td>
										<td className="px-4 py-3 border-t border-slate-100 align-middle">
											{trangThai ? (
												<span className={`px-2 py-1 rounded text-xs font-medium ${trangThai === 'Đạt' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
													{trangThai}
												</span>
											) : <span className="text-slate-400 italic text-sm">Chưa có</span>}
										</td>
										<td className="px-4 py-3 text-sm text-slate-700 border-t border-slate-100 align-middle">
											<button
												className="text-sm text-blue-600 hover:text-blue-800 font-semibold"
												onClick={() => openEdit(deTai)}
											>Xử lý</button>
										</td>
									</tr>
								);
							})
						)}
					</tbody>
				</table>
			</div>

			{total > perPage && (
				<div className="flex items-center justify-between mt-4">
					<span className="text-sm text-slate-500">Hiển thị {(page - 1) * perPage + 1}-{Math.min(page * perPage, total)} / {total} đề tài</span>
					<div className="flex gap-1">
						<button
							onClick={() => setPage(p => Math.max(1, p - 1))}
							disabled={page === 1}
							className="px-3 py-1 text-sm border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50"
						>Trước</button>
						{[...Array(Math.ceil(total / perPage))].map((_, i) => (
							<button
								key={i}
								onClick={() => setPage(i + 1)}
								className={`px-3 py-1 text-sm border rounded ${page === i + 1 ? 'bg-blue-500 text-white border-blue-500' : 'border-slate-200 hover:bg-slate-50'}`}
							>{i + 1}</button>
						))}
						<button
							onClick={() => setPage(p => Math.min(Math.ceil(total / perPage), p + 1))}
							disabled={page >= Math.ceil(total / perPage)}
							className="px-3 py-1 text-sm border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50"
						>Sau</button>
					</div>
				</div>
			)}

			{showEditModal && editDeTai && (
				<div className="fixed inset-0 bg-black/50 bg-opacity-30 flex items-center justify-center z-50">
					<div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
						<h2 className="text-lg font-semibold mb-1">Nhập điểm giữa kỳ</h2>
						<p className="text-sm text-slate-500 mb-4">{editDeTai.tenDeTai}</p>

						{Array.isArray(editDeTai.sinhViens) && editDeTai.sinhViens.length > 0 && (
							<div className="mb-4 bg-slate-50 rounded p-3">
								<p className="text-xs font-medium text-slate-500 mb-1">Sinh viên</p>
								{editDeTai.sinhViens.map(sv => (
									<p key={sv.mssv} className="text-sm text-slate-700">{sv.hoTen} — {sv.mssv}</p>
								))}
							</div>
						)}

						<div className="mb-4">
							<p className="text-xs font-medium text-slate-600 mb-2">Tiêu chí chấm điểm (0–10)</p>
							{tieuChiLabels.map((label, i) => {
								const key = `tc${i + 1}`;
								return (
									<div key={key} className="flex items-center gap-3 mb-2">
										<label className="text-sm text-slate-600 flex-1">{label}</label>
										<input
											type="number"
											min="0"
											max="10"
											step="0.5"
											value={editForm.tieu_chi?.[key] ?? ''}
											onChange={e => handleTieuChiChange(key, e.target.value)}
											className="border border-slate-300 rounded px-2 py-1 text-sm w-20 focus:outline-blue-500"
										/>
									</div>
								);
							})}
							<div className="flex items-center gap-3 mt-3 pt-3 border-t border-slate-200">
								<span className="text-sm font-medium text-slate-700 flex-1">Tổng điểm (trung bình)</span>
								<span className="text-base font-bold text-blue-600 w-20 text-center">
									{editForm.tong_diem ?? 0}
								</span>
							</div>
							<div className="flex items-center gap-3 mt-2">
								<span className="text-sm text-slate-600 flex-1">Trạng thái</span>
								<span className={`px-2 py-1 rounded text-xs font-medium ${trangThaiGiuaKy === 'Đạt' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
									{trangThaiGiuaKy}
								</span>
							</div>
						</div>

						<div className="mb-4">
							<label className="block text-xs font-medium text-slate-600 mb-1">Nhận xét</label>
							<textarea
								rows={3}
								value={editForm.nhan_xet ?? ''}
								onChange={e => setEditForm(f => ({ ...f, nhan_xet: e.target.value }))}
								className="border border-slate-300 rounded px-2 py-1 text-sm w-full focus:outline-blue-500"
							/>
						</div>

						<div className="flex gap-2 justify-end mt-4">
							<button
								className="px-4 py-2 rounded bg-slate-200 hover:bg-slate-300 text-sm"
								onClick={() => setShowEditModal(false)}
							>Hủy</button>
							<button
								className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 text-sm disabled:opacity-60"
								disabled={updateMut.isPending || saveSuccess}
								onClick={() => {
									if (!updateMut.isPending && !saveSuccess) {
										updateMut.mutate({
											deTaiId: editDeTai?.maDeTai,
											data: {
												tieu_chi: editForm.tieu_chi,
												tong_diem: editForm.tong_diem,
												nhan_xet: editForm.nhan_xet,
											},
										});
									}
								}}
							>
								{saveSuccess ? 'Đã lưu!' : updateMut.isPending ? 'Đang lưu...' : 'Lưu'}
							</button>
						</div>
						{updateMut.isError && <div className="text-red-500 mt-2 text-sm">Có lỗi xảy ra, vui lòng thử lại.</div>}
					</div>
				</div>
			)}
		</div>
	);
}
