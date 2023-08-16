import mongoose from 'mongoose';
import { ProjectModel } from "../models/Project.js";
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
}

export const getProject = async (req, res) => { 
    const { projectId } = req.params;
    const token = req.headers.authorization;
    const user = validateUser(token);
    if (!user) { return res.status(400).json('Invalid'); };
    try {
        const project = await ProjectModel.findById(projectId);
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
        if(!project){ return res.status(400).json('Invalid'); }
        if(project.owner !== user.id){ return res.status(403).json('Invalid'); }
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

        await project.save();

        res.status(200).json(project ? "Project Updated": "Project not found");
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
        if(!project){ return res.status(400).json('Invalid'); }
        if(project.owner !== user.id){ return res.status(403).json('Invalid'); }
        await ProjectModel.findByIdAndDelete(projectId);
        res.json("Project Deleted");
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};