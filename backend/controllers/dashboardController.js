import mongoose from 'mongoose';
import Project from '../models/Project.js';
import Task from '../models/Task.js';

export const getDashboard = async (req, res, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);
    const projects = await Project.find({ members: userId }).select('_id');
    const projectIds = projects.map((project) => project._id);

    const taskScope = {
      project: { $in: projectIds },
      $or: [{ createdBy: userId }, { assignedTo: userId }]
    };

    const now = new Date();
    const [totalTasks, byStatus, tasksPerUser, overdueTasks] = await Promise.all([
      Task.countDocuments(taskScope),
      Task.aggregate([
        { $match: taskScope },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      Task.aggregate([
        { $match: taskScope },
        { $group: { _id: '$assignedTo', count: { $sum: 1 } } },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'user'
          }
        },
        { $unwind: '$user' },
        { $project: { _id: 0, userId: '$_id', name: '$user.name', email: '$user.email', count: 1 } },
        { $sort: { count: -1 } }
      ]),
      Task.find({
        ...taskScope,
        dueDate: { $lt: now },
        status: { $ne: 'Done' }
      })
        .populate('assignedTo', 'name email')
        .populate('project', 'name')
        .sort({ dueDate: 1 })
        .limit(10)
    ]);

    res.json({
      totalTasks,
      byStatus: {
        'To Do': byStatus.find((item) => item._id === 'To Do')?.count || 0,
        'In Progress': byStatus.find((item) => item._id === 'In Progress')?.count || 0,
        Done: byStatus.find((item) => item._id === 'Done')?.count || 0
      },
      tasksPerUser,
      overdueTasks
    });
  } catch (error) {
    next(error);
  }
};
