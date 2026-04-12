---
status: partial
phase: 01-n-n-t-ng
source: [01-VERIFICATION.md]
started: 2026-04-05T17:35:00+07:00
updated: 2026-04-05T17:35:00+07:00
---

## Current Test

[awaiting human testing]

## Tests

### 1. Đăng nhập admin và kiểm tra sidebar
expected: Trang login hiển thị, submit thành công redirect về /admin/tong-quan, sidebar hiện 9 menu items cho role admin
result: [pending]

### 2. Đăng nhập sinh viên và kiểm tra sidebar
expected: Redirect /sv/de-tai, sidebar chỉ hiện menu "Đề tài của tôi" (1 item)
result: [pending]

### 3. Truy cập route protected khi chưa đăng nhập
expected: Truy cập /admin/tong-quan khi chưa có token → ProtectedRoute redirect về /login
result: [pending]

### 4. Đăng xuất end-to-end
expected: Click "Đăng xuất" → token bị xóa khỏi localStorage → redirect về /login → truy cập /admin/tong-quan lại bị redirect về /login
result: [pending]

## Summary

total: 4
passed: 0
issues: 0
pending: 4
skipped: 0
blocked: 0

## Gaps
