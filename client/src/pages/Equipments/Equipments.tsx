import { useState } from "react";
import EquipmentsTable from "../../components/organisms/Tables/EquipentsTable/EquipentsTable";
import { useFetchEquipments } from "../../features/equipment/EquipmentHooks";
import { Condition, Equipment } from "../../types/Equipment";
import { notification } from "antd";

const Equipments = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [serialNumber, setSerialNumber] = useState<string | null>(null);
  const [conditions, setCondition] = useState<Condition[] | null>(null);
  const [isCreateEquipmentDrawerOpen, setCreateEquipmentDrawerOpen] = useState(false);
  const [clickedEquipment, setClickedEquipment] = useState<Partial<Equipment> | null>(null);
  const [isUpdateEquipmentDrawerOpen, setUpdateEquipmentDrawerOpen] = useState(false);
  const [isViewEquipmentDrawerOpen, setViewEquipmentDrawerOpen] = useState(false);

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

  const handleCreateEquipment = (equipment: Partial<Equipment>) => {};

  return (
    <>
      <EquipmentsTable
        equipments={data?.data || []}
        currentUserRole={"ADMIN"} //TODO: get current user role
        status={"success"}
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
    </>
  );
};
export default Equipments;
