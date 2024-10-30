import { RoleId } from "./Role";

export type Equipment = {
  id: number;
  name: string;
  serialNumber: string;
  purchaseDate: Date;
  warrantyEndDate: Date;
  purchaseCost: number;
  purchaseCompany: string;
  brand: string;
  categoryId: number;
  category: EquipmentCategory;
  condition: Condition;
  assignedToId: RoleId;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
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
