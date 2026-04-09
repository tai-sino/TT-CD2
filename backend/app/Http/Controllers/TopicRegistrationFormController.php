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

        $sheetNames = ['DSSV_ĐK_HƯỚNG ĐỀ TÀI', 'SVĐK_TheoLink'];

        foreach ($sheetNames as $sheetName) {
            $sheet = null;
            try {
                $sheet = $spreadsheet->getSheetByName($sheetName);
            } catch (\Exception $e) {
                // sheet ko ton tai, bo qua
            }

            if (!$sheet) {
                continue;
            }

            $rows = $sheet->toArray();
            if (count($rows) < 2) continue;

            $header = $rows[0];
            $mssvIdx = null;
            $hoTenIdx = null;
            $lopIdx = null;
            $tenDeTaiIdx = null;

            foreach ($header as $i => $col) {
                $col = trim((string) $col);
                if (stripos($col, 'MSSV') !== false || stripos($col, 'mã số') !== false) $mssvIdx = $i;
                elseif (stripos($col, 'Họ tên') !== false || stripos($col, 'ho ten') !== false || stripos($col, 'họ và tên') !== false) $hoTenIdx = $i;
                elseif (stripos($col, 'Lớp') !== false || stripos($col, 'lop') !== false) $lopIdx = $i;
                elseif (stripos($col, 'đề tài') !== false || stripos($col, 'de tai') !== false || stripos($col, 'tên đề') !== false) $tenDeTaiIdx = $i;
            }

            if ($mssvIdx === null || $hoTenIdx === null) {
                $errors[] = ['sheet' => $sheetName, 'message' => 'Khong tim thay cot MSSV hoac Ho ten'];
                continue;
            }

            for ($i = 1; $i < count($rows); $i++) {
                $row = $rows[$i];
                $mssv = trim((string) ($row[$mssvIdx] ?? ''));
                $hoTen = trim((string) ($row[$hoTenIdx] ?? ''));
                $lop = $lopIdx !== null ? trim((string) ($row[$lopIdx] ?? '')) : '';
                $tenDeTai = $tenDeTaiIdx !== null ? trim((string) ($row[$tenDeTaiIdx] ?? '')) : '';

                if ($mssv === '' || $hoTen === '') {
                    continue;
                }

                $form = TopicRegistrationForm::create([
                    'topic_title' => $tenDeTai ?: 'Chua co tieu de',
                    'topic_type' => 'mot_sinh_vien',
                    'student1_id' => $mssv,
                    'student1_name' => $hoTen,
                    'student1_class' => $lop ?: '',
                    'source' => 'excel_import',
                    'status' => 'cho_duyet',
                ]);

                SinhVien::firstOrCreate(
                    ['mssv' => $mssv],
                    ['hoTen' => $hoTen, 'lop' => $lop ?: null]
                );

                $imported++;
            }
        }

        return response()->json(['imported' => $imported, 'errors' => $errors]);
    }
}
