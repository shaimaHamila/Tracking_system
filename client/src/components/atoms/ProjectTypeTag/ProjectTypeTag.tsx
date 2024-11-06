import { Tag } from "antd";
import { ProjectType } from "../../../types/Project";

interface ProjectTypeTagProps {
  projectTypeTag?: ProjectType;
}

const ProjectTypeTag: React.FC<ProjectTypeTagProps> = ({ projectTypeTag }) => {
  let tagColor;
  const tagText = projectTypeTag
    ? projectTypeTag.charAt(0).toUpperCase() + projectTypeTag.slice(1).toLowerCase()
    : "--";

  switch (projectTypeTag) {
    case ProjectType.INTERNAL:
      tagColor = "blue";
      break;
    case ProjectType.EXTERNAL:
      tagColor = "orange";
      break;
    default:
      tagColor = "default";
  }
  return <Tag color={tagColor}>{tagText}</Tag>;
};

export default ProjectTypeTag;
