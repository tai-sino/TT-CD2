<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\DeTai;

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
        $validated = $request->validate([
            'diemHuongDan' => 'nullable|numeric|min:0|max:10',
            'nhanXetHuongDan' => 'nullable|string',
        ]);
        $detai->update($validated);
        return response()->json($detai);
    }

    public function chamDiemPB(Request $request, $id)
    {
        $detai = DeTai::find($id);
        if (!$detai) return response()->json(['message' => 'Not found'], 404);
        $validated = $request->validate([
            'diemPhanBien' => 'nullable|numeric|min:0|max:10',
            'nhanXetPhanBien' => 'nullable|string',
        ]);
        $detai->update($validated);
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
}
