<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('thanhvien_hoidong', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('maHoiDong');
            $table->string('maGV', 20);
            $table->enum('vaiTro', ['ChuTich', 'ThuKy', 'UyVien']);
            $table->timestamps();
            $table->foreign('maHoiDong')->references('maHoiDong')->on('hoidong')->cascadeOnDelete();
            $table->foreign('maGV')->references('maGV')->on('giangvien')->cascadeOnDelete();
            $table->unique(['maHoiDong', 'maGV']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('thanhvien_hoidong');
    }
};
