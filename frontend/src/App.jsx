import { Routes, Route, Navigate } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import LoginPage from './pages/LoginPage';



import TongQuan from './pages/TongQuan';
import AdminSinhVien from './pages/SinhVien';
import GiangVien from './pages/GiangVien';
import PhanCong from './pages/PhanCong';
import NhapLieu from './pages/NhapLieu';
import AdminDeTai from './pages/DeTai';
import HoiDong from './pages/HoiDong';
import Diem from './pages/Diem';
import CaiDat from './pages/CaiDat';

import GvhdSinhVien from './pages/SinhVien';
import GvhdDeTai from './pages/DeTai';
import GvhdChamDiem from './pages/ChamDiem';

import GvpbDeTai from './pages/DeTai';
import GvpbChamDiem from './pages/ChamDiem';

import SvDeTai from './pages/DeTai';
import DeTai from './pages/DeTai';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/admin/tong-quan" element={<TongQuan />} />
                <Route path="/admin/sinh-vien" element={<AdminSinhVien />} />
                <Route path="/admin/giang-vien" element={<GiangVien />} />
                <Route path="/admin/nhap-lieu" element={<NhapLieu />} />
                <Route path="/admin/phan-cong" element={<PhanCong />} />
                <Route path="/admin/de-tai" element={<AdminDeTai />} />
                <Route path="/de-tai" element={<DeTai />} />
                <Route path="/admin/hoi-dong" element={<HoiDong />} />
                <Route path="/admin/diem" element={<Diem />} />
                <Route path="/admin/cai-dat" element={<CaiDat />} />

                <Route path="/gvhd/sinh-vien" element={<GvhdSinhVien />} />
                <Route path="/gvhd/de-tai" element={<GvhdDeTai />} />
                <Route path="/gvhd/cham-diem" element={<GvhdChamDiem />} />

                <Route path="/gvpb/de-tai" element={<GvpbDeTai />} />
                <Route path="/gvpb/cham-diem" element={<GvpbChamDiem />} />

                <Route path="/sv/de-tai" element={<SvDeTai />} />
              </Route>
            </Route>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
