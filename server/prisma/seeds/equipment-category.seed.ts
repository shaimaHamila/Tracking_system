export const InitUserRoles = async (prismaClient: any) => {
  const categories = [
    { categoryName: "Desktops" },
    { categoryName: "Laptops" },
    { categoryName: "Monitors" },
    { categoryName: "Printers" },
    { categoryName: "Scanners" },
    { categoryName: "Networking Equipment" },
    { categoryName: "Servers" },
    { categoryName: "Storage Devices" },
    { categoryName: "Peripherals" },
    { categoryName: "Audio/Visual Equipment" },
    { categoryName: "Accessories" },
    { categoryName: "Mobile Devices" },
    { categoryName: "Security Equipment" },
  ];
  // Create multiple categories
  for (const category of categories) {
    await prismaClient.equipment_category.upsert({
      where: { categoryName: category.categoryName }, // Assuming categoryName is unique
      update: {}, // No updates needed
      create: category, // Create new category if it doesn't exist
    });
  }
};
