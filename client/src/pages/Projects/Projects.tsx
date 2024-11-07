import { useState } from "react";
import ProjectsTable from "../../components/organisms/Tables/ProjectsTable/ProjectsTable";
import { useCreateProject, useDeleteProject, useFetchProjects } from "../../features/project/ProjectHooks";
import { Project, ProjectType } from "../../types/Project";
import { notification } from "antd";
import DrawerComponent from "../../components/molecules/Drawer/DrawerComponent";
import CreateProjectForm from "../../components/templates/forms/CreateProjectForm/CreateProjectForm";
import UpdateProjectForm from "../../components/templates/forms/UpdateProjectForm/UpdateProjectForm";
import ProjectDetails from "../../components/templates/ProjectDetails/ProjectDetails";
const clientsArray = [
  { id: 1, firstName: "Alice", lastName: "Smith" },
  { id: 2, firstName: "Bob", lastName: "Johnson" },
  { id: 3, firstName: "Charlie", lastName: "Brown" },
];

const projectManagersArray = [
  { id: 4, firstName: "David", lastName: "Wilson" },
  { id: 5, firstName: "Eva", lastName: "Davis" },
  { id: 6, firstName: "Frank", lastName: "Miller" },
];

const technicalManagersArray = [
  { id: 7, firstName: "Grace", lastName: "Taylor" },
  { id: 8, firstName: "Henry", lastName: "Anderson" },
];

const teamMembersArray = [
  { id: 9, firstName: "Isabella", lastName: "Thomas" },
  { id: 10, firstName: "Jack", lastName: "White" },
  { id: 11, firstName: "Karen", lastName: "Martinez" },
  { id: 12, firstName: "Leo", lastName: "Garcia" },
];

const Projects = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [projectType, setProjectType] = useState<ProjectType | null>(null);
  const [projectName, setProjectName] = useState<string | null>(null);
  const [isCreateProjectDrawerOpen, setCreateProjectDrawerOpen] = useState(false);
  const [clickedProject, setClickedProject] = useState<Partial<Project> | null>(null);
  const [isUpdateProjectDrawerOpen, setUpdateProjectDrawerOpen] = useState(false);
  const [isViewProjectDrawerOpen, setViewProjectDrawerOpen] = useState(false);
  const { data, status, isError } = useFetchProjects({
    pageSize,
    page,
    projectType,
    projectName,
  });
  const createProjectMutation = useCreateProject();
  // const updateProjectMutation = useUpdateProject();
  const deleteProjectMutation = useDeleteProject();

  if (isError) {
    notification.error({
      message: "Failed to fetch users, please try again",
    });
  }

  const handleCreateProject = (project: Partial<Project>) => {
    console.log("Project created:", project);
    // createProjectMutation.mutate(project);
    // setProjectDrawerOpen(false);
  };
  const handleUpdatedProject = (projectToUpdate: Partial<Project>) => {
    console.log("User updated:", projectToUpdate);
    // updateProjectMutation.mutate({ id: clickedProject?.id!, projectToUpdate: projectToUpdate });
    setUpdateProjectDrawerOpen(false);
  };
  return (
    <>
      <ProjectsTable
        projects={data?.data || []}
        currentUserRole={"ADMIN"}
        status={status}
        totalProjects={data?.meta?.totalCount || 0}
        onCreateProjectDrawerOpen={() => {
          setCreateProjectDrawerOpen(true);
        }}
        onViewProject={(project) => {
          setClickedProject(project);
          setViewProjectDrawerOpen(true);
        }}
        onUpdateProject={(project) => {
          console.log(project);
          setClickedProject(project);
          setUpdateProjectDrawerOpen(true);
        }}
        onDeleteProject={(id) => {
          console.log(id);
          deleteProjectMutation.mutate(id);
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
          setProjectName(searchedProjectName === "" ? null : searchedProjectName);
        }}
        onProjectTypeFilterChange={(projectType: ProjectType | null) => {
          setProjectType(projectType);
          setPage(1); // Reset to the first page when role changes
        }}
      />
      <DrawerComponent
        isOpen={isCreateProjectDrawerOpen}
        handleClose={() => setCreateProjectDrawerOpen(false)}
        title={"Create Project"}
        content={
          <CreateProjectForm
            onCreateProject={(project) => handleCreateProject(project)}
            clients={clientsArray}
            projectManagers={projectManagersArray}
            technicalManagers={technicalManagersArray}
            teamMembers={teamMembersArray}
          />
        }
      />
      <DrawerComponent
        isOpen={isUpdateProjectDrawerOpen}
        handleClose={() => setUpdateProjectDrawerOpen(false)}
        title={"Update User"}
        content={
          <UpdateProjectForm
            projectToUpdate={clickedProject!}
            onUpdateProject={(project) => handleUpdatedProject(project)}
            clients={clientsArray}
            projectManagers={projectManagersArray}
            technicalManagers={technicalManagersArray}
            teamMembers={teamMembersArray}
          />
        }
      />
      <DrawerComponent
        isOpen={isViewProjectDrawerOpen}
        handleClose={() => {
          setViewProjectDrawerOpen(false), setClickedProject(null);
        }}
        title={"User Details"}
        content={<ProjectDetails project={clickedProject} />}
      />
    </>
  );
};
export default Projects;
