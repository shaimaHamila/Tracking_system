export const TicketStatus = {
  OPEN: 1,
  IN_PROGRESS: 2,
  RESOLVED: 3,
  CLOSED: 4,
};
export enum TicketPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
}

export enum TicketType {
  BUG = "BUG",
  FEATURE = "FEATURE",
  CONSULTATION = "CONSULTATION",
  REQUEST = "REQUEST",
}
