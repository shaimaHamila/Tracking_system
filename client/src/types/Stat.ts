type Stat = {
  totalProjects: number;
  tickets: {
    opened: number;
    inProgress: number;
    resolved: number;
    closed: number;
  };
};
