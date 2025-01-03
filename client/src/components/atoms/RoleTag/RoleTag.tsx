import { Tag } from "antd";
import { Role, RolesId } from "../../../types/Role";

interface RoleTagProps {
  role?: Role;
}

const RoleTag: React.FC<RoleTagProps> = ({ role }) => {
  let tagColor;
  const tagText = role?.roleName
    ? role?.roleName
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase())
    : "No role";

  switch (role?.id) {
    case RolesId.ADMIN:
      tagColor = "volcano";
      break;
    case RolesId.STAFF:
      tagColor = "processing";
      break;
    case RolesId.CLIENT:
      tagColor = "gold";
      break;
    case RolesId.TECHNICAL_MANAGER:
      tagColor = "purple";
      break;
    default:
      tagColor = "default";
  }
  return (
    <Tag style={{ width: "min-content" }} key={role?.id} color={tagColor}>
      {tagText}
    </Tag>
  );
};

export default RoleTag;
