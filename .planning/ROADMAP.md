# Roadmap: TT-CD2 — He thong Quan ly Luan van Tot nghiep

**Created:** 2026-04-03
**Target:** 2026-05-25 (~7 tuan con lai)
**Phases:** 6 phases -> Demo Ready (v1.0)

---

## Hien trang code hien tai

Truoc khi len ke hoach, can hieu nhung gi da co de khong lam lai tu dau:

### Backend (Laravel 12)
- **Models**: Student, Teacher, Topic, Council, CouncilMember, Score, Setting, ThesisForm (8 models)
- **Controllers**: StudentController, LecturerController (chua dung), TopicController (chua dung), CouncilController (chua dung), DashboardController, ThesisFormController, AuthController (chua dung)
- **API routes**: ~820 dong trong `api.php`, phan lon la closure routes (logic viet thang trong route, khong qua controller)
- **Auth**: Custom token luu Cache file store — khong on dinh, mat khi restart server
- **Role system**: Lay role tu `council_members` table — sai logic (GV chua co hoi dong thi khong co role)
- **Packages**: phpoffice/phpspreadsheet + phpoffice/phpword da co trong composer.json
- **Migrations**: KHONG CO — chi co SQL dump
- **Cham diem**: Logic cham GVHD/GVPB da co (4 tieu chi, quy thang 10). Cham hoi dong + tinh tong ket da co.

### Frontend (React 18 + Vite + Tailwind 4)
- **Pages**: LoginPage, Dashboard, Assignment, Midterm, Review, Council, TopicManagement, ThesisForm, UsersPage
- **Layout**: ThesisLayout (sidebar + content area)
- **Auth**: AuthContext voi token luu localStorage
- **Services**: 8 service files (authService, studentService, lecturerService, thesisService, councilService, ...)
- **Routing**: React Router 6, nested routes duoi `/thesis/*`

### Nhung gi CAN LAM MOI / REFACTOR
1. Tach closure routes thanh controller methods (api.php qua lon)
2. Viet migrations thay cho SQL dump
3. Fix auth system — doi tu Cache sang DB token hoac Sanctum
4. Fix role system — isAdmin flag + role-per-context
5. Implement cac route dang tra 501 (import Excel, export Word)
6. Them SV login (hien tai chi co GV login)
7. Them phan cong GVPB
8. UI cho SV xem de tai + in form nhiem vu

---

## Phase Overview

| Phase | Name | Goal | Est. Duration |
|-------|------|------|---------------|
| 1 | Nen tang & Refactor | Migrations, auth dung, tach controllers, role system chuan | 1.5 tuan |
| 2 | Import SV & Phan cong GVHD | Import Excel chay duoc, phan cong SV cho GVHD, GVHD giao de tai | 1.5 tuan |
| 3 | Cham diem & Export Word | GVHD/GVPB cham diem, xuat phieu cham Word tu template | 1.5 tuan |
| 4 | Hoi dong & Phan cong PB | Lap hoi dong, phan cong GVPB, phan cong de tai vao HĐ | 1 tuan |
| 5 | SV Portal & Diem tong ket | SV dang nhap, xem de tai, in form nhiem vu, tinh diem tong ket | 1 tuan |
| 6 | Deploy & Polish | Deploy len hosting, sua UI, test toan bo flow | 0.5-1 tuan |

**Tong:** ~7 tuan (vua du deadline)

---

## Phase 1: Nen tang & Refactor

**Goal:** Backend co migrations chuan, auth on dinh, role dung logic, api.php duoc tach thanh controllers. Frontend ket noi duoc voi auth moi.

**Delivers:**
- Database tao bang migrations (khong con phu thuoc SQL dump)
- Auth login/logout dung DB token thay vi Cache file
- Role system: isAdmin flag cho thu ky, role-per-context cho GVHD/GVPB
- api.php chi chua route definitions, logic nam trong controllers
- Login page frontend ket noi duoc voi auth backend moi

**Code da co lien quan:**
- 8 models da dinh nghia — giu lai, sua table name/fillable neu can
- AuthContext frontend — giu lai, update API endpoints
- ThesisLayout + routing — giu nguyen

