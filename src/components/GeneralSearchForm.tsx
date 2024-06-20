import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useProjectContext } from '../context/ProjectContext';
import { useTaskContext } from '../context/TaskContext';

const debounce = (func: (...args: any[]) => void, wait: number) => {
  let timeout: NodeJS.Timeout;

  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

const GeneralSearchForm: React.FC = () => {
  const [query, setQuery] = useState('');
  const [currentController, setCurrentController] = useState('');
  const { setSearchQuery: setProjectSearchQuery, refetchProjects } = useProjectContext();
  const { setSearchQuery: setTaskSearchQuery, refetchTasks } = useTaskContext();
  const location = useLocation();

  useEffect(() => {
    const checkLocation = () => {
      if (location.pathname === '/' || location.pathname === '/tasks') {
        setCurrentController('tasks');
      } else if (location.pathname === '/projects') {
        setCurrentController('projects');
      }
    };

    checkLocation();
  }, [location]);

  const performSearch = useCallback(debounce((searchQuery: string) => {
    if (currentController === 'tasks') {
      setTaskSearchQuery(searchQuery);
      refetchTasks();
    } else if (currentController === 'projects') {
      setProjectSearchQuery(searchQuery);
      refetchProjects();
    }
  }, 500), [currentController, setProjectSearchQuery, setTaskSearchQuery, refetchProjects, refetchTasks]);

 const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = event.target.value;
    setQuery(newQuery);
    performSearch(newQuery);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    performSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        className="form-input bg-gray-700 text-white rounded px-2 py-1"
        placeholder="Search..."
      />
      <input
        type="hidden"
        name="current_controller"
        value={currentController}
      />
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded"
      >
        Search
      </button>
    </form>
  );
};

export default GeneralSearchForm;
