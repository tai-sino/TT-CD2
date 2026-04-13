<?php

namespace App\Http\Controllers;

use App\Models\SinhVien;
use App\Models\TopicRegistrationForm;
use Illuminate\Http\Request;
use PhpOffice\PhpSpreadsheet\IOFactory;

class TopicRegistrationFormController extends Controller
{
    public function index(Request $request)
    {
        $query = TopicRegistrationForm::query();

        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(function ($q) use ($s) {
                $q->where('student1_id', 'like', "%$s%")
                  ->orWhere('student1_name', 'like', "%$s%")
                  ->orWhere('student2_id', 'like', "%$s%")
                  ->orWhere('student2_name', 'like', "%$s%");
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        return response()->json($query->latest('registered_at')->paginate(20));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'topic_title' => 'required|string|max:255',
            'topic_description' => 'nullable|string',
            'topic_type' => 'required|in:mot_sinh_vien,hai_sinh_vien',
            'student1_id' => 'required|string|max:20',
            'student1_name' => 'required|string|max:255',
            'student1_class' => 'required|string|max:50',
            'student1_email' => 'nullable|email|max:255',
            'student2_id' => 'nullable|string|max:20',
            'student2_name' => 'nullable|string|max:255',
            'student2_class' => 'nullable|string|max:50',
            'student2_email' => 'nullable|email|max:255',
            'gvhd_code' => 'nullable|string|max:20',
            'gvhd_workplace' => 'nullable|string|max:255',
            'gvpb_code' => 'nullable|string|max:20',
            'note' => 'nullable|string',
            'status' => 'nullable|in:cho_duyet,da_duyet,tu_choi',
        ]);

        $form = TopicRegistrationForm::create($data);

        SinhVien::firstOrCreate(
            ['mssv' => $data['student1_id']],
            ['hoTen' => $data['student1_name'], 'lop' => $data['student1_class'], 'email' => $data['student1_email'] ?? null]
        );

        if (!empty($data['student2_id'])) {
            SinhVien::firstOrCreate(
                ['mssv' => $data['student2_id']],
                ['hoTen' => $data['student2_name'] ?? '', 'lop' => $data['student2_class'] ?? null, 'email' => $data['student2_email'] ?? null]
            );
        }

        return response()->json(['data' => $form], 201);
    }

    public function update(Request $request, $id)
    {
        $form = TopicRegistrationForm::findOrFail($id);

        $data = $request->validate([
            'topic_title' => 'sometimes|required|string|max:255',
            'topic_description' => 'nullable|string',
            'topic_type' => 'sometimes|required|in:mot_sinh_vien,hai_sinh_vien',
            'student1_id' => 'sometimes|required|string|max:20',
            'student1_name' => 'sometimes|required|string|max:255',
            'student1_class' => 'sometimes|required|string|max:50',
            'student1_email' => 'nullable|email|max:255',
            'student2_id' => 'nullable|string|max:20',
            'student2_name' => 'nullable|string|max:255',
            'student2_class' => 'nullable|string|max:50',
            'student2_email' => 'nullable|email|max:255',
            'gvhd_code' => 'nullable|string|max:20',
            'gvhd_workplace' => 'nullable|string|max:255',
            'gvpb_code' => 'nullable|string|max:20',
            'note' => 'nullable|string',
            'status' => 'nullable|in:cho_duyet,da_duyet,tu_choi',
        ]);

        $form->update($data);

        return response()->json(['data' => $form]);
    }

    public function destroy($id)
    {
        $form = TopicRegistrationForm::findOrFail($id);
        $form->delete();

        return response()->json(['message' => 'Da xoa']);
    }