**Plans:**
1. **Viet migrations** — tao migrations cho 7 bang chinh (giangvien, sinhvien, detai, hoidong, thanhvienhoidong, diem, cauhinh) + them cot `isAdmin` vao giangvien, them cot `matKhau` vao sinhvien
2. **Refactor auth** — tao bang `api_tokens` trong DB, viet middleware xac thuc tu DB token thay Cache. Them endpoint login cho SV (hoac check ca 2 bang giangvien + sinhvien khi login)
3. **Tach controllers** — chuyen closure routes trong api.php sang cac controller tuong ung (AuthController, LecturerController, TopicController, CouncilController, ScoreController, SettingController, ExportController)
4. **Seeder co ban** — tao seeder voi 1 admin account, vai GV mau, vai SV mau de test

**Success criteria:**
- [ ] `php artisan migrate` chay thanh cong tu database trong
- [ ] Login bang GV account tra ve token, /me tra ve user info voi roles dung
- [ ] api.php duoi 50 dong (chi route definitions)
- [ ] Moi controller co it nhat index + show method hoat dong
- [ ] Frontend login/logout hoat dong voi auth moi

---

## Phase 2: Import SV & Phan cong GVHD

**Goal:** Thu ky import duoc danh sach SV tu file Excel, phan cong SV cho GVHD (max 10 SV/GV), GVHD xem duoc danh sach SV va giao de tai.

**Delivers:**
- Upload file Excel (.xlsx) va import DSSV vao database
- Giao dien phan cong SV cho GVHD (drag-drop hoac select)
- GVHD thay danh sach SV duoc phan cong
- GVHD tao de tai va gan SV vao (1 hoac 2 SV/de tai)
- CRUD giangvien hoan chinh (da co API, can fix va ket noi FE)

**Code da co lien quan:**
- StudentController co index/show/store/update/destroy — giu lai
- Route `/students/import-excel` dang tra 501 — can implement
- Route `/topics/create-group-assign` da co logic tao de tai + gan SV — giu lai
- Frontend: Assignment.jsx, TopicManagement.jsx — review lai va update

**Plans:**
1. **Import Excel** — dung phpspreadsheet doc file truc tiep (khong dung maatwebsite/excel), parse theo format file mau `Chốt_DSSV_GVHD_TenDeTai_LVTN_Dot2_17112025.xlsx`, validate data truoc khi insert
2. **UI Import** — form upload file, hien thi preview truoc khi import, bao loi neu co dong sai
3. **Phan cong GVHD** — API gan SV cho GV (max 10), FE cho phep chon GV va chon SV de phan cong
4. **GVHD giao de tai** — GVHD dang nhap thay danh sach SV, tao de tai moi, gan 1-2 SV vao de tai

**Success criteria:**
- [ ] Upload file Excel mau import thanh cong, SV xuat hien trong danh sach
- [ ] Phan cong 10 SV cho 1 GV thanh cong, SV thu 11 bi tu choi
- [ ] GVHD dang nhap thay chi danh sach SV cua minh
- [ ] GVHD tao de tai va gan 2 SV vao thanh cong

---

## Phase 3: Cham diem & Export Word

**Goal:** GVHD cham diem huong dan, GVPB cham diem phan bien, xuat phieu cham thanh file Word theo mau cua khoa.

**Delivers:**
- Form cham diem GVHD (4 tieu chi, quy thang 10) — da co logic, can UI tot hon
- Form cham diem GVPB — tuong tu GVHD
- Export file Word Mau 01.01, 01.02 (GVHD) tu template .docx
- Export file Word Mau 02.01, 02.02 (GVPB) tu template .docx
- Danh gia 50% (giua ky) — da co toggle, can hoan thien

**Code da co lien quan:**
- API `/topics/{topic}/score-gvhd` va `/topics/{topic}/score-gvpb` da co — giu lai
- Frontend: Midterm.jsx (cham giua ky), Review.jsx (phan bien) — update UI
- phpoffice/phpword da co trong composer.json — chua implement
- File mau .docx da convert trong `docs/huong_dan/`

**Plans:**
1. **Hoan thien UI cham diem GVHD** — form nhap 4 tieu chi cho tung SV, tinh diem tu dong, luu vao DB
2. **UI cham diem GVPB** — tuong tu GVHD nhung cho role GVPB
3. **Export Word GVHD** — dung PHPWord TemplateProcessor, load file Mau_01.01.docx / 01.02.docx, fill data va stream download. Test ky voi template thuc te.
4. **Export Word GVPB** — tuong tu, dung Mau_02.01.docx / 02.02.docx
5. **Danh gia giua ky** — thu ky bat/tat cho phep cham GK, GVHD danh gia trang thai SV (duoc lam tiep / dinh chi / canh cao)

