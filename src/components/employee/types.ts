// =============================
// types.ts
// アプリ全体の型定義ファイル
// =============================
//
// 役割:
// ・従業員・有給付与履歴・UI部品propsなど全体で使う型定義を一元管理
//
// 設計意図:
// ・型安全性・保守性・可読性向上
// ・props/stateの流れ・UI部品の責務を明確化
// ・初学者が「どの型がどこで使われるか」理解しやすいようにコメント充実
//
// import分類:
// - 業務データ型
// - UI部品props型

// ====== 業務データ型 ======

/**
 * 有給付与履歴（年度ごと）
 * - 各従業員の「いつ付与されたか」「その付与分から何日使ったか」を管理
 * - Employee.grantsで利用
 * - 付与日数はマスタ参照・ロジックで算出
 */
export interface LeaveGrant {
  grantDate: string;      // 付与日(YYYY-MM-DD)
  usedDates: string[];    // この付与分から消化した日付
}

/**
 * 従業員データ構造
 * - アプリのメインデータ
 * - EmployeeTable, EmployeeModal, hooks等で利用
 * - 集計値（total, used, carryOver）は今後は持たず、付与履歴と取得日だけを保持する設計推奨
 */
export interface Employee {
  id: number;             // DB主キー
  employeeId: string;     // 業務用従業員ID（string型で管理）
  lastName: string;       // 姓
  firstName: string;      // 名
  joinedAt: string;       // 入社年月日 (YYYY-MM-DD)
}

// EmployeeSummary型を明示的に定義
export interface EmployeeSummary {
  employeeId: string;
  grantThisYear: number;
  carryOver: number;
  used: number;
  remain: number;
}

// ====== UI部品・props型 ======

/**
 * EmployeeTableの各行(RowContent)で使うprops型
 * - grant/carryOver/used/remainはutilsで計算した値を受け取る
 * - UI部品の型定義も一元管理
 */
export interface RowContentProps {
  emp: Employee;
  grantThisYear: number;
  carryOver: number;
  used: number;
  remain: number;
  servicePeriod: string; // 勤続年数（X年Yか月）を追加
  onEdit: (employeeId: string) => void;
  onDelete: (employeeId: string) => void;
  onView: (employeeId: string) => void;
  handleDeleteClick: (employeeId: string) => void;
  isReadOnly?: boolean;
}

/**
 * LeaveDatesModalのprops型
 * - 有給取得日編集モーダルで使用
 * - UI部品の型定義も一元管理
 *
 * summary: getEmployeeLeaveSummaryの返却型
 * grantDetails: getGrantDetailsの返却型
 */
export interface LeaveUsage {
  id: number;
  employeeId: string;
  usedDate: string;
}

export interface LeaveDatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  employeeId: string | null;
  leaveUsages: LeaveUsage[];
  onAddDate: (date: string) => void;
  onDeleteDate: (idx: number) => Promise<boolean>;
  editDateIdx: number | null;
  setEditDateIdx: (idx: number | null) => void;
  dateInput: string;
  setDateInput: (v: string) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
  summary: {
    grantThisYear: number;
    carryOver: number;
    used: number;
    remain: number;
  };
  usedDates: string[]; // 追加: APIから直接渡す有効期限内の消化日一覧
  grantDetails?: Array<{
    grantDate: string;
    days: number;
    used: number;
    remain: number;
    usedDates: string[];
  }>;
  addDateError?: string;
}

/**
 * LeaveDateListのprops型
 * - LeaveDatesModal配下の有給取得日リスト部品で使用
 */
export interface LeaveDateListProps {
  dates: string[];
  onDeleteDate: (idx: number) => void;
}

/**
 * GuideModalのprops型
 * - アプリの使い方ガイドモーダルで使用
 */
export interface GuideModalProps {
  open: boolean;
  onClose: () => void;
}

// ====== hooks用型（例: useEmployeeForm, useLeaveDates等） ======

/**
 * useEmployeeForm/useLeaveDates等のカスタムフックで返す値の型例
 * - hooksの責務・返却値を明確化
 * - 必要に応じて拡張
 */
export interface UseEmployeeFormReturn {
  values: Employee;
  errors: Partial<Record<keyof Employee, string>>;
  handleChange: (field: keyof Employee, value: string | number) => void;
  validate: () => boolean;
  reset: () => void;
}

export interface UseLeaveDatesReturn {
  leaveDates: string[];
  addLeaveDate: (date: string) => void;
  editLeaveDate: (idx: number, date: string) => void;
  deleteLeaveDate: (idx: number) => void;
  validateLeaveDate: (date: string) => string | null;
}

// ====== 共通ユーティリティ型 ======

/**
 * ページネーション用汎用型
 */
export interface Pagination {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

// EmployeeTableProps型を明示的に定義
export interface EmployeeTableProps {
  employees: Employee[];
  summaries: EmployeeSummary[];
  onEdit: (employeeId: string) => void;
  onDelete: (employeeId: string) => void;
  onView: (employeeId: string) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
}

// LeaveGrant, Employee, LeaveUsage, RowContentProps, LeaveDatesModalProps, LeaveDateListProps など型定義の重複・未使用を整理
// 不要なコメントや未使用型を削除
