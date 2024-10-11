export const InitTicketStatus = async (prismaClient: any) => {
  // Initialize Ticket Statuses
  await prismaClient.ticket_status.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, statusName: "OPEN" },
  });

  await prismaClient.ticket_status.upsert({
    where: { id: 2 },
    update: {},
    create: { id: 2, statusName: "IN_PROGRESS" },
  });

  await prismaClient.ticket_status.upsert({
    where: { id: 3 },
    update: {},
    create: { id: 3, statusName: "RESOLVED" },
  });

  await prismaClient.ticket_status.upsert({
    where: { id: 4 },
    update: {},
    create: { id: 4, statusName: "CLOSED" },
  });
};
