<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class SinhVien extends Authenticatable
{
    use HasApiTokens;

    protected $table = 'sinhvien';
    protected $primaryKey = 'mssv';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'mssv', 'hoTen', 'lop', 'email', 'soDienThoai', 'matKhau', 'maDeTai', 'ky_lvtn_id',
    ];

    protected $hidden = ['matKhau'];

    public function getAuthPassword()
    {
        return $this->matKhau;
    }

    public function deTai()
    {
        return $this->belongsTo(DeTai::class, 'maDeTai', 'maDeTai');
    }
}
