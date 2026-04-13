-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Apr 10, 2026 at 07:01 AM
-- Server version: 8.4.6
-- PHP Version: 8.3.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

DROP DATABASE IF EXISTS `quanly_lvtn_v2`;
CREATE DATABASE IF NOT EXISTS `quanly_lvtn_v2` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE quanly_lvtn_v2;


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `quanly_lvtn_v2`
--

-- --------------------------------------------------------

--
-- Table structure for table `cau_hinh`
--

CREATE TABLE `cau_hinh` (
  `id` bigint UNSIGNED NOT NULL,
  `key` varchar(50) NOT NULL,
  `value` text,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `cau_hinh`
--

INSERT INTO `cau_hinh` (`id`, `key`, `value`, `created_at`, `updated_at`) VALUES
(1, 'trangThaiChamGK', '1', NULL, NULL),
(2, 'giaiDoan', '5', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `detai`
--

CREATE TABLE `detai` (
  `maDeTai` bigint UNSIGNED NOT NULL,
  `tenDeTai` varchar(255) NOT NULL,
  `moTa` text,
  `maGV_HD` varchar(20) DEFAULT NULL,
  `maGV_PB` varchar(20) DEFAULT NULL,
  `maHoiDong` bigint UNSIGNED DEFAULT NULL,
  `ky_lvtn_id` bigint UNSIGNED DEFAULT NULL,
  `diemGiuaKy` decimal(4,2) DEFAULT NULL,
  `diemHuongDan` decimal(4,2) DEFAULT NULL,
  `diemPhanBien` decimal(4,2) DEFAULT NULL,
  `diemHoiDong` decimal(4,2) DEFAULT NULL,
  `diemTongKet` decimal(4,2) DEFAULT NULL,
  `trangThaiGiuaKy` enum('duoc_lam_tiep','dinh_chi','canh_cao') DEFAULT NULL,
  `trangThai` enum('dat','can_chinh_sua','khong_dat') DEFAULT NULL,
  `nhanXetGiuaKy` text,
  `nhanXetHuongDan` text,
  `nhanXetPhanBien` text,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `detai`
--
INSERT INTO `detai` (
  `maDeTai`, `tenDeTai`, `moTa`, `maGV_HD`, `maGV_PB`, `maHoiDong`, `ky_lvtn_id`,
  `diemGiuaKy`, `diemHuongDan`, `diemPhanBien`, `diemHoiDong`, `diemTongKet`,
  `trangThaiGiuaKy`, `trangThai`, `nhanXetGiuaKy`, `nhanXetHuongDan`, `nhanXetPhanBien`,
  `created_at`, `updated_at`
) VALUES
(1, 'Hệ thống quản lý sinh viên', 'Xây dựng hệ thống quản lý sinh viên cho trường đại học', 'GV001', 'GV002', 13, 1, 8.5, 9.0, 8.0, 8.5, 8.5, 'duoc_lam_tiep', 'dat', 'Làm tốt', 'Hướng dẫn tốt', 'Phản biện hợp lý', NOW(), NOW()),
(2, 'Website bán hàng thời trang', 'Thiết kế website bán hàng thời trang trực tuyến', 'GV003', 'GV004', 13, 1, 7.0, 7.5, 7.0, 7.2, 7.2, 'canh_cao', 'can_chinh_sua', 'Cần bổ sung chức năng', 'Cần cải thiện giao diện', 'Phản biện chi tiết', NOW(), NOW()),
(3, 'Ứng dụng quản lý thư viện', 'Phát triển ứng dụng quản lý mượn trả sách thư viện', 'GV002', 'GV005', 13, 1, 9.0, 9.5, 9.0, 9.2, 9.2, 'duoc_lam_tiep', 'dat', 'Rất tốt', 'Hướng dẫn sát sao', 'Phản biện tích cực', NOW(), NOW());

-- --------------------------------------------------------

--
-- Table structure for table `giangvien`
--

CREATE TABLE `giangvien` (
  `maGV` varchar(20) NOT NULL,
  `tenGV` varchar(100) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `soDienThoai` varchar(15) DEFAULT NULL,
  `hocVi` varchar(50) DEFAULT NULL,
  `matKhau` varchar(255) NOT NULL DEFAULT '123',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `giangvien`
--

INSERT INTO `giangvien` (`maGV`, `tenGV`, `email`, `soDienThoai`, `hocVi`, `matKhau`, `created_at`, `updated_at`) VALUES
('GV001', 'Dương Văn Đeo', 'duongvandeo@stu.edu.vn', '0906789012', 'ThS', '123', '2026-04-10 03:17:41', '2026-04-10 03:17:41'),
('GV002', 'Trần Văn Hùng', 'tranvanhung@stu.edu.vn', '0907890123', 'TS', '123', '2026-04-10 03:17:41', '2026-04-10 03:17:41'),
('GV003', 'Ngô Xuân Bách', 'ngoxuanbach@stu.edu.vn', '0908901234', 'ThS', '123', '2026-04-10 03:17:41', '2026-04-10 03:17:41'),
('GV004', 'Đoàn Trình Dục', 'doantrinhduc@stu.edu.vn', '0909012345', 'TS', '123', '2026-04-10 03:17:41', '2026-04-10 03:17:41'),
('GV005', 'Bùi Nhật Bằng', 'buinhatbang@stu.edu.vn', '0910123456', 'PGS.TS', '123', '2026-04-10 03:17:41', '2026-04-10 03:17:41');

-- --------------------------------------------------------

--
-- Table structure for table `hoidong`
--

CREATE TABLE `hoidong` (
  `maHoiDong` bigint UNSIGNED NOT NULL,
  `tenHoiDong` varchar(255) NOT NULL,
  `diaDiem` varchar(255) DEFAULT NULL,
  `ky_lvtn_id` bigint UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `hoidong`
--

INSERT INTO `hoidong` (`maHoiDong`, `tenHoiDong`, `diaDiem`, `ky_lvtn_id`, `created_at`, `updated_at`) VALUES
(13, '1', 'C.703', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `ky_lvtn`
--

CREATE TABLE `ky_lvtn` (
  `id` bigint UNSIGNED NOT NULL,
  `ten` varchar(100) NOT NULL,
  `ngay_bat_dau` date DEFAULT NULL,
  `ngay_nhan_de_tai` date DEFAULT NULL,
  `ngay_cham_50` date DEFAULT NULL,
  `ngay_phan_bien` date DEFAULT NULL,
  `ngay_bao_ve` date DEFAULT NULL,
  `ngay_ket_thuc` date DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------
INSERT INTO ky_lvtn (id, ten) VALUES (1, 'Kỳ LVTN 1');

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint UNSIGNED NOT NULL,
  `tokenable_id` varchar(255) NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_id`, `tokenable_type`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(2, 'GV001', 'App\\Models\\GiangVien', 'auth_token', '5d4d6c2f517e834bfc96cdfea25408e6bbb515055c235e03827b4b5b1775e65b', '[\"*\"]', NULL, NULL, '2026-04-09 20:48:11', '2026-04-09 20:48:11'),
(3, 'GV001', 'App\\Models\\GiangVien', 'auth_token', '688dd28b7bcd5d196209d81f3d001e9da7323ace1f3a2462b5d1dade2ee49863', '[\"*\"]', NULL, NULL, '2026-04-09 20:48:37', '2026-04-09 20:48:37'),
(4, 'GV001', 'App\\Models\\GiangVien', 'auth_token', '61568543db336769fe7c3ea3a80b81262a372f86546fb8ff18d598d57c4e6c58', '[\"*\"]', NULL, NULL, '2026-04-09 20:49:18', '2026-04-09 20:49:18'),
(7, 'GV001', 'App\\Models\\GiangVien', 'auth_token', '65a520628bb9e6c9f2b920288df1ed8a53560023b52249642439bc1623260a79', '[\"*\"]', NULL, NULL, '2026-04-09 21:02:23', '2026-04-09 21:02:23'),
(8, 'GV001', 'App\\Models\\GiangVien', 'auth_token', '7bddc3f04988f5e5209cf6e7a40c3af66db2222e6bdd2a1093fed4e2d745fe48', '[\"*\"]', NULL, NULL, '2026-04-09 21:02:45', '2026-04-09 21:02:45'),
(9, 'GV001', 'App\\Models\\GiangVien', 'auth_token', '7af34a1c375c6e7872f6eb742972e0d960330b88b45331078d46afd30417a189', '[\"*\"]', NULL, NULL, '2026-04-09 21:03:05', '2026-04-09 21:03:05'),
(12, 'GV002', 'App\\Models\\GiangVien', 'auth_token', '4433d9f3c8dbafaba1a55ac1be88199e868583cc8157d82927fd18779c2f8487', '[\"*\"]', '2026-04-10 00:01:33', NULL, '2026-04-09 21:20:52', '2026-04-10 00:01:33');

-- --------------------------------------------------------

--
-- Table structure for table `sinhvien`
--

CREATE TABLE `sinhvien` (
  `mssv` varchar(20) NOT NULL,
  `hoTen` varchar(100) NOT NULL,
  `lop` varchar(50) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `soDienThoai` varchar(15) DEFAULT NULL,
  `maDeTai` bigint UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `sinhvien`
--

INSERT INTO `sinhvien` (`mssv`, `hoTen`, `lop`, `email`, `soDienThoai`, `maDeTai`, `created_at`, `updated_at`) VALUES
('DH51801379', 'Ngô Minh Đạt', 'D18_TH01', 'DH51801379@student.stu.edu.vn', '792170819', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52000682', 'Lê Tuấn', 'D20_TH03', 'DH52000682@student.stu.edu.vn', '777789336', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52001024', 'Nguyễn Duy Sơn', 'D20_TH02', 'DH52001024@student.stu.edu.vn', '783887570', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52001243', 'Lưu Văn Hiếu', 'D20_TH05', 'DH52001243@student.stu.edu.vn', '977833079', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52001330', 'Phạm Ngọc Đông', 'D20_TH03', 'DH52001330@student.stu.edu.vn', '366468307', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52001367', 'Lâm Chí Minh', 'D20_TH01', 'DH52001367@student.stu.edu.vn', '924405798', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52001688', 'Phạm Nhựt Linh', 'D20_TH02', 'DH52001688@student.stu.edu.vn', '794985963', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52001900', 'Nguyễn Minh Triều', 'D20_TH01', 'DH52001900@student.stu.edu.vn', '899052420', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52001904', 'Nguyễn Hữu Trường', 'D20_TH01', 'DH52001904@student.stu.edu.vn', '855021202', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52002302', 'Cao Hoàng Nam', 'D20_TH01', 'DH52002302@student.stu.edu.vn', '909393047', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52002303', 'Lê Chí Cường', 'D20_TH01', 'DH52002303@student.stu.edu.vn', '904446653', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52002358', 'Vương Tiến Hùng', 'D20_TH05', 'DH52002358@student.stu.edu.vn', '968189572', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52002723', 'Phạm Ngọc Khoa', 'D20_TH04', 'DH52002723@student.stu.edu.vn', '528051699', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52003543', 'Nguyễn Công Chi', 'D20_TH05', 'DH52003543@student.stu.edu.vn', '523261143', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52003563', 'Phan Văn Việt', 'D20_TH03', 'DH52003563@student.stu.edu.vn', '934487805', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52003835', 'Trần Đình Khoa', 'D20_TH05', 'DH52003835@student.stu.edu.vn', '707035451', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52003862', 'Trần Hữu Quang', 'D20_TH05', 'DH52003862@student.stu.edu.vn', '919402052', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52003935', 'Phạm Châu Phú', 'D20_TH04', 'DH52003935@student.stu.edu.vn', '337847385', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52003995', 'Huỳnh Thanh Phúc', 'D20_TH04', 'DH52003995@student.stu.edu.vn', '348095507', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52004272', 'Lưu Thị Thanh Thảo', 'D20_TH06', 'DH52004272@student.stu.edu.vn', '329824880', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52005049', 'Đặng Ngọc Giàu', 'D20_TH09', 'DH52005049@student.stu.edu.vn', '834376555', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52005068', 'Nguyễn Thanh Danh', 'D20_TH09', 'DH52005068@student.stu.edu.vn', '798621883', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52005699', 'Nguyễn Hùng Cường', 'D20_TH10', 'DH52005699@student.stu.edu.vn', '932464672', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52005731', 'Trần Lê Minh Duy', 'D20_TH09', 'DH52005731@student.stu.edu.vn', '838567807', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52005747', 'Đào Thành Đạt', 'D20_TH06', 'DH52005747@student.stu.edu.vn', '522939018', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52005770', 'Trịnh Anh Đức', 'D20_TH11', 'DH52005770@student.stu.edu.vn', '582449063', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52005804', 'Mai Chí Hiệp', 'D20_TH09', 'DH52005804@student.stu.edu.vn', '949619154', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52005851', 'Nguyễn Tấn Huy', 'D20_TH08', 'DH52005851@student.stu.edu.vn', '919202108', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52005870', 'Vũ Trung Kiên', 'D20_TH08', 'DH52005870@student.stu.edu.vn', '779182032', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52005891', 'Phạm Nguyễn Hoàng Khang', 'D20_TH07', 'DH52005891@student.stu.edu.vn', '833485997', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52006237', 'Nguyễn Trần Vân Uyển', 'D20_TH09', 'DH52006237@student.stu.edu.vn', '963476850', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52006575', 'Lâm Tuấn Khoa', 'D20_TH09', 'DH52006575@student.stu.edu.vn', '355002372', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52007089', 'Huỳnh Minh Khoa', 'D20_TH11', 'DH52007089@student.stu.edu.vn', '898175595', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52007161', 'Phạm Duy Thắng', 'D20_TH11', 'DH52007161@student.stu.edu.vn', '335444058', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52007186', 'Trần Như Nguyện', 'D20_TH10', 'DH52007186@student.stu.edu.vn', '388065951', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52100514', 'Trần Quốc Nam', 'D21_TH04', 'DH52100514@student.stu.edu.vn', '2838506194', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52100776', 'Vũ Trung Nguyên', 'D21_TH09', 'DH52100776@student.stu.edu.vn', '931329585', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52100937', 'Nguyễn Xuân Long', 'D21_TH02', 'DH52100937@student.stu.edu.vn', '396285403', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52101402', 'Nguyễn Văn Hoàng Long', 'D21_TH02', 'DH52101402@student.stu.edu.vn', '828599379', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52101465', 'Quách Thái Hùng', 'D21_TH02', 'DH52101465@student.stu.edu.vn', '947252595', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52101856', 'Nguyễn Duy Bản', 'D21_TH03', 'DH52101856@student.stu.edu.vn', '342271703', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52101979', 'Phạm Thị ánh Hồng', 'D21_TH02', 'DH52101979@student.stu.edu.vn', '976747106', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52103137', 'Phan Tuấn Dũng', 'D21_TH01', 'DH52103137@student.stu.edu.vn', '357716720', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52103511', 'Phạm Hữu Chí', 'D21_TH01', 'DH52103511@student.stu.edu.vn', '385920397', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52103682', 'Bùi Minh Phúc', 'D21_TH01', 'DH52103682@student.stu.edu.vn', '359128746', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52103727', 'Đào Duy Hoàng Vương', 'D21_TH03', 'DH52103727@student.stu.edu.vn', '983621649', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52104108', 'Nguyễn Đăng Khoa', 'D21_TH02', 'DH52104108@student.stu.edu.vn', '938240431', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52104298', 'Lê Thị Ly Ly', 'D21_TH08', 'DH52104298@student.stu.edu.vn', '339519874', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52104582', 'Ngô Duy Tùng', 'D21_TH03', 'DH52104582@student.stu.edu.vn', '946809362', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52104857', 'Lê Thị Đa Lin', 'D21_TH04', 'DH52104857@student.stu.edu.vn', '374423479', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52104887', 'Nhữ Quốc Anh', 'D21_TH05', 'DH52104887@student.stu.edu.vn', '856143299', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52105312', 'Trần Hà Xuân Thịnh', 'D21_TH02', 'DH52105312@student.stu.edu.vn', '349573458', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52105342', 'Trần Nguyễn Minh Quân', 'D21_TH05', 'DH52105342@student.stu.edu.vn', '388073445', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52105346', 'Lê Nguyễn Thành Vũ', 'D21_TH02', 'DH52105346@student.stu.edu.vn', '763163435', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52105659', 'Bạch Đức Phước', 'D21_TH03', 'DH52105659@student.stu.edu.vn', '866088087', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52106130', 'Bùi Phi Hùng', 'D21_TH01', 'DH52106130@student.stu.edu.vn', '394126389', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52106176', 'Nguyễn Minh Huy', 'D21_TH07', 'DH52106176@student.stu.edu.vn', '933881276', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52106292', 'Phan Duy Tuấn', 'D21_TH04', 'DH52106292@student.stu.edu.vn', '327261528', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52106608', 'Đỗ Quang Vinh', 'D21_TH03', 'DH52106608@student.stu.edu.vn', '708738019', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52107203', 'Nguyễn Ngọc Thiện', 'D21_TH01', 'DH52107203@student.stu.edu.vn', '962419209', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52107408', 'Trần Minh Tú', 'D21_TH02', 'DH52107408@student.stu.edu.vn', '772911890', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52107697', 'Đinh Nguyễn Tuấn', 'D21_TH03', 'DH52107697@student.stu.edu.vn', '976588770', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52107801', 'Nguyễn Thanh Vân', 'D21_TH05', 'DH52107801@student.stu.edu.vn', '349442507', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52108018', 'Nguyễn Quốc Thắng', 'D21_TH05', 'DH52108018@student.stu.edu.vn', '765688708', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52108380', 'Đoàn Thị Yến Bình', 'D21_TH06', 'DH52108380@student.stu.edu.vn', '824108001', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52108402', 'Nguyễn Trung Hiếu', 'D21_TH05', 'DH52108402@student.stu.edu.vn', '326780829', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52108453', 'Đinh Phạm Phú Khang', 'D21_TH05', 'DH52108453@student.stu.edu.vn', '778715658', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52108517', 'Hoàng Hữu Lê Chinh', 'D21_TH05', 'DH52108517@student.stu.edu.vn', '898671245', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52108656', 'Võ Minh Thuận', 'D21_TH06', 'DH52108656@student.stu.edu.vn', '936452676', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52110534', 'Nguyễn Mậu An', 'D21_TH08', 'DH52110534@student.stu.edu.vn', '343513046', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52110553', 'Mai Trần Duy Anh', 'D21_TH13', 'DH52110553@student.stu.edu.vn', '947657637', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52110561', 'Nguyễn Lan Anh', 'D21_TH11', 'DH52110561@student.stu.edu.vn', '329186138', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52110568', 'Phạm Minh Anh', 'D21_TH05', 'DH52110568@student.stu.edu.vn', '395168006', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52110581', 'Nguyễn Ngọc Ân', 'D21_TH13', 'DH52110581@student.stu.edu.vn', '921266924', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52110593', 'Lê Tôn Bảo', 'D21_TH13', 'DH52110593@student.stu.edu.vn', '949965772', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52110640', 'Hà Thị Mỹ Châu', 'D21_TH05', 'DH52110640@student.stu.edu.vn', '394949891', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52110677', 'Nguyễn Ngọc Doanh', 'D21_TH09', 'DH52110677@student.stu.edu.vn', '902904122', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52110693', 'Đỗ Ngọc Anh Duy', 'D21_TH13', 'DH52110693@student.stu.edu.vn', '865006929', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52110733', 'Nguyễn Sơn Dương', 'D21_TH11', 'DH52110733@student.stu.edu.vn', '826464186', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52110742', 'Nguyễn Quốc Đại', 'D21_TH14', 'DH52110742@student.stu.edu.vn', '898366249', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52110793', 'Trịnh Phát Đạt', 'D21_TH08', 'DH52110793@student.stu.edu.vn', '977336644', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52110800', 'Nguyễn Võ Hoàng Hải Đăng', 'D21_TH14', 'DH52110800@student.stu.edu.vn', '2837713095', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52110802', 'Trần Ngọc Điền', 'D21_TH14', 'DH52110802@student.stu.edu.vn', '924640701', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52110812', 'Trương Thanh Đông', 'D21_TH11', 'DH52110812@student.stu.edu.vn', '706766557', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52110836', 'Nguyễn Hồng Gấm', 'D21_TH06', 'DH52110836@student.stu.edu.vn', '775160497', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52110857', 'Nguyễn Đăng Hải', 'D21_TH08', 'DH52110857@student.stu.edu.vn', '909523075', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52110924', 'Trần Nguyễn Minh Hiếu', 'D21_TH13', 'DH52110924@student.stu.edu.vn', '936049080', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52110935', 'Nguyễn Đình Hòa', 'D21_TH13', 'DH52110935@student.stu.edu.vn', '888254294', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52110995', 'Đỗ Quang Huy', 'D21_TH09', 'DH52110995@student.stu.edu.vn', '395553134', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52111030', 'Nguyễn Quốc Huy', 'D21_TH09', 'DH52111030@student.stu.edu.vn', '933705051', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52111055', 'Trần Đức Huynh', 'D21_TH10', 'DH52111055@student.stu.edu.vn', '866714807', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52111063', 'Nguyễn Mạnh Hưng', 'D21_TH11', 'DH52111063@student.stu.edu.vn', '328707978', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52111067', 'Trần Minh Hưng', 'D21_TH11', 'DH52111067@student.stu.edu.vn', '932078352', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52111083', 'Trần Mai Huy Khải', 'D21_TH09', 'DH52111083@student.stu.edu.vn', '582079957', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52111085', 'Trương Minh Khải', 'D21_TH08', 'DH52111085@student.stu.edu.vn', '835359010', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52111086', 'Dương Trí Khang', 'D21_TH08', 'DH52111086@student.stu.edu.vn', '836169654', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52111112', 'Đỗ Quốc Khánh', 'D21_TH10', 'DH52111112@student.stu.edu.vn', '983062644', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52111115', 'Mai Lâm Quang Khánh', 'D21_TH10', 'DH52111115@student.stu.edu.vn', '707347324', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52111171', 'Lâm Tuấn Kiệt', 'D21_TH10', 'DH52111171@student.stu.edu.vn', '941693505', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52111174', 'Ngô Tuấn Kiệt', 'D21_TH08', 'DH52111174@student.stu.edu.vn', '849929007', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52111204', 'Trương Văn Liêu', 'D21_TH08', 'DH52111204@student.stu.edu.vn', '393726628', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52111212', 'Nguyễn Hoàng Linh', 'D21_TH11', 'DH52111212@student.stu.edu.vn', '941412077', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52111224', 'Giang Nhật Long', 'D21_TH13', 'DH52111224@student.stu.edu.vn', '856639637', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52111245', 'Võ Thành Long', 'D21_TH10', 'DH52111245@student.stu.edu.vn', '937369772', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52111258', 'Trần Tấn Lộc', 'D21_TH10', 'DH52111258@student.stu.edu.vn', '332345957', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52111293', 'Ong Văn Mến', 'D21_TH12', 'DH52111293@student.stu.edu.vn', '933331843', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52111358', 'Đồng Văn Nghĩa', 'D21_TH08', 'DH52111358@student.stu.edu.vn', '382149204', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52111401', 'Lê Quang Nhân', 'D21_TH08', 'DH52111401@student.stu.edu.vn', '393638193', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52111411', 'Trần Trọng Nhân', 'D21_TH08', 'DH52111411@student.stu.edu.vn', '2723867856', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52111439', 'Huỳnh Tấn Nhớ', 'D21_TH13', 'DH52111439@student.stu.edu.vn', '977979791', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52111441', 'Nguyễn Thị Nhung', 'D21_TH09', 'DH52111441@student.stu.edu.vn', '359439628', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52111445', 'Lê Trần Ngọc Như', 'D21_TH09', 'dh52111445@student.stu.edu.vn', NULL, NULL, '2026-04-09 23:33:30', '2026-04-09 23:33:30'),
('DH52111482', 'Võ Văn Phát', 'D21_TH09', 'DH52111482@student.stu.edu.vn', '937689655', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52111486', 'Nguyễn Tấn Phi', 'D21_TH09', 'DH52111486@student.stu.edu.vn', '703760626', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52111491', 'Nguyễn Chí Phong', 'D21_TH10', 'DH52111491@student.stu.edu.vn', '903073250', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52111509', 'Nguyễn Thành Tỷ Phú', 'D21_TH10', 'DH52111509@student.stu.edu.vn', '767392039', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52111529', 'Lê Trần Trọng Phúc', 'D21_TH10', 'DH52111529@student.stu.edu.vn', '946129499', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52111531', 'Lưu Hoàng Phúc', 'D21_TH13', 'DH52111531@student.stu.edu.vn', '396895104', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52111560', 'Võ Hoàng Phúc', 'D21_TH08', 'DH52111560@student.stu.edu.vn', '767764470', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52111579', 'Nguyễn Việt Phương', 'D21_TH09', 'DH52111579@student.stu.edu.vn', '978699529', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52111612', 'Trần Nguyễn Hoàng Quân', 'D21_TH10', 'DH52111612@student.stu.edu.vn', '911341117', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52111615', 'Võ Minh Quân', 'D21_TH13', 'DH52111615@student.stu.edu.vn', '854381067', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52111637', 'Nguyễn Đăng Quyền', 'D21_TH10', 'DH52111637@student.stu.edu.vn', '815804376', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52111681', 'Lê Anh Tài', 'D21_TH10', 'DH52111681@student.stu.edu.vn', '967788246', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52111695', 'Nguyễn Văn Tài', 'D21_TH13', 'DH52111695@student.stu.edu.vn', '985141631', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52111700', 'Thái Tấn Tài', 'D21_TH09', 'DH52111700@student.stu.edu.vn', '353004163', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52111720', 'Nguyễn Công Tấn', 'D21_TH10', 'DH52111720@student.stu.edu.vn', NULL, NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52111756', 'Lê Minh Thảo', 'D21_TH13', 'DH52111756@student.stu.edu.vn', '522731750', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52111794', 'Nguyễn Chí Thiện', 'D21_TH13', 'DH52111794@student.stu.edu.vn', '979286060', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52111823', 'Võ Thị Tho', 'D21_TH10', 'DH52111823@student.stu.edu.vn', '969747148', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52111833', 'Lê Nguyễn Minh Thông', 'D21_TH08', 'DH52111833@student.stu.edu.vn', '769630210', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52111845', 'Lâm Gia Thuận', 'D21_TH13', 'DH52111845@student.stu.edu.vn', '931548545', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52111847', 'Lương Hiếu Thuận', 'D21_TH08', 'DH52111847@student.stu.edu.vn', '965629532', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52111863', 'Nguyễn Thị Minh Thư', 'D21_TH10', 'DH52111863@student.stu.edu.vn', '97473170', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52111881', 'Trần Thủy Tiên', 'D21_TH08', 'DH52111881@student.stu.edu.vn', '327458490', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52111923', 'Đỗ Minh Trí', 'D21_TH10', 'DH52111923@student.stu.edu.vn', '704651788', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52111976', 'Nguyễn Minh Trường', 'D21_TH13', 'DH52111976@student.stu.edu.vn', '939024432', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52112002', 'Lâm Đình Tuấn', 'D21_TH14', 'DH52112002@student.stu.edu.vn', '906673427', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52112019', 'Nguyễn Ngọc Thanh Tuệ', 'D21_TH08', 'DH52112019@student.stu.edu.vn', '907355548', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52112079', 'Nguyễn Đình Vinh', 'D21_TH14', 'DH52112079@student.stu.edu.vn', '383731640', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52112118', 'Trần Hoàng Vương', 'D21_TH13', 'DH52112118@student.stu.edu.vn', '987038840', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52112127', 'Lương Triều Vỹ', 'D21_TH08', 'DH52112127@student.stu.edu.vn', NULL, NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52112786', 'Đinh Quang Thịnh', 'D21_TH10', 'DH52112786@student.stu.edu.vn', '931487603', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52112805', 'Võ Trọng Nghĩa', 'D21_TH12', 'DH52112805@student.stu.edu.vn', NULL, NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52112809', 'Mai Hoàng An', 'D21_TH12', 'DH52112809@student.stu.edu.vn', '972285275', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52112944', 'Lê Đoàn Anh Quân', 'D21_TH11', 'DH52112944@student.stu.edu.vn', '866603591', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52113016', 'Huỳnh Quốc Duy', 'D21_TH14', 'DH52113016@student.stu.edu.vn', '362949286', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52113047', 'Phan Đức Thắng', 'D21_TH14', 'DH52113047@student.stu.edu.vn', '949985490', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52113134', 'Mai Quang Vinh', 'D21_TH12', 'DH52113134@student.stu.edu.vn', '523756478', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52113292', 'Lê Minh Kiệt', 'D21_TH08', 'DH52113292@student.stu.edu.vn', '937733385', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52113345', 'Lữ Mai Phương', 'D21_TH08', 'DH52113345@student.stu.edu.vn', '833063875', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52113526', 'Trần Thái Duy', 'D21_TH11', 'DH52113526@student.stu.edu.vn', '935183461', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('DH52113777', 'Huỳnh Xuân Thọ', 'D21_TH12', 'DH52113777@student.stu.edu.vn', NULL, NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29'),
('LT52200006', 'Trần Minh Nghĩa', 'L22_TH01', 'LT52200006@student.stu.edu.vn', '908655034', NULL, '2026-04-10 06:32:07', '2026-04-10 06:32:29');

-- --------------------------------------------------------

--
-- Table structure for table `thanhvien_hoidong`
--

CREATE TABLE `thanhvien_hoidong` (
  `id` bigint UNSIGNED NOT NULL,
  `maHoiDong` bigint UNSIGNED NOT NULL,
  `maGV` varchar(20) NOT NULL,
  `vaiTro` enum('ChuTich','ThuKy','UyVien') NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `thanhvien_hoidong`
--

INSERT INTO `thanhvien_hoidong` (`id`, `maHoiDong`, `maGV`, `vaiTro`, `created_at`, `updated_at`) VALUES
(13, 13, 'GV001', 'UyVien', NULL, NULL),
(14, 13, 'GV002', 'ThuKy', NULL, NULL),
(15, 13, 'GV003', 'ThuKy', NULL, NULL),
(16, 13, 'GV004', 'ChuTich', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `topic_registrations_form`
--

CREATE TABLE `topic_registrations_form` (
  `id` bigint NOT NULL,
  `topic_title` varchar(255) NOT NULL,
  `topic_description` text,
  `topic_type` enum('mot_sinh_vien','hai_sinh_vien') NOT NULL,
  `student1_id` varchar(20) NOT NULL,
  `student1_name` varchar(255) NOT NULL,
  `student1_class` varchar(50) NOT NULL,
  `student1_email` varchar(255) DEFAULT NULL,
  `student2_id` varchar(20) DEFAULT NULL,
  `student2_name` varchar(255) DEFAULT NULL,
  `student2_class` varchar(50) DEFAULT NULL,
  `student2_email` varchar(255) DEFAULT NULL,
  `gvhd_code` varchar(20) DEFAULT NULL,
  `gvpb_code` varchar(20) DEFAULT NULL,
  `note` text,
  `status` enum('cho_duyet','da_duyet','tu_choi') DEFAULT 'cho_duyet',
  `source` varchar(50) DEFAULT 'google_form',
  `registered_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `gvhd_workplace` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `topic_registrations_form`
--

INSERT INTO `topic_registrations_form` (`id`, `topic_title`, `topic_description`, `topic_type`, `student1_id`, `student1_name`, `student1_class`, `student1_email`, `student2_id`, `student2_name`, `student2_class`, `student2_email`, `gvhd_code`, `gvpb_code`, `note`, `status`, `source`, `registered_at`, `updated_at`, `gvhd_workplace`) VALUES
(1, 'ssasd', NULL, 'mot_sinh_vien', 'DH52111847', 'DH52111847', 'DH52111847', 'DH52111847@g.com', NULL, NULL, NULL, NULL, 'GV002', NULL, 'sss', 'cho_duyet', 'google_form', '2026-04-10 13:53:56', '2026-04-10 13:53:56', 'ss');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cau_hinh`
--
ALTER TABLE `cau_hinh`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `key` (`key`);

--
-- Indexes for table `detai`
--
ALTER TABLE `detai`
  ADD PRIMARY KEY (`maDeTai`),
  ADD KEY `maGV_HD` (`maGV_HD`),
  ADD KEY `maGV_PB` (`maGV_PB`),
  ADD KEY `maHoiDong` (`maHoiDong`),
  ADD KEY `ky_lvtn_id` (`ky_lvtn_id`);

--
-- Indexes for table `giangvien`
--
ALTER TABLE `giangvien`
  ADD PRIMARY KEY (`maGV`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `hoidong`
--
ALTER TABLE `hoidong`
  ADD PRIMARY KEY (`maHoiDong`),
  ADD KEY `ky_lvtn_id` (`ky_lvtn_id`);

--
-- Indexes for table `ky_lvtn`
--
ALTER TABLE `ky_lvtn`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `token` (`token`),
  ADD KEY `idx_tokenable` (`tokenable_id`,`tokenable_type`);

--
-- Indexes for table `sinhvien`
--
ALTER TABLE `sinhvien`
  ADD PRIMARY KEY (`mssv`),
  ADD KEY `maDeTai` (`maDeTai`);

--
-- Indexes for table `thanhvien_hoidong`
--
ALTER TABLE `thanhvien_hoidong`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `maHoiDong` (`maHoiDong`,`maGV`),
  ADD KEY `maGV` (`maGV`);

--
-- Indexes for table `topic_registrations_form`
--
ALTER TABLE `topic_registrations_form`
  ADD PRIMARY KEY (`id`),
  ADD KEY `gvhd_code` (`gvhd_code`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cau_hinh`
--
ALTER TABLE `cau_hinh`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `detai`
--
ALTER TABLE `detai`
  MODIFY `maDeTai` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `hoidong`
--
ALTER TABLE `hoidong`
  MODIFY `maHoiDong` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `ky_lvtn`
--
ALTER TABLE `ky_lvtn`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `thanhvien_hoidong`
--
ALTER TABLE `thanhvien_hoidong`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `topic_registrations_form`
--
ALTER TABLE `topic_registrations_form`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `detai`
--
ALTER TABLE `detai`
  ADD CONSTRAINT `detai_ibfk_1` FOREIGN KEY (`maGV_HD`) REFERENCES `giangvien` (`maGV`) ON DELETE SET NULL,
  ADD CONSTRAINT `detai_ibfk_2` FOREIGN KEY (`maGV_PB`) REFERENCES `giangvien` (`maGV`) ON DELETE SET NULL,
  ADD CONSTRAINT `detai_ibfk_3` FOREIGN KEY (`maHoiDong`) REFERENCES `hoidong` (`maHoiDong`) ON DELETE SET NULL,
  ADD CONSTRAINT `detai_ibfk_4` FOREIGN KEY (`ky_lvtn_id`) REFERENCES `ky_lvtn` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `hoidong`
--
ALTER TABLE `hoidong`
  ADD CONSTRAINT `hoidong_ibfk_1` FOREIGN KEY (`ky_lvtn_id`) REFERENCES `ky_lvtn` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `sinhvien`
--
ALTER TABLE `sinhvien`
  ADD CONSTRAINT `sinhvien_ibfk_1` FOREIGN KEY (`maDeTai`) REFERENCES `detai` (`maDeTai`) ON DELETE SET NULL;

--
-- Constraints for table `thanhvien_hoidong`
--
ALTER TABLE `thanhvien_hoidong`
  ADD CONSTRAINT `thanhvien_hoidong_ibfk_1` FOREIGN KEY (`maHoiDong`) REFERENCES `hoidong` (`maHoiDong`) ON DELETE CASCADE,
  ADD CONSTRAINT `thanhvien_hoidong_ibfk_2` FOREIGN KEY (`maGV`) REFERENCES `giangvien` (`maGV`) ON DELETE CASCADE;

--
-- Constraints for table `topic_registrations_form`
--
ALTER TABLE `topic_registrations_form`
  ADD CONSTRAINT `topic_registrations_form_ibfk_1` FOREIGN KEY (`gvhd_code`) REFERENCES `giangvien` (`maGV`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
