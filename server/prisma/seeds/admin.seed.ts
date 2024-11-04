import { Encrypt } from "../../src/helpers/Encrypt";

export const InitAdmin = async (prismaClient: any) => {
  const password = await Encrypt.encryptpass("123456");
  console.log(password);

  const adminEmail = "admin@gmail.com";

  // Create the admin object with all necessary details
  const admin = {
    email: adminEmail,
    firstName: "Shaima",
    lastName: "Hamila",
    phone: "22 333 444",
    password: password,
    roleId: 2,
  };

  // Use upsert with the required `where` condition
  await prismaClient.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: admin,
  });
};
