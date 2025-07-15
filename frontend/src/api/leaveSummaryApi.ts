// =====================================================
// leaveSummaryApi.ts
// -----------------------------------------------------
// 【有給休暇管理アプリ】有給サマリー取得API通信ロジック
// -----------------------------------------------------
// ▼主な役割
//   - 有給サマリー情報の取得API呼び出し
// ▼設計意図
//   - API通信の共通化・型安全・UIからの分離
// ▼使い方
//   - fetchLeaveSummary関数をimportして従業員ごとの有給サマリー取得に利用
// =====================================================

// ===== import: API共通関数 =====
import { apiGet } from "../api"; // API通信共通ラッパー

// ===== 型定義 =====
export interface LeaveSummary {
  employeeId: number;
  grantThisYear: number;
  carryOver: number;
  used: number;
  remain: number;
  usedDates: string[];
  grantDetails?: Array<{
    grant_date: string;
    days: number;
    used: number;
    remain: number;
    used_dates: string[];
  }>;
}

// ===== APIエンドポイント定数 =====
const API_BASE = import.meta.env.VITE_API_URL;
const BASE_URL = `${API_BASE}/api/leave-summary`;

// ===== API呼び出し関数 =====

/** 有給サマリーを取得 */
export async function fetchLeaveSummary(employeeId: number): Promise<LeaveSummary> {
  return apiGet<LeaveSummary>(`${BASE_URL}?employee_id=${employeeId}`);
}
