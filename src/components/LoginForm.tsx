import React, { useState } from "react";
import { fetchEmployeeById } from "../api/employeeApi.viewerLogin";
import { Box, Button, Input, Heading, Text } from "@chakra-ui/react";

interface LoginFormProps {
  onLoginSuccess: (user: {
    role: string;
    employee_id: string | null;
    token: string;
  }) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // 閲覧者ログイン時はフルネーム連結パスワードを自動生成
      if (employeeId && password === "__viewer_auto__") {
        const emp = await fetchEmployeeById(employeeId);
        if (!emp) {
          setError("従業員IDが存在しません");
          setLoading(false);
          return;
        }
        const viewerPassword = `${emp.employeeId}${emp.lastName}${emp.firstName}`;
        // 通常のログインAPIを呼ぶ
        await fetch("http://172.18.119.226:8000/sanctum/csrf-cookie", {
          credentials: "include",
        });
        const res = await fetch("http://172.18.119.226:8000/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            employee_id: employeeId,
            password: viewerPassword,
          }),
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
        setLoading(false);
        return;
      }
      // 管理者・通常ログイン
      await fetch("http://172.18.119.226:8000/sanctum/csrf-cookie", {
        credentials: "include",
      });
      const res = await fetch("http://172.18.119.226:8000/api/login", {
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
          従業員ID
        </Text>
        <Input
          type="text"
          value={employeeId}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setEmployeeId(e.target.value)
          }
          autoFocus
          required
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
          placeholder="閲覧者は空欄で自動入力"
          onFocus={() => {
            // 閲覧者用: パスワード欄にフォーカス時、空欄なら自動セット
            if (password === "" && employeeId) setPassword("__viewer_auto__");
          }}
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

export default LoginForm;
