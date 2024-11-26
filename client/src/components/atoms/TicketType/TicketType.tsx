import { Tag } from "antd";
import { TicketType } from "../../../types/Ticket";

interface TicketTypeTagProps {
  type?: TicketType;
}

const TicketTypeTag: React.FC<TicketTypeTagProps> = ({ type }) => {
  let tagColor: string;
  const tagText = type ? type.charAt(0).toUpperCase() + type.slice(1).toLowerCase() : "No Type";

  switch (type) {
    case TicketType.BUG:
      tagColor = "red";
      break;
    case TicketType.FEATURE:
      tagColor = "blue";
      break;
    case TicketType.CONSULTATION:
      tagColor = "green";
      break;
    case TicketType.REQUEST:
      tagColor = "orange";
      break;
    case TicketType.OTHER:
      tagColor = "default";
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

export default TicketTypeTag;
