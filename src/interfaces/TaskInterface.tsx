
export interface Task {
  id: number;
  title: string;
  completed_at: string | null;
  scheduled_at: string | null;
  feature_image_url: string | null;
}

export interface TaskContextType {
  tasks: Task[] | undefined;
  isLoadingTasks: boolean;
  refetchTasks: () => Promise<any>;
  setSearchQuery: (query: string) => void;
  markAsCompleted: (task: Task) => void;
  markAsIncompleted: (task: Task) => void;
  destroyTask: (task: Task) => void;
  completedTaskCount: () => number;
  tasksColor: () => string;
}

export interface TaskFormData {
  title: string;
  scheduled_at: string;
  completed_at: string;
  feature_image_url: string;
  featureImage?: FileList | null;
}