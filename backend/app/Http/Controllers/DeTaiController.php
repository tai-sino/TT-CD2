<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\DeTai;
use App\Models\SinhVien;
use App\Models\GiangVien;
use PhpOffice\PhpWord\TemplateProcessor;

class DeTaiController extends Controller
{
    // Lấy danh sách đề tài

    // Lấy danh sách đề tài, filter nâng cao
    public function index(Request $request)
    {
        $query = DeTai::query();
        // Lọc theo mã GV hướng dẫn
        if ($request->filled('maGV_HD')) {
            $query->where('maGV_HD', $request->maGV_HD);
        }
        // Lọc theo mã hội đồng
        if ($request->filled('maHoiDong')) {
            $query->where('maHoiDong', $request->maHoiDong);
        }
        // Lọc theo kỳ LVTN
        if ($request->filled('ky_lvtn_id')) {
            $query->where('ky_lvtn_id', $request->ky_lvtn_id);
        }
        // Lọc theo trạng thái
        if ($request->filled('trangThai')) {
            $query->where('trangThai', $request->trangThai);
        }
        // Tìm kiếm tên đề tài
        if ($request->filled('q')) {
            $query->where('tenDeTai', 'like', '%' . $request->q . '%');
        }
        // Sắp xếp mới nhất
        $query->orderByDesc('maDeTai');
        $pageSize = $request->input('per_page', 15);

        

        $result = $query->paginate($pageSize);

        // Lấy danh sách mã đề tài trên trang này
        $maDeTaiArr = collect($result->items())->pluck('maDeTai')->all();
        // Lấy sinh viên theo mã đề tài
        $sinhVienMap = [];
        if (!empty($maDeTaiArr)) {
            $sinhViens = \App\Models\SinhVien::whereIn('maDeTai', $maDeTaiArr)->get();
            foreach ($sinhViens as $sv) {
                $sinhVienMap[$sv->maDeTai][] = [
                    'mssv' => $sv->mssv,
                    'hoTen' => $sv->hoTen,
                ];
            }
        }
        // Gắn thuộc tính sinhViens cho từng đề tài
        $result->getCollection()->transform(function ($deTai) use ($sinhVienMap) {
            $deTai->sinhViens = $sinhVienMap[$deTai->maDeTai] ?? [];
            return $deTai;
        });
        return response()->json($result);
    }

    // Lấy 1 đề tài
    public function show($id)
    {
        $detai = DeTai::find($id);
        if (!$detai) return response()->json(['message' => 'Not found'], 404);
        return response()->json($detai);
    }

    // Thêm đề tài

    public function store(Request $request)
    {
        $validated = $request->validate([
            'tenDeTai' => 'required|string|max:255',
            'moTa' => 'nullable|string',
            'maGV_HD' => 'required|string|max:20',
            'maGV_PB' => 'nullable|string|max:20',
            'maHoiDong' => 'nullable|integer',
            'ky_lvtn_id' => 'nullable|integer',
            'thuTuTrongHD' => 'nullable|integer',
            'ghiChu' => 'nullable|string',
            'trangThai' => 'nullable|string|max:50',
        ]);
        $detai = DeTai::create($validated);
        return response()->json($detai, 201);
    }

    // Cập nhật đề tài

    public function update(Request $request, $id)
    {
        $detai = DeTai::find($id);
        if (!$detai) return response()->json(['message' => 'Not found'], 404);
        $validated = $request->validate([
            'tenDeTai' => 'sometimes|required|string|max:255',
            'moTa' => 'nullable|string',
            'maGV_HD' => 'sometimes|required|string|max:20',
            'maGV_PB' => 'nullable|string|max:20',
            'maHoiDong' => 'nullable|integer',
            'ky_lvtn_id' => 'nullable|integer',
            'thuTuTrongHD' => 'nullable|integer',
            'ghiChu' => 'nullable|string',
            'trangThai' => 'nullable|string|max:50',
            'diemGiuaKy' => 'nullable|numeric',
            'nhanXetGiuaKy' => 'nullable|string',
            'trangThaiGiuaKy' => 'nullable|string',
        ]);
        $detai->update($validated);
        return response()->json($detai);
    }

