export const InitEquipmentBrands = async (prismaClient: any) => {
  const brands = [
    { brandName: "Dell" },
    { brandName: "MSI" },
    { brandName: "HP" },
    { brandName: "Lenovo" },
    { brandName: "Apple" },
    { brandName: "Asus" },
    { brandName: "Acer" },
    { brandName: "Samsung" },
    { brandName: "Razer" },
    { brandName: "Microsoft" },
    { brandName: "Toshiba" },
    { brandName: "Sony" },
    { brandName: "LG" },
    { brandName: "Huawei" },
    { brandName: "IBM" },
    { brandName: "Fujitsu" },
    { brandName: "Panasonic" },
    { brandName: "Alienware" },
    { brandName: "Gateway" },
    { brandName: "Xiaomi" },
  ];
  // Create multiple Brands
  for (const brand of brands) {
    await prismaClient.equipmentBrand.upsert({
      where: { brandName: brand.brandName },
      update: {},
      create: brand,
    });
  }
};
