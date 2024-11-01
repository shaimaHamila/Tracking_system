export const InitAdmin = async (prismaClient: any) => {
  const admin = {
    email: "admin.com",
    firstName: "Shaima",
    lastName: "Hamila",
    phone: "22 333 444",
    password: "123456",
    roleId: 2,
  };
  // Create multiple categories
  await prismaClient.user.upsert({
    where: { id: 5 },
    update: {},
    create: admin,
  });
};
