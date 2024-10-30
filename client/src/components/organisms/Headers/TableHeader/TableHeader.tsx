import { Button } from "antd";
import Search, { SearchProps } from "antd/es/input/Search";
import { HiOutlinePlus } from "react-icons/hi";
import "./TableHeader.scss";
import Title from "antd/es/typography/Title";

interface TableHeaderProps {
  onSearchChange: (searchedId: string) => void;
  onClickBtn?: () => void;
  btnText?: string;
  totalItems?: number;
  totalItemsText?: string;
  withBtn?: boolean;
  searchPlaceholder?: string;
}

const TableHeader = ({
  onSearchChange,
  searchPlaceholder = "Search",
  withBtn = true,
  onClickBtn,
  btnText = "Add",
  totalItems,
  totalItemsText = "Total:",
}: TableHeaderProps) => {
  const onSearch: SearchProps["onSearch"] = (value) => onSearchChange(value || "null");

  return (
    <div className='table-container'>
      {withBtn && (
        <Title style={{ marginBottom: "1.25rem" }} level={5}>
          {totalItemsText} {totalItems ?? 0}
        </Title>
      )}
      <div className='table-container--header-actions'>
        {!withBtn && (
          <Title style={{ marginBottom: "1.25rem" }} level={5}>
            {totalItemsText} {totalItems ?? 0}
          </Title>
        )}
        <Search
          className='table-container--header-actions-search'
          placeholder={searchPlaceholder}
          allowClear
          onSearch={onSearch}
          style={{ minWidth: 200, maxWidth: 300 }}
        />

        {withBtn && onClickBtn && (
          <Button onClick={onClickBtn} type='primary' icon={<HiOutlinePlus />}>
            {btnText}
          </Button>
        )}
      </div>
    </div>
  );
};

export default TableHeader;
