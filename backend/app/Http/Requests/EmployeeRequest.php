<?php
// =====================================================
// EmployeeRequest.php
// -----------------------------------------------------
// 【有給休暇管理アプリ】従業員バリデーションFormRequest
// -----------------------------------------------------
// ▼主な役割
//   - 従業員の追加・編集時のバリデーションを一元管理
// ▼設計意図
//   - コントローラから分離し保守性・再利用性向上
// ▼使い方
//   - コントローラのstore/updateで型指定するだけで自動適用
//     例: public function store(EmployeeRequest $request)
// =====================================================

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EmployeeRequest extends FormRequest
{
    /**
     * 認可ロジック（今回は全て許可）
     */
    public function authorize()
    {
        return true;
    }

    /**
     * バリデーションルール
     * - 新規登録時と更新時でuniqueルールを自動切り替え
     */
    public function rules()
    {
        // idがルートパラメータにあれば「更新」、なければ「新規登録」
        $employee_id = $this->route('employee_id');
        $isUpdate = !empty($employee_id);
        return [
            // employee_idはstring型・英数字記号可・最大20文字程度を推奨
            'employee_id' => [
                'required',
                'string',
                'max:20',
                'unique:employees,employee_id' . ($isUpdate ? ",{$employee_id},employee_id" : ''),
            ],
            'last_name' => 'required|string|max:50',
            'first_name' => 'required|string|max:50',
            'joined_at' => 'required|date',
            // 新規登録時のみ必須、編集時はnullable
            'password' => $isUpdate ? 'nullable|string|min:8|max:255' : 'required|string|min:8|max:255',
            'role' => $isUpdate ? 'nullable|string|in:admin,viewer' : 'required|string|in:admin,viewer',
        ];
    }
}
