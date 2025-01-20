import { createContext } from "react";
import { User } from "../types/User";

interface CurrentUserContextType {
  currentUserContext: User | null;
  setCurrentUserContext: React.Dispatch<React.SetStateAction<User | null>>;
}

export const CurrentUserContext = createContext<CurrentUserContextType | undefined>(undefined);
