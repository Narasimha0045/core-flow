import express from 'express';
import { body, param, query } from 'express-validator';
import {
  createTask,
  deleteTask,
  getProjectTasks,
  updateTask,
  updateTaskStatus
} from '../controllers/taskController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router = express.Router();

const taskRules = [
  body('title').trim().isLength({ min: 2 }).withMessage('Task title is required'),
  body('description').optional().trim().isLength({ max: 2000 }).withMessage('Description is too long'),
  body('dueDate').isISO8601().withMessage('Valid due date is required'),
  body('priority').optional().isIn(['Low', 'Medium', 'High']).withMessage('Invalid priority'),
  body('status').optional().isIn(['To Do', 'In Progress', 'Done']).withMessage('Invalid status'),
  body('assignedTo').isMongoId().withMessage('Valid assignee is required')
];

router.use(protect);

router.post(
  '/',
  [body('project').isMongoId().withMessage('Valid project id is required'), ...taskRules],
  validateRequest,
  createTask
);

router.get(
  '/project/:projectId',
  [
    param('projectId').isMongoId().withMessage('Valid project id is required'),
    query('status').optional().isIn(['To Do', 'In Progress', 'Done']).withMessage('Invalid status'),
    query('priority').optional().isIn(['Low', 'Medium', 'High']).withMessage('Invalid priority')
  ],
  validateRequest,
  getProjectTasks
);

router.put(
  '/:id',
  [param('id').isMongoId().withMessage('Valid task id is required'), ...taskRules],
  validateRequest,
  updateTask
);

router.delete(
  '/:id',
  [param('id').isMongoId().withMessage('Valid task id is required')],
  validateRequest,
  deleteTask
);

router.patch(
  '/:id/status',
  [
    param('id').isMongoId().withMessage('Valid task id is required'),
    body('status').isIn(['To Do', 'In Progress', 'Done']).withMessage('Invalid status')
  ],
  validateRequest,
  updateTaskStatus
);

export default router;
