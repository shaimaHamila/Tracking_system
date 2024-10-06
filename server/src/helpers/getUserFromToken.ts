import prisma from "../prisma";
import { encrypt } from "./encrypt"; // Adjust the path based on your folder structure

// Function to get the current user from a token
export const getCurrentUserFromToken = async (token: string) => {
  try {
    if (!token) {
      return {
        message: "Session expired. Please log in again.",
        logout: true,
      };
    }
    // Use the existing encrypt class to verify the token
    const decodedToken = encrypt.verifyToken(token);

    // Check if the decoded token contains a valid user ID
    if (typeof decodedToken === "string" || !("id" in decodedToken)) {
      return {
        message: "Invalid token. Please log in again.",
        logout: true,
      };
    }

    // Query the database to find the user with the decoded user ID
    const user = await prisma.user.findUnique({
      where: { id: decodedToken.id },
    });

    // Check if the user exists
    if (!user) {
      return { valid: false, error: "User not found." };
    }

    return { valid: true, user };
  } catch (error: any) {
    // Return a structured error message instead of throwing an error
    return {
      valid: false,
      error: `Failed to authenticate token: ${error.message}`,
    };
  }
};
