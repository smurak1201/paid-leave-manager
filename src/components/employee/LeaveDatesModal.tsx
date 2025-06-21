import { Box, Button, Heading, Text } from "@chakra-ui/react";
import { X, Plus } from "lucide-react";
import React from "react";
import { Icons, inputDateStyle, inputDateSmallStyle } from "./icons";

interface LeaveDatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  viewName: string;
  viewDates: string[];
  editDateIdx: number | null;
  dateInput: string;
  onDateInputChange: (v: string) => void;
  onEditDate: (idx: number) => void;
  onSaveDate: () => void;
  onDeleteDate: (idx: number) => void;
  onAddDate: () => void;
  setEditDateIdx: (idx: number | null) => void;
}

export const LeaveDatesModal: React.FC<LeaveDatesModalProps> = ({
  isOpen,
  onClose,
  viewName,
  viewDates,
  editDateIdx,
  dateInput,
  onDateInputChange,
  onEditDate,
  onSaveDate,
  onDeleteDate,
  onAddDate,
  setEditDateIdx,
}) => {
  const overlayRef = React.useRef<HTMLDivElement>(null);
  // オーバーレイ外クリックで閉じる
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) {
      onClose();
      setEditDateIdx(null);
      onDateInputChange("");
    }
  };
  if (!isOpen) return null;
  return (
    <Box
      ref={overlayRef}
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
      onClick={handleOverlayClick}
    >
      <Box
        bg="white"
        borderRadius="lg"
        boxShadow="lg"
        p={6}
        minW="340px"
        maxW="90vw"
        position="relative"
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          position="absolute"
          top={2}
          right={2}
          size="sm"
          variant="ghost"
          colorScheme="teal"
          onClick={() => {
            onClose();
            setEditDateIdx(null);
            onDateInputChange("");
          }}
          p={2}
          minW={"auto"}
        >
          <X size={18} />
        </Button>
        <Heading as="h3" size="md" mb={4} color="teal.700" textAlign="center">
          {viewName} さんの有給取得日
        </Heading>
        <Text color="teal.700" fontWeight="bold" mb={2} textAlign="center">
          消化日数：{viewDates.length}日
        </Text>
        <Box display="flex" gap={2} mb={4}>
          <input
            type="date"
            value={dateInput}
            onChange={(e) => onDateInputChange(e.target.value)}
            style={inputDateStyle}
            maxLength={10}
          />
          {editDateIdx === null ? (
            <Button colorScheme="teal" onClick={onAddDate} px={4} minW={"auto"}>
              <Plus size={16} style={{ marginRight: 6 }} />
              追加
            </Button>
          ) : (
            <Button
              colorScheme="teal"
              onClick={onSaveDate}
              px={4}
              minW={"auto"}
            >
              <Icons.Edit size={16} style={{ marginRight: 6 }} />
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
                      onChange={(e) => onDateInputChange(e.target.value)}
                      style={inputDateSmallStyle}
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
                      editDateIdx === i ? setEditDateIdx(null) : onEditDate(i)
                    }
                    aria-label="編集"
                  >
                    <Icons.Edit size={15} />
                  </Button>
                  <Button
                    size="xs"
                    variant="ghost"
                    colorScheme="red"
                    minW={"auto"}
                    px={2}
                    onClick={() => onDeleteDate(i)}
                    aria-label="削除"
                  >
                    <Icons.Trash2 size={15} />
                  </Button>
                </Box>
              );
            })}
          </Box>
        )}
      </Box>
    </Box>
  );
};
