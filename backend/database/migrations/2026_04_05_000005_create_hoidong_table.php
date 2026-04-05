<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('hoidong', function (Blueprint $table) {
            $table->id('maHoiDong');
            $table->string('tenHoiDong', 100);
            $table->string('diaDiem', 100)->nullable();
            $table->date('ngayBaoVe')->nullable();
            $table->unsignedBigInteger('ky_lvtn_id')->nullable();
            $table->timestamps();
            $table->foreign('ky_lvtn_id')->references('id')->on('ky_lvtn')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('hoidong');
    }
};
