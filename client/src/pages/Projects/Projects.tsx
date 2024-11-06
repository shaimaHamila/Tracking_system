import { useState } from "react";
import ProjectsTable from "../../components/organisms/Tables/ProjectsTable/ProjectsTable";
import { useFetchProjects } from "../../features/project/ProjectHooks";
import { ProjectType } from "../../types/Project";
import { notification } from "antd";

const Projects = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [projectType, setProjectType] = useState<ProjectType | null>(null);
  const { data, status, isError } = useFetchProjects({
    pageSize,
    page,
    projectType,
  });
  if (isError) {
    notification.error({
      message: "Failed to fetch users, please try again",
    });
  }
  return (
    <>
      <ProjectsTable
        projects={data?.data || []}
        currentUserRole={"ADMIN"}
        status={status}
        totalProjects={data?.meta?.totalCount || 0}
        onCreateProjectDrawerOpen={() => {
          // setCreateProjectDrawerOpen(true);
        }}
        onViewProject={(project) => {
          // setClickedProject(project);
          // setViewProjectDrawerOpen(true);
        }}
        onUpdateProject={(project) => {
          console.log(project);
          // setClickedProject(project);
          // setUpdateProjectDrawerOpen(true);
        }}
        onDeleteProject={(id) => {
          console.log(id);
          // deleteProjectMutation.mutate(id);
        }}
        limitProjectsPerPage={5}
        onPageChange={(newPage: number) => {
          setPage(newPage);
        }}
        handlePageSizeChange={(newPageSize) => {
          setPageSize(newPageSize);
          setPage(1);
        }}
        addBtnText={"Add new Project"}
        onSearchChange={(searchedProjectName: string) => {
          // setFirstProjectName(searchedProjectName === "" ? null : searchedProjectName);
        }}
        onProjectTypeFilterChange={(projectType: ProjectType | null) => {
          // setProjectType(projectType);
          setPage(1); // Reset to the first page when role changes
        }}
      />
    </>
  );
};
export default Projects;
