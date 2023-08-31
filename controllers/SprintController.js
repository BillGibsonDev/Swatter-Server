import mongoose from 'mongoose';
import { ProjectModel } from "../models/Project.js";
import { validateUser } from '../JWT.js';

export const getSprint = async (req, res) => { 
    const { projectId, sprintId } = req.params;

    const token = req.headers.authorization;
    const user = await validateUser(token);

    if (!user) { return res.status(400).json('No valid token providied'); };
    try {
        const project = await ProjectModel.findOne({ _id: projectId });
        if(!project){ return res.status(400).json('No project found')};
         const memberIds = project.members.map(member => member.memberId);
        if(!memberIds.includes(user.id) && user.id !== project.ownerId ){ return res.status(400).json('Not a member of project'); };


        const sprint = project.sprints.find(sprint => sprint._id.toString() === sprintId);
        if(!sprint){ return res.status(400).json('No sprint found')};

        res.status(200).json(sprint);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const createSprint = async (req, res) => {
    const { goal, color, endDate, title, status } = req.body;
    const { projectId } = req.params;
    
    const currentDate = new Date();
    
    const token = req.headers.authorization;
    const user = await validateUser(token);

    if (!user) { return res.status(400).json('No valid token providied'); };
    try {
        const project = await ProjectModel.findOne({ _id: projectId });
        if(!project){ return res.status(400).json('No project found')};
         const memberIds = project.members.map(member => member.memberId);
        if(!memberIds.includes(user.id) && user.id !== project.ownerId ){ return res.status(400).json('Not a member of project'); };


        let sprintData = { createdBy: user.username, goal, title, endDate, status, color, updated: currentDate,}

        project.lastUpdate = currentDate;
        project.sprints.unshift(sprintData);

        let activity = { activity: `created sprint ${title}`, date: currentDate, user: user.username };
        project.activities.unshift(activity);

        await project.save();

        res.status(200).json(`${title} created`);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

export const updateSprint = async (req, res) => {
    const { projectId, sprintId } = req.params;
    const { goal, endDate, title, color, status, lastTitle } = req.body;
    
    const currentDate = new Date();
    
    const token = req.headers.authorization;
    const user = await validateUser(token);

    if (!user) { return res.status(400).json('No valid token providied'); };
    try {
        const project = await ProjectModel.findOne({ "_id": projectId });
        if(!project){ return res.status(400).json('No project found')};
          const memberIds = project.members.map(member => member.memberId);
        if(!memberIds.includes(user.id) && user.id !== project.ownerId ){ return res.status(400).json('Not a member of project'); };

        project.lastUpdate = currentDate;

        await ProjectModel.findOneAndUpdate({ "_id": projectId, "sprints._id": sprintId },
            {
                $set:{
                    "sprints.$.goal": goal,
                    "sprints.$.title": title,
                    "sprints.$.endDate": endDate,
                    "sprints.$.color": color,
                    "sprints.$.status": status,
                    "sprints.$.updated": currentDate,
                }
            }
        );

        await ProjectModel.updateMany(
            { _id: projectId, "tickets.sprint": lastTitle}, 
            { $set:{ 
                'tickets.$.sprint': title
            }},
            { multi: true }
        );

        let activity = { activity: `updated sprint ${lastTitle} to ${title}`, date: currentDate, user: user.username };
        project.activities.unshift(activity);

        await project.save();

        res.status(200).json(project.sprints);
    } catch(error){
        res.status(400).json({ message: error.message });
    }
};

export const deleteSprint = async (req, res) => {
    const { projectId, sprintId } = req.params;
    const { sprintTitle, removeAll } = req.body;
    
    const currentDate = new Date();

    const token = req.headers.authorization;
    const user = await validateUser(token);

    if (!user) { return res.status(400).json('No valid token providied'); };
    try {
        const project =  await ProjectModel.findOne({ _id: projectId });
        if(!project){ return res.status(400).json('No project found')};

        const memberIds = project.members.map(member => member.memberId);
        if(!memberIds.includes(user.id) && user.id !== project.ownerId ){ return res.status(400).json('Not a member of project'); };

        project.lastUpdate = currentDate;

        let tickets = project.tickets;

        tickets.forEach((ticket) => {
            if(ticket.sprint === sprintTitle){
                ticket.sprint =  '';
            }
        })

        project.sprints = project.sprints.filter(sprint => sprint._id.toString() !== sprintId);

        let activity = { activity: `deleted sprint ${sprintTitle}`, date: currentDate, user: user.username };
        project.activities.unshift(activity);

        await project.save();

        res.status(200).json(project.sprints);
    } catch(error){
        res.status(400).json({ message: error.message });
    }
};