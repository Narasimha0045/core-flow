import Project from '../models/Project.js';

export const getProjectForUser = async (projectId, userId) => {
  const project = await Project.findOne({
    _id: projectId,
    members: userId
  });

  return project;
};

export const isProjectAdmin = (project, userId) => {
  const adminId = project.admin?._id || project.admin;
  return adminId?.toString() === userId.toString();
};

export const ensureProjectMember = async (projectId, userId) => {
  const project = await getProjectForUser(projectId, userId);

  if (!project) {
    const error = new Error('Project not found or access denied');
    error.statusCode = 404;
    throw error;
  }

  return project;
};

export const ensureProjectAdmin = async (projectId, userId) => {
  const project = await ensureProjectMember(projectId, userId);

  if (!isProjectAdmin(project, userId)) {
    const error = new Error('Admin access required');
    error.statusCode = 403;
    throw error;
  }

  return project;
};
