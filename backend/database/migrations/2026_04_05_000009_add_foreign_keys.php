<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('sinhvien', function (Blueprint $table) {
            $table->foreign('maDeTai')->references('maDeTai')->on('detai')->nullOnDelete();
        });

        Schema::table('detai', function (Blueprint $table) {
            $table->foreign('maHoiDong')->references('maHoiDong')->on('hoidong')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('sinhvien', function (Blueprint $table) {
            $table->dropForeign(['maDeTai']);
        });

        Schema::table('detai', function (Blueprint $table) {
            $table->dropForeign(['maHoiDong']);
        });
    }
};
