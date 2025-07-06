import React, { useState } from "react";
import { Box, Button, Input, Heading, Text } from "@chakra-ui/react";

interface LoginFormProps {
  onLoginSuccess: (user: {
    role: string;
    employee_id: number | null;
    token: string;
  }) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("http://172.18.119.226:8000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login_id: loginId, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "ログインに失敗しました");
      } else {
        // トークン・ユーザー情報を親に通知
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
          ログインID
        </Text>
        <Input
          type="text"
          value={loginId}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setLoginId(e.target.value)
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
