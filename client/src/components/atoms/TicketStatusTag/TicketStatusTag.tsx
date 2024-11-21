import { Tag } from "antd";
import { TicketStatusId, TicketStatusType } from "../../../types/Ticket";

interface TicketStatusTagProps {
  ticketStatus?: TicketStatusType;
}

const TicketStatusTag: React.FC<TicketStatusTagProps> = ({ ticketStatus }) => {
  let tagColor: string;
  const tagText = ticketStatus?.statusName
    ? ticketStatus.statusName
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase())
    : "No status";

  switch (ticketStatus?.id) {
    case TicketStatusId.OPEN:
      tagColor = "red";
      break;
    case TicketStatusId.IN_PROGRESS:
      tagColor = "blue";
      break;
    case TicketStatusId.RESOLVED:
      tagColor = "green";
      break;
    case TicketStatusId.CLOSED:
      tagColor = "geekblue";
      break;
    default:
      tagColor = "default";
  }
  return (
    <Tag style={{ width: "min-content" }} key={ticketStatus?.id} color={tagColor}>
      {tagText}
    </Tag>
  );
};

export default TicketStatusTag;
