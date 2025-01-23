import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Button, message, Pagination, Popconfirm, Space, Table, Tooltip } from "antd";
import type { TableProps } from "antd";
import TableHeader from "../../Headers/TableHeader/TableHeader";
import {
  HiOutlineClipboardCopy,
  HiOutlineEye,
  HiOutlinePencilAlt,
  HiOutlineTrash,
  HiOutlineUserAdd,
} from "react-icons/hi";
import { User } from "../../../../types/User";
import "./EquipentsTable.scss";
import { RoleName } from "../../../../types/Role";
import { Condition, Equipment, EquipmentBrand, EquipmentCategory } from "../../../../types/Equipment";
import ConditionTag from "../../../atoms/ConditionTag/ConditionTag";
import { formatDateWithoutTime } from "../../../../helpers/date";
interface EquipentsTableRow {
  id: number;
  serialNumber: string;
  category: EquipmentCategory;
  warrantyEndDate: string;
  condition: Condition;
  brand: EquipmentBrand;
  equipment: Equipment;
}
interface EquipentsTableProps {
  equipments: Equipment[];
  currentUserRole: string;
  status: "error" | "success" | "pending";
  totalEquipments: number;
  onCreateEquipmentDrawerOpen: () => void;
  onViewEquipment: (equipment: Equipment) => void;
  onUpdateEquipment: (equipment: Equipment) => void;
  onDeleteEquipment: (id: number) => void;
  onAssignEquipment: (equipment: Equipment) => void;
  limitEquipmentsPerPage: number;
  onPageChange: (page: number) => void;
  handlePageSizeChange: (pageSize: number) => void;
  addBtnText: string;
  onSearchChange: (searchedName: string) => void;
  onEquipmentCondtionFilterChange: (conditions: Condition[] | null) => void;
}

