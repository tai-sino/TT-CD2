<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HoiDong extends Model
{
    protected $table = 'hoidong';
    protected $primaryKey = 'maHoiDong';

    protected $fillable = [
        'tenHoiDong', 'diaDiem', 'ngayBaoVe', 'ky_lvtn_id',
    ];

    protected $casts = [
        'ngayBaoVe' => 'date',
    ];

    public function thanhVien()
    {
        return $this->hasMany(ThanhVienHoiDong::class, 'maHoiDong', 'maHoiDong');
    }

    public function deTai()
    {
        return $this->hasMany(DeTai::class, 'maHoiDong', 'maHoiDong');
    }

    public function kyLvtn()
    {
        return $this->belongsTo(KyLvtn::class, 'ky_lvtn_id');
    }
}
