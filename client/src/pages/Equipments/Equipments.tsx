import { useContext, useState } from "react";
import EquipmentsTable from "../../components/organisms/Tables/EquipentsTable/EquipentsTable";
import {
  useAssignEquipment,
  useCreateEquipment,
  useDeleteEquipment,
  useFetchEquipments,
  useUpdateEquipment,
} from "../../features/equipment/EquipmentHooks";
import { Condition, Equipment } from "../../types/Equipment";
import { Form, Modal, notification, Select } from "antd";
import DrawerComponent from "../../components/molecules/Drawer/DrawerComponent";
import { CreateEquipmentForm } from "../../components/templates/forms/CreateEquipmentForm/CreateEquipmentForm";
import { useFetchUsers } from "../../features/user/UserHooks";
import { UpdateEquipmentForm } from "../../components/templates/forms/UpdateEquipmentForm/UpdateEquipmentForm";
import EquipmentDetails from "../../components/templates/EquipmentDetails/EquipmentDetails";
import { CurrentUserContext } from "../../context/CurrentUserContext";
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

  const context = useContext(CurrentUserContext);

  const { data: admin } = useFetchUsers({ roleId: 2 });
  const { data: staff } = useFetchUsers({ roleId: 3 });
  const { data: technicalManagers } = useFetchUsers({ roleId: 5 });
  const assignEquipmentMutation = useAssignEquipment();
  const createEquipmentMutation = useCreateEquipment();
  const deleteEquipmentMutation = useDeleteEquipment();
  const updateEquipmentMutation = useUpdateEquipment();
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

      setIsAssignUserModalVisible(false);
      setClickedEquipment(null);
    } else {
      notification.error({
        message: "Please select a user to assign",
      });
    }
  };
  const handleCreateEquipment = (newEquipment: Partial<Equipment>) => {
    createEquipmentMutation.mutate(newEquipment);
    setCreateEquipmentDrawerOpen(false);
  };
  const handleUpdateEquipment = (newEquipment: Partial<Equipment>) => {
    updateEquipmentMutation.mutate({ id: Number(clickedEquipment?.id), equipmentToUpdate: newEquipment });
    setUpdateEquipmentDrawerOpen(false);
    setClickedEquipment(null);
  };
  return (
    <>
      <EquipmentsTable
        equipments={data?.data || []}
        currentUserRole={context?.currentUserContext?.role.roleName!}
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
          setClickedEquipment(equipment);
          setUpdateEquipmentDrawerOpen(true);
        }}
        onDeleteEquipment={(id) => {
          deleteEquipmentMutation.mutate(id);
        }}
        onAssignEquipment={(equipment: Equipment) => {
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
      <DrawerComponent
        isOpen={isUpdateEquipmentDrawerOpen}
        handleClose={() => {
          setUpdateEquipmentDrawerOpen(false);
          setClickedEquipment(null);
        }}
        title={"Update Equipment"}
        content={
          <UpdateEquipmentForm
            equipmentToUpdate={clickedEquipment!}
            onUpdateEquipment={(equipment) => handleUpdateEquipment(equipment)}
          />
        }
      />
      <DrawerComponent
        isOpen={isViewEquipmentDrawerOpen}
        handleClose={() => setViewEquipmentDrawerOpen(false)}
        title={"View Equipment"}
        content={<EquipmentDetails equipment={clickedEquipment!} />}
      />
      {/* Modal for assign a user */}
      <Modal
        title='Assign a user'
        open={isAssignUserModalVisible}
        onOk={handleAssignUser}
        onCancel={() => {
          setIsAssignUserModalVisible(false);
          setClickedEquipment(null);
        }}
      >
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
    </>
  );
};

export default Equipments;
