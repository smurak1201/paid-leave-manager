// =====================================================
// leaveSummaryApi.ts
// -----------------------------------------------------
// このファイルは「有給サマリー取得API通信ロジック」を一元管理します。
// 主な役割:
//   - 有給サマリー情報の取得APIの呼び出し
//   - 型安全・エラーハンドリング・API設計の共通化
// 設計意図:
//   - API通信の共通化・型安全・保守性向上
//   - UI/ロジックからAPI通信の詳細を隠蔽し、再利用性・可読性向上
// 使い方:
//   - fetchLeaveSummary関数をimportして従業員ごとの有給サマリー取得に利用
// =====================================================

import { apiGet } from "../api";

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

const BASE_URL = "/api/leave-summary";

/**
 * 有給サマリーを取得
 * @param employeeId - 対象従業員ID（number型）
 * @returns LeaveSummary
 */
export async function fetchLeaveSummary(employeeId: number): Promise<LeaveSummary> {
  return apiGet<LeaveSummary>(`${BASE_URL}?employee_id=${employeeId}`);
}
