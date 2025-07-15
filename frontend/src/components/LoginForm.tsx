// =====================================================
// LoginForm.tsx
// -----------------------------------------------------
// 【有給休暇管理アプリ】ログインフォームAPI通信ロジック
// -----------------------------------------------------
// ▼主な役割
//   - ログイン・CSRF取得APIの呼び出し
// ▼設計意図
//   - API通信の共通化・型安全・UIからの分離
// ▼使い方
//   - APIベースURL定数を利用し、API呼び出し箇所を統一
// =====================================================

// ===== import: 外部ライブラリ =====
import React, { useState } from "react"; // React本体・フック
import { Box, Button, Input, Heading, Text } from "@chakra-ui/react"; // UIコンポーネント

// ===== APIエンドポイント定数 =====
const API_BASE = import.meta.env.VITE_API_URL;

// ===== 型定義 =====
interface LoginFormProps {
  onLoginSuccess: (user: {
    role: string;
    employee_id: string | null;
    token: string;
  }) => void;
}

// ===== コンポーネント本体 =====
const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  // ===== useState: 入力・状態管理 =====
  const [employeeId, setEmployeeId] = useState(""); // 従業員ID入力欄
  const [password, setPassword] = useState(""); // パスワード入力欄
  const [error, setError] = useState(""); // エラーメッセージ
  const [loading, setLoading] = useState(false); // ログイン処理中フラグ

  // ===== ログイン処理関数 =====
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // 閲覧者も管理者もID・パスワード手入力方式に統一
      // 管理者・通常ログイン
      await fetch(`${API_BASE}/sanctum/csrf-cookie`, {
        credentials: "include",
      });
      const res = await fetch(`${API_BASE}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ employee_id: employeeId, password }),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "ログインに失敗しました");
      } else {
        onLoginSuccess({
          role: data.role,
          employee_id: data.employee_id,
          token: data.token,
        });
      }
    } catch (e) {
      setError("通信エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      as="form"
      onSubmit={handleSubmit}
      maxW="320px"
      mx="auto"
      mt={12}
      p={8}
      borderWidth={1}
      borderRadius="lg"
      boxShadow="md"
      bg="white"
    >
      <Heading as="h2" size="md" mb={6} textAlign="center">
        ログイン
      </Heading>
      <Box mb={4}>
        <Text mb={1} fontWeight="bold">
          従業員コード
        </Text>
        <Input
          type="text"
          value={employeeId}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setEmployeeId(e.target.value)
          }
          autoFocus
          required
          fontSize="16px"
        />
      </Box>
      <Box mb={4}>
        <Text mb={1} fontWeight="bold">
          パスワード
        </Text>
        <Input
          type="password"
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
          }
          required
          fontSize="16px"
        />
      </Box>
      {error && (
        <Text color="red.500" mb={3} textAlign="center">
          {error}
        </Text>
      )}
      <Button
        type="submit"
        colorScheme="teal"
        width="100%"
        loading={loading}
        mt={2}
      >
        {loading ? "ログイン中..." : "ログイン"}
      </Button>
    </Box>
  );
};

// ===== export =====
export default LoginForm; // ログインフォームコンポーネント
