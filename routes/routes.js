import express from 'express';
import dotenv from 'dotenv';

import { deleteComment, createComment } from '../controllers/CommentController.js';
import { createBug, getBug, deleteBug, updateBug, deleteImage, createBugComment, deleteBugComment } from '../controllers/BugController.js';
import { getProjects, getProject, deleteProject, createProject, editProject } from '../controllers/ProjectController.js';
import { createUser, loginUser, updateUser } from '../controllers/UserController.js';
import { getSprint, createSprint, updateSprint, deleteSprint } from '../controllers/SprintController.js';

import { validateToken } from '../JWT.js';

const router = express.Router();
dotenv.config();

// read
router.get(`/${process.env.NODE_ENV_GET_PROJECTS_URL}`, getProjects);
router.get(`/${process.env.NODE_ENV_GET_PROJECT_URL}/:projectId`, getProject);
router.get(`/${process.env.NODE_ENV_GET_BUG_URL}/:projectId/:bugId`, getBug);
router.post(`/${process.env.NODE_ENV_LOGIN_URL}`, loginUser);
router.get(`/${process.env.NODE_ENV_GET_SPRINT_URL}/:projectId/:sprintId`, getSprint);
router.post(`/validateTokens`, validateToken);

// update
router.post(`/${process.env.NODE_ENV_UPDATE_PROJECT_URL}/:projectId`, editProject);
router.post(`/${process.env.NODE_ENV_UPDATE_BUG_URL}/:projectId/:bugId`, updateBug);
router.post(`/${process.env.NODE_ENV_UPDATE_USER_URL}`, updateUser);
router.post(`/${process.env.NODE_ENV_UPDATE_SPRINT_URL}/:projectId/:sprintId`, updateSprint);

// create
router.post(`/${process.env.NODE_ENV_ADD_PROJECT_URL}`, createProject);
router.post(`/${process.env.NODE_ENV_ADD_BUG_URL}/:projectId/bugs`, createBug);
router.post(`/${process.env.NODE_ENV_SEND_COMMENT_URL}/:projectId/comments`, createComment);
router.post(`/${process.env.NODE_ENV_REGISTER_URL}`, createUser);
router.post(`/${process.env.NODE_ENV_CREATE_SPRINT_URL}/:projectId`, createSprint);
router.post(`/${process.env.NODE_ENV_BUG_COMMENT_URL}/:projectId/:bugId/comments`, createBugComment);

// delete
router.post(`/${process.env.NODE_ENV_DELETE_PROJECT_URL}/:projectId`, deleteProject);
router.post(`/${process.env.NODE_ENV_DELETE_BUG_URL}/:projectId/:bugId`, deleteBug);
router.post(`/${process.env.NODE_ENV_DELETE_COMMENT_URL}/:projectId/:commentId`, deleteComment);
router.post(`/${process.env.NODE_ENV_DELETE_SPRINT_URL}/:projectId/:sprintId`, deleteSprint);
router.post(`/${process.env.NODE_ENV_DELETE_IMAGE_URL}/:projectId/:bugId/images`, deleteImage);
router.post(`/${process.env.NODE_ENV_DELETE_BUG_COMMENT_URL}/:projectId/:bugId/:commentId`, deleteBugComment);

export default router;