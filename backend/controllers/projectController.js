import Project from '../models/Project.js';
import Task from '../models/Task.js';
import User from '../models/User.js';
import { ensureProjectAdmin, ensureProjectMember, isProjectAdmin } from '../utils/projectAccess.js';

const populateProject = (query) =>
  query.populate('admin', 'name email').populate('members', 'name email');

export const createProject = async (req, res, next) => {
  try {
    const existingProject = await Project.findOne({
      admin: req.user._id,
      name: { $regex: `^${req.body.name.trim()}$`, $options: 'i' }
    });

    if (existingProject) {
      return res.status(409).json({
        message: 'Project with this name already exists'
      });
    }

    const project = await Project.create({
      name: req.body.name.trim(),
      description: req.body.description || '',
      admin: req.user._id,
      members: [req.user._id]
    });

    const populated = await populateProject(Project.findById(project._id));

    res.status(201).json({
      ...populated.toObject(),
      role: 'Admin'
    });
  } catch (error) {
    next(error);
  }
};

export const getProjects = async (req, res, next) => {
  try {
    const projects = await populateProject(
      Project.find({ members: req.user._id }).sort({ updatedAt: -1 })
    );

    res.json(
      projects.map((project) => ({
        ...project.toObject(),
        role: isProjectAdmin(project, req.user._id) ? 'Admin' : 'Member'
      }))
    );
  } catch (error) {
    next(error);
  }
};

export const getProjectById = async (req, res, next) => {
  try {
    await ensureProjectMember(req.params.id, req.user._id);
    const project = await populateProject(Project.findById(req.params.id));
    const taskCount = await Task.countDocuments({ project: req.params.id });

    res.json({
      ...project.toObject(),
      taskCount,
      role: isProjectAdmin(project, req.user._id) ? 'Admin' : 'Member'
    });
  } catch (error) {
    next(error);
  }
};

export const addMember = async (req, res, next) => {
  try {
    const project = await ensureProjectAdmin(req.params.id, req.user._id);
    const user = await User.findOne({ email: req.body.email.toLowerCase() }).select('_id');

    if (!user) {
      return res.status(404).json({ message: 'User with that email was not found' });
    }

    if (project.members.some((memberId) => memberId.toString() === user._id.toString())) {
      return res.status(409).json({ message: 'User is already a project member' });
    }

    project.members.push(user._id);
    await project.save();

    const updated = await populateProject(Project.findById(project._id));
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

export const removeMember = async (req, res, next) => {
  try {
    const project = await ensureProjectAdmin(req.params.id, req.user._id);
    const memberId = req.params.userId;

    if (project.admin.toString() === memberId) {
      return res.status(400).json({ message: 'Project admin cannot be removed' });
    }

    project.members = project.members.filter((id) => id.toString() !== memberId);
    await project.save();

    await Task.deleteMany({ project: project._id, assignedTo: memberId });

    const updated = await populateProject(Project.findById(project._id));
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req, res, next) => {
  try {

    const project = await ensureProjectAdmin(
      req.params.id,
      req.user._id
    );

    await Task.deleteMany({
      project: project._id
    });

    await project.deleteOne();

    res.json({
      message: 'Project deleted successfully'
    });

  } catch (error) {
    next(error);
  }
};
