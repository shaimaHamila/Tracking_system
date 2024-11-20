import { Tag } from "antd";
import { Condition } from "../../../types/Equipment";

interface ConditionTagProps {
  condition?: Condition;
}

const ConditionTag: React.FC<ConditionTagProps> = ({ condition }) => {
  let tagColor;
  const tagText = condition ? condition.charAt(0).toUpperCase() + condition.slice(1).toLowerCase() : "--";

  switch (condition) {
    case Condition.OPERATIONAL:
      tagColor = "green";
      break;
    case Condition.DAMAGED:
      tagColor = "red";
      break;
    case Condition.UNDER_MAINTENANCE:
      tagColor = "orange";
      break;
    case Condition.REPAIRED:
      tagColor = "blue";
      break;
    default:
      tagColor = "default";
  }
  return (
    <Tag style={{ width: "min-content", margin: 0 }} color={tagColor}>
      {tagText}
    </Tag>
  );
};

export default ConditionTag;