**Success criteria:**
- [ ] GVHD cham diem cho de tai co 2 SV, diem tinh dung (trung binh 2 SV)
- [ ] Download file Word Mau 01.01 co day du thong tin SV, de tai, diem — dung format mau khoa
- [ ] Download file Word Mau 02.01 cho GVPB tuong tu
- [ ] Thu ky bat/tat cham giua ky thanh cong

---

## Phase 4: Hoi dong & Phan cong PB

**Goal:** Thu ky lap hoi dong bao ve, phan cong GVPB cho de tai, phan cong de tai vao hoi dong co thu tu.

**Delivers:**
- CRUD hoi dong bao ve (ngay, phong, 3-4 GV voi vai tro)
- Phan cong GVPB cho tung de tai
- Phan cong de tai vao hoi dong co thu tu trinh bay
- Xuat danh sach bao ve LVTN (Excel)

**Code da co lien quan:**
- Council CRUD da co trong api.php (closure routes) — can chuyen sang controller
- Route `/topics/assign-hoidong` da co — giu lai
- Frontend: Council.jsx da co — review va update
- Topic model co `maGV_PB` va `maHoiDong` fields — da co

**Plans:**
1. **Phan cong GVPB** — thu ky chon de tai, chon GV phan bien, luu vao `detai.maGV_PB`. FE hien thi dropdown GV cho moi de tai.
2. **Hoan thien UI Hoi dong** — form tao/sua hoi dong voi chon GV theo vai tro (chu tich, thu ky, uy vien), them truong ngay bao ve
3. **Phan cong de tai vao HĐ** — chon nhieu de tai, gan vao 1 hoi dong, co thu tu trinh bay (dung drag-drop hoac input so thu tu)
4. **Xuat danh sach bao ve** — export Excel danh sach SV + de tai + hoi dong + ngay + phong

**Success criteria:**
- [ ] Phan cong GVPB cho de tai thanh cong, GVPB dang nhap thay de tai phan bien
- [ ] Tao hoi dong voi 3 GV (ChuTich, ThuKy, UyVien) thanh cong
- [ ] Gan 3 de tai vao hoi dong co thu tu 1-2-3
- [ ] Download file Excel danh sach bao ve day du thong tin

---

## Phase 5: SV Portal & Diem tong ket

**Goal:** Sinh vien dang nhap xem de tai cua minh, in form nhiem vu LVTN. He thong tinh diem tong ket tu dong.

**Delivers:**
- SV dang nhap bang MSSV + mat khau
- Trang SV xem thong tin de tai, GVHD, trang thai
- Export form nhiem vu LVTN (Form_NhiemvuLVTN.docx)
- Tinh diem tong ket: 20% HD + 20% PB + 60% HĐ, quy doi diem chu
- Dashboard thong ke cho admin (neu con thoi gian)

**Code da co lien quan:**
- Logic tinh diem tong ket da co trong route `/topics/council-score` — giu lai
- Logic quy doi diem chu (A+, A, B+, ...) da co — giu lai
- Chua co SV login, chua co trang SV

**Plans:**
1. **SV login** — them endpoint login check bang `sinhvien` (MSSV + matKhau), tra ve token + info. FE them trang login cho SV (hoac dung chung trang login, auto detect GV hay SV).
2. **Trang SV** — hien thi de tai, ten GVHD, trang thai giua ky, diem (neu da co), thong tin hoi dong
3. **Export form nhiem vu** — dung PHPWord fill Form_NhiemvuLVTN.docx voi ten SV, ten de tai, ten GVHD, ...
4. **Tinh diem tong ket** — khi admin nhap diem hoi dong, tu dong tinh diem tong ket va diem chu. Hien thi bang diem tong hop.

**Success criteria:**
- [ ] SV dang nhap bang MSSV, thay duoc de tai cua minh
- [ ] SV download form nhiem vu LVTN voi thong tin dung
- [ ] Nhap du 3 loai diem (HD, PB, HĐ) -> diem tong ket tinh tu dong
- [ ] Bang diem tong hop hien thi dung diem chu

