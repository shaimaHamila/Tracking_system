import prisma from "../prisma";

// check user existence and role
export const validateUserRole = async (userId: any, expectedRole: string) => {
  // Ensure userId is an integer before querying Prisma
  const parsedUserId = parseInt(userId, 10);

  if (isNaN(parsedUserId)) {
    throw new Error(`Invalid user ID provided: ${userId}.`);
  }
  const user = await prisma.user.findUnique({
    where: { id: parsedUserId },
    select: { id: true, role: { select: { roleName: true } } },
  });

  if (!user) {
    throw new Error(`User with ID ${userId} does not exist.`);
  }

  if (user.role.roleName !== expectedRole) {
    throw new Error(
      `User with ID ${userId} must have the role of ${expectedRole}, found ${user.role.roleName} instead.`
    );
  }
};
