<?php

// =====================================================
// AuthController.php
// -----------------------------------------------------
// 【有給休暇管理アプリ】認証APIコントローラ
// -----------------------------------------------------
// ▼主な役割
//   - ログイン・ログアウトAPIの提供
// ▼設計意図
//   - 認証処理の一元管理・保守性向上
// ▼使い方
//   - ルート定義（api.php）から呼び出し
// =====================================================

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\Employee;

// =====================================================
// 認証APIコントローラ
// -----------------------------------------------------
// ログイン・ログアウトAPIのエンドポイントを提供
// =====================================================
class AuthController extends Controller
{
    // =====================================================
    // ログインAPI
    // -----------------------------------------------------
    // ▼主な役割
    //   - 従業員ID・パスワードで認証
    //   - 認証成功時はトークン・権限等を返却
    // ▼設計意図
    //   - セキュアな認証処理の実装
    //   - API利用時の認証状態管理
    // ▼使い方
    //   - POST /api/login
    //   - リクエスト: { employee_id, password }
    //   - レスポンス: { token, employee_id, role }
    // =====================================================
    public function login(Request $request)
    {
        $request->validate([
            'employee_id' => 'required|string',
            'password' => 'required|string',
        ]);
        $employee = Employee::where('employee_id', $request->employee_id)->first();
        if (!$employee || !Hash::check($request->password, $employee->password)) {
            return response()->json(['message' => 'IDまたはパスワードが正しくありません'], 401);
        }
        $token = $employee->createToken('api-token')->plainTextToken;
        return response()->json([
            'token' => $token,
            'employee_id' => $employee->employee_id,
            'role' => $employee->role,
        ]);
    }

    // =====================================================
    // ログアウトAPI
    // -----------------------------------------------------
    // ▼主な役割
    //   - 現在のアクセストークンを削除
    //   - 認証済みユーザーのみ実行可能
    // ▼設計意図
    //   - セッション管理の明確化
    //   - トークン失効によるセキュリティ向上
    // ▼使い方
    //   - POST /api/logout
    //   - ヘッダー: Authorization: Bearer {token}
    //   - レスポンス: { message }
    // =====================================================
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'ログアウトしました']);
    }
}
