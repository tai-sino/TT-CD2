<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('detai', function (Blueprint $table) {
            $table->id('maDeTai');
            $table->string('tenDeTai', 255);
            $table->text('moTa')->nullable();
            $table->string('maGV_HD', 20)->nullable();
            $table->string('maGV_PB', 20)->nullable();
            $table->unsignedBigInteger('maHoiDong')->nullable();
            $table->unsignedBigInteger('ky_lvtn_id')->nullable();
            $table->integer('thuTuTrongHD')->nullable();
            $table->text('ghiChu')->nullable();
            $table->decimal('diemGiuaKy', 4, 2)->nullable();
            $table->string('trangThaiGiuaKy', 20)->nullable();
            $table->text('nhanXetGiuaKy')->nullable();
            $table->decimal('diemHuongDan', 4, 2)->nullable();
            $table->text('nhanXetHuongDan')->nullable();
            $table->decimal('diemPhanBien', 4, 2)->nullable();
            $table->text('nhanXetPhanBien')->nullable();
            $table->decimal('diemHoiDong', 4, 2)->nullable();
            $table->decimal('diemTongKet', 4, 2)->nullable();
            $table->string('diemChu', 5)->nullable();
            $table->string('trangThai', 30)->default('chua_phan_cong');
            $table->timestamps();
            $table->foreign('maGV_HD')->references('maGV')->on('giangvien')->nullOnDelete();
            $table->foreign('maGV_PB')->references('maGV')->on('giangvien')->nullOnDelete();
            $table->foreign('ky_lvtn_id')->references('id')->on('ky_lvtn')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('detai');
    }
};
