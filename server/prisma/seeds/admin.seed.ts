import { Encrypt } from "../../src/helpers/Encrypt";

export const InitAdmin = async (prismaClient: any) => {
  const password = await Encrypt.encryptpass("123456");
  console.log(password);
  const admin = {
    email: "admin@gmail.com",
    firstName: "Shaima",
    lastName: "Hamila",
    phone: "22 333 444",
    password: password,
    roleId: 2,
  };
  // Create multiple categories
  await prismaClient.user.upsert({
    where: { id: 12 },
    update: {},
    create: admin,
  });
};
