import mongoose from 'mongoose';
import { ProjectModel } from "../models/Project.js";
import { validateUser } from '../JWT.js';

export const getTicket = async (req, res) => {
    const { projectId, ticketId } = req.params;

    const token = req.headers.authorization;
    const user = validateUser(token);
    if (!user) { return res.status(400).json('No valid token providied'); };
    try {
        const project = await ProjectModel.findOne({ _id: projectId});
        if(!project){ return res.status(404).json('No project found');};

         const memberIds = project.members.map(member => member.memberId);
        if(!memberIds.includes(user.id) && user.id !== project.owner ){ return res.status(400).json('Not a member of project'); };


        const ticket = project.tickets.find( ticket => ticket._id.toString() === ticketId);
        if(!ticket){ return res.status(404).json('No ticket found');}

        res.status(200).json(ticket);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const createTicket = async (req, res) => {
    const { title, author, description, status, priority, tag, images, sprint } = req.body;
    const { projectId } = req.params;

    const currentDate = new Date();

    const token = req.headers.authorization;
    const user = validateUser(token);
    if (!user) { return res.status(400).json('No valid token providied'); };
    try {
        const project = await ProjectModel.findOne({ _id: projectId });
        if(!project){ return res.status(404).json('No project found')};

         const memberIds = project.members.map(member => member.memberId);
        if(!memberIds.includes(user.id) && user.id !== project.owner ){ return res.status(400).json('Not a member of project'); };

        project.lastUpdate = currentDate;
        
        let data = { title, description, date: currentDate, status, author: user.username, priority, tag, sprint, images, lastUpdate: currentDate };
        project.tickets.unshift(data);

        let activity = { activity: `created ticket ${title}`, date: currentDate, user: user.username }
        project.activities.unshift(activity);
        
        await project.save();

        res.status(200).json("Ticket Created");
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateTicket = async (req, res) => {
    const { projectId, ticketId } = req.params;
    const { description, status, priority, tag, sprint, images } = req.body;
    
    const currentDate = new Date();

    const token = req.headers.authorization;
    const user = validateUser(token);
    if (!user) { return res.status(400).json('No valid token providied'); };
    try {
        const project = await ProjectModel.findOne({ "_id": projectId });
        if (!project) { return res.status(404).json('No project found'); }

        const memberIds = project.members.map(member => member.memberId);
        if(!memberIds.includes(user.id) && user.id !== project.owner ){ return res.status(400).json('Not a member of project'); };

        let index = project.tickets.findIndex(ticket => ticket._id.toString() === ticketId);
        if (index < 0) { return res.status(404).json('No ticket found'); }

        let ticket = project.tickets[ticketIndex];
        ticket.description = description;
        ticket.status = status;
        ticket.priority = priority;
        ticket.tag = tag;
        ticket.sprint = sprint;
        ticket.images = images;
        ticket.lastUpdate = currentDate;

        project.lastUpdate = currentDate;

        let activity = { activity: `updated the ticket ${ticket.title}`, date: currentDate, user: user.username };
        project.activities.unshift(activity);
        
        await project.save();

        res.status(200).json("Ticket Updated");
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteTicket = async (req, res) => {
    const { projectId, ticketId } = req.params;

    const currentDate = new Date();

    const token = req.headers.authorization;
    const user = validateUser(token);
    if (!user) { return res.status(400).json('No valid token providied'); };
    try {
        const project = await ProjectModel.findOne({ _id: projectId });
        if(!project){ return res.status(404).json('No project found')};

        const memberIds = project.members.map(member => member.memberId);
        if(!memberIds.includes(user.id) && user.id !== project.owner ){ return res.status(400).json('Not a member of project'); };

        project.lastUpdate = currentDate;

        project.tickets = project.tickets.filter(ticket => ticket._id.toString() !== ticketId);

        let activity = { activity: `deleted ${project.tickets[index].title}`, date: currentDate, user: user.username };
        
        project.tickets.splice(index, 1);
        project.activities.unshift(activity);

        await project.save();

        res.status(200).json("Ticket Deleted");
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const createTicketComment = async (req, res) => {
    const { projectId, ticketId } = req.params;
    const { comment } = req.body;
    
    const currentDate = new Date();

    const token = req.headers.authorization;
    const user = validateUser(token);
    if (!user) { return res.status(400).json('No valid token providied'); };
    try { 
        const project = await ProjectModel.findOne({ _id: projectId });
        if(!project){ return res.status(404).json('No project found')};

        const memberIds = project.members.map(member => member.memberId);
        if(!memberIds.includes(user.id) && user.id !== project.owner ){ return res.status(400).json('Not a member of project'); };

        project.lastUpdate = currentDate;

        let ticket = project.tickets.find(ticket => ticket._id.toString() === ticketId);
        if(!ticket){ return res.status(404).json('No ticket found')};

        let commentData = { comment: comment, date: currentDate, user: user.username }
        ticket.comments.unshift(commentData);

        await project.save();

        res.status(200).json("Comment created!");
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteTicketComment = async (req, res) => {
    const { projectId, ticketId, commentId } = req.params;  
    
    const currentDate = new Date();

    const token = req.headers.authorization;
    const user = validateUser(token);
    if (!user) { return res.status(400).json('No valid token providied'); };
    try { 
        const project = await ProjectModel.findOne({ _id: projectId });
        if(!project){ return res.status(404).json('No project found')};

        const memberIds = project.members.map(member => member.memberId);
        if(!memberIds.includes(user.id) && user.id !== project.owner ){ return res.status(400).json('Not a member of project'); };

        project.lastUpdate = currentDate;

        let ticket = project.tickets.find(ticket => ticket._id.toString() === ticketId);
        if(!ticket){ return res.status(404).json('No ticket found')};

        ticket.comments = ticket.comments.filter(comment => comment._id.toString() !== commentId);
        
        await project.save();

        res.status(200).json("Comment Deleted!");
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};