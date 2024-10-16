// Helper function for checking project managers
export const isProjectManager = (user: any, project: any) => {
  return project.managers.some((manager: any) => manager.managerId === user.id);
};
