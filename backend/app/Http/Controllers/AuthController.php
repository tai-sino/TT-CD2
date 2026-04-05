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
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = GiangVien::where('email', $request->email)->first();

        if (!$user) {
            $user = SinhVien::where('email', $request->email)->first();
        }

        if (!$user) {
            return response()->json(['message' => 'Email hoac mat khau khong dung'], 401);
        }

        if (!Hash::check($request->password, $user->matKhau)) {
            return response()->json(['message' => 'Email hoac mat khau khong dung'], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        if ($user instanceof GiangVien) {
            $type = 'giangvien';
            $roles = [];
            if ($user->isAdmin) $roles[] = 'admin';
            if (DeTai::where('maGV_HD', $user->maGV)->exists()) $roles[] = 'gvhd';
            if (DeTai::where('maGV_PB', $user->maGV)->exists()) $roles[] = 'gvpb';
            if (ThanhVienHoiDong::where('maGV', $user->maGV)->exists()) $roles[] = 'tv_hd';
            if (empty($roles) && !$user->isAdmin) $roles[] = 'gvhd';
            $id = $user->maGV;
            $name = $user->tenGV;
        } else {
            $type = 'sinhvien';
            $roles = ['sv'];
            $id = $user->mssv;
            $name = $user->hoTen;
        }

        return response()->json([
            'token' => $token,
            'user' => [
                'id' => $id,
                'name' => $name,
                'email' => $user->email,
                'type' => $type,
                'roles' => $roles,
            ],
        ]);
    }

    public function me(Request $request)
    {
        $user = $request->user();

        if ($user instanceof GiangVien) {
            $type = 'giangvien';
            $roles = [];
            if ($user->isAdmin) $roles[] = 'admin';
            if (DeTai::where('maGV_HD', $user->maGV)->exists()) $roles[] = 'gvhd';
            if (DeTai::where('maGV_PB', $user->maGV)->exists()) $roles[] = 'gvpb';
            if (ThanhVienHoiDong::where('maGV', $user->maGV)->exists()) $roles[] = 'tv_hd';
            if (empty($roles) && !$user->isAdmin) $roles[] = 'gvhd';
            $id = $user->maGV;
            $name = $user->tenGV;
        } else {
            $type = 'sinhvien';
            $roles = ['sv'];
            $id = $user->mssv;
            $name = $user->hoTen;
        }

        return response()->json([
            'id' => $id,
            'name' => $name,
            'email' => $user->email,
            'type' => $type,
            'roles' => $roles,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Dang xuat thanh cong']);
    }
}
