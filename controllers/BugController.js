import mongoose from 'mongoose';
import { ProjectModel } from "../models/Project.js";
import { validateUser } from '../JWT.js';

export const getBug = async (req, res) => {
    const { projectId, bugId } = req.params;
    try {
        const project = await ProjectModel.findOne({ _id: projectId});
        if(!project){ return res.status(404).json('No project found');}
        if(!project.members.includes(user.id)){ return res.status(400).json('Invalid'); };

        const bug = project.bugs.find({ _id: bugId });
        if(!bug){ return res.status(404).json('No bug found');}

        res.status(200).json(bug);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const createBug = async (req, res) => {
    const { title, author, description, status, priority, tag, images, sprint, bugKey } = req.body;
    const { projectId } = req.params;

    const currentDate = new Date();

    const token = req.headers.authorization;
    const user = validateUser(token);
    if (!user) { return res.status(400).json('Invalid'); };
    try {
        const project = await ProjectModel.findOne({ _id: projectId });
        if(!project){ return res.status(404).json('No project found')};
        if(!project.members.includes(user.id)){ return res.status(400).json('Invalid'); };
        project.lastUpdate = currentDate;
        
        let data = { title, description, date: currentDate, status, author, priority, tag, sprint, images, bugKey, lastUpdate: currentDate };
        project.bugs.unshift(data);

        let activity = { activity: `Created ${title}`, date: currentDate, user: user.username }
        project.activities.unshift(activity);
        
        await project.save();

        res.status(201).json("Bug Created");
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateBug = async (req, res) => {
    const { projectId, bugId } = req.params;
    const { description, status, priority, tag, sprint, images } = req.body;
    
    const currentDate = new Date();

    const token = req.headers.authorization;
    const user = validateUser(token);
    if (!user) { return res.status(400).json('Invalid'); };
    try {
        const project = await ProjectModel.findOne({ "_id": projectId });
        if (!project) { return res.status(404).json('No project found'); }
        if (!project.members.includes(user.id)) { return res.status(400).json('Invalid'); }

        let bugIndex = project.bugs.findIndex(bug => bug._id.toString() === bugId);
        if (bugIndex < 0) { return res.status(404).json('Bug not found'); }

        let bug = project.bugs[bugIndex];
        bug.description = description;
        bug.status = status;
        bug.priority = priority;
        bug.tag = tag;
        bug.sprint = sprint;
        bug.images = images;
        bug.lastUpdate = currentDate;

        project.lastUpdate = currentDate;

        let activity = { activity: `Updated ${bug.title}`, date: currentDate, user: user.username };
        project.activities.unshift(activity);
        
        await project.save();

        res.status(200).json("Bug Updated");
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteBug = async (req, res) => {
    const { projectId, bugId } = req.params;

    const currentDate = new Date();

    const token = req.headers.authorization;
    const user = validateUser(token);
    if (!user) { return res.status(400).json('Invalid'); };
    try {
        const project = await ProjectModel.findOne({ _id: projectId });
        if(!project){ return res.status(400).json('No project found')};
        project.lastUpdate = currentDate;

        let index = project.bugs.findIndex(bug => bug._id.toString() === bugId);
        if(index < 0){ return res.status(400).json('Bug not found')};
        let activity = { activity: `Deleted ${project.bugs[index].title}`, date: currentDate, user: user.username };
        
        project.bugs.splice(index, 1);
        project.activities.unshift(activity);

        await project.save();

        res.status(200).json("Bug Deleted");
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const createBugComment = async (req, res) => {
    const { projectId, bugId } = req.params;
    const { comment } = req.body;
    
    const currentDate = new Date();

    const token = req.headers.authorization;
    const user = validateUser(token);
    if (!user) { return res.status(400).json('Invalid'); };
    try { 
        const project = await ProjectModel.findOne({ _id: projectId });
        if(!project){ return res.status(404).json('No project found')};
        project.lastUpdate = currentDate;

        let bug = project.bugs.find(bug => bug._id.toString() === bugId);
        if(!bug){ return res.status(404).json('No bug found')};

        let commentData = { comment: comment, date: currentDate, user: user.username }
        bug.comments.unshift(commentData);

        await project.save();

        res.json("Comment created!");
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteBugComment = async (req, res) => {
    const { projectId, bugId, commentId } = req.params;  
    
    const currentDate = new Date();

    const token = req.headers.authorization;
    const user = validateUser(token);
    if (!user) { return res.status(400).json('Invalid'); };
    try { 
        const project = await ProjectModel.findOne({ _id: projectId });
        if(!project){ return res.status(404).json('No project found')};
        project.lastUpdate = currentDate;

        let bug = project.bugs.find(bug => bug._id.toString() === bugId);
        if(!bug){ return res.status(404).json('No bug found')};

        let index = bug.comments.findIndex(comment => comment._id.toString() === commentId);
        if(index < 0){ return res.status(404).json('Comment not found')};
        bug.comments.splice(index, 1);
        
        await project.save();

        res.json("Comment Deleted!");
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};