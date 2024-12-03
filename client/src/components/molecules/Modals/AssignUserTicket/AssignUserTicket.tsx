import { Alert, Form, Modal, Select } from "antd";
import { useFetchProjectById } from "../../../../features/project/ProjectHooks";
import { Ticket } from "../../../../types/Ticket";
import { useEffect } from "react";

const { Option } = Select;

interface AssignUserTicketProps {
  isAssignUserModalVisible: boolean;
  onCancel: (value: any) => void;
  ticket: Partial<Ticket>;
  handleAssignUser: (assignedUsersId: number[]) => void;
}

const AssignUserTicket: React.FC<AssignUserTicketProps> = ({
  ticket,
  isAssignUserModalVisible,
  handleAssignUser,
  onCancel,
}) => {
  const {
    data: projectData,
    isError,
    isLoading,
  } = useFetchProjectById(
    isAssignUserModalVisible ? ticket?.project?.id : undefined, // Fetch only when modal is open
  );
  const [form] = Form.useForm();

  // Set the initial values dynamically once the data is loaded
  useEffect(() => {
    if (projectData && ticket?.assignedUsersId) {
      form.setFieldsValue({
        userIds: ticket.assignedUsersId,
      });
    }
  }, [projectData, ticket?.assignedUsersId, form]);

  return (
    <Modal
      title='Assign a user'
      open={isAssignUserModalVisible}
      onOk={() => handleAssignUser(form.getFieldValue("userIds"))}
      onCancel={onCancel}
    >
      {isLoading ? (
        <Alert message='Loading team members...' type='info' />
      ) : isError ? (
        <Alert message='Failed to fetch Team Members, please try again' type='error' />
      ) : (
        <Form form={form} layout='vertical'>
          <Form.Item className='user-form--input' label='User' name='userIds'>
            <Select placeholder='Select a user' mode='multiple' allowClear>
              {projectData?.data?.teamMembers.map((user) => (
                <Option key={user.id} value={user.id}>
                  {user.firstName} {user.lastName}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
};

export default AssignUserTicket;
