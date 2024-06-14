import React, { createContext, useContext, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../axiosConfig';
import { Task, TaskContextType } from '../interfaces/TaskInterface';

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const getTasks = () => {
  return axios.get<Task[]>('/api/tasks').then((response) => response.data);
};

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();
  const { data, isLoading, refetch } = useQuery<Task[]>({ queryKey: ['tasks'], queryFn: getTasks });

  const taskMutation = useMutation({
    mutationFn: ({ taskId }: { taskId: number }) => {
      return axios.patch(`/api/tasks/${taskId}/mark_as_completed`).then((response) => response.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const destroyMutation = useMutation({
    mutationFn: async ({ taskId }: { taskId: number }) => {
      if (window.confirm('Are you sure?')) {
        const response = await axios.delete(`/api/tasks/${taskId}`);
        return response.data;
      }
      throw new Error('Deletion cancelled by user'); 
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const destroyTask = (task: Task) => {
    destroyMutation.mutate({ taskId: task.id });
  };

  const completeTask = (task: Task) => {
    taskMutation.mutate({ taskId: task.id });
  };

  const completedTaskCount = () => {
    return !isLoading && data ? data.filter((task) => task.completed_at).length : 0;
  };

  const getCompletionColor = () => {
    if (isLoading) {
      return 'gray';
    }

    const count = completedTaskCount();
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
      tasks: data,
      isLoadingTasks: isLoading,
      refetchTasks: refetch,
      completeTask,
      destroyTask,
      completedTaskCount,
      tasksColor: getCompletionColor,
    }),
    [data, isLoading, refetch, taskMutation, destroyMutation]
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};
