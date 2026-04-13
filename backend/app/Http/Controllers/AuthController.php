<?php

namespace App\Http\Controllers;

use App\Models\DeTai;
use App\Models\GiangVien;
use App\Models\SinhVien;
use App\Models\ThanhVienHoiDong;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'maGV' => 'required|string',
            'password' => 'required|string',
        ]);

        $user = GiangVien::where('maGV', $request->maGV)->first();

        if (!$user || !($request->password === $user->matKhau)) {
            return response()->json(['message' => 'Mã GV hoặc mật khẩu không đúng'], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        // Lấy vai trò duy nhất ưu tiên theo bảng thanhvien_hoidong
        $tvhd = ThanhVienHoiDong::where('maGV', $user->maGV)->first();
        return response()->json([
            'token' => $token,
            'user' => [
                'id' => $user->maGV,
                'name' => $user->tenGV,
                'email' => $user->email,
                'type' => 'giangvien',
                'role' => $tvhd ? $tvhd->vaiTro : null,
            ],
        ]);
    }

    public function me(Request $request)
    {
        $user = $request->user();

        $tvhd = ThanhVienHoiDong::where('maGV', $user->maGV)->first();
        $role = $tvhd ? $tvhd->vaiTro : null;

        // Xác định role dựa trên đề tài nếu chưa có vai trò hội đồng
        if (!$role) {
            if (DeTai::where('maGV_HD', $user->maGV)->exists()) $role = 'gvhd';
            elseif (DeTai::where('maGV_PB', $user->maGV)->exists()) $role = 'gvpb';
        }

        return response()->json([
            'id' => $user->maGV,
            'name' => $user->tenGV,
            'email' => $user->email,
            'type' => 'giangvien',
            'role' => $role,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Dang xuat thanh cong']);
    }
}
