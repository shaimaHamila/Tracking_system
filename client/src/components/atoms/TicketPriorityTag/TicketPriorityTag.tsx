import { Tag } from "antd";
import { TicketPriority } from "../../../types/Ticket";

interface TicketPriorityTagProps {
  priority?: TicketPriority;
}

const TicketPriorityTag: React.FC<TicketPriorityTagProps> = ({ priority }) => {
  let tagColor: string;
  const tagText = priority ? priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase() : "No Priority";

  switch (priority) {
    case TicketPriority.LOW:
      tagColor = "green";
      break;
    case TicketPriority.MEDIUM:
      tagColor = "blue";
      break;
    case TicketPriority.HIGH:
      tagColor = "orange";
      break;
    case TicketPriority.CRITICAL:
      tagColor = "red";
      break;
    default:
      tagColor = "default";
  }

  return (
    <Tag style={{ width: "min-content" }} color={tagColor}>
      {tagText}
    </Tag>
  );
};

export default TicketPriorityTag;
