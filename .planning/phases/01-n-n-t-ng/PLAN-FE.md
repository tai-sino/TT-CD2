---
wave: 1
depends_on: []
files_modified:
  - frontend/package.json
  - frontend/vite.config.js
  - frontend/src/**
  - frontend/index.html
autonomous: true
requirements:
  - AUTH-01
  - AUTH-02
  - AUTH-03
  - AUTH-04
---

# PLAN-FE: Phase 1 Frontend - Nen tang

Greenfield rebuild. KHONG tai su dung code cu trong frontend/.

## Tong quan

4 viec chinh:
1. Cap nhat packages (React 19, react-router 7, axios, @tanstack/react-query, xoa packages cu)
2. AuthContext + useAuth hook (luu token localStorage)
3. LoginPage (form email + password, goi API)
4. MainLayout + Sidebar (menu theo role, protected routes)

---

## Wave 1: Setup project + Auth

### Task 1.1: Cap nhat packages va cau truc thu muc

<read_first>
- frontend/package.json
- frontend/vite.config.js
- .planning/research/STACK.md (section Frontend)
- .planning/phases/01-n-n-t-ng/01-UI-SPEC.md (Design System)
</read_first>

<action>
1. Cap nhat frontend/package.json:
   - Doi react va react-dom tu ^18.3.1 len ^19.0.0
   - Xoa react-router-dom, them react-router@^7.0.0
   - Them axios@^1.7.0
   - Them @tanstack/react-query@^5.0.0
   - Giu react-icons (da co)
   - Giu tailwindcss ^4.2.2 (da co)
   - Xoa @fortawesome/free-solid-svg-icons va @fortawesome/react-fontawesome (dung react-icons thay)
   - Xoa lottie-react (khong can)
   - Giu vite, @vitejs/plugin-react, postcss, @tailwindcss/postcss

2. Chay npm install de cap nhat

3. Sua vite.config.js them proxy cho API:
   server: {
     proxy: {
       '/api': 'http://localhost:8000',
       '/sanctum': 'http://localhost:8000',
     }
   }

4. Tao cau truc thu muc moi (xoa files cu):
   src/
     components/     (shared components)
     context/        (AuthContext + useAuth)
     layouts/        (MainLayout)
     pages/          (LoginPage, placeholder pages)
     services/       (api.js - axios instance)
     App.jsx
     main.jsx
     index.css

5. Xoa tat ca files cu trong src/ (se viet lai)

6. Dam bao index.html co link Google Fonts Inter:
   <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
</action>

<acceptance_criteria>
- package.json chua "react": "^19
- package.json chua "react-router": "^7
- package.json chua "axios"
- package.json chua "@tanstack/react-query"
- package.json KHONG chua "@fortawesome"
- package.json KHONG chua "lottie-react"
- package.json KHONG chua "react-router-dom"
- vite.config.js chua proxy va '/api': 'http://localhost:8000'
- index.html chua fonts.googleapis.com/css2?family=Inter
- Thu muc src/ KHONG co folder hooks/ (useAuth nam trong AuthContext.jsx)
- npm run dev chay khong loi
</acceptance_criteria>

### Task 1.2: Tao axios instance va API service

<read_first>
- frontend/vite.config.js (proxy config)
- .planning/phases/01-n-n-t-ng/01-UI-SPEC.md (Interaction Contract)
</read_first>

<action>
Tao file src/services/api.js:

import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

Tao file src/services/authService.js:

import api from './api';

export async function login(email, password) {
  const res = await api.post('/login', { email, password });
  return res.data;
}

export async function getMe() {
  const res = await api.get('/me');
  return res.data;
}

export async function logout() {
  await api.post('/logout');
}
</action>

<acceptance_criteria>
- File src/services/api.js ton tai
- File chua axios.create
- File chua localStorage.getItem('token')
- File chua Bearer ${token}
- File chua interceptors.response (xu ly 401)
- File src/services/authService.js ton tai
- File chua export async function login
- File chua export async function getMe
- File chua export async function logout
</acceptance_criteria>

### Task 1.3: AuthContext + useAuth hook

<read_first>
- frontend/src/context/AuthContext.jsx (file cu, de tham khao)
- .planning/phases/01-n-n-t-ng/01-UI-SPEC.md (Interaction Contract - Login Flow)
- .planning/research/ARCHITECTURE.md (section 2.2)
</read_first>

<action>
Tao file src/context/AuthContext.jsx:

import { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  const saveAuth = (userData, tokenStr) => {
    setUser(userData);
    setToken(tokenStr);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', tokenStr);
  };

  const clearAuth = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, saveAuth, clearAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth phai dung trong AuthProvider');
  return context;
}

export default AuthContext;
</action>

<acceptance_criteria>
- File src/context/AuthContext.jsx ton tai
- File chua createContext
- File chua AuthProvider
- File chua export function useAuth()
- File chua localStorage.getItem('user')
- File chua localStorage.setItem('token'
- File chua localStorage.removeItem('token'
</acceptance_criteria>

---

## Wave 2: Pages + Layout

### Task 2.1: LoginPage

<read_first>
- src/services/authService.js (tu Task 1.2)
- src/context/AuthContext.jsx (tu Task 1.3)
- .planning/phases/01-n-n-t-ng/01-UI-SPEC.md (LoginPage specs + Copywriting)
</read_first>

<action>
Tao file src/pages/LoginPage.jsx:

Component LoginPage:
- State: email, password, error, loading
- Import: import { useNavigate } from 'react-router';
- Import: import { useEffect } from 'react';

- Helper function xac dinh trang mac dinh theo role:
  function getDefaultRoute(roles) {
    if (roles.includes('admin')) return '/admin/tong-quan';
    if (roles.includes('gvhd')) return '/gvhd/sinh-vien';
    if (roles.includes('gvpb')) return '/gvpb/de-tai';
    if (roles.includes('sv')) return '/sv/de-tai';
    return '/login';
  }

- Redirect neu da dang nhap (AUTH-04):
  useEffect(() => {
    const token = localStorage.getItem('token');
    const saved = localStorage.getItem('user');
    if (token && saved) {
      const userData = JSON.parse(saved);
      navigate(getDefaultRoute(userData.roles));
    }
  }, []);

- Submit handler:
  1. Set loading = true, error = null
  2. Goi login(email, password) tu authService
  3. Thanh cong: goi saveAuth(data.user, data.token), navigate theo role:
     navigate(getDefaultRoute(data.user.roles))
  4. Loi: set error message, loading = false

UI theo UI-SPEC:
- Centered card: bg-white rounded-xl shadow-lg p-12 max-w-md mx-auto
- Nen: min-h-screen bg-slate-50 flex items-center justify-center
- Tieu de: text-2xl font-bold text-slate-900 - "Quan ly Luan van Tot nghiep"
- Phu de: text-sm text-slate-500 - "Khoa Cong nghe Thong tin - Dai hoc Cong Nghe Sai Gon"
- Input email: w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none
- Label: text-sm font-medium text-slate-700
- Input password: tuong tu, co nut toggle show/hide password
- Button: w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg disabled:opacity-50
- Button text: "Dang nhap" (binh thuong), "Dang xu ly..." (loading)
- Error: text-red-500 text-sm mt-2
</action>

<acceptance_criteria>
- File src/pages/LoginPage.jsx ton tai
- File chua "Quan ly Luan van Tot nghiep" (tieu de)
- File chua "Khoa Cong nghe Thong tin" (phu de)
- File chua "Dang nhap" (button text)
- File chua "Dang xu ly..." (loading text)
- File chua bg-blue-500 (button style)
- File chua saveAuth (tu useAuth)
- File chua navigate( (redirect sau login)
- File chua /admin/tong-quan (redirect admin)
- File chua useEffect (check da dang nhap)
- File chua localStorage.getItem('token') (check token trong useEffect)
- File chua getDefaultRoute (helper function)
</acceptance_criteria>

### Task 2.2: Sidebar component

<read_first>
- .planning/phases/01-n-n-t-ng/01-UI-SPEC.md (Sidebar specs + Menu theo role)
</read_first>

<action>
Tao file src/components/Sidebar.jsx:

Props: khong can (lay user tu useAuth)

Menu items theo role (lay tu UI-SPEC):
const menuConfig = {
  admin: [
    { label: 'Tong quan', path: '/admin/tong-quan', icon: HiOutlineHome },
    { label: 'Sinh vien', path: '/admin/sinh-vien', icon: HiOutlineUsers },
    { label: 'Giang vien', path: '/admin/giang-vien', icon: HiOutlineAcademicCap },
    { label: 'Phan cong GVHD', path: '/admin/phan-cong-gvhd', icon: HiOutlineUserGroup },
    { label: 'De tai', path: '/admin/de-tai', icon: HiOutlineDocumentText },
    { label: 'Phan cong GVPB', path: '/admin/phan-cong-gvpb', icon: HiOutlineClipboardDocumentCheck },
    { label: 'Hoi dong', path: '/admin/hoi-dong', icon: HiOutlineBuildingOffice },
    { label: 'Diem tong ket', path: '/admin/diem', icon: HiOutlineChartBar },
    { label: 'Cai dat', path: '/admin/cai-dat', icon: HiOutlineCog6Tooth },
  ],
  gvhd: [
    { label: 'Sinh vien cua toi', path: '/gvhd/sinh-vien', icon: HiOutlineUsers },
    { label: 'De tai huong dan', path: '/gvhd/de-tai', icon: HiOutlineDocumentText },
    { label: 'Cham diem', path: '/gvhd/cham-diem', icon: HiOutlinePencilSquare },
  ],
  gvpb: [
    { label: 'De tai phan bien', path: '/gvpb/de-tai', icon: HiOutlineDocumentText },
    { label: 'Cham diem phan bien', path: '/gvpb/cham-diem', icon: HiOutlinePencilSquare },
  ],
  sv: [
    { label: 'De tai cua toi', path: '/sv/de-tai', icon: HiOutlineDocumentText },
  ],
};

Layout:
- Container: fixed left-0 top-0 w-64 h-screen bg-white border-r border-slate-200 flex flex-col
- Header: px-6 py-6, text "QL Luan van" (text-lg font-semibold text-slate-800), border-b border-slate-200
- Menu: flex-1 overflow-y-auto py-4
- Moi menu item: flex items-center gap-3 px-6 py-3 text-sm cursor-pointer transition-colors
  - Active: bg-blue-50 text-blue-600 border-l-4 border-l-blue-600 font-medium
  - Default: text-slate-500 hover:bg-slate-50 hover:text-slate-900
- Footer: border-t border-slate-200 px-6 py-4
  - "Xin chao, {ten_user}" text-sm text-slate-700
  - Role label: text-xs text-slate-400 (Thu ky khoa / Giang vien huong dan / ...)
  - Nut logout: flex items-center gap-2 text-red-500 hover:text-red-700 text-sm mt-2 cursor-pointer

Xac dinh menu hien thi:
- Lay roles tu user.roles
- Gop menu cua tat ca roles lai (VD: GV vua la gvhd vua gvpb thi hien ca 2 menu)
- Neu co admin thi chi hien menu admin (admin thay het)

Logout handler: goi logout() tu authService, goi clearAuth(), navigate('/login')
</action>

<acceptance_criteria>
- File src/components/Sidebar.jsx ton tai
- File chua "QL Luan van" (sidebar header)
- File chua "Xin chao" (user greeting)
- File chua "Dang xuat" (logout button)
- File chua menuConfig hoac cau truc menu tuong tu
- File chua /admin/tong-quan (admin menu path)
- File chua /gvhd/sinh-vien (gvhd menu path)
- File chua /gvpb/de-tai (gvpb menu path)
- File chua /sv/de-tai (sv menu path)
- File chua bg-blue-50 (active state)
- File chua text-red-500 (logout button)
- File chua clearAuth (tu useAuth)
</acceptance_criteria>

### Task 2.3: MainLayout + ProtectedRoute + Placeholder pages

<read_first>
- src/components/Sidebar.jsx (tu Task 2.2)
- src/context/AuthContext.jsx (tu Task 1.3)
- .planning/phases/01-n-n-t-ng/01-UI-SPEC.md (MainLayout + ProtectedRoute specs)
</read_first>

<action>
Tao file src/components/ProtectedRoute.jsx:

import { Outlet, Navigate } from 'react-router';

- Check token trong localStorage (hoac user tu useAuth)
- Neu khong co: Navigate to="/login" replace
- Neu co: render <Outlet />

Tao file src/layouts/MainLayout.jsx:
- import { Outlet } from 'react-router';
- Render Sidebar + main content area
- Main content: div voi ml-64 min-h-screen bg-slate-50 p-8
- Render <Outlet /> trong main content area

Tao file src/pages/PlaceholderPage.jsx:
- Hien "Chuc nang dang phat trien" (text-slate-500 text-center py-20)
- Co props: title (ten trang)
- Hien title o tren: text-xl font-semibold text-slate-900

Tao cac placeholder page files (moi file chi import PlaceholderPage va truyen title):
- src/pages/admin/TongQuan.jsx -> title "Tong quan"
- src/pages/admin/SinhVien.jsx -> title "Sinh vien"
- src/pages/admin/GiangVien.jsx -> title "Giang vien"
- src/pages/admin/PhanCongGVHD.jsx -> title "Phan cong GVHD"
- src/pages/admin/DeTai.jsx -> title "De tai"
- src/pages/admin/PhanCongGVPB.jsx -> title "Phan cong GVPB"
- src/pages/admin/HoiDong.jsx -> title "Hoi dong"
- src/pages/admin/Diem.jsx -> title "Diem tong ket"
- src/pages/admin/CaiDat.jsx -> title "Cai dat"
- src/pages/gvhd/SinhVien.jsx -> title "Sinh vien cua toi"
- src/pages/gvhd/DeTai.jsx -> title "De tai huong dan"
- src/pages/gvhd/ChamDiem.jsx -> title "Cham diem"
- src/pages/gvpb/DeTai.jsx -> title "De tai phan bien"
- src/pages/gvpb/ChamDiem.jsx -> title "Cham diem phan bien"
- src/pages/sv/DeTai.jsx -> title "De tai cua toi"
</action>

<acceptance_criteria>
- File src/components/ProtectedRoute.jsx ton tai
- ProtectedRoute chua Navigate to="/login"
- ProtectedRoute chua import { Outlet, Navigate } from 'react-router'
- File src/layouts/MainLayout.jsx ton tai
- MainLayout chua ml-64 (margin left cho sidebar)
- MainLayout chua Outlet
- MainLayout chua import { Outlet } from 'react-router'
- File src/pages/PlaceholderPage.jsx ton tai
- PlaceholderPage chua "Chuc nang dang phat trien"
- Cac file placeholder ton tai: src/pages/admin/TongQuan.jsx, src/pages/gvhd/SinhVien.jsx, src/pages/gvpb/DeTai.jsx, src/pages/sv/DeTai.jsx
</acceptance_criteria>

### Task 2.4: App.jsx - Router config

<read_first>
- src/components/ProtectedRoute.jsx (tu Task 2.3)
- src/layouts/MainLayout.jsx (tu Task 2.3)
- src/pages/LoginPage.jsx (tu Task 2.1)
- src/context/AuthContext.jsx (tu Task 1.3)
- .planning/phases/01-n-n-t-ng/01-UI-SPEC.md (Interaction Contract)
</read_first>

<action>
Viet src/App.jsx:

import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import LoginPage from './pages/LoginPage';
// import tat ca placeholder pages

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
                {/* Admin routes */}
                <Route path="/admin/tong-quan" element={<TongQuan />} />
                <Route path="/admin/sinh-vien" element={<AdminSinhVien />} />
                <Route path="/admin/giang-vien" element={<GiangVien />} />
                <Route path="/admin/phan-cong-gvhd" element={<PhanCongGVHD />} />
                <Route path="/admin/de-tai" element={<AdminDeTai />} />
                <Route path="/admin/phan-cong-gvpb" element={<PhanCongGVPB />} />
                <Route path="/admin/hoi-dong" element={<HoiDong />} />
                <Route path="/admin/diem" element={<Diem />} />
                <Route path="/admin/cai-dat" element={<CaiDat />} />
                {/* GVHD routes */}
                <Route path="/gvhd/sinh-vien" element={<GvhdSinhVien />} />
                <Route path="/gvhd/de-tai" element={<GvhdDeTai />} />
                <Route path="/gvhd/cham-diem" element={<GvhdChamDiem />} />
                {/* GVPB routes */}
                <Route path="/gvpb/de-tai" element={<GvpbDeTai />} />
                <Route path="/gvpb/cham-diem" element={<GvpbChamDiem />} />
                {/* SV routes */}
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

