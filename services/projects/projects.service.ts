import { CreateProjectData } from '@/components/CreateProjectModal';
import { apiRequest } from '@/utils/api';

export const createProject = async (
    projectName: string,
    targetValue: number,
    description?: string
): Promise<any> => {
    const projectData: CreateProjectData = {
        projectName,
        description,
        targetValue,
    };

    return await apiRequest('/projects', 'POST', projectData, false);
};

export const listProjects = async (status?: string): Promise<any> => {
    const params = status ? `?status=${status}` : '';
    return await apiRequest(`/projects${params}`, 'GET', null, false);
};

export const getProjectDetails = async (projectId: string): Promise<any> => {
    return await apiRequest(`/projects/${projectId}`, 'GET', null, false);
};

export const updateProject = async (
    projectId: string,
    updates: Partial<CreateProjectData & { status: string }>
): Promise<any> => {
    return await apiRequest(`/projects/${projectId}`, 'PUT', updates, false);
};

export const deleteProject = async (projectId: string): Promise<any> => {
    return await apiRequest(`/projects/${projectId}`, 'DELETE', null, false);
};