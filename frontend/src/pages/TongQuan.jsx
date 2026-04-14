import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import studentWithLaptop from "../../public/assets/student with laptop.json";
import { Bar } from "react-chartjs-2";
import { getOverallStats } from "../services/dashboardService";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function TongQuan() {
  const [stats, setStats] = useState({
    presentations: 0,
    total: 0,
    students: 0,
    finished: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      setIsLoading(true);
      try {
        const data = await getOverallStats();
        setStats({
          presentations: data.giaidoan_hientai || 0,
          total: data.sodetai || 0,
          students: data.sosinhvien || 0,
          finished: data.detai_daxong || 0,
        });
      } catch {
        setStats({ presentations: 0, total: 0, students: 0, finished: 0 });
      }
      setIsLoading(false);
    }
    fetchStats();
  }, []);

  // Lấy thông tin người dùng từ localStorage (theo cấu trúc JSON mới)
  const [aboutMe, setAboutMe] = useState(() => {
    try {
      const userStr = localStorage.getItem("user");
      if (!userStr) return null;
      const user = typeof userStr === "string" ? JSON.parse(userStr) : userStr;

      return {
        maGV: user.id,
        tenGV: user.name,
        email: user.email,
        vaiTro: user.role,
        type: user.type,
      };
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (!aboutMe && !localStorage.getItem("token")) {
      // window.location.href = "/login";
    }
  }, [aboutMe]);

  if (!aboutMe) return null;

  return (
    <div className="dashboard-page">
      {/* Banner chào mừng */}
      <div className="flex justify-between items-center bg-blue-600 text-white rounded-lg px-4 py-3 mb-5">
        <div>
          <h2 className="font-bold text-base md:text-lg">Xin chào, {aboutMe?.tenGV || "N/A"}!</h2>
          <div className="text-blue-100 text-sm mt-1 space-y-0.5">
            <div>Mã giảng viên: {aboutMe?.maGV || "N/A"}</div>
            <div className="hidden sm:block">Email: {aboutMe?.email || "N/A"}</div>
            <div>Vai trò: {aboutMe?.vaiTro || "N/A"}</div>
          </div>
        </div>
        <div className="w-24 md:w-36 shrink-0">
          <Lottie animationData={studentWithLaptop} loop={true} />
        </div>
      </div>

      {/* Hàng thống kê tổng quan */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {isLoading
          ? Array(4).fill(0).map((_, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-lg p-3 shadow-sm flex flex-col justify-between min-h-[90px]">
                <div className="w-3/5 h-4 bg-slate-200 rounded animate-pulse mb-2" />
                <div className="w-10 h-7 bg-slate-200 rounded animate-pulse mt-auto" />
              </div>
            ))
          : [
              { label: "Giai đoạn hiện tại", value: stats.presentations },
              { label: "Số đề tài", value: stats.total },
              { label: "Số sinh viên", value: stats.students },
              { label: "Đề tài đã xong", value: stats.finished },
            ].map((item) => (
              <div key={item.label} className="bg-white border border-slate-200 rounded-lg p-3 shadow-sm flex flex-col justify-between min-h-[90px]">
                <div className="text-sm text-slate-500 mb-1">{item.label}</div>
                <div className="text-2xl font-semibold text-blue-600 mt-auto">{item.value}</div>
              </div>
            ))}
      </div>

      {/* Khu vực 2 cột: Thông báo & Biểu đồ */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Cột 1: Danh sách thông báo */}
        <div className="w-full lg:w-1/3">
          <h3 className="font-semibold mb-3">Thông báo & Nhắc nhở</h3>
          <ul className="bg-white rounded-lg shadow-sm p-4 min-h-[120px]">
            {isLoading ? (
              <li>
                <div className="w-4/5 h-4 bg-slate-200 rounded animate-pulse mb-2" />
                <div className="w-3/5 h-3 bg-slate-200 rounded animate-pulse mt-2" />
              </li>
            ) : (
              <li className="text-sm text-slate-500">Chưa có thông báo nào.</li>
            )}
          </ul>
        </div>

        {/* Cột 2: Biểu đồ tổng quan */}
        <div className="w-full lg:w-2/3">
          <h3 className="font-semibold mb-3">Biểu đồ tổng quan</h3>
          <div className="bg-white rounded-lg shadow-sm p-4 min-h-[240px] flex items-center justify-center">
            {isLoading ? (
              <div className="w-4/5 h-44 bg-slate-200 rounded-lg animate-pulse" />
            ) : (
              <Bar
                data={{
                  labels: ["Giai đoạn hiện tại", "Số đề tài", "Số sinh viên", "Đề tài đã xong"],
                  datasets: [{
                    label: "Thống kê tổng quan",
                    data: [stats.presentations, stats.total, stats.students, stats.finished],
                    backgroundColor: ["#2563eb", "#22d3ee", "#f59e42", "#10b981"],
                    borderRadius: 6,
                  }],
                }}
                options={{
                  responsive: true,
                  plugins: { legend: { display: false }, title: { display: false } },
                  scales: { y: { beginAtZero: true, grace: "10%" } },
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