Viet src/main.jsx:
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(<App />);

Viet src/index.css:
@import "tailwindcss";

body {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}
</action>

<acceptance_criteria>
- File src/App.jsx ton tai
- App.jsx chua BrowserRouter (tu react-router, KHONG phai react-router-dom)
- App.jsx chua QueryClientProvider
- App.jsx chua AuthProvider
- App.jsx chua ProtectedRoute
- App.jsx chua /admin/tong-quan (route path)
- App.jsx chua /gvhd/sinh-vien
- App.jsx chua /gvpb/de-tai
- App.jsx chua /sv/de-tai
- App.jsx chua /login
- File src/main.jsx ton tai
- File src/index.css ton tai va chua @import "tailwindcss"
- index.css chua font-family: 'Inter'
- npm run dev chay khong loi
</acceptance_criteria>

---

## Verification

Sau khi hoan thanh tat ca tasks:

1. npm run dev chay thanh cong, trang Login hien thi dung
2. Nhap email admin@stu.edu.vn + password 123456 -> dang nhap thanh cong, redirect /admin/tong-quan
3. Sidebar hien menu admin (9 items)
4. Click menu item -> navigate dung route, hien placeholder
5. Nhap email SV -> redirect /sv/de-tai, sidebar chi co 1 item
6. Click "Dang xuat" -> ve trang login
7. Truy cap /admin/tong-quan khi chua login -> redirect ve /login
8. Truy cap /login khi da dang nhap -> redirect ve trang mac dinh theo role

---

## must_haves

- [ ] npm run dev chay OK, trang login hien thi
- [ ] Login thanh cong redirect dung trang theo role
- [ ] 4 roles (admin, gvhd, gvpb, sv) thay menu khac nhau trong sidebar
- [ ] Protected route: chua login -> redirect /login
- [ ] Da dang nhap ma vao /login -> redirect ve trang mac dinh theo role
- [ ] Logout xoa token, redirect ve /login
- [ ] Sidebar hien "QL Luan van", ten user, role label, nut dang xuat
- [ ] GV co nhieu role thay gop menu cua tat ca roles