const EquipmentsTable: React.FC<EquipentsTableProps> = ({
  equipments,
  currentUserRole,
  totalEquipments,
  onDeleteEquipment,
  onUpdateEquipment,
  onViewEquipment,
  onAssignEquipment,
  onPageChange,
  onSearchChange,
  addBtnText,
  onCreateEquipmentDrawerOpen,
  handlePageSizeChange,
  limitEquipmentsPerPage,
  status,
  onEquipmentCondtionFilterChange,
}) => {
  const [pageSize, setPageSize] = useState<number>(limitEquipmentsPerPage);
  const [tableContent, setTableContent] = useState<EquipentsTableRow[]>([]);

  useEffect(() => {
    // Extract specific fields from orders and populate tableContent
    const _tableContent = equipments?.map((equipment) => ({
      id: equipment?.id!,
      serialNumber: equipment?.serialNumber,
      category: equipment?.category,
      warrantyEndDate: equipment?.warrantyEndDate,
      condition: equipment?.condition,
      brand: equipment?.brand,
      assignedTo: equipment?.assignedTo,
      equipment: equipment,
    }));
    setTableContent(_tableContent);
  }, [equipments]);

  const handleEquipmentTypeFilterChange = (selectedConditions: Condition[] | null) => {
    if (!selectedConditions && Array.isArray(selectedConditions)) {
      onEquipmentCondtionFilterChange(null);
    } else {
      onEquipmentCondtionFilterChange(selectedConditions);
    }
  };

  const columns: TableProps<EquipentsTableRow>["columns"] = [
    {
      title: "",
      key: "number",
      width: 50,
      render: (_, _record, index) => index + 1,
    },
    {
      title: "Serial Number",
      dataIndex: "serialNumber",
      key: "serialNumber",
      width: 100,
      render: (text) => (
        <Space>
          <span>{text?.slice(0, 8)}...</span>
          <Tooltip title='copy'>
            <Button
              onClick={() => {
                navigator.clipboard.writeText(text);
                message.success(`Serial Number ${text} copied successfuly.`, 1.5);
              }}
              className='table--action-btn'
              icon={<HiOutlineClipboardCopy />}
            />
          </Tooltip>
        </Space>
      ),
    },

    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      width: 150,
      render: (category) => <>{category?.categoryName}</>,
    },
    {
      title: "Brand",
      dataIndex: "brand",
      key: "brand",
      width: 100,
      render: (brand) => <>{brand?.brandName}</>,
    },
    {
      title: "Condition",
      dataIndex: "condition",
      key: "condition",
      width: 100,
      filters: [
        { text: "Operational", value: Condition.OPERATIONAL },
        { text: "Damaged", value: Condition.DAMAGED },
        { text: "Under maintenance", value: Condition.UNDER_MAINTENANCE },
        { text: "Repaired", value: Condition.REPAIRED },
      ],
      filterMultiple: true,
      filterOnClose: true,
      onFilter: (filteredDataSource: any, activeFilters: any) => {
        return activeFilters.condition === filteredDataSource;
      },
      render: (condition: any) => <ConditionTag condition={condition} />,
    },

    {
      title: "Warranty End Date",
      dataIndex: "warrantyEndDate",
      key: "warrantyEndDate",
      width: 155,
      render: (warrantyEndDate) => <>{formatDateWithoutTime(warrantyEndDate)}</>,
    },
    {
      title: "AssignedTo",
      dataIndex: "assignedTo",
      key: "assignedTo",
      width: 150,
      render: (assignedTo: Partial<User>) => (
        <>{assignedTo?.firstName ? assignedTo?.firstName + " " + assignedTo?.lastName : <div>--</div>}</>
      ),
    },
    ...(currentUserRole == RoleName.TECHNICAL_MANAGER || currentUserRole == RoleName.ADMIN
      ? [
          {
            title: "Action",
            key: "action",
            width: 200,
            render: (equipment: EquipentsTableRow) => (
              <Space size='middle'>
                <Tooltip title='AssignTo'>
                  <Button
                    onClick={() => onAssignEquipment(equipment.equipment)}
                    className='table--action-btn'
                    icon={<HiOutlineUserAdd />}
                  />
                </Tooltip>
                <Tooltip title='View'>
                  <Button
                    onClick={() => {
                      onViewEquipment(equipment.equipment);
                    }}
                    className='table--action-btn'
                    icon={<HiOutlineEye />}
                  />
                </Tooltip>
                <Tooltip title='Edit'>
                  <Button
                    onClick={() => onUpdateEquipment(equipment.equipment)}
                    className='table--action-btn'
                    icon={<HiOutlinePencilAlt />}
                  />
                </Tooltip>
                <Tooltip title='Delete'>
                  <Popconfirm
                    title='Are you sur you want to delete this Equipment?'
                    onConfirm={() => {
                      // store.dispatch(setLoading(true));
                      onDeleteEquipment(equipment.id!);
                    }}
                  >
                    <Button className='table--action-btn' icon={<HiOutlineTrash />} loading={false} />
                  </Popconfirm>
                </Tooltip>
              </Space>
            ),
          },
        ]
      : []),
  ];

  const onPageSizeChange = (_current: number, size: number) => {
    setPageSize(size);
    handlePageSizeChange(size);
  };
  const [tableHeight, setTableHeight] = useState(300);
  const equipmentTabRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (equipmentTabRef.current) {
      const { top } = equipmentTabRef.current.getBoundingClientRect();
      // Adjust TABLE_HEADER_HEIGHT according to your actual header height.
      const TABLE_HEADER_HEIGHT = 160;
      setTableHeight(window.innerHeight - top - TABLE_HEADER_HEIGHT - 100);
    }
  }, [equipmentTabRef]);
  return (
    <div ref={equipmentTabRef} style={{ overflow: "auto" }}>
      <TableHeader
        onSearchChange={(searchedName) => onSearchChange(searchedName)}
        onClickBtn={onCreateEquipmentDrawerOpen}
        btnText={addBtnText}
        totalItems={totalEquipments}
        totalItemsText={"Total Equipments:"}
        searchPlaceholder={"Search by serial number"}
        withBtn={currentUserRole == RoleName.TECHNICAL_MANAGER || currentUserRole == RoleName.ADMIN}
      />
      <Table<EquipentsTableRow>
        loading={status == "pending"}
        rowKey='id'
        columns={columns}
        dataSource={tableContent}
        onChange={(_pagination, filter) => {
          handleEquipmentTypeFilterChange(filter.condition as Condition[]);
        }}
        pagination={false}
        scroll={{ y: tableHeight, x: "max-content" }}
      />
      <Pagination
        style={{ margin: "26px", textAlign: "right", justifyContent: "flex-end" }}
        total={totalEquipments}
        pageSize={pageSize}
        showSizeChanger
        showTotal={(total, range) => `${range[0]}-${range[1]} ${"of"} ${total} ${"Equipments"}`}
        onChange={onPageChange}
        onShowSizeChange={onPageSizeChange}
      />
    </div>
  );
};

export default EquipmentsTable;