    public function importExcel(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls',
        ]);

        $spreadsheet = IOFactory::load($request->file('file')->getPathname());

        $imported = 0;
        $errors = [];

        // Sheet 1: DSSV_ĐK_HƯỚNG DẪN ĐỀ TÀI
        $sheet1 = null;
        try {
            $sheet1 = $spreadsheet->getSheetByName('DSSV_ĐK_HƯỚNG DẪN ĐỀ TÀI');
        } catch (\Exception $e) {}
        if ($sheet1) {
            $rows = $sheet1->toArray();
            if (count($rows) >= 2) {
                $header = $rows[0];
                // Map columns
                $idx = [
                    'mssv' => null,
                    'hoTen' => null,
                    'lop' => null,
                    'gvhd' => null,
                    'gvhd_workplace' => null,
                    'tenDeTai' => null,
                    'ghiChu' => null,
                ];
                foreach ($header as $i => $col) {
                    $col = trim((string) $col);
                    if (stripos($col, 'MSSV') !== false) $idx['mssv'] = $i;
                    elseif (stripos($col, 'HỌ TÊN SINH VIÊN') !== false) $idx['hoTen'] = $i;
                    elseif (stripos($col, 'LỚP') !== false) $idx['lop'] = $i;
                    elseif (stripos($col, 'GVHD') !== false && stripos($col, 'nhập') === false) $idx['gvhd'] = $i;
                    elseif (stripos($col, 'Nơi công tác') !== false) $idx['gvhd_workplace'] = $i;
                    elseif (stripos($col, 'Tên đề tài (GVHD nhập thông tin') !== false) $idx['tenDeTai'] = $i;
                    elseif (stripos($col, 'GHI CHÚ') !== false) $idx['ghiChu'] = $i;
                }
                if ($idx['mssv'] === null || $idx['hoTen'] === null) {
                    $errors[] = ['sheet' => 'DSSV_ĐK_HƯỚNG DẪN ĐỀ TÀI', 'message' => 'Không tìm thấy cột MSSV hoặc HỌ TÊN'];
                } else {
                    for ($i = 1; $i < count($rows); $i++) {
                        $row = $rows[$i];
                        $mssv = trim((string) ($row[$idx['mssv']] ?? ''));
                        $hoTen = trim((string) ($row[$idx['hoTen']] ?? ''));
                        $lop = $idx['lop'] !== null ? trim((string) ($row[$idx['lop']] ?? '')) : '';
                        $gvhd = $idx['gvhd'] !== null ? trim((string) ($row[$idx['gvhd']] ?? '')) : null;
                        $gvhd_workplace = $idx['gvhd_workplace'] !== null ? trim((string) ($row[$idx['gvhd_workplace']] ?? '')) : null;
                        $tenDeTai = $idx['tenDeTai'] !== null ? trim((string) ($row[$idx['tenDeTai']] ?? '')) : '';
                        $ghiChu = $idx['ghiChu'] !== null ? trim((string) ($row[$idx['ghiChu']] ?? '')) : null;

                        if ($mssv === '' || $hoTen === '') continue;

                        // Thêm sinh viên nếu chưa có
                        SinhVien::firstOrCreate(
                            ['mssv' => $mssv],
                            ['hoTen' => $hoTen, 'lop' => $lop ?: null]
                        );

                        // Đối chiếu các cột khác khi tạo TopicRegistrationForm
                        $form = TopicRegistrationForm::firstOrCreate(
                            [
                                'student1_id' => $mssv,
                                'topic_title' => $tenDeTai ?: 'Chưa có tiêu đề',
                            ],
                            [
                                'topic_type' => 'mot_sinh_vien',
                                'student1_name' => $hoTen,
                                'student1_class' => $lop ?: '',
                                'gvhd_code' => $gvhd,
                                'gvhd_workplace' => $gvhd_workplace,
                                'note' => $ghiChu,
                                'source' => 'excel_import',
                                'status' => 'cho_duyet',
                            ]
                        );
                        $imported++;
                    }
                }
            }
        }

        // Sheet 2: SVĐK_TheoLink
        $sheet2 = null;
        try {
            $sheet2 = $spreadsheet->getSheetByName('SVĐK_TheoLink');
        } catch (\Exception $e) {}
        if ($sheet2) {
            $rows = $sheet2->toArray();
            if (count($rows) >= 2) {
                $header = $rows[0];
                // Map columns
                $idx = [
                    'timestamp' => null,
                    'email' => null,
                    'hoTen1' => null,
                    'lop1' => null,
                    'mssv1' => null,
                    'sdt1' => null,
                    'soNhom' => null,
                    'lamChungNhom' => null,
                ];
                foreach ($header as $i => $col) {
                    $col = trim((string) $col);
                    if (stripos($col, 'Timestamp') !== false) $idx['timestamp'] = $i;
                    elseif (stripos($col, 'Email Address') !== false) $idx['email'] = $i;
                    elseif (stripos($col, 'Họ và tên sinh viên 1') !== false) $idx['hoTen1'] = $i;
                    elseif (stripos($col, 'Lớp sinh viên 1') !== false) $idx['lop1'] = $i;
                    elseif (stripos($col, 'Mã sinh viên 1') !== false) $idx['mssv1'] = $i;
                    elseif (stripos($col, 'Số điện thoại sinh viên 1') !== false) $idx['sdt1'] = $i;
                    elseif (stripos($col, 'Số Nhóm') !== false) $idx['soNhom'] = $i;
                    elseif (stripos($col, 'Có làm chung nhóm với sinh viên khác không?') !== false) $idx['lamChungNhom'] = $i;
                }
                if ($idx['mssv1'] === null || $idx['hoTen1'] === null) {
                    $errors[] = ['sheet' => 'SVĐK_TheoLink', 'message' => 'Không tìm thấy cột Mã sinh viên 1 hoặc Họ và tên sinh viên 1'];
                } else {
                    for ($i = 1; $i < count($rows); $i++) {
                        $row = $rows[$i];
                        $mssv1 = trim((string) ($row[$idx['mssv1']] ?? ''));
                        $hoTen1 = trim((string) ($row[$idx['hoTen1']] ?? ''));
                        $lop1 = $idx['lop1'] !== null ? trim((string) ($row[$idx['lop1']] ?? '')) : '';
                        $email = $idx['email'] !== null ? trim((string) ($row[$idx['email']] ?? '')) : null;
                        $sdt1 = $idx['sdt1'] !== null ? trim((string) ($row[$idx['sdt1']] ?? '')) : null;
                        $soNhom = $idx['soNhom'] !== null ? trim((string) ($row[$idx['soNhom']] ?? '')) : null;
                        $lamChungNhom = $idx['lamChungNhom'] !== null ? trim((string) ($row[$idx['lamChungNhom']] ?? '')) : null;

                        if ($mssv1 === '' || $hoTen1 === '') continue;

                        // Thêm sinh viên nếu chưa có
                        SinhVien::firstOrCreate(
                            ['mssv' => $mssv1],
                            ['hoTen' => $hoTen1, 'lop' => $lop1 ?: null, 'email' => $email]
                        );

                        // Đối chiếu các cột khác khi tạo TopicRegistrationForm
                        $form = TopicRegistrationForm::firstOrCreate(
                            [
                                'student1_id' => $mssv1,
                                'student1_name' => $hoTen1,
                            ],
                            [
                                'topic_type' => 'mot_sinh_vien',
                                'student1_class' => $lop1 ?: '',
                                'student1_email' => $email,
                                'note' => 'SĐT: ' . $sdt1 . '; Số nhóm: ' . $soNhom . '; Làm chung nhóm: ' . $lamChungNhom,
                                'source' => 'excel_import',
                                'status' => 'cho_duyet',
                            ]
                        );
                        $imported++;
                    }
                }
            }
        }

        return response()->json(['imported' => $imported, 'errors' => $errors]);
    }
}
