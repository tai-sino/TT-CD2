import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import LoginPage from './pages/LoginPage';

import TongQuan from './pages/admin/TongQuan';
import AdminSinhVien from './pages/admin/SinhVien';
import GiangVien from './pages/admin/GiangVien';
import PhanCongGVHD from './pages/admin/PhanCongGVHD';
import AdminDeTai from './pages/admin/DeTai';
import PhanCongGVPB from './pages/admin/PhanCongGVPB';
import HoiDong from './pages/admin/HoiDong';
import Diem from './pages/admin/Diem';
import CaiDat from './pages/admin/CaiDat';

import GvhdSinhVien from './pages/gvhd/SinhVien';
import GvhdDeTai from './pages/gvhd/DeTai';
import GvhdChamDiem from './pages/gvhd/ChamDiem';

import GvpbDeTai from './pages/gvpb/DeTai';
import GvpbChamDiem from './pages/gvpb/ChamDiem';

import SvDeTai from './pages/sv/DeTai';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<MainLayout />}>
                <Route path="/admin/tong-quan" element={<TongQuan />} />
                <Route path="/admin/sinh-vien" element={<AdminSinhVien />} />
                <Route path="/admin/giang-vien" element={<GiangVien />} />
                <Route path="/admin/phan-cong-gvhd" element={<PhanCongGVHD />} />
                <Route path="/admin/de-tai" element={<AdminDeTai />} />
                <Route path="/admin/phan-cong-gvpb" element={<PhanCongGVPB />} />
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
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