    public function chamDiemHD(Request $request, $id)
    {
        $detai = DeTai::find($id);
        if (!$detai) return response()->json(['message' => 'Not found'], 404);

        if ($request->has('tieu_chi')) {
            $request->validate([
                'tieu_chi' => 'required|array',
                'tieu_chi.*' => 'numeric|min:0|max:10',
                'tong_diem' => 'required|numeric|min:0|max:10',
                'nhan_xet' => 'nullable|string',
            ]);
            $detai->tieuChiHD = $request->tieu_chi;
            $detai->diemHuongDan = $request->tong_diem;
            $detai->nhanXetHuongDan = $request->nhan_xet;
            $detai->save();
        } else {
            $validated = $request->validate([
                'diemHuongDan' => 'nullable|numeric|min:0|max:10',
                'nhanXetHuongDan' => 'nullable|string',
            ]);
            $detai->update($validated);
        }

        return response()->json($detai);
    }

    public function chamDiemPB(Request $request, $id)
    {
        $detai = DeTai::find($id);
        if (!$detai) return response()->json(['message' => 'Not found'], 404);

        if ($request->has('tieu_chi')) {
            $request->validate([
                'tieu_chi' => 'required|array',
                'tieu_chi.*' => 'numeric|min:0|max:10',
                'tong_diem' => 'required|numeric|min:0|max:10',
                'nhan_xet' => 'nullable|string',
            ]);
            $detai->tieuChiPB = $request->tieu_chi;
            $detai->diemPhanBien = $request->tong_diem;
            $detai->nhanXetPhanBien = $request->nhan_xet;
            $detai->save();
        } else {
            $validated = $request->validate([
                'diemPhanBien' => 'nullable|numeric|min:0|max:10',
                'nhanXetPhanBien' => 'nullable|string',
            ]);
            $detai->update($validated);
        }

        return response()->json($detai);
    }

    public function chamDiemGK(Request $request, $id)
    {
        $detai = DeTai::find($id);
        if (!$detai) return response()->json(['message' => 'Not found'], 404);

        $request->validate([
            'tieu_chi' => 'required|array',
            'tieu_chi.*' => 'numeric|min:0|max:10',
            'tong_diem' => 'required|numeric|min:0|max:10',
            'nhan_xet' => 'nullable|string',
            'trang_thai' => 'nullable|string',
        ]);

        $trangThai = $request->trang_thai;
        if (!$trangThai) {
            $trangThai = $request->tong_diem >= 5 ? 'dat' : 'khong_dat';
        }

        $detai->tieuChiGK = $request->tieu_chi;
        $detai->diemGiuaKy = $request->tong_diem;
        $detai->nhanXetGiuaKy = $request->nhan_xet;
        $detai->trangThaiGiuaKy = $trangThai;
        $detai->save();

        return response()->json($detai);
    }

    // Xoá đề tài
    public function destroy($id)
    {
        $detai = DeTai::find($id);
        if (!$detai) return response()->json(['message' => 'Not found'], 404);
        $detai->delete();
        return response()->json(['message' => 'Deleted']);
    }

    public function exportGVHD($id)
    {
        $detai = DeTai::find($id);
        if (!$detai) return response()->json(['message' => 'Not found'], 404);

        $svList = SinhVien::where('maDeTai', $id)->get();
        $gvhd = GiangVien::find($detai->maGV_HD);

        $templateDir = storage_path('app/templates');
        if (count($svList) >= 2) {
            $templateFile = $templateDir . '/Mau_01_01.docx';
        } else {
            $templateFile = $templateDir . '/Mau_01_02.docx';
        }

        $tp = new TemplateProcessor($templateFile);

        $tp->setValue('ten_de_tai', $detai->tenDeTai ?? '');
        $tp->setValue('ten_gvhd', $gvhd ? $gvhd->tenGV : '');

        $tieuChi = $detai->tieuChiHD ?? [];
        for ($i = 1; $i <= 5; $i++) {
            $tp->setValue('tc' . $i, $tieuChi['tc' . $i] ?? '');
        }

        $diem = $detai->diemHuongDan ?? '';
        $tp->setValue('diem_tong', $diem);
        $tp->setValue('diem_chu', $diem !== '' ? $this->diemSangChu((float)$diem) : '');
        $tp->setValue('nhan_xet', $detai->nhanXetHuongDan ?? '');

        $now = now();
        $tp->setValue('ngay', $now->day);
        $tp->setValue('thang', $now->month);
        $tp->setValue('nam', $now->year);

        if (count($svList) >= 2) {
            $sv1 = $svList[0];
            $sv2 = $svList[1];
            $tp->setValue('ho_ten_sv_01', $sv1->hoTen ?? '');
            $tp->setValue('mssv_01', $sv1->mssv ?? '');
            $tp->setValue('lop_01', $sv1->lop ?? '');
            $tp->setValue('ho_ten_sv_02', $sv2->hoTen ?? '');
            $tp->setValue('mssv_02', $sv2->mssv ?? '');
            $tp->setValue('lop_02', $sv2->lop ?? '');
        } else {
            $sv = $svList->first();
            $tp->setValue('ho_ten_sv', $sv ? $sv->hoTen : '');
            $tp->setValue('mssv', $sv ? $sv->mssv : '');
            $tp->setValue('lop', $sv ? $sv->lop : '');
        }

        $tempFile = $tp->save();
        $filename = 'Phieu_cham_HD_' . $detai->maDeTai . '.docx';
        return response()->download($tempFile, $filename)->deleteFileAfterSend(true);
    }