---

## Phase 6: Deploy & Polish

**Goal:** He thong chay tren hosting thuc, giao dien on dinh, flow chinh demo duoc tron ven.

**Delivers:**
- Deploy thanh cong len hosting cua thay
- Domain .io.vn hoac .id.vn tro ve dung
- UI responsive, khong bi loi hien thi
- Flow demo: Import SV -> Phan cong GVHD -> Giao de tai -> Cham diem -> Export Word -> Lap HĐ -> Tinh tong ket

**Plans:**
1. **Build React** — `npm run build`, copy output vao `backend/public/`, cau hinh catch-all route cho SPA
2. **Deploy Laravel** — upload len hosting, cau hinh .env, chay migrations, test API
3. **Cau hinh .htaccess** — rewrite rules cho API va SPA routing
4. **Test toan bo flow** — chay thu tu dau den cuoi, fix loi gap duoc
5. **UI polish** — sua nhung cho bi loi UI, them loading states cho cac trang chinh, responsive check

**Success criteria:**
- [ ] Truy cap domain.io.vn thay giao dien login
- [ ] Demo full flow tu import SV den xuat diem tong ket khong bi loi
- [ ] Trang web hoat dong tren laptop khac (khong chi may dev)
- [ ] Khong co loi console JS nghiem trong

---

## Milestone: v1.0 — Demo Ready

**Phases:** 1-6
**Target:** 2026-05-25

**Demo flow chinh (BAT BUOC hoat dong):**
```
Admin login -> Import DSSV tu Excel -> Phan cong SV cho GVHD
-> GVHD login -> Giao de tai -> Cham diem giua ky -> Cham diem HD -> Export Word
-> Admin phan cong GVPB -> GVPB login -> Cham diem PB -> Export Word
-> Admin lap hoi dong -> Gan de tai vao HĐ -> Nhap diem HĐ -> Tinh tong ket
-> SV login -> Xem de tai -> In form nhiem vu
-> Admin xuat danh sach bao ve
```

**Nice to have (lam neu con thoi gian):**
- Dashboard thong ke dep (so SV, so de tai, tien do)
- Auto-assign GVHD (phan cong tu dong deu cho GV)
- Preview Excel truoc khi import
- Tim kiem/loc nang cao tren cac trang danh sach

**Khong lam trong v1 (da xac nhan):**
- Cham diem hoi dong realtime trong buoi bao ve
- In cong bo ket qua 50%
- SV tu dang ky de tai online
- Notification email
- OAuth/SSO

---

## Risk & Mitigation

| Risk | Kha nang | Tac dong | Cach xu ly |
|------|----------|----------|------------|
| PHPWord template fill bi loi (placeholder tach XML) | Cao | Mat 3-5 ngay | Test template ngay Phase 1, neu khong duoc thi tao Word moi thay vi dung template |
| File Excel tu truong khac format | Trung binh | Import sai data | Xem file thuc te truoc khi code, parse thu cong (khong dung WithHeadingRow) |
| Hosting thieu PHP extension | Trung binh | Deploy fail | Kiem tra hosting ngay khi co access, deploy thu som (cuoi Phase 1) |
| Auth cookie/CORS tren hosting | Thap | Login khong hoat dong | Dung token DB (khong dung Sanctum cookie), deploy cung origin |
| Het thoi gian truoc khi xong het | Trung binh | Thieu feature | Uu tien core flow, thay noi "khong bat buoc lam het" |

---

## Luu y ve thu tu uu tien

Neu bi tre tien do, cat theo thu tu nay (tu duoi len):
1. **Cat truoc nhat**: Dashboard thong ke, auto-assign, preview Excel
2. **Cat neu can**: Xuat danh sach bao ve (lam bang tay duoc)
3. **Cat neu ep buoc**: SV portal (SV co the xem qua GV)
4. **KHONG duoc cat**: Import Excel, Phan cong GVHD, Giao de tai, Cham diem HD/PB, Export Word, Hoi dong

Core flow phai chay duoc end-to-end — tot hon la co nhieu feature do dang.

---

*Tài liệu nay se duoc cap nhat sau moi phase transition. Xem PROJECT.md de biet requirements chi tiet.*
