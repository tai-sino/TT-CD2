<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DeTai extends Model
{
    protected $table = 'detai';
    protected $primaryKey = 'maDeTai';

    protected $fillable = [
        'tenDeTai', 'moTa', 'maGV_HD', 'maGV_PB', 'maHoiDong', 'ky_lvtn_id',
        'thuTuTrongHD', 'ghiChu', 'diemGiuaKy', 'trangThaiGiuaKy', 'nhanXetGiuaKy',
        'diemHuongDan', 'nhanXetHuongDan', 'diemPhanBien', 'nhanXetPhanBien',
        'diemHoiDong', 'diemTongKet', 'diemChu', 'trangThai',
    ];

    protected $casts = [
        'diemGiuaKy' => 'float',
        'diemHuongDan' => 'float',
        'diemPhanBien' => 'float',
        'diemHoiDong' => 'float',
        'diemTongKet' => 'float',
    ];

    public function giangVienHD()
    {
        return $this->belongsTo(GiangVien::class, 'maGV_HD', 'maGV');
    }

    public function giangVienPB()
    {
        return $this->belongsTo(GiangVien::class, 'maGV_PB', 'maGV');
    }

    public function hoiDong()
    {
        return $this->belongsTo(HoiDong::class, 'maHoiDong', 'maHoiDong');
    }

    public function sinhVien()
    {
        return $this->hasMany(SinhVien::class, 'maDeTai', 'maDeTai');
    }

    public function kyLvtn()
    {
        return $this->belongsTo(KyLvtn::class, 'ky_lvtn_id');
    }
}
