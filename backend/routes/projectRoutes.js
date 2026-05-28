import express from 'express';
import { body, param } from 'express-validator';
import {
  addMember,
  createProject,
  deleteProject,
  getProjectById,
  getProjects,
  removeMember
} from '../controllers/projectController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .post(
    [
      body('name').trim().isLength({ min: 2 }).withMessage('Project name is required'),
      body('description').optional().trim().isLength({ max: 1000 }).withMessage('Description is too long')
    ],
    validateRequest,
    createProject
  )
  .get(getProjects);

router.get(
  '/:id',
  [param('id').isMongoId().withMessage('Valid project id is required')],
  validateRequest,
  getProjectById
);

router.put(
  '/:id/members',
  [
    param('id').isMongoId().withMessage('Valid project id is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid member email is required')
  ],
  validateRequest,
  addMember
);

router.delete(
  '/:id/members/:userId',
  [
    param('id').isMongoId().withMessage('Valid project id is required'),
    param('userId').isMongoId().withMessage('Valid user id is required')
  ],
  validateRequest,
  removeMember
);
router.delete(
  '/:id',
  [param('id').isMongoId().withMessage('Valid project id is required')],
  validateRequest,
  deleteProject
);

export default router;
