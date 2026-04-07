<?php

namespace App\Http\Controllers;

use App\Models\KyLvtn;
use Illuminate\Http\Request;

class KyLvtnController extends Controller
{
    public function index()
    {
        return response()->json(['data' => KyLvtn::orderBy('id', 'desc')->get()]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'ten' => 'required',
            'ngay_bat_dau' => 'nullable|date',
            'ngay_nhan_de_tai' => 'nullable|date',
            'ngay_cham_50' => 'nullable|date',
            'ngay_phan_bien' => 'nullable|date',
            'ngay_bao_ve' => 'nullable|date',
            'ngay_ket_thuc' => 'nullable|date',
        ]);

        $ky = KyLvtn::create(array_merge(
            $request->only(['ten', 'ngay_bat_dau', 'ngay_nhan_de_tai', 'ngay_cham_50', 'ngay_phan_bien', 'ngay_bao_ve', 'ngay_ket_thuc']),
            ['is_active' => true]
        ));

        return response()->json(['data' => $ky], 201);
    }

    public function update(Request $request, $id)
    {
        $ky = KyLvtn::find($id);
        if (!$ky) {
            return response()->json(['message' => 'Khong tim thay ky LVTN'], 404);
        }

        $request->validate([
            'ten' => 'required',
            'ngay_bat_dau' => 'nullable|date',
            'ngay_nhan_de_tai' => 'nullable|date',
            'ngay_cham_50' => 'nullable|date',
            'ngay_phan_bien' => 'nullable|date',
            'ngay_bao_ve' => 'nullable|date',
            'ngay_ket_thuc' => 'nullable|date',
        ]);

        $ky->update($request->only([
            'ten', 'ngay_bat_dau', 'ngay_nhan_de_tai', 'ngay_cham_50',
            'ngay_phan_bien', 'ngay_bao_ve', 'ngay_ket_thuc',
        ]));

        return response()->json(['data' => $ky]);
    }
}
