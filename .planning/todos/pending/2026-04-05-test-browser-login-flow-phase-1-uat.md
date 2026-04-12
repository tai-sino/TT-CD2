---
created: 2026-04-05T16:43:31.508Z
title: Test browser login flow Phase 1 UAT
area: auth
files:
  - .planning/phases/01-n-n-t-ng/01-HUMAN-UAT.md
  - .planning/phases/01-n-n-t-ng/01-VERIFICATION.md
---

## Problem

Phase 1 đã hoàn thành 14/14 must-haves qua code analysis nhưng còn 4 test cases cần chạy tay trên browser để xác nhận end-to-end behavior.

Cần chạy: `php artisan serve` (backend port 8000) + `npm run dev` (frontend port 5173), rồi test trên browser.

## Solution

Chạy 4 test cases sau:

1. Đăng nhập `admin@stu.edu.vn / 123456` → kiểm tra redirect `/admin/tong-quan`, sidebar hiển thị 9 menu items
2. Đăng nhập SV `em@student.stu.edu.vn / 123456` → kiểm tra redirect `/sv/de-tai`, sidebar chỉ 1 item
3. Truy cập `/admin/tong-quan` khi chưa đăng nhập (xóa localStorage) → kiểm tra redirect về `/login`
4. Click "Đăng xuất" → token bị xóa → truy cập route protected lại bị redirect về `/login`

Sau khi test xong → chạy `/gsd:execute-phase 1` với "approved" để đánh dấu Phase 1 complete.
