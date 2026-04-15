<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\SinhVienController;
use App\Http\Controllers\GiangVienController;
use App\Http\Controllers\KyLvtnController;
use App\Http\Controllers\TopicRegistrationFormController;
use Illuminate\Support\Facades\DB;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::post('/students/import', [SinhVienController::class, 'import']);
    Route::get('/students/lop-list', [SinhVienController::class, 'lopList']);
    Route::get('/students', [SinhVienController::class, 'index']);
    Route::post('/students', [SinhVienController::class, 'store']);
    Route::put('/students/{mssv}', [SinhVienController::class, 'update']);
    Route::delete('/students/{mssv}', [SinhVienController::class, 'destroy']);

    Route::get('/giang-vien', [GiangVienController::class, 'index']);
    Route::post('/giang-vien', [GiangVienController::class, 'store']);
    Route::put('/giang-vien/{maGV}', [GiangVienController::class, 'update']);
    Route::delete('/giang-vien/{maGV}', [GiangVienController::class, 'destroy']);

    Route::get('/ky-lvtn', [KyLvtnController::class, 'index']);
    Route::post('/ky-lvtn', [KyLvtnController::class, 'store']);
    Route::put('/ky-lvtn/{id}', [KyLvtnController::class, 'update']);

    Route::get('/nhap-lieu', [TopicRegistrationFormController::class, 'index']);
    Route::post('/nhap-lieu', [TopicRegistrationFormController::class, 'store']);
    Route::put('/nhap-lieu/{id}', [TopicRegistrationFormController::class, 'update']);
    Route::delete('/nhap-lieu/{id}', [TopicRegistrationFormController::class, 'destroy']);

    Route::post('/topic-registration-form/{id}/approve', [TopicRegistrationFormController::class, 'approve']);
    Route::post('/nhap-lieu-import-excel', [TopicRegistrationFormController::class, 'importExcel']);

    // Lấy giai đoạn hiện tại
    Route::get('/giai-doan', [\App\Http\Controllers\CauHinhController::class, 'giaiDoan']);

    // CRUD Đề tài
    Route::get('/de-tai', [\App\Http\Controllers\DeTaiController::class, 'index']);
    Route::get('/de-tai/{id}', [\App\Http\Controllers\DeTaiController::class, 'show']);
    Route::post('/de-tai', [\App\Http\Controllers\DeTaiController::class, 'store']);
    Route::put('/de-tai/{id}', [\App\Http\Controllers\DeTaiController::class, 'update']);
    Route::put('/de-tai/{id}/cham-diem-hd', [\App\Http\Controllers\DeTaiController::class, 'chamDiemHD']);
    Route::put('/de-tai/{id}/cham-diem-pb', [\App\Http\Controllers\DeTaiController::class, 'chamDiemPB']);
    Route::put('/de-tai/{id}/cham-diem-gk', [\App\Http\Controllers\DeTaiController::class, 'chamDiemGK']);
    Route::delete('/de-tai/{id}', [\App\Http\Controllers\DeTaiController::class, 'destroy']);
    Route::get('/de-tai/{id}/export/gvhd', [\App\Http\Controllers\DeTaiController::class, 'exportGVHD']);
    Route::get('/de-tai/{id}/export/gvpb', [\App\Http\Controllers\DeTaiController::class, 'exportGVPB']);


    // API thống kê tổng quan cho dashboard
    Route::get('/stats', function () {
        // Sử dụng Model Eloquent thay vì DB facade
        $giaidoan = \App\Models\CauHinh::where('key', 'giaiDoan')->value('value');
        $sodetai = \App\Models\DeTai::count();
        $sosinhvien = \App\Models\SinhVien::count();
        $detai_daxong = \App\Models\DeTai::where('trangthai', 'dat')->count(); // Cột này cần tồn tại
        return response()->json([
            'giaidoan_hientai' => (int) $giaidoan,
            'sodetai' => $sodetai,
            'sosinhvien' => $sosinhvien,
            'detai_daxong' => $detai_daxong,
        ]);
    });
});
