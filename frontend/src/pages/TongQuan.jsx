

import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import studentWithLaptop from '../../public/assets/student with laptop.json';
import { getGiaiDoan, getDeTaiStats, getStudentStats } from '../services/dashboardService';


export default function TongQuan() {
	
	const [stats, setStats] = useState({
		total: 0,
		students: 0,
		finished: 0,
		presentations: 0,
	});

	useEffect(() => {
		async function fetchStats() {
			try {
				// Giai đoạn hiện tại
				const giaiDoanRes = await getGiaiDoan();
				let presentations = 0;
				if (giaiDoanRes && giaiDoanRes.giaiDoan) {
					presentations = Number(giaiDoanRes.giaiDoan);
				}

				// Số đề tài, đề tài đã xong
				let total = 0, finished = 0;
				try {
					const deTaiStats = await getDeTaiStats();
					total = deTaiStats?.total || 0;
					finished = deTaiStats?.finished || 0;
				} catch {}

				// Số sinh viên
				let students = 0;
				try {
					const studentStats = await getStudentStats();
					students = studentStats?.total || 0;
				} catch {}

				setStats({
					total,
					students,
					finished,
					presentations,
				});
			} catch {
				setStats({ total: 0, students: 0, finished: 0, presentations: 0 });
			}
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

			<div className="stat-cards-row" style={{ display: "flex", gap: 16, marginBottom: 24 }}>
				{[
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
                            // boxShadow: "0 2px 4px rgba(37, 99, 235, 0.1)",
                            boxShadow: "2px 2px 4px rgba(0,0,0,0.1)"
						}}
					>
						<div className="stat-label text-slate-500" style={{  marginBottom: 4, textAlign: "left", width: "100%" }}>{item.label}</div>
						<div className="stat-value" style={{ fontSize: 26, fontWeight: 600, color: "#2563eb", marginTop: "auto", textAlign: "left", width: "100%" }}>{item.value}</div>
					</div>
				))}
			</div>
		</div>
	);
}
