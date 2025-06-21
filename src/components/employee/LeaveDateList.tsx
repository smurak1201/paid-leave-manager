import { Box, Button, Text } from "@chakra-ui/react";
import { Icons } from "./icons";
import React from "react";

interface LeaveDateListProps {
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
 * 有給取得日リスト部分（LeaveDatesModalから分離）
 */
export const LeaveDateList: React.FC<LeaveDateListProps> = ({
  dates,
  editDateIdx,
  dateInput,
  onChangeDateInput,
  onEditDate,
  onDeleteDate,
  inputDateSmallStyle,
  pagedDates,
  currentPage,
  ITEMS_PER_PAGE,
}) => (
  <Box as="ul" pl={0} m={0}>
    {pagedDates.map((date, i) => {
      const idx = (currentPage - 1) * ITEMS_PER_PAGE + i;
      const [y, m, d] = date.split("-");
      const jpDate = `${y}年${m}月${d}日`;
      return (
        <Box
          as="li"
          key={date + idx}
          fontSize="md"
          color="teal.700"
          py={2}
          px={4}
          borderBottom={idx !== dates.length - 1 ? "1px solid" : undefined}
          borderColor="teal.50"
          borderRadius="md"
          mb={1}
          listStyleType="none"
          bg={idx % 2 === 0 ? "teal.50" : "white"}
          display="flex"
          alignItems="center"
          gap={2}
        >
          <Text fontWeight="bold" minW="2em">
            {idx + 1}.
          </Text>
          {editDateIdx === idx ? (
            <input
              type="date"
              value={dateInput}
              onChange={(e) => onChangeDateInput(e.target.value)}
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
            onClick={() => onEditDate(idx)}
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
            onClick={() => onDeleteDate(idx)}
            aria-label="削除"
          >
            <Icons.Trash2 size={15} />
          </Button>
        </Box>
      );
    })}
  </Box>
);
