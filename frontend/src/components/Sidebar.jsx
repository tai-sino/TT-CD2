import { useNavigate, useLocation } from 'react-router';
import {
  HiOutlineHome,
  HiOutlineUsers,
  HiOutlineAcademicCap,
  HiOutlineUserGroup,
  HiOutlineDocumentText,
  HiOutlineBuildingOffice2,
  HiOutlineChartBar,
  HiOutlineCog6Tooth,
  HiOutlinePencilSquare,
  HiArrowRightOnRectangle,
} from 'react-icons/hi2';
import { useAuth } from '../context/AuthContext';
import { logout } from '../services/authService';

const menuConfig = {
  admin: [
    { label: 'Tổng quan', path: '/admin/tong-quan', icon: HiOutlineHome },
    { label: 'Sinh viên', path: '/admin/sinh-vien', icon: HiOutlineUsers },
    { label: 'Giảng viên', path: '/admin/giang-vien', icon: HiOutlineAcademicCap },
    { label: 'Nhập liệu', path: '/admin/nhap-lieu', icon: HiOutlinePencilSquare },
    { label: 'Phân công GVHD/GVPB', path: '/admin/phan-cong', icon: HiOutlineUserGroup },
    { label: 'Đề tài', path: '/admin/de-tai', icon: HiOutlineDocumentText },
    { label: 'Hội đồng', path: '/admin/hoi-dong', icon: HiOutlineBuildingOffice2 },
    { label: 'Điểm tổng kết', path: '/admin/diem', icon: HiOutlineChartBar },
    { label: 'Cài đặt', path: '/admin/cai-dat', icon: HiOutlineCog6Tooth },
  ],
  gvhd: [
    { label: 'Sinh viên của tôi', path: '/gvhd/sinh-vien', icon: HiOutlineUsers },
    { label: 'Đề tài hướng dẫn', path: '/gvhd/de-tai', icon: HiOutlineDocumentText },
    { label: 'Chấm điểm', path: '/gvhd/cham-diem', icon: HiOutlinePencilSquare },
  ],
  gvpb: [
    { label: 'Đề tài phản biện', path: '/gvpb/de-tai', icon: HiOutlineDocumentText },
    { label: 'Chấm điểm phản biện', path: '/gvpb/cham-diem', icon: HiOutlinePencilSquare },
  ],
  sv: [
    { label: 'Đề tài của tôi', path: '/sv/de-tai', icon: HiOutlineDocumentText },
  ],
};

const roleLabels = {
  admin: 'Thư ký khoa',
  gvhd: 'Giảng viên hướng dẫn',
  gvpb: 'Giảng viên phản biện',
  sv: 'Sinh viên',
};

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, clearAuth } = useAuth();

  const roles = user?.roles || [];

  let menuItems = [];
  if (roles.includes('admin')) {
    menuItems = menuConfig.admin;
  } else {
    roles.forEach((role) => {
      if (menuConfig[role]) {
        menuItems = [...menuItems, ...menuConfig[role]];
      }
    });
  }

  const getRoleLabel = () => {
    if (roles.includes('admin')) return roleLabels.admin;
    if (roles.includes('gvhd') && roles.includes('gvpb')) return 'Giảng viên HD & PB';
    if (roles.includes('gvhd')) return roleLabels.gvhd;
    if (roles.includes('gvpb')) return roleLabels.gvpb;
    if (roles.includes('sv')) return roleLabels.sv;
    return '';
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {
      // loi server khong quan trong, van xoa token
    }
    clearAuth();
    navigate('/login');
  };

  return (
    <div className="fixed left-0 top-0 w-64 h-screen bg-white border-r border-slate-200 flex flex-col">
      <div className="px-6 py-6 border-b border-slate-200">
        <span className="text-lg font-semibold text-slate-800">QL Luận văn</span>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <div
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-3 px-6 py-3 text-sm cursor-pointer transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-600 border-l-4 border-l-blue-600 font-medium'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </div>
          );
        })}
      </nav>

      <div className="border-t border-slate-200 px-6 py-4">
        <p className="text-sm text-slate-700">Xin chào, {user?.name || 'Người dùng'}</p>
        <p className="text-xs text-slate-400 mt-0.5">{getRoleLabel()}</p>
        <div
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-500 hover:text-red-700 text-sm mt-2 cursor-pointer"
        >
          <HiArrowRightOnRectangle size={16} />
          <span>Đăng xuất</span>
        </div>
      </div>
    </div>
  );
}
