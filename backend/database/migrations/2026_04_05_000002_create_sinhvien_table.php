<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sinhvien', function (Blueprint $table) {
            $table->string('mssv', 20)->primary();
            $table->string('hoTen', 100);
            $table->string('lop', 20)->nullable();
            $table->string('email', 100)->unique()->nullable();
            $table->string('soDienThoai', 15)->nullable();
            $table->string('matKhau', 255);
            $table->unsignedBigInteger('maDeTai')->nullable();
            $table->unsignedBigInteger('ky_lvtn_id')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sinhvien');
    }
};
