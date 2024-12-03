import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Button, Dropdown, Pagination, Popconfirm, Select, Space, Table, Tooltip } from "antd";
import type { MenuProps, TableProps } from "antd";
import TableHeader from "../../Headers/TableHeader/TableHeader";
import { HiOutlineEye, HiOutlinePencilAlt, HiOutlineTrash, HiOutlineUserAdd } from "react-icons/hi";
import { DownOutlined } from "@ant-design/icons";
import { User } from "../../../../types/User";
import "./TicketsTable.scss";
import { RoleName } from "../../../../types/Role";
import { formatDateWithoutYear } from "../../../../helpers/date";
import {
  Ticket,
  TicketPriority,
  TicketStatusId,
  ticketStatusOptions,
  TicketStatusType,
  TicketType,
} from "../../../../types/Ticket";
import { Project } from "../../../../types/Project";
import TicketStatusTag from "../../../atoms/TicketStatusTag/TicketStatusTag";
import TicketPriorityTag from "../../../atoms/TicketPriorityTag/TicketPriorityTag";
import { Typography } from "antd";
import TicketTypeTag from "../../../atoms/TicketTypeTag/TicketTypeTag";

const { Text } = Typography;
interface TicketsTableRow {
  id: number;
  title: string;
  status: TicketStatusType;
  priority: TicketPriority;
  project: Partial<Project>;
  createdBy: Partial<User>;
  createdAt: string;
  ticket: Ticket;
}
interface EquipentsTableProps {
  tickets: Ticket[];
  currentUser: Partial<User>;
  dataStatus: "error" | "success" | "pending";
  totalTickets: number;
  onCreateTicketDrawerOpen: () => void;
  onViewTicket: (ticket: Ticket) => void;
  onUpdateTicket: (ticket: Ticket) => void;
  onDeleteTicket: (id: number) => void;
  onAssignTicket: (ticket: Ticket) => void;
  limitTicketsPerPage: number;
  onPageChange: (page: number) => void;
  handlePageSizeChange: (pageSize: number) => void;
  addBtnText: string;
  onSearchChange: (searchedName: string) => void;
  onTicketStatusFilterChange: (statusId: TicketStatusId | null) => void;
  onTicketPrioritiFilterChange: (priority: TicketPriority | null) => void;
  onPriorityChange: (ticketId: number, priority: TicketPriority) => void;
  onStatusChange: (ticketId: number, status: TicketStatusId) => void;
}

