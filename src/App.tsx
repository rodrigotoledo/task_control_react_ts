// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Navbar from './components/Navbar';
import Tasks from './components/Tasks';
import Projects from './components/Projects';
import TaskForm from './components/TaskForm';
import ProjectForm from './components/ProjectForm';
import { TaskProvider } from './context/TaskContext';
import { ProjectProvider } from './context/ProjectContext';

const queryClient = new QueryClient()

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TaskProvider>
        <ProjectProvider>
          <Router>
            <Navbar />
            <main className="mx-auto mt-28 px-5">
              <Routes>
                <Route path="/" element={<Tasks />} />
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/tasks/new" element={<TaskForm />} />
                <Route path="/tasks/:id/edit" element={<TaskForm />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/projects/new" element={<ProjectForm />} />
                <Route path="/projects/:id/edit" element={<ProjectForm />} />
              </Routes>
            </main>
          </Router>
        </ProjectProvider>
      </TaskProvider>
    </QueryClientProvider>
  );
};

export default App;
