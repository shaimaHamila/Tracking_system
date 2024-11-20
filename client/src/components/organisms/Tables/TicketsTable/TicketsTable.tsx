import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Button, message, Pagination, Popconfirm, Space, Table, Tooltip } from "antd";
import type { TableProps } from "antd";
import TableHeader from "../../Headers/TableHeader/TableHeader";
import { HiOutlineEye, HiOutlinePencilAlt, HiOutlineTrash, HiOutlineUserAdd } from "react-icons/hi";
import { User } from "../../../../types/User";
import "./TicketsTable.scss";
import { RoleName } from "../../../../types/Role";
import ConditionTag from "../../../atoms/ConditionTag/ConditionTag";
import { formatDateWithoutTime } from "../../../../helpers/date";
import { Ticket, TicketPriority, TicketStatusId, TicketStatusType } from "../../../../types/Ticket";
import { Project } from "../../../../types/Project";
import TicketStatusTag from "../../../atoms/TicketStatusTag/TicketStatusTag";
import TicketPriorityTag from "../../../atoms/TicketPriorityTag/TicketPriorityTag";
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
  currentUserRole: string;
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
}

const TicketsTable: React.FC<EquipentsTableProps> = ({
  tickets,
  currentUserRole,
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
}) => {
  const [pageSize, setPageSize] = useState<number>(limitTicketsPerPage);
  const [tableContent, setTableContent] = useState<TicketsTableRow[]>([]);

  useEffect(() => {
    // Extract specific fields from orders and populate tableContent
    const _tableContent = tickets?.map((ticket) => ({
      id: ticket?.id!,
      title: ticket?.title,
      status: ticket?.status,
      priority: ticket?.priority,
      project: ticket?.project,
      createdBy: ticket?.createdBy,
      createdAt: ticket?.createdAt,
      ticket: ticket,
    }));
    setTableContent(_tableContent);
  }, [tickets]);

  const handleTicketTypeFilterChange = (selectedConditions: TicketStatusId | null) => {
    if (!selectedConditions && Array.isArray(selectedConditions)) {
      onTicketStatusFilterChange(null);
    } else {
      onTicketStatusFilterChange(selectedConditions);
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
      width: 150,
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
      filterMultiple: true,
      filterOnClose: true,
      onFilter: (filteredDataSource: any, activeFilters: any) => {
        return activeFilters.condition === filteredDataSource;
      },
      render: (status) => <TicketStatusTag ticketStatus={status?.statusName} />,
    },
    {
      title: "Project",
      dataIndex: "project",
      key: "project",
      width: 100,
      render: (project) => <>{project?.name}</>,
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      width: 100,
      render: (priority) => <TicketPriorityTag priority={priority} />,
    },

    {
      title: "Warranty End Date",
      dataIndex: "warrantyEndDate",
      key: "warrantyEndDate",
      width: 155,
      render: (warrantyEndDate) => <>{formatDateWithoutTime(warrantyEndDate)}</>,
    },
    {
      title: "Created By",
      dataIndex: "createdBy",
      key: "createdBy",
      width: 150,
      render: (createdBy: Partial<User>) => (
        <>{createdBy?.firstName ? createdBy?.firstName + " " + createdBy?.lastName : <div>--</div>}</>
      ),
    },
    // ...(currentUserRole == RoleName.TECHNICAL_MANAGER || currentUserRole == RoleName.ADMIN
    //   ? [
    //       {
    //         title: "Action",
    //         key: "action",
    //         width: 200,
    //         render: (ticket: EquipentsTableRow) => (
    //           <Space size='middle'>
    //             <Tooltip title='AssignTo'>
    //               <Button
    //                 onClick={() => onAssignTicket(ticket.ticket)}
    //                 className='table--action-btn'
    //                 icon={<HiOutlineUserAdd />}
    //               />
    //             </Tooltip>
    //             <Tooltip title='View'>
    //               <Button
    //                 onClick={() => {
    //                   onViewTicket(ticket.ticket);
    //                 }}
    //                 className='table--action-btn'
    //                 icon={<HiOutlineEye />}
    //               />
    //             </Tooltip>
    //             <Tooltip title='Edit'>
    //               <Button
    //                 onClick={() => onUpdateTicket(ticket.ticket)}
    //                 className='table--action-btn'
    //                 icon={<HiOutlinePencilAlt />}
    //               />
    //             </Tooltip>
    //             <Tooltip title='Delete'>
    //               <Popconfirm
    //                 title='Are you sur you want to delete this Ticket?'
    //                 onConfirm={() => {
    //                   // store.dispatch(setLoading(true));
    //                   onDeleteTicket(ticket.id!);
    //                 }}
    //               >
    //                 <Button className='table--action-btn' icon={<HiOutlineTrash />} loading={false} />
    //               </Popconfirm>
    //             </Tooltip>
    //           </Space>
    //         ),
    //       },
    //     ]
    //   : []),
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
        searchPlaceholder={"Search by serial number"}
      />
      <Table<TicketsTableRow>
        loading={dataStatus == "pending"}
        rowKey='id'
        columns={columns}
        dataSource={tableContent}
        onChange={(_pagination, filter) => {
          handleTicketTypeFilterChange(filter.status as TicketStatusId | null);
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
