<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DiemHoiDong extends Model
{
    protected $table = 'diem_hoidong';

    protected $fillable = [
        'maDeTai', 'maGV', 'diemSo', 'nhanXet',
    ];

    protected $casts = [
        'diemSo' => 'float',
    ];

    public function deTai()
    {
        return $this->belongsTo(DeTai::class, 'maDeTai', 'maDeTai');
    }

    public function giangVien()
    {
        return $this->belongsTo(GiangVien::class, 'maGV', 'maGV');
    }
}
