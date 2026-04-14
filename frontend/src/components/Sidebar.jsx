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
  HiOutlineXMark,
} from 'react-icons/hi2';
import { useAuth } from '../context/AuthContext';
import { logout } from '../services/authService';

const menuItems = [
  { label: 'Tổng quan', path: '/admin/tong-quan', icon: HiOutlineHome },
  { label: 'Sinh viên', path: '/admin/sinh-vien', icon: HiOutlineUsers },
  { label: 'Giảng viên', path: '/admin/giang-vien', icon: HiOutlineAcademicCap },
  { label: 'Nhập liệu', path: '/admin/nhap-lieu', icon: HiOutlinePencilSquare },
  { label: 'Phân Công GVHD/GVPB', path: '/admin/phan-cong', icon: HiOutlineUserGroup },
  { label: 'Giữa kỳ', path: '/admin/giua-ky', icon: HiOutlineDocumentText },
  { label: 'Hội đồng', path: '/admin/hoi-dong', icon: HiOutlineBuildingOffice2 },
  { label: 'Điểm tổng kết', path: '/admin/diem', icon: HiOutlineChartBar },
  { label: 'Cài đặt', path: '/admin/cai-dat', icon: HiOutlineCog6Tooth },
];

const roleLabels = {
  admin: 'Thư ký khoa',
  gvhd: 'Giảng viên hướng dẫn',
  gvpb: 'Giảng viên phản biện',
  sv: 'Sinh viên',
};

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, clearAuth } = useAuth();

  const role = user?.role;

  const getRoleLabel = () => {
    if (!role) return '';
    if (roleLabels[role]) return roleLabels[role];
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

  const handleNavigate = (path) => {
    navigate(path);
    onClose?.();
  };

  return (
    <div
      className={`fixed left-0 top-0 w-64 h-screen bg-white border-r border-slate-200 flex flex-col z-40 transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0`}
    >
      <div className="px-6 py-6 border-b border-slate-200 flex items-center justify-between">
        <span className="text-lg font-semibold text-slate-800">QL Luận văn</span>
        <button
          onClick={onClose}
          className="md:hidden text-slate-400 hover:text-slate-600 p-1"
          aria-label="Đóng menu"
        >
          <HiOutlineXMark size={20} />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <div
              key={item.path}
              onClick={() => handleNavigate(item.path)}
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
