import express from 'express';
import dotenv from 'dotenv';

import { deleteComment, createComment } from '../controllers/CommentController.js';
import { createTicket, getTicket, deleteTicket, updateTicket, createTicketComment, deleteTicketComment } from '../controllers/TicketController.js';
import { getProjects, getProject, deleteProject, createProject, editProject, addProjectMember, removeProjectMember } from '../controllers/ProjectController.js';
import { createUser, deleteAccount, getUser, loginUser, updateUserAvatar, updateUserEmail, updateUserPassword , updateUsername, activateServer} from '../controllers/UserController.js';
import { getSprint, createSprint, updateSprint, deleteSprint } from '../controllers/SprintController.js';

import { validateToken } from '../JWT.js';

const router = express.Router();
dotenv.config();

// read
router.get(`/:userId/projects`, getProjects);
router.get(`/:userId/projects/:projectId`, getProject);
router.get(`/:userId/projects/:projectId/tickets/:ticketId`, getTicket);
router.post(`/users/login`, loginUser);
router.get(`/users/:userId/profile`, getUser);
router.get(`/:userId/projects/:projectId/sprints/:sprintId`, getSprint);
router.post(`/users/:userId/validate-tokens`, validateToken);
router.get(`/activate/active`, activateServer);

// update
router.post(`/:userId/projects/:projectId/edit`, editProject);
router.post(`/:userId/projects/:projectId/tickets/:ticketId/update`, updateTicket);
router.post(`/users/:userId/update/email`, updateUserEmail);
router.post(`/users/:userId/update/password`, updateUserPassword);
router.post(`/users/:userId/update/username`, updateUsername);
router.post(`/users/:userId/update/avatar`, updateUserAvatar);
router.post(`/:userId/projects/:projectId/sprints/:sprintId/update`, updateSprint);

// create
router.post(`/:userId/projects/create`, createProject);
router.post(`/:userId/projects/:projectId/tickets/create`, createTicket);
router.post(`/:userId/projects/:projectId/comments/create`, createComment);
router.post(`/users/signup`, createUser);
router.post(`/:userId/projects/:projectId/sprints/create`, createSprint);
router.post(`/:userId/projects/:projectId/tickets/:ticketId/comments/create`, createTicketComment);
router.post(`/:userId/projects/:projectId/members/add`, addProjectMember);

// delete
router.delete(`/:userId/projects/:projectId/delete`, deleteProject);
router.post(`/:userId/projects/:projectId/tickets/:ticketId/delete`, deleteTicket);
router.post(`/:userId/projects/:projectId/comments/:commentId/delete`, deleteComment);
router.post(`/:userId/projects/:projectId/sprints/:sprintId/delete`, deleteSprint);
router.post(`/:userId/projects/:projectId/tickets/:ticketId/comments/:commentId/delete`, deleteTicketComment);
router.post(`/:userId/projects/:projectId/members/:memberId/remove`, removeProjectMember);
router.post(`/users/:userId/delete-account`, deleteAccount);

export default router;