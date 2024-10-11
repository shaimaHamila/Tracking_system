import prisma from "../prisma";

export const getCurrentUser = async (userId: number) => {
  if (!userId) {
    throw new Error("User ID is missing. Please log in again.");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { role: true },
  });

  if (!user) {
    throw new Error("User not found.");
  }

  return user;
};
