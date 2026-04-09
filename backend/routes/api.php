<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\SinhVienController;
use App\Http\Controllers\GiangVienController;
use App\Http\Controllers\KyLvtnController;
use App\Http\Controllers\TopicRegistrationFormController;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::post('/students/import', [SinhVienController::class, 'import']);
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
    Route::post('/nhap-lieu/import-excel', [TopicRegistrationFormController::class, 'importExcel']);
});
