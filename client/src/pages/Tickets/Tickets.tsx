import { useContext, useState } from "react";
import TicketsTable from "../../components/organisms/Tables/TicketsTable/TicketsTable";

import { TicketPriority, Ticket, TicketStatusId } from "../../types/Ticket";
import { Form, Modal, notification, Select, Tabs } from "antd";
import { useCreateTicket, useDeleteTicket, useFetchTickets, useUpdateTicket } from "../../features/ticket/TicketHooks";
import { CurrentUserContext } from "../../context/CurrentUserContext";
import { RoleName, RolesId } from "../../types/Role";
import { ProjectType } from "../../types/Project";
import DrawerComponent from "../../components/molecules/Drawer/DrawerComponent";
import CreateTicketForm from "../../components/templates/forms/ticket/CreateTicketForm/CreateTicketForm";
import UpdateTicketForm from "../../components/templates/forms/ticket/UpdateTicketForm/UpdateTicketForm";

const { Option } = Select;

const Tickets = () => {
  const context = useContext(CurrentUserContext);
  const currentUserRoleId = context?.currentUserContext?.role?.id;

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [ticketTitle, setTicketTitle] = useState<string | null>(null);
  const [priority, setPriority] = useState<TicketPriority | null>(null);
  const [statusId, setStatusId] = useState<TicketStatusId | null>(null);
  const [projectType, setProjectType] = useState<ProjectType | null>(
    currentUserRoleId === RolesId.ADMIN || currentUserRoleId === RolesId.STAFF ? ProjectType.EXTERNAL : null,
  );
  const [form] = Form.useForm();

  const [clickedTicket, setClickedTicket] = useState<Partial<Ticket> | null>(null);
  const [isCreateTicketDrawerOpen, setCreateTicketDrawerOpen] = useState(false);
  const [isViewTicketDrawerOpen, setViewTicketDrawerOpen] = useState(false);
  const [isUpdateTicketDrawerOpen, setUpdateTicketDrawerOpen] = useState(false);
  const [isAssignUserModalVisible, setIsAssignUserModalVisible] = useState(false);

  const updateTicketMutation = useUpdateTicket();
  const deleteTicketMutation = useDeleteTicket();
  const createTicketMutation = useCreateTicket();
  const { data, status, isError } = useFetchTickets({
    pageSize,
    page,
    title: ticketTitle,
    priority,
    statusId,
    projectType,
  });

  if (isError) {
    notification.error({
      message: "Failed to fetch Tickets, please try again",
    });
  }
  const handleAssignUser = () => {
    const selectedUser = form.getFieldValue("userId");

    if (selectedUser && clickedTicket) {
      setIsAssignUserModalVisible(false);
      setClickedTicket(null);
    } else {
      notification.error({
        message: "Please select a user to assign",
      });
    }
  };
  const handleCreateTicket = (newTicket: Partial<Ticket>) => {
    createTicketMutation.mutate(newTicket);
    console.log(newTicket);

    setCreateTicketDrawerOpen(false);
  };
  const handleUpdateTicket = (newTicket: Partial<Ticket>) => {
    updateTicketMutation.mutate({ id: clickedTicket?.id!, ticketToUpdate: newTicket });
    setUpdateTicketDrawerOpen(false);
    setClickedTicket(null);
  };
  const onChangeProjectType = (key: string) => {
    console.log(key);
    setProjectType(key as ProjectType);
  };
  const ticketTable = (
    <TicketsTable
      tickets={data?.data || []}
      currentUser={context?.currentUserContext!}
      dataStatus={status}
      totalTickets={data?.meta?.totalCount || 0}
      onCreateTicketDrawerOpen={() => {
        setCreateTicketDrawerOpen(true);
      }}
      onViewTicket={(ticket: Partial<Ticket>) => {
        setClickedTicket(ticket);
        setViewTicketDrawerOpen(true);
      }}
      onUpdateTicket={(ticket: Partial<Ticket>) => {
        setClickedTicket(ticket);
        setUpdateTicketDrawerOpen(true);
      }}
      onDeleteTicket={(id: number) => {
        deleteTicketMutation.mutate(id);
        console.log(id);
      }}
      onAssignTicket={(ticket: Ticket) => {
        setClickedTicket(ticket);
        setIsAssignUserModalVisible(true);
      }}
      limitTicketsPerPage={pageSize}
      onPageChange={(newPage: number) => {
        setPage(newPage);
      }}
      handlePageSizeChange={(newPageSize: number) => {
        setPageSize(newPageSize);
        setPage(1);
      }}
      addBtnText={"Add new Ticket"}
      onSearchChange={(searchedTicketNumber: string) => {
        console.log("seee", searchedTicketNumber);

        setTicketTitle(searchedTicketNumber === "" ? "null" : searchedTicketNumber);
      }}
      onTicketStatusFilterChange={(filtredStatusId) => {
        setStatusId(filtredStatusId);
        setPage(1);
      }}
      onTicketPrioritiFilterChange={(filtredPriority) => {
        setPriority(filtredPriority);
        setPage(1);
      }}
      onPriorityChange={(newPriority: TicketPriority) => {
        console.log("Selected priority:", newPriority);
      }}
      onStatusChange={(newStatus: TicketStatusId) => {
        console.log("Selected newStatus:", newStatus);
      }}
    />
  );
  const items: any = [
    {
      key: "EXTERNAL",
      label: "External Tickets",
      children: ticketTable,
    },
    {
      key: "INTERNAL",
      label: "Internal Tickets",
      children: ticketTable,
    },
  ];
  return (
    <>
      {(currentUserRoleId === RolesId.ADMIN || currentUserRoleId === RolesId.STAFF) && (
        <Tabs defaultActiveKey='1' items={items} onChange={onChangeProjectType} />
      )}
      {(currentUserRoleId === RolesId.CLIENT || currentUserRoleId === RolesId.TECHNICAL_MANAGER) && ticketTable}
      <DrawerComponent
        isOpen={isCreateTicketDrawerOpen}
        handleClose={() => setCreateTicketDrawerOpen(false)}
        title={"Create Ticket"}
        content={<CreateTicketForm onCreateTicket={(ticket) => handleCreateTicket(ticket)} />}
      />

      <DrawerComponent
        isOpen={isUpdateTicketDrawerOpen}
        handleClose={() => {
          setUpdateTicketDrawerOpen(false);
          setClickedTicket(null);
        }}
        title={"Update Ticket"}
        content={<UpdateTicketForm ticket={clickedTicket!} onUpdateTicket={(ticket) => handleUpdateTicket(ticket)} />}
      />
      {/*
      <DrawerComponent
        isOpen={isViewTicketDrawerOpen}
        handleClose={() => setViewTicketDrawerOpen(false)}
        title={"View Ticket"}
        content={<TicketDetails ticket={clickedTicket!} />}
      />
      {/* Modal for assign a user */}
      {/* <Modal
        title='Assign a user'
        open={isAssignUserModalVisible}
        onOk={handleAssignUser}
        onCancel={() => {
          setIsAssignUserModalVisible(false);
          setClickedTicket(null);
        }}
      >
        <Form form={form} layout='vertical'>
          <Form.Item className='user-form--input' label='User' name='userId'>
            <Select placeholder='Select a user' allowClear>
              {[...(admin?.data || []), ...(staff?.data || []), ...(technicalManagers?.data || [])].map((user) => (
                <Option key={user.id} value={user.id}>
                  {user.firstName} {user.lastName}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>  */}
    </>
  );
};

export default Tickets;
