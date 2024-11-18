import { useState } from "react";
import EquipmentsTable from "../../components/organisms/Tables/EquipentsTable/EquipentsTable";
import { useCreateEquipment, useDeleteEquipment, useFetchEquipments } from "../../features/equipment/EquipmentHooks";
import { Condition, Equipment } from "../../types/Equipment";
import { notification } from "antd";
import DrawerComponent from "../../components/molecules/Drawer/DrawerComponent";
import { CreateEquipmentForm } from "../../components/templates/forms/CreateEquipmentForm/CreateEquipmentForm";

const Equipments = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [serialNumber, setSerialNumber] = useState<string | null>(null);
  const [conditions, setCondition] = useState<Condition[] | null>(null);
  const [isCreateEquipmentDrawerOpen, setCreateEquipmentDrawerOpen] = useState(false);
  const [clickedEquipment, setClickedEquipment] = useState<Partial<Equipment> | null>(null);
  const [isUpdateEquipmentDrawerOpen, setUpdateEquipmentDrawerOpen] = useState(false);
  const [isViewEquipmentDrawerOpen, setViewEquipmentDrawerOpen] = useState(false);

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
          console.log(id);
          deleteEquipmentMutation.mutate(id);
        }}
        onAssignEquipment={(equipment: Equipment) => {
          console.log(equipment);
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
    </>
  );
};
export default Equipments;
