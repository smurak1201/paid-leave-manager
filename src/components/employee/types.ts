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
  employeeCode: number;   // 業務用従業員コード
  lastName: string;       // 姓
  firstName: string;      // 名
  joinedAt: string;       // 入社年月日 (YYYY-MM-DD)
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
  servicePeriod: string;
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  handleDeleteClick: (id: number) => void;
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
  employeeId: number;
  usedDate: string;
}

export interface LeaveDatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  employeeId: number | null;
  leaveUsages: LeaveUsage[];
  onAddDate: (date: string) => void;
  onDeleteDate: (idx: number) => void;
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
  grantDetails: Array<{
    grantDate: string;
    days: number;
    used: number;
    remain: number;
    usedDates: string[];
  }>;
}

/**
 * LeaveDateListのprops型
 * - LeaveDatesModal配下の有給取得日リスト部品で使用
 */
export interface LeaveDateListProps {
  dates: string[];
  editDateIdx: number | null;
  dateInput: string;
  onChangeDateInput: (v: string) => void;
  onEditDate: (idx: number) => void;
  onDeleteDate: (idx: number) => void;
  inputDateSmallStyle: React.CSSProperties;
  pagedDates: string[];
  currentPage: number;
  ITEMS_PER_PAGE: number;
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

// 不要なローカルロジックや未使用型、サンプルデータ型のコメントアウト等は現状で最適化済み。API設計・props/stateの流れに完全準拠。
