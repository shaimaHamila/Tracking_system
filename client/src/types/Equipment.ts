import { RoleId } from "./Role";

export type Equipment = {
  id: number;
  category: EquipmentCategory;
  name?: string;
  serialNumber: string;
  purchaseDate: string;
  warrantyEndDate: string;
  purchaseCost: number;
  purchaseCompany: string;
  brand: string;
  categoryId: number;
  condition: Condition;
  assignedToId: RoleId;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
};

export enum Condition {
  OPERATIONAL = "OPERATIONAL",
  DAMAGED = "DAMAGED",
  UNDER_MAINTENANCE = "UNDER_MAINTENANCE",
  REPAIRED = "REPAIRED",
}
export type EquipmentCategory = {
  id: number;
  categoryName: String;
  equipments?: Equipment[];
};
export type EquipmentBrand = {
  id: number;
  brandName: String;
  equipments?: Equipment[];
};
