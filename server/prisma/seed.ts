import prisma from "../src/prisma";
import { InitAdmin } from "./seeds/admin.seed";
import { InitEquipmentBrands } from "./seeds/equipment-brand.seed";
import { InitEquipmentCategories } from "./seeds/equipment-category.seed";
import { InitTicketStatus } from "./seeds/ticket-status.seed";
import { InitUserRoles } from "./seeds/user-role.seed";

async function main() {
  // Initialize roles
  await InitUserRoles(prisma);

  // Initialize equipment categories
  await InitEquipmentCategories(prisma);

  // Initialize equipment brands
  await InitEquipmentBrands(prisma);

  // Initialize ticket statuses
  await InitTicketStatus(prisma);

  //Initialize admin
  await InitAdmin(prisma);
}

// Execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1); // Exit the process with a failure code
  })
  .finally(async () => {
    // Close the Prisma Client at the end
    await prisma.$disconnect();
  });
