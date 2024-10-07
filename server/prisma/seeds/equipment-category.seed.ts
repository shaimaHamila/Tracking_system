export const InitEquipmentCategories = async (prismaClient: any) => {
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
    await prismaClient.equipmentCategory.upsert({
      where: { categoryName: category.categoryName }, // Assuming categoryName is unique
      update: {}, // No updates needed
      create: category, // Create new category if it doesn't exist
    });
  }
};
