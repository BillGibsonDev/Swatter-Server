import express from 'express';
import dotenv from 'dotenv';

import { deleteComment, createComment } from '../controllers/CommentController.js';
import { createBug, getBug, deleteBug, updateBug } from '../controllers/BugController.js';
import { getProjects, getProject, deleteProject, createProject } from '../controllers/ProjectController.js';
import { confirmAdmin, confirmRole, createUser, getRole, loginUser, updateUser } from '../controllers/UserController.js';
import { validateToken } from '../JWT.js';

const router = express.Router();
dotenv.config();

// read
router.get(`/${process.env.NODE_ENV_GET_PROJECTS_URL}`, getProjects);
router.get(`/${process.env.NODE_ENV_GET_PROJECT_URL}/:projectId`, getProject);
router.get(`/${process.env.NODE_ENV_GET_BUG_URL}/:projectId/:bugId`, getBug);
router.post(`/${process.env.NODE_ENV_LOGIN_URL}`, loginUser);
router.post(`/${process.env.NODE_ENV_SET_ROLE_URL}`, getRole);
router.post(`/${process.env.NODE_ENV_ADMIN_CONFIRM_URL}`, confirmAdmin);
router.post(`/${process.env.NODE_ENV_ROLE_CONFIRM_URL}`, confirmRole);

// update
router.post(`/${process.env.NODE_ENV_UPDATE_BUG_URL}/:projectId/:bugId`, updateBug);
router.post(`/${process.env.NODE_ENV_UPDATE_USER_URL}`, updateUser);

// create
router.post(`/${process.env.NODE_ENV_ADD_PROJECT_URL}`, createProject);
router.post(`/${process.env.NODE_ENV_ADD_BUG_URL}/:projectId/bugs`, createBug);
router.post(`/${process.env.NODE_ENV_SEND_COMMENT_URL}/:projectId/comments`, createComment);
router.post(`/${process.env.NODE_ENV_REGISTER_URL}`, createUser);

// delete
router.delete(`/${process.env.NODE_ENV_DELETE_PROJECT_URL}/:projectId`, deleteProject);
router.post(`/${process.env.NODE_ENV_DELETE_BUG_URL}/:projectId/:bugId`, deleteBug);
router.post(`/${process.env.NODE_ENV_DELETE_COMMENT_URL}/:projectId/:commentId`, deleteComment);

export default router;