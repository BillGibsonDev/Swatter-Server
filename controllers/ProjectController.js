import mongoose from 'mongoose';
import { ProjectModel } from "../models/Project.js";
import { UserModel } from '../models/User.js';
import { validateUser } from '../JWT.js';

export const getProjects = async (req, res) => {
    const token = req.headers.authorization;
    const user = await validateUser(token);

    if (!user) { return res.status(400).json('No valid token providied'); };
    try {
        const ownedProjects = await ProjectModel.find({ 'ownerId': user.id }); 
        const memberOfProjects = await ProjectModel.find({ 'members.memberId': user.id }); 
        const projects = ownedProjects.concat(memberOfProjects);

        res.status(200).json(projects);
    } catch (error) {
        console.log(error)
        res.status(404).json(error.message);
    }
};

export const getProject = async (req, res) => { 
    const { projectId } = req.params;
    const token = req.headers.authorization;
    const user = await validateUser(token);

    if (!user) { return res.status(400).json('No valid token providied'); };
    try {
        const project = await ProjectModel.findById(projectId);
        if(!project){ return res.status(404).json('No project found'); };

        const memberIds = project.members.map(member => member.memberId);
        if(!memberIds.includes(user.id) && user.id !== project.ownerId ){ return res.status(400).json('Not a member of project'); };
        
        res.status(200).json(project);
    } catch (error) {
        res.status(404).json(error.message);
    }
};

export const createProject = async (req, res) => {
    const { title, image, link, description, repository } = req.body;
    
    const token = req.headers.authorization;
    const user = await validateUser(token);
    if (!user) { return res.status(400).json('No valid token providied'); };
    try {
        await ProjectModel.create({ 
            title, 
            ownerId: user.id, 
            owner: user.username,
            image, 
            link, 
            description, 
            repository,
            startDate: new Date(),
            lastUpdate: new Date(),
            members:[],
            tickets:[],
            comments: [],
            sprints: [],
        })
        res.status(200).json("Project Created!");
    } catch (error) {
        console.log(error)
        res.status(400).json(error.message);
    } 
};

export const editProject = async (req, res) => {
    const { projectId } = req.params;
    const { title, image, link, description, repository } = req.body;
    
    const currentDate = new Date();

    const token = req.headers.authorization;
    const user = await validateUser(token);

    if (!user){ return res.status(403).json('No valid token providied'); };
    try {
        const project = await ProjectModel.findById(projectId);
        if(!project){ return res.status(404).json('No project found'); }
        if(project.ownerId !== user.id){ return res.status(403).json('Not authorized'); }
        project.lastUpdate = currentDate;

        await ProjectModel.findOneAndUpdate({ "_id": projectId },
            {
                $set: {
                    title,
                    lastUpdate: currentDate,
                    image,
                    link,
                    description,
                    repository,
                }
            }
        );

        let activity = { activity: `updated ${project.title}`, date: currentDate, user: user.username };
        project.activities.unshift(activity);

        await project.save();

        res.status(200).json(project);
    } catch (error) {
        res.status(400).json(error.message);
    }
};

export const deleteProject = async (req, res) => {
    const { userId, projectId } = req.params;
    const token = req.headers.authorization;
    const user = await validateUser(token);

    if (!user) { return res.status(400).json('No valid token providied'); };
    try {
        const project = await ProjectModel.findById(projectId);
        if(!project){ return res.status(404).json('No project found'); }
        if(project.ownerId !== user.id){ return res.status(403).json('Not authorized'); }
        await ProjectModel.findByIdAndDelete(projectId);
        res.status(200).json(`${project.title} deleted`);
    } catch (error) {
        res.status(400).json(error.message);
    }
};

export const addProjectMember = async (req, res) => {
    const { projectId } = req.params;
    const { username } = req.body;
    
    const regexUsername = new RegExp(username, "i");
    const currentDate = new Date();

    const token = req.headers.authorization;
    const user = await validateUser(token);

    if (!user) { return res.status(400).json('No valid token providied'); };
    try {
        const project = await ProjectModel.findById(projectId);
        if(!project){ return res.status(404).json('No project found'); };
        if(project.ownerId !== user.id){ return res.status(403).json('Not authorized'); };

        const member = await UserModel.findOne({ username: { $regex: regexUsername } });
        if(!member){ return res.status(404).json('No user found'); };
        if (project.members.some(mem => mem.memberId.toString() === member._id.toString())) {
            return res.status(400).json('Member already added');
        }

        let data = {
            username: username,
            memberId: member._id.toString()
        };

        let array = project.members;
        array.unshift(data);
        project.members = array;

        let activity = { activity: `added member ${username}`, date: currentDate, user: user.username };
        project.activities.unshift(activity);

        project.lastUpdate = currentDate;
        await project.save();

        res.status(200).json(project.members);
    } catch (error) {
        console.log(error)
        res.status(400).json(error.message);
    }
};

export const removeProjectMember = async (req, res) => {
    const { projectId } = req.params;
    const { memberId } = req.body;
    
    const currentDate = new Date();

    const token = req.headers.authorization;
    const user = await validateUser(token);

    if (!user) { return res.status(400).json('No valid token providied'); };
    try {
        const project = await ProjectModel.findById(projectId);
        if(!project){ return res.status(404).json('No project found'); };
        
        const memberIds = project.members.map(member => member.memberId);
        if(!memberIds.includes(user.id) && user.id !== project.ownerId ){ return res.status(400).json('Not a member of project'); };

        const member = await UserModel.findById(memberId);
        if(!member){ return res.status(404).json('No user found'); };

        project.members = project.members.filter(member => member.memberId.toString() !== memberId);

        let activity = { activity: `removed member ${member.username}`, date: currentDate, user: user.username };
        project.activities.unshift(activity);

        project.lastUpdate = currentDate;
        await project.save();

        res.status(200).json(project.members);
    } catch (error) {
        res.status(400).json(error.message);
    }
}