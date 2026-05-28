import Task from '../models/Task.js';
import { ensureProjectAdmin, ensureProjectMember, isProjectAdmin } from '../utils/projectAccess.js';

const populateTask = (query) =>
  query
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name email')
    .populate('project', 'name admin members');

const isAssignedUser = (task, userId) => {
  const assignedId = task.assignedTo?._id || task.assignedTo;
  return assignedId.toString() === userId.toString();
};

export const createTask = async (req, res, next) => {
  try {
    const project = await ensureProjectAdmin(req.body.project, req.user._id);

    if (!project.members.some((id) => id.toString() === req.body.assignedTo)) {
      return res.status(400).json({ message: 'Assigned user must be a project member' });
    }
    const existingTask = await Task.findOne({
      title: req.body.title.trim(),
      project: req.body.project
    });

    if (existingTask) {
      return res.status(409).json({
        message: 'Task with this title already exists'
      });
    }

    const task = await Task.create({
      title: req.body.title,
      description: req.body.description || '',
      dueDate: req.body.dueDate,
      priority: req.body.priority || 'Medium',
      status: req.body.status || 'To Do',
      assignedTo: req.body.assignedTo,
      project: project._id,
      createdBy: req.user._id
    });

    const populated = await populateTask(Task.findById(task._id));
    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

export const getProjectTasks = async (req, res, next) => {
  try {
    const project = await ensureProjectMember(req.params.projectId, req.user._id);
    const { status, priority, search } = req.query;
    const filter = { project: project._id };

    if (!isProjectAdmin(project, req.user._id)) {
      filter.assignedTo = req.user._id;
    }

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (search) filter.title = { $regex: search, $options: 'i' };

    const tasks = await populateTask(Task.find(filter).sort({ dueDate: 1, createdAt: -1 }));
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    const existingTask = await Task.findOne({
      title: req.body.title.trim(),
      project: req.body.project
    });

    if (existingTask) {
      return res.status(409).json({
        message: 'Task with this title already exists'
      });
    }

    const project = await ensureProjectAdmin(task.project, req.user._id);

    if (req.body.assignedTo && !project.members.some((id) => id.toString() === req.body.assignedTo)) {
      return res.status(400).json({ message: 'Assigned user must be a project member' });
    }

    const allowedFields = ['title', 'description', 'dueDate', 'priority', 'status', 'assignedTo'];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        task[field] = req.body[field];
      }
    });

    await task.save();
    const populated = await populateTask(Task.findById(task._id));
    res.json(populated);
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await ensureProjectAdmin(task.project, req.user._id);
    await task.deleteOne();

    res.json({ message: 'Task deleted' });
  } catch (error) {
    next(error);
  }
};

export const updateTaskStatus = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const project = await ensureProjectMember(task.project, req.user._id);
    const canUpdate = isProjectAdmin(project, req.user._id) || isAssignedUser(task, req.user._id);

    if (!canUpdate) {
      return res.status(403).json({ message: 'You can only update assigned task status' });
    }

    task.status = req.body.status;
    await task.save();

    const populated = await populateTask(Task.findById(task._id));
    res.json(populated);
  } catch (error) {
    next(error);
  }
};
