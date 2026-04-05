<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ky_lvtn', function (Blueprint $table) {
            $table->id();
            $table->string('ten', 100);
            $table->date('ngay_bat_dau')->nullable();
            $table->date('ngay_nhan_de_tai')->nullable();
            $table->date('ngay_cham_50')->nullable();
            $table->date('ngay_phan_bien')->nullable();
            $table->date('ngay_bao_ve')->nullable();
            $table->date('ngay_ket_thuc')->nullable();
            $table->boolean('is_active')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ky_lvtn');
    }
};
