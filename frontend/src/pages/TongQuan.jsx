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
      <div
        className="dashboard-banner"
        style={{
          background: "var(--primary-color, #2563eb)",
          padding: "12px 16px",
          borderRadius: "6px",
          marginBottom: "20px",
          width: "100%",
          color: "#fff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h2 className="font-bold">Xin chào, {aboutMe?.tenGV || "N/A"}!</h2>
          <div style={{ color: "#f1f1f1" }}>
            <div>Mã giảng viên: {aboutMe?.maGV || "N/A"}</div>
            <div>Email: {aboutMe?.email || "N/A"}</div>
            <div>Vai trò: {aboutMe?.vaiTro || "N/A"}</div>
          </div>
        </div>
        <div className="dashboard-banner-lottie" style={{ width: "150px" }}>
          <Lottie animationData={studentWithLaptop} loop={true} />
        </div>
      </div>

      {/* Hàng thống kê tổng quan */}
      <div
        className="stat-cards-row"
        style={{ display: "flex", gap: 16, marginBottom: 24 }}
      >
        {isLoading
          ? Array(4)
              .fill(0)
              .map((_, idx) => (
                <div
                  key={idx}
                  className="stat-card"
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    alignItems: "start",
                    border: "1px solid #e5e7eb",
                    borderRadius: 8,
                    background: "#fff",
                    padding: 12,
                    minHeight: 90,
                    boxShadow: "2px 2px 4px rgba(0,0,0,0.1)",
                  }}
                >
                  <div
                    style={{
                      width: "60%",
                      height: 16,
                      background: "#e5e7eb",
                      borderRadius: 4,
                      marginBottom: 8,
                      animation:
                        "skeleton-loading 1.2s infinite linear alternate",
                    }}
                  />
                  <div
                    style={{
                      width: 40,
                      height: 28,
                      background: "#e5e7eb",
                      borderRadius: 4,
                      marginTop: "auto",
                      animation:
                        "skeleton-loading 1.2s infinite linear alternate",
                    }}
                  />
                </div>
              ))
          : [
              { label: "Giai đoạn hiện tại", value: stats.presentations },
              { label: "Số đề tài", value: stats.total },
              { label: "Số sinh viên", value: stats.students },
              { label: "Đề tài đã xong", value: stats.finished },
            ].map((item, idx) => (
              <div
                key={item.label}
                className="stat-card"
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  alignItems: "start",
                  border: "1px solid #e5e7eb",
                  borderRadius: 8,
                  background: "#fff",
                  padding: 12,
                  minHeight: 90,
                  boxShadow: "2px 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                <div
                  className="stat-label text-slate-500"
                  style={{ marginBottom: 4, textAlign: "left", width: "100%" }}
                >
                  {item.label}
                </div>
                <div
                  className="stat-value"
                  style={{
                    fontSize: 26,
                    fontWeight: 600,
                    color: "#2563eb",
                    marginTop: "auto",
                    textAlign: "left",
                    width: "100%",
                  }}
                >
                  {item.value}
                </div>
              </div>
            ))}
      </div>

      {/* Khu vực 2 cột: Thông báo & Biểu đồ */}
      <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
        {/* Cột 1: Danh sách thông báo */}
        <div style={{ flex: 1, minWidth: 320 }}>
          <h3 style={{ fontWeight: 600, marginBottom: 12 }}>
            Thông báo & Nhắc nhở
          </h3>
          <ul
            style={{
              background: "#fff",
              borderRadius: 8,
              boxShadow: "1px 1px 4px rgba(0,0,0,0.06)",
              padding: 16,
              minHeight: 120,
            }}
          >
            {isLoading ? (
              <li>
                <div
                  style={{
                    width: "80%",
                    height: 18,
                    background: "#e5e7eb",
                    borderRadius: 4,
                    animation:
                      "skeleton-loading 1.2s infinite linear alternate",
                  }}
                />
                <div
                  style={{
                    width: "60%",
                    height: 12,
                    background: "#e5e7eb",
                    borderRadius: 4,
                    marginTop: 8,
                    animation:
                      "skeleton-loading 1.2s infinite linear alternate",
                  }}
                />
              </li>
            ) : (
              <li>Chưa có thông báo nào.</li>
            )}
          </ul>
        </div>

        {/* Cột 2: Biểu đồ tổng quan */}
        <div style={{ flex: 2, minWidth: 360 }}>
          <h3 style={{ fontWeight: 600, marginBottom: 12 }}>
            Biểu đồ tổng quan
          </h3>
          <div
            style={{
              background: "#fff",
              borderRadius: 8,
              boxShadow: "1px 1px 4px rgba(0,0,0,0.06)",
              padding: 16,
              minHeight: 240,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {isLoading ? (
              <div
                style={{
                  width: "80%",
                  height: 180,
                  background: "#e5e7eb",
                  borderRadius: 8,
                  animation: "skeleton-loading 1.2s infinite linear alternate",
                }}
              />
            ) : (
              <Bar
                data={{
                  labels: [
                    "Giai đoạn hiện tại",
                    "Số đề tài",
                    "Số sinh viên",
                    "Đề tài đã xong",
                  ],
                  datasets: [
                    {
                      label: "Thống kê tổng quan",
                      data: [
                        stats.presentations,
                        stats.total,
                        stats.students,
                        stats.finished,
                      ],
                      backgroundColor: [
                        "#2563eb",
                        "#22d3ee",
                        "#f59e42",
                        "#10b981",
                      ],
                      borderRadius: 6,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { display: false },
                    title: { display: false },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      grace: "10%",
                    },
                  },
                }}
              />
            )}
          </div>
        </div>
      </div>
      {/* CSS cho skeleton loading */}
      <style>{`
				@keyframes skeleton-loading {
					0% { background-color: #e5e7eb; }
					100% { background-color: #f3f4f6; }
				}
			`}</style>
    </div>
  );
}