const TicketsTable: React.FC<EquipentsTableProps> = ({
  tickets,
  currentUser,
  totalTickets,
  onDeleteTicket,
  onUpdateTicket,
  onViewTicket,
  onAssignTicket,
  onPageChange,
  onSearchChange,
  addBtnText,
  onCreateTicketDrawerOpen,
  handlePageSizeChange,
  limitTicketsPerPage,
  dataStatus,
  onTicketStatusFilterChange,
  onTicketPrioritiFilterChange,
  onPriorityChange,
  onStatusChange,
}) => {
  const [pageSize, setPageSize] = useState<number>(limitTicketsPerPage);
  const [tableContent, setTableContent] = useState<TicketsTableRow[]>([]);

  useEffect(() => {
    const _tableContent = tickets?.map((ticket) => ({
      id: ticket?.id!,
      title: ticket?.title,
      status: ticket?.status,
      priority: ticket?.priority, //!client
      project: ticket?.project,
      createdBy: ticket?.createdBy, //!staff
      createdAt: ticket?.createdAt,
      ticketType: ticket?.type,
      ticket: ticket,
    }));
    setTableContent(_tableContent);
  }, [tickets]);

  const handleTicketStatusFilterChange = (selectedTicketStatusId: TicketStatusId | null) => {
    if (!selectedTicketStatusId) {
      onTicketStatusFilterChange(null);
    } else {
      onTicketStatusFilterChange(selectedTicketStatusId);
    }
  };

  const handleTicketPriorityFilterChange = (selectedTicketPriority: TicketPriority | null) => {
    if (!selectedTicketPriority) {
      onTicketPrioritiFilterChange(null);
    } else {
      onTicketPrioritiFilterChange(selectedTicketPriority);
    }
  };

  const columns: TableProps<TicketsTableRow>["columns"] = [
    {
      title: "",
      key: "number",
      width: 50,
      render: (_, _record, index) => index + 1,
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      width: 120,
      render: (title) => (
        <Text ellipsis={{ tooltip: title }} style={{ maxWidth: "120px" }}>
          {title}
        </Text>
      ),
    },

    {
      title: "Type",
      dataIndex: "ticketType",
      key: "ticketType",
      width: 90,
      render: (ticketType: TicketType) => <TicketTypeTag type={ticketType} />,
    },

    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      filters: [
        { text: "Open", value: TicketStatusId.OPEN },
        { text: "In Progress", value: TicketStatusId.IN_PROGRESS },
        { text: "Resolved", value: TicketStatusId.RESOLVED },
        { text: "Closed", value: TicketStatusId.CLOSED },
      ],
      filterMultiple: false,
      filterOnClose: true,
      onFilter: (value, record) => record.status.id === value,
      render: (status: TicketStatusType, record: TicketsTableRow) => {
        if (currentUser.role?.roleName === RoleName.ADMIN || record.ticket.assignedUsersId.includes(currentUser?.id!)) {
          return (
            <Select
              style={{ width: "100%" }}
              value={status.id}
              onChange={(newStatus: TicketStatusId) => onStatusChange(record?.ticket?.id, newStatus)}
            >
              {ticketStatusOptions.map((statusOption) => (
                <Select.Option key={statusOption.id} value={statusOption.id}>
                  {statusOption.statusName.charAt(0).toUpperCase() + statusOption.statusName.slice(1).toLowerCase()}
                </Select.Option>
              ))}
            </Select>
          );
        } else {
          return <TicketStatusTag ticketStatus={status} />;
        }
      },
    },
    {
      title: "Project",
      dataIndex: "project",
      key: "project",
      width: 120,

      render: (project) => (
        <Text ellipsis={{ tooltip: project?.name }} style={{ maxWidth: "120px" }}>
          {project?.name}
        </Text>
      ),
    },

    ...(currentUser.role?.roleName != RoleName.CLIENT
      ? [
          {
            title: "Priority",
            dataIndex: "priority",
            key: "priority",
            width: 100,
            filters: [
              { text: "Critical", value: TicketPriority.CRITICAL },
              { text: "High", value: TicketPriority.HIGH },
              { text: "Medium", value: TicketPriority.MEDIUM },
              { text: "Low", value: TicketPriority.LOW },
            ],
            filterMultiple: false,
            filterOnClose: true,
            onFilter: (value: any, record: any) => record.priority === value,
            render: (priority: TicketPriority, record: TicketsTableRow) => {
              if (
                currentUser.role?.roleName === RoleName.ADMIN ||
                record.ticket.managersId.includes(currentUser?.id!)
              ) {
                const getColorForPriority = (priority: TicketPriority) => {
                  switch (priority) {
                    case TicketPriority.LOW:
                      return "#389e0d";
                    case TicketPriority.MEDIUM:
                      return "#0958d9";
                    case TicketPriority.HIGH:
                      return "#d46b08";
                    case TicketPriority.CRITICAL:
                      return "#cf1322";
                    default:
                      return "black";
                  }
                };
                return (
                  <Select
                    style={{ width: "100%" }}
                    value={priority}
                    onChange={(newPriority: TicketPriority) => onPriorityChange(record?.ticket?.id, newPriority)}
                  >
                    {Object.values(TicketPriority).map((prio) => (
                      <Select.Option
                        key={prio}
                        value={prio}
                        style={{ color: getColorForPriority(prio) }} // Dynamically set color for each option
                      >
                        {prio.charAt(0).toUpperCase() + prio.slice(1).toLowerCase()}
                      </Select.Option>
                    ))}
                  </Select>
                );
              } else {
                return <TicketPriorityTag priority={priority} />;
              }
            },
          },
        ]
      : []),

    ...(currentUser.role?.roleName != RoleName.STAFF
      ? [
          {
            title: "Created By",
            dataIndex: "createdBy",
            key: "createdBy",
            width: 150,
            render: (createdBy: Partial<User>) => (
              <>{createdBy?.firstName ? createdBy?.firstName + " " + createdBy?.lastName : <div>--</div>}</>
            ),
          },
        ]
      : []),

    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 140,
      render: (createdAt) => <>{formatDateWithoutYear(createdAt)}</>,
    },

    {
      title: "Action",
      key: "ticket",
      dataIndex: "ticket",
      width: 140,
      render: (ticket: Ticket) => {
        const isManager = currentUser.role?.roleName === RoleName.ADMIN || ticket.managersId.includes(currentUser?.id!);
        const isCreator = ticket.createdBy?.id === currentUser?.id;

        const items: MenuProps["items"] = [];

        if (isManager) {
          items.push({
            key: "assign",
            label: (
              <span onClick={() => onAssignTicket(ticket)} className='table--action-btn no-border'>
                <HiOutlineUserAdd /> Assign To
              </span>
            ),
          });
        }

        if (isCreator) {
          items.push(
            {
              key: "edit",
              label: (
                <span onClick={() => onUpdateTicket(ticket)} className='table--action-btn no-border'>
                  <HiOutlinePencilAlt /> Edit
                </span>
              ),
            },
            {
              key: "delete",
              label: (
                <Popconfirm
                  title='Are you sure you want to delete this Ticket?'
                  onConfirm={() => onDeleteTicket(ticket.id!)}
                >
                  <span className='table--action-btn no-border'>
                    <HiOutlineTrash /> Delete
                  </span>
                </Popconfirm>
              ),
            },
          );
        }

        return (
          <Space size='middle'>
            <Tooltip title='View'>
              <Button onClick={() => onViewTicket(ticket)} className='table--action-btn' icon={<HiOutlineEye />} />
            </Tooltip>

            {(isManager || isCreator) && (
              <Dropdown menu={{ items }} trigger={["click"]}>
                <a onClick={(e) => e.preventDefault()}>
                  More <DownOutlined />
                </a>
              </Dropdown>
            )}
          </Space>
        );
      },
    },
  ];

  const onPageSizeChange = (_current: number, size: number) => {
    setPageSize(size);
    handlePageSizeChange(size);
  };
  const [tableHeight, setTableHeight] = useState(300);
  const ticketTabRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (ticketTabRef.current) {
      const { top } = ticketTabRef.current.getBoundingClientRect();
      // Adjust TABLE_HEADER_HEIGHT according to your actual header height.
      const TABLE_HEADER_HEIGHT = 160;
      setTableHeight(window.innerHeight - top - TABLE_HEADER_HEIGHT - 100);
    }
  }, [ticketTabRef]);
  return (
    <div ref={ticketTabRef} style={{ overflow: "auto" }}>
      <TableHeader
        onSearchChange={(searchedName) => onSearchChange(searchedName)}
        onClickBtn={onCreateTicketDrawerOpen}
        btnText={addBtnText}
        totalItems={totalTickets}
        totalItemsText={"Total Tickets:"}
        searchPlaceholder={"Search by title"}
      />
      <Table<TicketsTableRow>
        loading={dataStatus == "pending"}
        rowKey='id'
        columns={columns}
        dataSource={tableContent}
        onChange={(_pagination, filters) => {
          filters.status
            ? handleTicketStatusFilterChange(filters.status[0] as TicketStatusId)
            : handleTicketStatusFilterChange(null);

          filters.priority
            ? handleTicketPriorityFilterChange(filters.priority[0] as TicketPriority)
            : handleTicketPriorityFilterChange(null);
        }}
        pagination={false}
        scroll={{ y: tableHeight, x: "max-content" }}
      />
      <Pagination
        style={{ margin: "26px", textAlign: "right", justifyContent: "flex-end" }}
        total={totalTickets}
        pageSize={pageSize}
        showSizeChanger
        showTotal={(total, range) => `${range[0]}-${range[1]} ${"of"} ${total} ${"Tickets"}`}
        onChange={onPageChange}
        onShowSizeChange={onPageSizeChange}
      />
    </div>
  );
};

export default TicketsTable;
