<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('diem_hoidong', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('maDeTai');
            $table->string('maGV', 20);
            $table->decimal('diemSo', 4, 2);
            $table->text('nhanXet')->nullable();
            $table->timestamps();
            $table->foreign('maDeTai')->references('maDeTai')->on('detai')->cascadeOnDelete();
            $table->foreign('maGV')->references('maGV')->on('giangvien')->cascadeOnDelete();
            $table->unique(['maDeTai', 'maGV']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('diem_hoidong');
    }
};
