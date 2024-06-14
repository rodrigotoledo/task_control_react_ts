import React, { useState, useEffect } from 'react';
import humanizeString from 'humanize-string';
import { useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from "react-hook-form"
import axios, { AxiosError }  from '../axiosConfig';
import { Project, ProjectFormData  } from '../interfaces/ProjectInterface';
import { Errors  } from '../interfaces/ErrorsInterface';
import FetchImageAsFile from './FetchImageAsFile';

const ProjectForm: React.FC = () => {

  const { register, handleSubmit, setValue } = useForm<ProjectFormData>();
  const params = useParams<{ id?: string }>();
  const id = parseInt(params.id || '');
  const navigate = useNavigate();
  const [featureImage, setFeatureImage] = useState<File | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const queryClient = useQueryClient();

  const fetchProjectDetails = async () => {
    try {
      const response = await axios.get<Project>(`/api/projects/${id}`);
      const completed_at = response?.data?.completed_at
      if(completed_at !== null) {
        const completedAtFormatted = new Date(response?.data?.completed_at || '').toISOString().slice(0, 16) || '';
        setValue('completed_at', completedAtFormatted);
      }

      setValue('title', response.data.title);
      const imageUrl = response.data.feature_image_url;

      if (typeof imageUrl === 'string') {
        const file = await FetchImageAsFile(imageUrl);
        if (file) {
          setFeatureImage(file);
        } else {
          console.error('Failed to fetch image as file');
        }
      } else {
        console.error('Invalid image URL');
      }
    } catch (errorOnFetchData) {
      console.error('Error fetching project details:', errorOnFetchData);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProjectDetails();
    } else {
      setValue('featureImage', undefined);
    }
  }, [id]);

  const onSubmit = async (data: ProjectFormData) => {
    const formData = new FormData();
    formData.append('title', data.title || '');
    formData.append('completed_at', data.completed_at || '');

    if (featureImage) {
      formData.append('feature_image', featureImage);
    }

    if(!id){
      try {
        await axios.post('/api/projects', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        queryClient.invalidateQueries({ queryKey: ["projects"] });
        navigate('/projects');
      } catch (error) {
        const axiosError = error as AxiosError<Errors>;
        if (axiosError.response?.data) {
          setErrors(axiosError.response.data);
        }
      }
    }else{
      try {
        await axios.patch(`/api/projects/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        queryClient.invalidateQueries({ queryKey: ["projects"] });
        navigate('/projects');
      } catch (error) {
        const axiosError = error as AxiosError<Errors>;
        if (axiosError.response?.data) {
          setErrors(axiosError.response.data);
        }
      }
    }
  };

  return (
    <div className="mx-auto w-full">
      <h1 className="font-bold text-4xl">{!id ? 'New project' : 'Editing project'}</h1>

      {errors && Object.keys(errors).length > 0 && (
        <div id="error_explanation" className="bg-red-50 text-red-500 px-3 py-2 font-medium rounded-lg mt-3">
          <h2>{Object.keys(errors).length} {Object.keys(errors).length === 1 ? 'error' : 'errors'} prohibited this project from being saved:</h2>
          <ul>
            {Object.entries(errors).map(([field, messages]) => (
              messages.map((message, i) => (
                <li key={`${field}-${i}`}>{`${humanizeString(field)} ${message}`}</li>
              ))
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className='contents'>
        <div className="my-5">
          <label>
            Title:
            <input type="text" {...register('title')} className="block shadow rounded-md border border-gray-200 outline-none px-3 py-2 mt-2 w-full" />
          </label>
        </div>

        <div className="my-5">
          <label>
            Feature Image:
            <input
              type="file"
              {...register('featureImage')}
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                setFeatureImage(file);
                setValue('featureImage', e.target.files ?? null);
              }}
              className="block shadow rounded-md border border-gray-200 outline-none px-3 py-2 mt-2 w-full" 
            />
            {featureImage && (
              <img src={URL.createObjectURL(featureImage)} alt="" className='w-20' />
            )}
          </label>
        </div>

        <div className="my-5">
          <label>
            Completed At:
            <input type="datetime-local" {...register('completed_at')} className="block shadow rounded-md border border-gray-200 outline-none px-3 py-2 mt-2 w-full" />
          </label>
        </div>
        <button type="submit" className="rounded-lg py-3 px-5 bg-blue-600 text-white inline-block font-medium cursor-pointer">{!id ? 'Create project' : 'Update project'}</button>
        <Link to="/projects" className="ml-2 rounded-lg py-3 px-5 bg-gray-100 inline-block font-medium">
          Back to projects
        </Link>
      </form>
    </div>
  );
};

export default ProjectForm;
