import mongoose from 'mongoose';
import { ProjectModel } from "../models/Project.js";
import { validateUser } from '../JWT.js';

export const getTicket = async (req, res) => {
    const { projectId, ticketId } = req.params;

    const token = req.headers.authorization;
    const user = await validateUser(token);

    if (!user) { return res.status(400).json('No valid token providied'); };
    try {
        const project = await ProjectModel.findOne({ _id: projectId});
        if(!project){ return res.status(404).json('No project found');};

        const memberIds = project.members.map(member => member.memberId);
        if(!memberIds.includes(user.id) && user.id !== project.ownerId ){ return res.status(400).json('Not a member of project'); };

        const ticket = project.tickets.find( ticket => ticket._id.toString() === ticketId);
        if(!ticket){ return res.status(404).json('No ticket found');}

        res.status(200).json(ticket);
    } catch (error) {
        res.status(404).json(error.message);
    }
};

export const createTicket = async (req, res) => {
    const { title, assigned, description, status, priority, tag, images, sprint, link } = req.body;
    const { projectId } = req.params;

    const currentDate = new Date();

    const token = req.headers.authorization;
    const user = await validateUser(token);

    if (!user) { return res.status(400).json('No valid token providied'); };
    try {
        const project = await ProjectModel.findOne({ _id: projectId });
        if(!project){ return res.status(404).json('No project found')};

        const memberIds = project.members.map(member => member.memberId);
        if(!memberIds.includes(user.id) && user.id !== project.ownerId ){ return res.status(400).json('Not a member of project'); };

        project.lastUpdate = currentDate;
        
        function generateKey() {
            const min = 1000;
            const max = 9999;
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        let data = { title, description, date: currentDate, status, assigned, author: user.username, priority, tag, images, sprint, lastUpdate: null, key: generateKey(), link };
        project.tickets.unshift(data);

        let activity = { activity: `created ticket ${title}`, date: currentDate, user: user.username };
        project.activities.unshift(activity);
        
        await project.save();

        res.status(200).json("Ticket Created");
    } catch (error) {
        res.status(400).json(error.message);
    }
};

export const updateTicket = async (req, res) => {
    const { projectId, ticketId } = req.params;
    const { description, status, priority, tag, sprint, images, assigned, link } = req.body;
    
    const currentDate = new Date();

    const token = req.headers.authorization;
    const user = await validateUser(token);

    if (!user) { return res.status(400).json('No valid token providied'); };
    try {
        const project = await ProjectModel.findOne({ "_id": projectId });
        if (!project) { return res.status(404).json('No project found'); }

        const memberIds = project.members.map(member => member.memberId);
        if(!memberIds.includes(user.id) && user.id !== project.ownerId ){ return res.status(401).json('Not a member of project'); };

        let index = project.tickets.findIndex(ticket => ticket._id.toString() === ticketId);
        if (index < 0) { return res.status(404).json('No ticket found'); }

        let ticket = project.tickets[index];
        ticket.description = description;
        ticket.status = status;
        ticket.priority = priority;
        ticket.tag = tag;
        ticket.sprint = sprint;
        ticket.images = images;
        ticket.lastUpdate = currentDate;
        ticket.assigned = assigned;
        ticket.link = link;

        project.lastUpdate = currentDate;

        let activity = { activity: `updated the ticket ${ticket.title}`, date: currentDate, user: user.username };
        project.activities.unshift(activity);
        
        await project.save();

        res.status(200).json(ticket);
    } catch (error) {
        res.status(400).json(error.message);
    }
};

export const deleteTicket = async (req, res) => {
    const { projectId, ticketId } = req.params;

    const currentDate = new Date();

    const token = req.headers.authorization;
    const user = await validateUser(token);

    if (!user) { return res.status(400).json('No valid token providied'); };
    try {
        const project = await ProjectModel.findOne({ _id: projectId });
        if(!project){ return res.status(404).json('No project found')};

        const memberIds = project.members.map(member => member.memberId);
        if(!memberIds.includes(user.id) && user.id !== project.ownerId ){ return res.status(401).json('Not a member of project'); };

        project.lastUpdate = currentDate;

        project.tickets = project.tickets.filter(ticket => ticket._id.toString() !== ticketId);

        let activity = { activity: `deleted ticket`, date: currentDate, user: user.username };
        
        project.activities.unshift(activity);

        await project.save();

        res.status(200).json("Ticket Deleted");
    } catch (error) {
        res.status(400).json(error.message);
    }
};

export const createTicketComment = async (req, res) => {
    const { projectId, ticketId } = req.params;
    const { comment } = req.body;
    
    const currentDate = new Date();

    const token = req.headers.authorization;
    const user = await validateUser(token);

    if (!user) { return res.status(400).json('No valid token providied'); };
    try { 
        const project = await ProjectModel.findOne({ _id: projectId });
        if(!project){ return res.status(404).json('No project found')};

        const memberIds = project.members.map(member => member.memberId);
        if(!memberIds.includes(user.id) && user.id !== project.ownerId ){ return res.status(400).json('Not a member of project'); };

        project.lastUpdate = currentDate;

        let ticket = project.tickets.find(ticket => ticket._id.toString() === ticketId);
        if(!ticket){ return res.status(404).json('No ticket found')};

        const commentData = { comment: comment, date: currentDate, user: user.username, edited: false, userAvatar: user.avatar }
        ticket.comments.unshift(commentData);

        ticket.lastUpdate = currentDate;
        await project.save();

        res.status(200).json(ticket.comments);
    } catch (error) {
        res.status(400).json(error.message);
    }
};

export const updateTicketComment = async (req, res) => {
    const { projectId, ticketId, commentId } = req.params;
    const { comment } = req.body;
    
    const currentDate = new Date();

    const token = req.headers.authorization;
    const user = await validateUser(token);

    if (!user) { return res.status(400).json('No valid token providied'); };
    try { 
        const project = await ProjectModel.findOne({ _id: projectId });
        if(!project){ return res.status(404).json('No project found')};

        const memberIds = project.members.map(member => member.memberId);
        if(!memberIds.includes(user.id) && user.id !== project.ownerId ){ return res.status(401).json('Not a member of project'); };

        project.lastUpdate = currentDate;

        const ticket = project.tickets.find(ticket => ticket._id.toString() === ticketId);
        if(!ticket){ return res.status(404).json('No ticket found')};

        let ticketComment = ticket.comments.find(comment => comment._id.toString() === commentId);
        if(!ticketComment){ return res.status(404).json('No comment found')};

        ticket.lastUpdate = currentDate;
        ticketComment.comment = comment;
        ticketComment.edited = true;

        await project.save();

        res.status(200).json(ticket.comments);
    } catch (error) {
        res.status(400).json(error.message);
    }
};

export const deleteTicketComment = async (req, res) => {
    const { projectId, ticketId, commentId } = req.params;  
    
    const currentDate = new Date();

    const token = req.headers.authorization;
    const user = await validateUser(token);

    if (!user) { return res.status(400).json('No valid token providied'); };
    try { 
        const project = await ProjectModel.findOne({ _id: projectId });
        if(!project){ return res.status(404).json('No project found')};

        const memberIds = project.members.map(member => member.memberId);
        if(!memberIds.includes(user.id) && user.id !== project.ownerId ){ return res.status(401).json('Not a member of project'); };

        project.lastUpdate = currentDate;

        let ticket = project.tickets.find(ticket => ticket._id.toString() === ticketId);
        if(!ticket){ return res.status(404).json('No ticket found')};

        ticket.comments = ticket.comments.filter(comment => comment._id.toString() !== commentId);
        
        await project.save();

        res.status(200).json(ticket.comments);
    } catch (error) {
        res.status(400).json(error.message);
    }
};