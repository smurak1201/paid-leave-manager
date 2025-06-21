import { useState } from "react";
import {
  Box,
  Heading,
  Button,
  Flex,
  useDisclosure,
  Text,
} from "@chakra-ui/react";
import type { Employee } from "./components/employee/types";
import { EmployeeTable } from "./components/employee/EmployeeTable";
import { EmployeeModal } from "./components/employee/EmployeeModal";
import { X, Edit, Trash2, Plus, Info } from "lucide-react";

const initialEmployees: Employee[] = [
  {
    id: "001",
    lastName: "山田",
    firstName: "太郎",
    total: 20,
    used: 5,
    leaveDates: [
      "2025-04-01",
      "2025-04-15",
      "2025-05-10",
      "2025-06-01",
      "2025-06-15",
    ],
  },
  {
    id: "002",
    lastName: "佐藤",
    firstName: "花子",
    total: 15,
    used: 3,
    leaveDates: ["2025-03-20", "2025-04-10", "2025-06-05"],
  },
];

function App() {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const { open: isOpen, onOpen, onClose } = useDisclosure();
  const [form, setForm] = useState<Employee>({
    id: "",
    lastName: "",
    firstName: "",
    total: 20,
    used: 0,
    leaveDates: [],
  });
  const [editId, setEditId] = useState<string | null>(null);
  const [viewDates, setViewDates] = useState<string[] | null>(null);
  const [viewName, setViewName] = useState<string>("");
  const [editDateIdx, setEditDateIdx] = useState<number | null>(null);
  const [dateInput, setDateInput] = useState<string>("");
  const [guideOpen, setGuideOpen] = useState(false);
  const guideDisclosure = useDisclosure();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "total" || name === "used" ? Number(value) : value,
    }));
  };

  const handleAdd = () => {
    if (!form.id || !form.lastName || !form.firstName) return;
    if (editId) {
      setEmployees((prev) =>
        prev.map((emp) => (emp.id === editId ? { ...form } : emp))
      );
    } else {
      setEmployees([...employees, { ...form }]);
    }
    setForm({
      id: "",
      lastName: "",
      firstName: "",
      total: 20,
      used: 0,
      leaveDates: [],
    });
    setEditId(null);
    onClose();
  };

  const handleEdit = (emp: Employee) => {
    setForm(emp);
    setEditId(emp.id);
    onOpen();
  };

  const handleDelete = (emp: Employee) => {
    setEmployees((prev) => prev.filter((e) => e.id !== emp.id));
  };

  const handleView = (emp: Employee) => {
    setViewDates(emp.leaveDates);
    setViewName(`${emp.lastName} ${emp.firstName}`);
  };

  const handleAddDate = () => {
    if (!viewDates || !dateInput.match(/^\d{4}-\d{2}-\d{2}$/)) return;
    setViewDates([...viewDates, dateInput]);
    setDateInput("");
    // employees側も更新
    setEmployees((prev) =>
      prev.map((emp) =>
        `${emp.lastName} ${emp.firstName}` === viewName
          ? { ...emp, leaveDates: [...emp.leaveDates, dateInput] }
          : emp
      )
    );
  };

  const handleEditDate = (idx: number) => {
    setEditDateIdx(idx);
    setDateInput(viewDates ? viewDates[idx] : "");
  };

  const handleSaveDate = () => {
    if (
      !viewDates ||
      editDateIdx === null ||
      !dateInput.match(/^\d{4}-\d{2}-\d{2}$/)
    )
      return;
    const newDates = viewDates.map((d, i) =>
      i === editDateIdx ? dateInput : d
    );
    setViewDates(newDates);
    setEditDateIdx(null);
    setDateInput("");
    setEmployees((prev) =>
      prev.map((emp) =>
        `${emp.lastName} ${emp.firstName}` === viewName
          ? { ...emp, leaveDates: newDates }
          : emp
      )
    );
  };

  const handleDeleteDate = (idx: number) => {
    if (!viewDates) return;
    const newDates = viewDates.filter((_, i) => i !== idx);
    setViewDates(newDates);
    setEditDateIdx(null);
    setDateInput("");
    setEmployees((prev) =>
      prev.map((emp) =>
        `${emp.lastName} ${emp.firstName}` === viewName
          ? { ...emp, leaveDates: newDates }
          : emp
      )
    );
  };

  return (
    <Box minH="100vh" bgGradient="linear(to-br, teal.50, white)" py={10}>
      <Box
        maxW="900px"
        mx="auto"
        p={6}
        borderRadius="lg"
        boxShadow="lg"
        bg="whiteAlpha.900"
      >
        <Heading
          mb={8}
          color="teal.700"
          textAlign="center"
          fontWeight="bold"
          letterSpacing={2}
        >
          有給休暇管理
        </Heading>
        <Flex mb={6} justify="flex-end" gap={4}>
          <Button
            colorScheme="teal"
            variant="outline"
            leftIcon={<Info size={18} />}
            onClick={guideDisclosure.onOpen}
            size="md"
            px={6}
            boxShadow="md"
          >
            ガイド
          </Button>
          <Button
            colorScheme="teal"
            onClick={() => {
              setForm({
                id: "",
                lastName: "",
                firstName: "",
                total: 20,
                used: 0,
                leaveDates: [],
              });
              setEditId(null);
              onOpen();
            }}
            size="md"
            px={8}
            boxShadow="md"
          >
            従業員追加
          </Button>
        </Flex>
        {/* ガイドモーダル */}
        {guideDisclosure.open && (
          <Box
            position="fixed"
            top={0}
            left={0}
            w="100vw"
            h="100vh"
            zIndex={2100}
            bg="blackAlpha.400"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Box
              bg="white"
              borderRadius="lg"
              boxShadow="lg"
              p={6}
              minW="340px"
              maxW="90vw"
              position="relative"
            >
              <Button
                position="absolute"
                top={2}
                right={2}
                size="sm"
                variant="ghost"
                colorScheme="teal"
                onClick={guideDisclosure.onClose}
                p={2}
                minW={"auto"}
              >
                <X size={18} />
              </Button>
              <Heading
                as="h3"
                size="md"
                mb={4}
                color="teal.700"
                textAlign="center"
              >
                有給休暇管理ガイド
              </Heading>
              <Box color="gray.700" fontSize="md" lineHeight={1.8}>
                <Text mb={2}>
                  このアプリは、従業員ごとの有給休暇の付与日数・取得状況・残日数を一元管理できます。
                </Text>
                <Text mb={2}>
                  <b>主な機能：</b>
                  <ul style={{ marginLeft: 20 }}>
                    <li>
                      <Plus
                        size={16}
                        style={{ verticalAlign: "middle", marginRight: 4 }}
                      />
                      <b>従業員の追加：</b>{" "}
                      <span style={{ color: "#319795" }}>
                        「従業員追加」ボタン
                      </span>
                      で新規登録
                    </li>
                    <li>
                      <Edit
                        size={16}
                        style={{ verticalAlign: "middle", marginRight: 4 }}
                      />
                      <b>従業員情報の編集：</b>{" "}
                      <span style={{ color: "#319795" }}>
                        テーブルの
                        <Edit
                          size={14}
                          style={{ verticalAlign: "middle", margin: "0 2px" }}
                        />
                        編集ボタン
                      </span>
                      で編集
                    </li>
                    <li>
                      <Trash2
                        size={16}
                        style={{ verticalAlign: "middle", marginRight: 4 }}
                      />
                      <b>従業員の削除：</b>{" "}
                      <span style={{ color: "#E53E3E" }}>
                        テーブルの
                        <Trash2
                          size={14}
                          style={{ verticalAlign: "middle", margin: "0 2px" }}
                        />
                        削除ボタン
                      </span>
                      で削除
                    </li>
                    <li>
                      <Edit
                        size={16}
                        style={{ verticalAlign: "middle", marginRight: 4 }}
                      />
                      <b>有給取得日の登録・編集：</b>{" "}
                      <span style={{ color: "#319795" }}>
                        「確認」ボタンから日付を
                        <Plus
                          size={14}
                          style={{ verticalAlign: "middle", margin: "0 2px" }}
                        />
                        追加、
                        <Edit
                          size={14}
                          style={{ verticalAlign: "middle", margin: "0 2px" }}
                        />
                        編集、
                        <Trash2
                          size={14}
                          style={{ verticalAlign: "middle", margin: "0 2px" }}
                        />
                        削除
                      </span>
                    </li>
                  </ul>
                </Text>
                <Text mb={2}>
                  <b>使い方：</b>
                  <ul style={{ marginLeft: 20 }}>
                    <li>
                      <Plus
                        size={14}
                        style={{ verticalAlign: "middle", margin: "0 2px" }}
                      />
                      「従業員追加」ボタンで新規従業員を登録
                    </li>
                    <li>
                      <Edit
                        size={14}
                        style={{ verticalAlign: "middle", margin: "0 2px" }}
                      />
                      テーブルの編集ボタンで従業員情報を編集
                    </li>
                    <li>
                      <Trash2
                        size={14}
                        style={{ verticalAlign: "middle", margin: "0 2px" }}
                      />
                      テーブルの削除ボタンで従業員を削除
                    </li>
                    <li>
                      <span style={{ color: "#319795" }}>「確認」ボタン</span>
                      で有給取得日を一覧・編集
                    </li>
                  </ul>
                </Text>
                <Text mb={2}>
                  <b>日本の有給休暇制度（概要）</b>
                  <br />
                  ・年次有給休暇は、雇用形態や勤続年数に応じて付与されます。
                  <br />
                  ・取得日数や残日数の管理が義務化されています。
                  <br />
                  ・本アプリはその管理をサポートします。
                </Text>
                <Box mt={4}>
                  <Heading as="h4" size="sm" color="teal.600" mb={2}>
                    年次有給休暇 付与日数の目安表
                  </Heading>
                  <Box
                    as="table"
                    w="100%"
                    borderCollapse="collapse"
                    fontSize="sm"
                    mb={2}
                  >
                    <Box as="thead" bg="teal.50">
                      <Box as="tr">
                        <Box
                          as="th"
                          border="1px solid #B2F5EA"
                          p={1}
                          textAlign="center"
                        >
                          勤続年数
                        </Box>
                        <Box
                          as="th"
                          border="1px solid #B2F5EA"
                          p={1}
                          textAlign="center"
                        >
                          付与日数
                        </Box>
                      </Box>
                    </Box>
                    <Box as="tbody">
                      <Box as="tr">
                        <Box
                          as="td"
                          border="1px solid #B2F5EA"
                          p={1}
                          textAlign="center"
                        >
                          6か月
                        </Box>
                        <Box
                          as="td"
                          border="1px solid #B2F5EA"
                          p={1}
                          textAlign="center"
                        >
                          10日
                        </Box>
                      </Box>
                      <Box as="tr">
                        <Box
                          as="td"
                          border="1px solid #B2F5EA"
                          p={1}
                          textAlign="center"
                        >
                          1年6か月
                        </Box>
                        <Box
                          as="td"
                          border="1px solid #B2F5EA"
                          p={1}
                          textAlign="center"
                        >
                          11日
                        </Box>
                      </Box>
                      <Box as="tr">
                        <Box
                          as="td"
                          border="1px solid #B2F5EA"
                          p={1}
                          textAlign="center"
                        >
                          2年6か月
                        </Box>
                        <Box
                          as="td"
                          border="1px solid #B2F5EA"
                          p={1}
                          textAlign="center"
                        >
                          12日
                        </Box>
                      </Box>
                      <Box as="tr">
                        <Box
                          as="td"
                          border="1px solid #B2F5EA"
                          p={1}
                          textAlign="center"
                        >
                          3年6か月
                        </Box>
                        <Box
                          as="td"
                          border="1px solid #B2F5EA"
                          p={1}
                          textAlign="center"
                        >
                          14日
                        </Box>
                      </Box>
                      <Box as="tr">
                        <Box
                          as="td"
                          border="1px solid #B2F5EA"
                          p={1}
                          textAlign="center"
                        >
                          4年6か月
                        </Box>
                        <Box
                          as="td"
                          border="1px solid #B2F5EA"
                          p={1}
                          textAlign="center"
                        >
                          16日
                        </Box>
                      </Box>
                      <Box as="tr">
                        <Box
                          as="td"
                          border="1px solid #B2F5EA"
                          p={1}
                          textAlign="center"
                        >
                          5年6か月
                        </Box>
                        <Box
                          as="td"
                          border="1px solid #B2F5EA"
                          p={1}
                          textAlign="center"
                        >
                          18日
                        </Box>
                      </Box>
                      <Box as="tr">
                        <Box
                          as="td"
                          border="1px solid #B2F5EA"
                          p={1}
                          textAlign="center"
                        >
                          6年6か月以上
                        </Box>
                        <Box
                          as="td"
                          border="1px solid #B2F5EA"
                          p={1}
                          textAlign="center"
                        >
                          20日
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                  <Text color="gray.500" fontSize="xs">
                    ※週所定労働日数や労働時間によって異なる場合があります
                  </Text>
                </Box>
              </Box>
            </Box>
          </Box>
        )}
        <EmployeeTable
          employees={employees}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
        />
      </Box>
      <EmployeeModal
        isOpen={isOpen}
        onClose={() => {
          setEditId(null);
          onClose();
        }}
        form={form}
        onChange={handleChange}
        onAdd={handleAdd}
      />
      {/* 有給取得日確認モーダル */}
      {viewDates && (
        <Box
          position="fixed"
          top={0}
          left={0}
          w="100vw"
          h="100vh"
          zIndex={2000}
          bg="blackAlpha.400"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Box
            bg="white"
            borderRadius="lg"
            boxShadow="lg"
            p={6}
            minW="340px"
            maxW="90vw"
            position="relative"
          >
            <Button
              position="absolute"
              top={2}
              right={2}
              size="sm"
              variant="ghost"
              colorScheme="teal"
              onClick={() => {
                setViewDates(null);
                setEditDateIdx(null);
                setDateInput("");
              }}
              p={2}
              minW={"auto"}
            >
              <X size={18} />
            </Button>
            <Heading
              as="h3"
              size="md"
              mb={4}
              color="teal.700"
              textAlign="center"
            >
              {viewName} さんの有給取得日
            </Heading>
            <Box display="flex" gap={2} mb={4}>
              <input
                type="date"
                value={dateInput}
                onChange={(e) => setDateInput(e.target.value)}
                style={{
                  border: "1px solid #B2F5EA",
                  borderRadius: 6,
                  padding: "6px 12px",
                  fontSize: 16,
                  outline: "none",
                  flex: 1,
                }}
                maxLength={10}
              />
              {editDateIdx === null ? (
                <Button
                  colorScheme="teal"
                  onClick={handleAddDate}
                  px={4}
                  minW={"auto"}
                >
                  <Plus size={16} style={{ marginRight: 6 }} />
                  追加
                </Button>
              ) : (
                <Button
                  colorScheme="teal"
                  onClick={handleSaveDate}
                  px={4}
                  minW={"auto"}
                >
                  <Edit size={16} style={{ marginRight: 6 }} />
                  保存
                </Button>
              )}
            </Box>
            {viewDates.length === 0 ? (
              <Text color="gray.500" textAlign="center">
                取得履歴なし
              </Text>
            ) : (
              <Box as="ul" pl={0} m={0}>
                {viewDates.map((date, i) => {
                  const [y, m, d] = date.split("-");
                  const jpDate = `${y}年${m}月${d}日`;
                  return (
                    <Box
                      as="li"
                      key={date + i}
                      fontSize="md"
                      color="teal.700"
                      py={2}
                      px={4}
                      borderBottom={
                        i !== viewDates.length - 1 ? "1px solid" : undefined
                      }
                      borderColor="teal.50"
                      borderRadius="md"
                      mb={1}
                      listStyleType="none"
                      bg={i % 2 === 0 ? "teal.50" : "white"}
                      display="flex"
                      alignItems="center"
                      gap={2}
                    >
                      <Text fontWeight="bold" minW="2em">
                        {i + 1}.
                      </Text>
                      {editDateIdx === i ? (
                        <input
                          type="date"
                          value={dateInput}
                          onChange={(e) => setDateInput(e.target.value)}
                          style={{
                            border: "1px solid #B2F5EA",
                            borderRadius: 6,
                            padding: "4px 8px",
                            fontSize: 16,
                            outline: "none",
                          }}
                          maxLength={10}
                        />
                      ) : (
                        <Text>{jpDate}</Text>
                      )}
                      <Button
                        size="xs"
                        variant="ghost"
                        colorScheme="teal"
                        minW={"auto"}
                        px={2}
                        onClick={() =>
                          editDateIdx === i
                            ? setEditDateIdx(null)
                            : handleEditDate(i)
                        }
                        aria-label="編集"
                      >
                        <Edit size={15} />
                      </Button>
                      <Button
                        size="xs"
                        variant="ghost"
                        colorScheme="red"
                        minW={"auto"}
                        px={2}
                        onClick={() => handleDeleteDate(i)}
                        aria-label="削除"
                      >
                        <Trash2 size={15} />
                      </Button>
                    </Box>
                  );
                })}
              </Box>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default App;
