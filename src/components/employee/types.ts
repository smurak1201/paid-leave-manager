// =============================
// types.ts
// 型定義ファイル
// =============================
//
// このファイルは有給休暇管理アプリ全体で使う型定義を一元管理します。
// - Employee型: 従業員情報（id, 氏名, 入社日, 有給付与履歴, 取得日リスト等）
// - Grant型: 有給付与履歴（付与日・付与日数・消化日リスト）
// - propsやstateの型安全性・バリデーション共通化のために利用
//
// 設計意図:
// - 型定義を一元管理し、全ファイルで型安全性・保守性を向上
// - 初学者でも理解しやすいように型の意味・用途を日本語コメントで明記
//
// 型定義ファイル。従業員(Employee)や有給付与履歴(LeaveGrant)の構造を定義します。
// アプリ全体で型の一元管理を行うことで、型安全性・保守性を高めています。
export interface LeaveGrant {
  grantDate: string; // 付与日（YYYY-MM-DD）
  days: number;      // 付与日数
  usedDates: string[]; // この付与分から消化した日付
}

export interface Employee {
  id: number; // 従業員コード（数値型）
  lastName: string; // 姓
  firstName: string; // 名
  joinedAt: string; // 入社年月日 (YYYY-MM-DD)
  grants?: LeaveGrant[]; // 年度ごとの有給付与履歴
  total: number; // 付与日数（理論値）
  used: number; // 消化日数
  leaveDates: string[]; // 有給取得日（YYYY-MM-DD）
  carryOver?: number; // 前年からの繰越日数（省略時は0）
}

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
 */
export interface LeaveDatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  employeeId: number | null;
  getEmployee: (id: number) => Employee | undefined;
  editDateIdx: number | null;
  dateInput: string;
  onChangeDateInput: (v: string) => void;
  onAddDate: (date: string) => void;
  onEditDate: (idx: number) => void;
  onSaveDate: () => void;
  onDeleteDate: (idx: number) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
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
