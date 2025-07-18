<?php

// =====================================================
// EmployeesController.php
// -----------------------------------------------------
// 【有給休暇管理アプリ】従業員APIコントローラ
// -----------------------------------------------------
// ▼主な役割
//   - 従業員情報の一覧取得・追加・編集・削除
// ▼設計意図
//   - RESTfulなAPI設計例・バリデーション/エラーハンドリング例
// ▼使い方
//   - ルーティングでAPIエンドポイントに紐付けて利用
// =====================================================

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Employee;
use App\Http\Requests\EmployeeRequest;

class EmployeesController extends Controller
{
    // 権限制御付き 従業員一覧取得
    public function index(Request $request)
    {
        $user = $request->user();
        if ($user->role === 'admin') {
            // 管理者は全件取得
            $employees = Employee::all();
        } elseif ($user->role === 'viewer' && $user->employee_id) {
            // 閲覧ユーザーは自分の従業員データのみ
            $employees = Employee::where('employee_id', $user->employee_id)->get();
        } else {
            // 権限なし
            return response()->json(['message' => '権限がありません'], 403);
        }
        return response()->json($employees);
    }

    // 従業員追加（管理者のみ許可）
    public function store(EmployeeRequest $request)
    {
        $user = $request->user();
        if ($user->role !== 'admin') {
            return response()->json(['message' => '権限がありません'], 403);
        }
        $validated = $request->validated();
        // パスワードはハッシュ化して保存
        $validated['password'] = bcrypt($validated['password']);
        $employee = Employee::create($validated);
        // usersテーブルへの登録処理は不要（廃止済み）
        return response()->json(['result' => 'ok', 'employee' => $employee]);
    }

    // 従業員編集（管理者のみ許可）
    public function update(EmployeeRequest $request, $id)
    {
        $user = $request->user();
        if ($user->role !== 'admin') {
            return response()->json(['message' => '権限がありません'], 403);
        }
        $employee_id = $request->route('employee_id');
        $employee = Employee::findOrFail($employee_id);
        $data = $request->validated();
        // パスワードが送信されていればハッシュ化して更新
        if (!empty($data['password'])) {
            $data['password'] = bcrypt($data['password']);
        } else {
            unset($data['password']);
        }
        // roleが送信されていれば更新
        if (empty($data['role'])) {
            unset($data['role']);
        }
        $employee->update($data);
        return response()->json(['result' => 'ok', 'employee' => $employee]);
    }

    // 従業員削除（管理者のみ許可）
    public function destroy($employee_id)
    {
        $user = request()->user();
        if ($user->role !== 'admin') {
            return response()->json(['message' => '権限がありません'], 403);
        }
        $employee = Employee::findOrFail($employee_id);
        // usersテーブルからの削除処理は不要（usersテーブル廃止済み）
        $employee->delete();
        return response()->json(['result' => 'ok']);
    }
}
