import { useContext, useState } from "react";
import TicketsTable from "../../components/organisms/Tables/TicketsTable/TicketsTable";

import { TicketPriority, Ticket } from "../../types/Ticket";
import { Form, Modal, notification, Select } from "antd";
import { useFetchUsers } from "../../features/user/UserHooks";
import { useFetchTickets } from "../../features/ticket/TicketHooks";
import { CurrentUserContext } from "../../context/CurrentUserContext";

const { Option } = Select;

const Tickets = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [ticketTitle, setTicketTitle] = useState<string | null>(null);
  const [priorities, setPriorities] = useState<TicketPriority[] | null>(null);
  const [isCreateTicketDrawerOpen, setCreateTicketDrawerOpen] = useState(false);
  const [clickedTicket, setClickedTicket] = useState<Partial<Ticket> | null>(null);
  const [isUpdateTicketDrawerOpen, setUpdateTicketDrawerOpen] = useState(false);
  const [isViewTicketDrawerOpen, setViewTicketDrawerOpen] = useState(false);
  const [isAssignUserModalVisible, setIsAssignUserModalVisible] = useState(false);

  const context = useContext(CurrentUserContext);

  const { data: admin } = useFetchUsers({ roleId: 2 });
  const { data: staff } = useFetchUsers({ roleId: 3 });
  const { data: technicalManagers } = useFetchUsers({ roleId: 5 });
  const { data, status, isError } = useFetchTickets({
    pageSize,
    page,
    title: ticketTitle,
  });

  // if (isError) {
  //   notification.error({
  //     message: "Failed to fetch Tickets, please try again",
  //   });
  // }
  const [form] = Form.useForm();

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
        dataStatus={"success"}
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
        onTicketStatusFilterChange={(priority: any) => {
          // setPriorities();
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
