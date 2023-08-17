import express from 'express';
import dotenv from 'dotenv';

import { deleteComment, createComment } from '../controllers/CommentController.js';
import { createBug, getBug, deleteBug, updateBug, createBugComment, deleteBugComment } from '../controllers/BugController.js';
import { getProjects, getProject, deleteProject, createProject, editProject } from '../controllers/ProjectController.js';
import { createUser, loginUser, updateUserEmail, updateUserPassword } from '../controllers/UserController.js';
import { getSprint, createSprint, updateSprint, deleteSprint } from '../controllers/SprintController.js';

import { validateToken } from '../JWT.js';

const router = express.Router();
dotenv.config();

// read
router.get(`/:userId/projects`, getProjects);
router.get(`/:userId/projects/:projectId`, getProject);
router.get(`/:userId/projects/:projectId/bugs/:bugId`, getBug);
router.post(`/users/login`, loginUser);
router.get(`/:userId/projects/:projectId/sprints/:sprintId`, getSprint);
router.post(`/users/validateTokens`, validateToken);

// update
router.post(`/:userId/projects/:projectId/edit`, editProject);
router.post(`/:userId/projects/:projectId/bugs/:bugId/update`, updateBug);
router.post(`/:userId/update/email`, updateUserEmail);
router.post(`/:userId/update/password`, updateUserPassword);
router.post(`/:userId/projects/:projectId/sprints/:sprintId/update`, updateSprint);

// create
router.post(`/:userId/projects/create`, createProject);
router.post(`/:userId/projects/:projectId/bugs/create`, createBug);
router.post(`/:userId/projects/:projectId/comments/create`, createComment);
router.post(`/users/signup`, createUser);
router.post(`/:userId/projects/:projectId/sprints/create`, createSprint);
router.post(`/:userId/projects/:projectId/bugs/:bugId/comments/create`, createBugComment);

// delete
router.post(`/:userId/projects/:projectId`, deleteProject);
router.post(`/:userId/projects/:projectId/:bugs/bugId/delete`, deleteBug);
router.post(`/:userId/projects/:projectId/comments/:commentId/delete`, deleteComment);
router.post(`/:userId/projects/:projectId/sprints/:sprintId/delete`, deleteSprint);
router.post(`/:userId/projects/:projectId/bugs/:bugId/comments/:commentId/delete`, deleteBugComment);

export default router;