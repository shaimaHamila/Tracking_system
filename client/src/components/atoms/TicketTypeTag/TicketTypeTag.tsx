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
      tagColor = "geekblue";
      break;
    case TicketType.CONSULTATION:
      tagColor = "purple";
      break;
    case TicketType.REQUEST:
      tagColor = "cyan";
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