    public function exportGVPB($id)
    {
        $detai = DeTai::find($id);
        if (!$detai) return response()->json(['message' => 'Not found'], 404);

        $svList = SinhVien::where('maDeTai', $id)->get();
        $gvpb = GiangVien::find($detai->maGV_PB);

        $templateDir = storage_path('app/templates');
        if (count($svList) >= 2) {
            $templateFile = $templateDir . '/Mau_02_01.docx';
        } else {
            $templateFile = $templateDir . '/Mau_02_02.docx';
        }

        $tp = new TemplateProcessor($templateFile);

        $tp->setValue('ten_de_tai', $detai->tenDeTai ?? '');
        $tp->setValue('ten_gvpb', $gvpb ? $gvpb->tenGV : '');

        $tieuChi = $detai->tieuChiPB ?? [];
        for ($i = 1; $i <= 5; $i++) {
            $tp->setValue('tc' . $i, $tieuChi['tc' . $i] ?? '');
        }

        $diem = $detai->diemPhanBien ?? '';
        $tp->setValue('diem_tong', $diem);
        $tp->setValue('diem_chu', $diem !== '' ? $this->diemSangChu((float)$diem) : '');
        $tp->setValue('nhan_xet', $detai->nhanXetPhanBien ?? '');

        $now = now();
        $tp->setValue('ngay', $now->day);
        $tp->setValue('thang', $now->month);
        $tp->setValue('nam', $now->year);

        if (count($svList) >= 2) {
            $sv1 = $svList[0];
            $sv2 = $svList[1];
            $tp->setValue('ho_ten_sv_01', $sv1->hoTen ?? '');
            $tp->setValue('mssv_01', $sv1->mssv ?? '');
            $tp->setValue('lop_01', $sv1->lop ?? '');
            $tp->setValue('ho_ten_sv_02', $sv2->hoTen ?? '');
            $tp->setValue('mssv_02', $sv2->mssv ?? '');
            $tp->setValue('lop_02', $sv2->lop ?? '');
        } else {
            $sv = $svList->first();
            $tp->setValue('ho_ten_sv', $sv ? $sv->hoTen : '');
            $tp->setValue('mssv', $sv ? $sv->mssv : '');
            $tp->setValue('lop', $sv ? $sv->lop : '');
        }

        $tempFile = $tp->save();
        $filename = 'Phieu_cham_PB_' . $detai->maDeTai . '.docx';
        return response()->download($tempFile, $filename)->deleteFileAfterSend(true);
    }

    private function diemSangChu($diem)
    {
        $map = [
            0 => 'Không', 1 => 'Một', 2 => 'Hai', 3 => 'Ba', 4 => 'Bốn',
            5 => 'Năm', 6 => 'Sáu', 7 => 'Bảy', 8 => 'Tám', 9 => 'Chín', 10 => 'Mười',
        ];
        $floor = (int) $diem;
        $dec = round($diem - $floor, 1);
        if ($dec == 0) {
            return ($map[$floor] ?? $floor) . ' điểm';
        }
        $decStr = $dec == 0.5 ? 'năm' : str_replace('0.', '', (string)$dec);
        return ($map[$floor] ?? $floor) . ' phẩy ' . $decStr . ' điểm';
    }
}
