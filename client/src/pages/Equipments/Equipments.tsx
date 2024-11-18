import { useState } from "react";
import EquipmentsTable from "../../components/organisms/Tables/EquipentsTable/EquipentsTable";
import {
  useAssignEquipment,
  useCreateEquipment,
  useDeleteEquipment,
  useFetchEquipments,
} from "../../features/equipment/EquipmentHooks";
import { Condition, Equipment } from "../../types/Equipment";
import { Form, Modal, notification, Select } from "antd";
import DrawerComponent from "../../components/molecules/Drawer/DrawerComponent";
import { CreateEquipmentForm } from "../../components/templates/forms/CreateEquipmentForm/CreateEquipmentForm";
import { useFetchUsers } from "../../features/user/UserHooks";
const { Option } = Select;

const Equipments = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [serialNumber, setSerialNumber] = useState<string | null>(null);
  const [conditions, setCondition] = useState<Condition[] | null>(null);
  const [isCreateEquipmentDrawerOpen, setCreateEquipmentDrawerOpen] = useState(false);
  const [clickedEquipment, setClickedEquipment] = useState<Partial<Equipment> | null>(null);
  const [isUpdateEquipmentDrawerOpen, setUpdateEquipmentDrawerOpen] = useState(false);
  const [isViewEquipmentDrawerOpen, setViewEquipmentDrawerOpen] = useState(false);
  const [isAssignUserModalVisible, setIsAssignUserModalVisible] = useState(false);

  const { data: admin } = useFetchUsers({ roleId: 2 });
  const { data: staff } = useFetchUsers({ roleId: 3 });
  const { data: technicalManagers } = useFetchUsers({ roleId: 5 });
  const assignEquipmentMutation = useAssignEquipment();
  const createEquipmentMutation = useCreateEquipment();
  const deleteEquipmentMutation = useDeleteEquipment();
  const { data, status, isError } = useFetchEquipments({
    pageSize,
    page,
    serialNumber,
    conditions,
  });

  if (isError) {
    notification.error({
      message: "Failed to fetch Equipments, please try again",
    });
  }
  const [form] = Form.useForm();

  const handleAssignUser = () => {
    const selectedUser = form.getFieldValue("userId");

    if (selectedUser && clickedEquipment) {
      assignEquipmentMutation.mutate({
        equipmentId: Number(clickedEquipment.id?.toString()),
        assignedToId: selectedUser,
      });

      setClickedEquipment(null);
      setIsAssignUserModalVisible(false);
    } else {
      notification.error({
        message: "Please select a user to assign",
      });
    }
  };
  const handleCreateEquipment = (newEquipment: Partial<Equipment>) => {
    console.log(newEquipment);
    createEquipmentMutation.mutate(newEquipment);
    setCreateEquipmentDrawerOpen(false);
  };

  return (
    <>
      <EquipmentsTable
        equipments={data?.data || []}
        currentUserRole={"ADMIN"} //TODO: get current user role
        status={status}
        totalEquipments={data?.meta?.totalCount || 0}
        onCreateEquipmentDrawerOpen={() => {
          setCreateEquipmentDrawerOpen(true);
        }}
        onViewEquipment={(equipment) => {
          setClickedEquipment(equipment);
          setViewEquipmentDrawerOpen(true);
        }}
        onUpdateEquipment={(equipment) => {
          console.log(equipment);
          setClickedEquipment(equipment);
          setUpdateEquipmentDrawerOpen(true);
        }}
        onDeleteEquipment={(id) => {
          deleteEquipmentMutation.mutate(id);
        }}
        onAssignEquipment={(equipment: Equipment) => {
          console.log(equipment);
          setClickedEquipment(equipment);
          setIsAssignUserModalVisible(true);
        }}
        limitEquipmentsPerPage={pageSize}
        onPageChange={(newPage: number) => {
          setPage(newPage);
        }}
        handlePageSizeChange={(newPageSize) => {
          setPageSize(newPageSize);
          setPage(1);
        }}
        addBtnText={"Add new Equipment"}
        onSearchChange={(searchedSerialNumber: string) => {
          setSerialNumber(searchedSerialNumber === "" ? null : searchedSerialNumber);
        }}
        onEquipmentCondtionFilterChange={(conditions) => {
          setCondition(conditions);
          setPage(1);
        }}
      />
      <DrawerComponent
        isOpen={isCreateEquipmentDrawerOpen}
        handleClose={() => setCreateEquipmentDrawerOpen(false)}
        title={"Create Equipment"}
        content={<CreateEquipmentForm onCreateEquipment={(equipment) => handleCreateEquipment(equipment)} />}
      />
      {/* Modal for assign a user */}
      <Modal
        title='Assign a user'
        open={isAssignUserModalVisible}
        onOk={handleAssignUser}
        onCancel={() => setIsAssignUserModalVisible(false)}
      >
        {/* Wrap Form.Item inside a Form */}
        <Form form={form} layout='vertical'>
          <Form.Item className='user-form--input' label='User' name='userId'>
            <Select placeholder='Select a user' allowClear>
              {/* Combine all user roles into a single array */}
              {[...(admin?.data || []), ...(staff?.data || []), ...(technicalManagers?.data || [])].map((user) => (
                <Option key={user.id} value={user.id}>
                  {user.firstName} {user.lastName}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
      ;
    </>
  );
};

export default Equipments;
