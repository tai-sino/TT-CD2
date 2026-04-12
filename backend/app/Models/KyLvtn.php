<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class KyLvtn extends Model
{
    protected $table = 'ky_lvtn';

    protected $fillable = [
        'ten', 'ngay_bat_dau', 'ngay_nhan_de_tai', 'ngay_cham_50',
        'ngay_phan_bien', 'ngay_bao_ve', 'ngay_ket_thuc', 'is_active',
    ];

    protected $casts = [
        'ngay_bat_dau' => 'date',
        'ngay_nhan_de_tai' => 'date',
        'ngay_cham_50' => 'date',
        'ngay_phan_bien' => 'date',
        'ngay_bao_ve' => 'date',
        'ngay_ket_thuc' => 'date',
        'is_active' => 'boolean',
    ];
}
