import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Button, Pagination, Popconfirm, Space, Table, Tooltip } from "antd";
import type { TableProps } from "antd";
import TableHeader from "../../Headers/TableHeader/TableHeader";
import { HiOutlineEye, HiOutlinePencilAlt, HiOutlineTrash, HiOutlineUserAdd } from "react-icons/hi";
import { User } from "../../../../types/User";
import "./EquipentsTable.scss";
import { RoleName } from "../../../../types/Role";
import { Condition, Equipment, EquipmentCategory } from "../../../../types/Equipment";
import ConditionTag from "../../../atoms/ConditionTag/ConditionTag";
import { formatDateWithoutTime } from "../../../../helpers/date";
interface EquipentsTableRow {
  id: number;
  serialNumber: string;
  category: EquipmentCategory;
  warrantyEndDate: string;
  condition: Condition;
  brand: string;
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
  onEquipmentTypeFilterChange: (condition: Condition | null) => void;
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
  onEquipmentTypeFilterChange,
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
      equipment: equipment,
    }));
    setTableContent(_tableContent);
  }, [equipments]);

  const handleEquipmentTypeFilterChange = (condition: Condition | null) => {
    onEquipmentTypeFilterChange(condition); // Trigger data fetch or update based on selected role
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
      render: (text) => <>{text}</>,
    },

    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (category) => <>{category?.categoryName}</>,
    },
    {
      title: "Brand",
      dataIndex: "brand",
      key: "brand",
      render: (warrantyEndDate) => <>{warrantyEndDate}</>,
    },
    {
      title: "Condition",
      dataIndex: "condition",
      key: "condition",
      filters: [
        { text: "Operational", value: Condition.OPERATIONAL },
        { text: "Damaged", value: Condition.DAMAGED },
        { text: "Under maintenance", value: Condition.UNDER_MAINTENANCE },
        { text: "Repaired", value: Condition.REPAIRED },
        { text: "All", value: "null" },
      ],
      filterMultiple: false,
      filterOnClose: true,

      onFilter: (value: any, record: any) => {
        if (value === "null" || value === undefined) {
          handleEquipmentTypeFilterChange(null);
          return true; // Return true to show all rows
        }
        if (value) handleEquipmentTypeFilterChange(value);
        return record.condition === value;
      },
      render: (condition: any) => <ConditionTag condition={condition} />,
    },
    {
      title: "AssignedTo",
      dataIndex: "assignedTo",
      key: "assignedTo",
      render: (assignedTo: Partial<User>) => (
        <>
          {assignedTo?.firstName && assignedTo?.lastName ? (
            assignedTo?.firstName + " " + assignedTo?.lastName
          ) : (
            <div style={{ width: "60px" }}>--</div>
          )}
        </>
      ),
    },
    {
      title: "Warranty End Date",
      dataIndex: "warrantyEndDate",
      key: "warrantyEndDate",
      render: (warrantyEndDate) => <>{formatDateWithoutTime(warrantyEndDate)}</>,
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
      />
      <Table<EquipentsTableRow>
        loading={status == "pending"}
        rowKey='id'
        columns={columns}
        dataSource={tableContent}
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
