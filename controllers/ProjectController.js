import express from 'express';
import mongoose from 'mongoose';
import { ProjectModel } from "../models/Project.js";

const router = express.Router();

export const getProjects = async (req, res) => { 
    try {
        const projects = await ProjectModel.find();
                
        res.status(200).json(projects);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const getProject = async (req, res) => { 
    const { projectId } = req.params;

    try {
        const project = await ProjectModel.findById(projectId);
        
        res.status(200).json(project);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const createProject = async (req, res) => {
    const { projectTitle, startDate, author, role } = req.body;

    if(role !== process.env.NODE_ENV_ADMIN_SECRET || role !== process.env.NODE_ENV_USER_SECRET ){
      res.json("You do not have permission");
    } else {
        const newProject = new ProjectModel({ projectTitle, startDate, author })
        try {
            await newProject.save();

            res.status(201).json("Project Created");
        } catch (error) {
            res.status(409).json({ message: error.message });
        }
    }
}

export const deleteProject = async (req, res) => {
    const { projectId } = req.params;
    const { role } = req.body;
    if (!mongoose.Types.ObjectId.isValid(projectId)) return res.status(404).send(`No project with id: ${projectId}`);

    if(role !== process.env.NODE_ENV_ADMIN_SECRET || role !== process.env.NODE_ENV_USER_SECRET ){
      res.json("You do not have permission");
    } else {
        await ProjectModel.findByIdAndRemove(projectId);
        res.json("Project Deleted");
    }
}