import prisma from "../prisma";

// Check user existence and validate role(s)
export const validateUserRole = async (
  userId: any,
  expectedRoles: string | string[]
) => {
  // Ensure userId is an integer before querying Prisma
  const parsedUserId = parseInt(userId, 10);

  if (isNaN(parsedUserId)) {
    throw new Error(`Invalid user ID provided: ${userId}.`);
  }

  // Fetch user with role information
  const user = await prisma.user.findUnique({
    where: { id: parsedUserId },
    select: { id: true, role: { select: { roleName: true } } },
  });

  if (!user) {
    throw new Error(`User with ID ${userId} does not exist.`);
  }

  // Check if expectedRoles is a string, convert it to an array for uniform handling
  const rolesArray = Array.isArray(expectedRoles)
    ? expectedRoles
    : [expectedRoles];

  // Validate if the user's role is included in the expected roles
  if (!rolesArray.includes(user.role.roleName)) {
    throw new Error(
      `User with ID ${userId} must have one of the roles: [${rolesArray.join(", ")}], but found ${user.role.roleName} instead.`
    );
  }
};
