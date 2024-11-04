export const formatDate = (date: string | undefined) => {
  if (!date) return "-"; // Return "-" if date is undefined or null

  const formattedDate = new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
  return formattedDate;
};

export const formatDateWithoutTime = (date: string | undefined) => {
  if (!date) return "-"; // Return "-" if date is undefined or null

  const formattedDate = new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  return formattedDate;
};
