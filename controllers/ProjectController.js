import mongoose from 'mongoose';
import { ProjectModel } from "../models/Project.js";
import { UserModel } from '../models/User.js';
import { validateUser } from '../JWT.js';

export const getProjects = async (req, res) => {
    const token = req.headers.authorization;
    const user = validateUser(token);
    if (!user) { return res.status(400).json('Invalid'); };
    try {
        const ownedProjects = await ProjectModel.find({ owner: user.id }); 
        const memberOfProjects = await ProjectModel.find({ members: user.id }); 
        res.status(200).json({ projects: ownedProjects, memberProjects: memberOfProjects });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const getProject = async (req, res) => { 
    const { projectId } = req.params;
    const token = req.headers.authorization;
    const user = validateUser(token);
    if (!user) { return res.status(400).json('Invalid'); };
    try {
        const project = await ProjectModel.findById(projectId);
        if(!project){ return res.status(404).json('No project found'); }
        if(!project.members.includes(user.id)){ return res.status(400).json('Invalid'); };
        res.status(200).json(project);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const createProject = async (req, res) => {
    const { title, image, link, type, description, repository, lead, key } = req.body;
    const token = req.headers.authorization;
    const user = validateUser(token);
    if (!user) { return res.status(400).json('Invalid'); }
    try {
        await new ProjectModel.create({ 
            title, 
            owner: user.id, 
            type, 
            image, 
            link, 
            description, 
            repository, 
            lead, 
            key, 
            lastUpdate: Date.now(),
            members: [{ user: user.id }],
            bugs:[],
            comments: [],
            sprints: [],
        })
        res.status(201).json("Project Created!");
    } catch (error) {
        res.status(400).json({ message: error.message });
    } 
};

export const editProject = async (req, res) => {
    const { projectId } = req.params;
    const { title, startDate, author, image, link, type, description, repository, lead } = req.body;
    
    const currentDate = new Date();

    const token = req.headers.authorization;
    const user = validateUser(token);
    if (!user) { return res.status(400).json('Invalid'); };
    try {
        const project = await ProjectModel.findById(projectId);
        if(!project){ return res.status(404).json('No project found'); }
        if(project.owner !== user.id){ return res.status(403).json('Not authorized'); }
        project.lastUpdate = currentDate;

        await ProjectModel.findOneAndUpdate({ "_id": projectId },
            {
                $set: {
                    title,
                    startDate,
                    lastUpdate: currentDate,
                    author,
                    image,
                    link,
                    type,
                    description,
                    repository,
                    lead,
                }
            }
        );

        let activity = { activity: `updated ${project.title}`, date: currentDate, user: user.username };
        project.activities.unshift(activity);

        await project.save();

        res.status(200).json(`${project.title} updated`);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteProject = async (req, res) => {
    const { projectId } = req.params;
    const token = req.headers.authorization;
    const user = validateUser(token);
    if (!user) { return res.status(400).json('Invalid'); };
    try {
        const project = await ProjectModel.findById(projectId);
        if(!project){ return res.status(404).json('No project found'); }
        if(project.owner !== user.id){ return res.status(403).json('Not authorized'); }
        await ProjectModel.findByIdAndDelete(projectId);
        res.status(200).json(`${project.title} deleted`);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const addProjectMember = async (req, res) => {
    const { projectId } = req.params;
    const { memberId } = req.body;
    
    const currentDate = new Date();

    const token = req.headers.authorization;
    const user = validateUser(token);
    if (!user) { return res.status(400).json('Invalid'); };
    try {
        const project = await ProjectModel.findById(projectId);
        if(!project){ return res.status(404).json('No project found'); }
        if(project.owner !== user.id){ return res.status(403).json('Not authorized'); }
        project.lastUpdate = currentDate;

        const member = await UserModel.findById(memberId);
        if(!member){ return res.status(404).json('No user found'); }

        project.members.unshift(memberId);

        let activity = { activity: `added member ${member.username}`, date: currentDate, user: user.username };
        project.activities.unshift(activity);

        await project.save();

        res.status(200).json(`${member.username} added`);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const removeProjectMember = async (req, res) => {
    const { projectId } = req.params;
    const { memberId } = req.body;
    
    const currentDate = new Date();

    const token = req.headers.authorization;
    const user = validateUser(token);
    if (!user) { return res.status(400).json('Invalid'); };
    try {
        const project = await ProjectModel.findById(projectId);
        if(!project){ return res.status(404).json('No project found'); }
        if(project.owner !== user.id){ return res.status(403).json('Not authorized'); }
        project.lastUpdate = currentDate;

        const member = await UserModel.findById(memberId);
        if(!member){ return res.status(404).json('No user found'); }

        project.members = project.members.filter(member => member._id.toString() !== memberId);

        let activity = { activity: `removed member ${member.username}`, date: currentDate, user: user.username };
        project.activities.unshift(activity);

        await project.save();

        res.status(200).json(`${member.username} removed`);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}