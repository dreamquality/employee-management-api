import api from './api';

export const userProjectService = {
  getUserProjects: async (userId) => {
    const response = await api.get(`/users/${userId}/projects`);
    return response.data;
  },

  setUserProjects: async (userId, projectIds, primaryProjectId) => {
    const response = await api.put(`/users/${userId}/projects`, {
      projectIds,
      primaryProjectId
    });
    return response.data;
  },

  addUserProject: async (userId, projectId, isPrimary = false) => {
    const response = await api.post(`/users/${userId}/projects`, {
      projectId,
      isPrimary
    });
    return response.data;
  },

  removeUserProject: async (userId, projectId) => {
    const response = await api.delete(`/users/${userId}/projects/${projectId}`);
    return response.data;
  },

  setPrimaryProject: async (userId, projectId) => {
    const response = await api.patch(`/users/${userId}/projects/${projectId}/set-primary`);
    return response.data;
  },
};
