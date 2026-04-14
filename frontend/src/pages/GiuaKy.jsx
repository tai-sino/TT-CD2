

import { useState, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDeTais } from '../services/deTaiService';
import { getKyLvtn } from '../services/kyLvtnService';
import { updateGiuaKy } from '../services/giuaKyService';
import { getLecturers } from '../services/giangVienService';

	export default function GiuaKy() {
	const queryClient = useQueryClient();
	const [editDeTai, setEditDeTai] = useState(null);
	// Chuẩn hóa lại cấu trúc dữ liệu theo mẫu JSON mapping
	const defaultForm = {
		tenDeTai: '',
		sinhVien: [
			{
				hoTen: '',
				mssv: '',
				lop: ''
			}
		],
		diemGiuaKy: '',
		nhanXetGiuaKy: ''
	};
	const [editForm, setEditForm] = useState(defaultForm);
	const [showEditModal, setShowEditModal] = useState(false);
	// Mutation cập nhật giữa kỳ
	const [saveSuccess, setSaveSuccess] = useState(false);
	const updateMut = useMutation({
		mutationFn: ({ deTaiId, data }) => updateGiuaKy(deTaiId, data),
		onSuccess: () => {
			setSaveSuccess(true);
			queryClient.invalidateQueries(['deTais']);
			setTimeout(() => {
				setShowEditModal(false);
				setEditDeTai(null);
				setEditForm(defaultForm);
				setSaveSuccess(false);
			}, 1500);
		},
	});
	const [kyId, setKyId] = useState('');
	const [search, setSearch] = useState('');
	const [page, setPage] = useState(1);

	// Lấy mã GV hiện tại từ localStorage (hoặc thay đổi nếu bạn lấy từ nơi khác)
	const getCurrentMaGV = () => {
		try {
			const user = JSON.parse(localStorage.getItem('user'));
			return user ? user.id : '';
		} catch {
			return '';
		}
	};
	const [selectedGVHD, setSelectedGVHD] = useState(getCurrentMaGV());

	// Nếu user đăng nhập thay đổi, cập nhật lại selectedGV
	useEffect(() => {
		setSelectedGVHD(getCurrentMaGV());
	}, []);

	// Lấy danh sách kỳ LVTN
	const { data: kyList } = useQuery({
		queryKey: ['kyLvtn'],
		queryFn: getKyLvtn,
	});

	// Lấy danh sách giảng viên
	const { data: lecturerList } = useQuery({
		queryKey: ['giangVien'],
		queryFn: getLecturers,
	});

	// Map mã GVHD -> tên GVHD
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

				{/* Dropdown lọc theo GVHD */}
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
							<th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Nhận xét giữa kỳ</th>
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
							tableData.map(deTai => (
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
									<td className="px-4 py-3 text-sm text-slate-700 border-t border-slate-100 align-middle">
										{deTai.nhanXetGiuaKy
											? <span className="block text-slate-700 whitespace-pre-line">{deTai.nhanXetGiuaKy}</span>
											: <span className="text-slate-400 italic">Chưa có</span>}
									</td>
									<td className="px-4 py-3 text-sm text-slate-700 border-t border-slate-100 align-middle">
										<button
											className="text-sm text-blue-600 hover:text-blue-800 font-semibold"
											onClick={() => {
												setEditDeTai(deTai);
												// Chuẩn bị form theo mẫu JSON mapping
												const svs = Array.isArray(deTai.sinhViens) ? deTai.sinhViens.map(sv => ({
													hoTen: sv.hoTen || '',
													mssv: sv.mssv || '',
													lop: sv.lop || '',
													diemPhanTich: sv.diemPhanTich || '',
													diemThietKe: sv.diemThietKe || '',
													diemHienThuc: sv.diemHienThuc || '',
													diemBaoCao: sv.diemBaoCao || '',
													diemTongCong: sv.diemTongCong || '',
													diemFinal: sv.diemFinal || '',
													deNghi: sv.deNghi || ''
												})) : [];
												// Lấy tên GVHD từ map nếu có
												let tenGVHD = deTai.tenGVHD || '';
												if (!tenGVHD && deTai.maGV_HD && gvhdMap[deTai.maGV_HD]) tenGVHD = gvhdMap[deTai.maGV_HD];
												setEditForm({
													tenDeTai: deTai.tenDeTai || '',
													tenGVHD,
													thuyetMinh_Dat: deTai.thuyetMinh_Dat || '',
													thuyetMinh_KhongDat: deTai.thuyetMinh_KhongDat || '',
													ndDieuChinh: deTai.ndDieuChinh || '',
													uuDiem: deTai.uuDiem || '',
													thieuSot: deTai.thieuSot || '',
													cauHoi: deTai.cauHoi || '',
													sinhVien: svs.length > 0 ? svs : defaultForm.sinhVien,
												});
												setShowEditModal(true);
											}}
										>Xử lý</button>
									</td>
								</tr>
							))
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

			{showEditModal && (
				<div className="fixed inset-0 bg-black/50 bg-opacity-30 flex items-center justify-center z-50">
					<div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
						<h2 className="text-lg font-semibold mb-4">Nhập điểm giữa kỳ</h2>
						{/* Các trường chung */}
						<div className="mb-3 grid grid-cols-1 gap-2">
							<label className="block text-xs font-medium text-slate-600 mb-1">Tên đề tài</label>
							<div className="border border-slate-200 rounded px-2 py-1 text-sm w-full bg-slate-100 text-slate-700">{editForm.tenDeTai}</div>
						</div>
						{/* Danh sách sinh viên */}
						<div className="mb-3">
							<label className="block text-xs font-medium text-slate-600 mb-1">Danh sách sinh viên</label>
							{editForm.sinhVien && editForm.sinhVien.map((sv, idx) => (
								<div key={idx} className="mb-2 border border-slate-200 rounded p-2 bg-slate-50">
									<div className="flex gap-2 mb-2">
										<div className="flex-1">
											<label className="block text-xs text-slate-500">MSSV</label>
											<div className="font-medium text-slate-800 text-sm bg-white rounded px-2 py-1 border border-slate-100">{sv.mssv}</div>
										</div>
										<div className="flex-1">
											<label className="block text-xs text-slate-500">Họ tên</label>
											<div className="font-medium text-slate-800 text-sm bg-white rounded px-2 py-1 border border-slate-100">{sv.hoTen}</div>
										</div>
									</div>
								</div>
							))}
						</div>
						<div className="mb-3">
							<label className="block text-xs font-medium text-slate-600 mb-1">Điểm giữa kỳ</label>
							<input className="border border-slate-300 rounded px-2 py-1 text-sm w-full focus:outline-blue-500" type="number" min="0" max="10" step="0.01" value={editForm.diemGiuaKy || ''} onChange={e => setEditForm(f => ({ ...f, diemGiuaKy: e.target.value }))} />
						</div>
						<div className="mb-3">
							<label className="block text-xs font-medium text-slate-600 mb-1">Nhận xét giữa kỳ</label>
							<textarea className="border border-slate-300 rounded px-2 py-1 text-sm w-full focus:outline-blue-500" rows={3} value={editForm.nhanXetGiuaKy || ''} onChange={e => setEditForm(f => ({ ...f, nhanXetGiuaKy: e.target.value }))} />
						</div>
						
						<div className="flex gap-2 justify-end mt-4">
							<button
							  className="px-4 py-2 rounded bg-slate-200 hover:bg-slate-300"
							  onClick={() => setShowEditModal(false)}
							>Hủy</button>
							<button
								className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
								disabled={updateMut.isLoading || saveSuccess}
								onClick={() => {
									if (!updateMut.isLoading && !saveSuccess) {
										updateMut.mutate({
											deTaiId: editDeTai?.maDeTai,
											data: editForm,
										});
									}
									
								}}
							>
								{saveSuccess ? 'Đã lưu!' : updateMut.isLoading ? 'Đang lưu...' : 'Lưu'}
							</button>
						</div>
						{updateMut.isError && <div className="text-red-500 mt-2 text-sm">Có lỗi xảy ra, vui lòng thử lại.</div>}
					</div>
				</div>
			)}
		</div>
	);
}
                              