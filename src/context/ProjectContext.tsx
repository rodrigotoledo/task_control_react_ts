import React, { useState, createContext, useContext, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../axiosConfig';
import { Project, ProjectContextType } from '../interfaces/ProjectInterface';

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

const getProjects = (query: string) => {
  return axios.get<Project[]>(`/api/projects`, { params: { query } }).then((response) => response.data);
};

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const { data, isLoading, refetch } = useQuery<Project[]>({ queryKey: ['projects', searchQuery], queryFn: () => getProjects(searchQuery) });

  const projectCompleteMutation = useMutation({
    mutationFn: ({ projectId }: { projectId: number }) => {
      return axios.patch(`/api/projects/${projectId}/mark_as_completed`).then((response) => response.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  const projectIncompleteMutation = useMutation({
    mutationFn: ({ projectId }: { projectId: number }) => {
      return axios.patch(`/api/projects/${projectId}/mark_as_incompleted`).then((response) => response.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  const destroyMutation = useMutation({
    mutationFn: async ({ projectId }: { projectId: number }) => {
      if (window.confirm('Are you sure?')) {
        const response = await axios.delete(`/api/projects/${projectId}`);
        return response.data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  const destroyProject = (project: Project) => {
    destroyMutation.mutate({ projectId: project.id });
  };

  const markAsCompleted = (project: Project) => {
    projectCompleteMutation.mutate({ projectId: project.id });
  };

  const markAsIncompleted = (project: Project) => {
    projectIncompleteMutation.mutate({ projectId: project.id });
  };

  const completedProjectCount = () => {
    return !isLoading && data ? data.filter((project) => project.completed_at).length : 0;
  };

  const getCompletionColor = () => {
    if (isLoading) {
      return 'gray';
    }

    const count = completedProjectCount();
    const completionPercentage = (count / (data ? data.length : 1)) * 100;

    if (completionPercentage < 30) {
      return 'bg-red-500';
    } else if (completionPercentage < 60) {
      return 'bg-orange-500';
    } else {
      return 'bg-green-500';
    }
  };

  const value = useMemo(
    () => ({
      projects: data,
      isLoadingProjects: isLoading,
      setSearchQuery,
      refetchProjects: () => refetch(),
      markAsCompleted,
      markAsIncompleted,
      destroyProject,
      completedProjectCount,
      projectsColor: getCompletionColor,
    }),
    [data, isLoading, refetch, markAsCompleted, markAsIncompleted, destroyMutation]
  );

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
};

export const useProjectContext = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjectContext must be used within a ProjectProvider');
  }
  return context;
};
