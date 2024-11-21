import { createContext } from "react";
import { User } from "../types/User";

interface CurrentUserContextType {
  currentUserContext: User | null;
  setCurrentUserContext?: (user: User | null) => void;
}

export const CurrentUserContext = createContext<CurrentUserContextType | undefined>(undefined);
