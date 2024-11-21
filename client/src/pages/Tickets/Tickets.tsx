import { useContext, useState } from "react";
import TicketsTable from "../../components/organisms/Tables/TicketsTable/TicketsTable";

import { TicketPriority, Ticket, TicketStatusId } from "../../types/Ticket";
import { Form, Modal, notification, Select } from "antd";
import { useFetchTickets } from "../../features/ticket/TicketHooks";
import { CurrentUserContext } from "../../context/CurrentUserContext";

const { Option } = Select;

const Tickets = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [ticketTitle, setTicketTitle] = useState<string | null>(null);
  const [priority, setPriority] = useState<TicketPriority | null>(null);
  const [statusId, setStatusId] = useState<TicketStatusId | null>(null);

  const [form] = Form.useForm();

  const [clickedTicket, setClickedTicket] = useState<Partial<Ticket> | null>(null);
  const [isCreateTicketDrawerOpen, setCreateTicketDrawerOpen] = useState(false);
  const [isUpdateTicketDrawerOpen, setUpdateTicketDrawerOpen] = useState(false);
  const [isViewTicketDrawerOpen, setViewTicketDrawerOpen] = useState(false);
  const [isAssignUserModalVisible, setIsAssignUserModalVisible] = useState(false);

  const context = useContext(CurrentUserContext);

  const { data, status, isError } = useFetchTickets({
    pageSize,
    page,
    title: ticketTitle,
    priority,
    statusId,
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
    setCreateTicketDrawerOpen(false);
  };
  const handleUpdateTicket = (newTicket: Partial<Ticket>) => {
    setUpdateTicketDrawerOpen(false);
    setClickedTicket(null);
  };

  return (
    <>
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
          // deleteTicketMutation.mutate(id);
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
          setTicketTitle(searchedTicketNumber === "" ? null : searchedTicketNumber);
        }}
        onTicketStatusFilterChange={(filtredStatusId) => {
          setStatusId(filtredStatusId);
          setPage(1);
        }}
        onTicketPrioritiFilterChange={(filtredPriority) => {
          setPriority(filtredPriority);
          setPage(1);
        }}
      />
      {/* <DrawerComponent
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
        content={
          <UpdateTicketForm ticketToUpdate={clickedTicket!} onUpdateTicket={(ticket) => handleUpdateTicket(ticket)} />
        }
      />
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
