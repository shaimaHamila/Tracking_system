import prisma from "../src/prisma";
import { InitEquipmentCategories } from "./seeds/equipment-category.seed";
import { InitUserRoles } from "./seeds/user-role.seed";

async function main() {
  // Initialize roles
  await InitUserRoles(prisma);

  // Initialize equipment categories
  await InitEquipmentCategories(prisma);
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
