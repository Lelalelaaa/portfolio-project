// api.js
// This file handles all communication between the frontend (React) and the backend (Express).
// Instead of writing API calls everywhere in the code, we put them all here in one place.
//
// VITE_API_URL is a setting we configure when deploying to AWS.
// In development it just uses localhost:5000 automatically.

import axios from 'axios';

// If we are in development, use localhost. If in production, use the relative path.
const API_URL = import.meta.env.DEV ? 'http://localhost:5000/api' : '/api';

// Create an axios instance so we don't have to repeat the base URL every time
const api = axios.create({
  baseURL: API_URL,
});

// --- Project functions ---

// Get all projects (shown on the homepage)
export const getProjects = () => api.get('/projects');

// Get one specific project by its ID (shown on the case study page)
export const getProjectById = (id) => api.get(`/projects/${id}`);

// Add a new project (used in the Admin page)
export const createProject = (data) => api.post('/projects', data);

// Edit an existing project (used in the Admin page)
export const updateProject = (id, data) => api.put(`/projects/${id}`, data);

// Delete a project (used in the Admin page)
export const deleteProject = (id) => api.delete(`/projects/${id}`);

// --- Message functions ---

// Send a contact form message (used on the homepage contact section)
export const submitContactMessage = (data) => api.post('/messages', data);

// Get all received messages (shown in the Admin page)
export const getMessages = () => api.get('/messages');

export default api;
