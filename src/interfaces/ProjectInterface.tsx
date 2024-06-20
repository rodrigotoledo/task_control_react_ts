export interface Project {
  id: number;
  title: string;
  completed_at: string | null;
  feature_image_url: string;
}

export interface ProjectContextType {
  projects: Project[] | undefined;
  isLoadingProjects: boolean;
  refetchProjects: () => Promise<any>;
  setSearchQuery: (query: string) => void;
  markAsCompleted: (project: Project) => void;
  markAsIncompleted: (project: Project) => void;
  destroyProject: (project: Project) => void;
  completedProjectCount: () => number;
  projectsColor: () => string;
}

export interface ProjectFormData {
  title: string;
  completed_at: string;
  feature_image_url: string;
  featureImage?: FileList | null;
}

export interface ProjectButtonProps {
  project: Project;
}