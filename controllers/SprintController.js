import mongoose from 'mongoose';
import { ProjectModel } from "../models/Project.js";
import { validateAdmin } from '../JWT.js';

export const getSprint = async (req, res) => { 
    const { projectId, sprintId } = req.params;
    try {
        const sprint = await ProjectModel.findOne({ 
            sprints: {
                $elemMatch: { _id: sprintId}}},
            { 
                sprints:{ 
                    $elemMatch: { _id: sprintId }
                }
            }
        )
        res.status(200).json(sprint);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const createSprint = async (req, res) => {
    const { goal, color, endDate, title, status } = req.body;
    const { projectId } = req.params;
    const currentDate = new Date();
    let token = req.headers.authorization;
    if(validateAdmin(token)){
        try {
            await ProjectModel.findOneAndUpdate({ _id: projectId },
                {
                    $set: {
                        lastUpdate: currentDate,
                    }
                },
                {
                    '$push': {
                        'sprints': {  
                            goal,
                            title,
                            endDate,
                            status,
                            color,
                            updated: currentDate,
                        }
                    }
                })
            res.status(201).json("Sprint Created");
        } catch (error) {
            res.status(409).json({ message: error.message });
        }
    } else {
        res.status(400).json('Invalid');
    }
}

export const updateSprint = async (req, res) => {
    const { projectId, sprintId } = req.params;
    const { goal, endDate, title, color, status, lastTitle } = req.body;
    const currentDate = new Date();
    if (!mongoose.Types.ObjectId.isValid(sprintId)) return res.status(404).send(`No sprint with id: ${sprintId}`);
    let token = req.headers.authorization;
    if(validateAdmin(token)){
        try {
            await ProjectModel.findOneAndUpdate(
            { "_id": projectId, "sprints._id": sprintId },
            {
                $set:{
                    lastUpdate: currentDate,
                    "sprints.$.goal": goal,
                    "sprints.$.title": title,
                    "sprints.$.endDate": endDate,
                    "sprints.$.color": color,
                    "sprints.$.status": status,
                    "sprints.$.updated": currentDate.toLocaleString('en-US', { timeZone: 'America/New_York' }),
                }
            },
            await ProjectModel.updateMany(
                { _id: projectId, "bugs.sprint": lastTitle}, 
                { $set:{ 
                    'bugs.$.sprint': title
                }},
                { multi: true }
            )
        );
        res.json("Sprint Updated");
        } catch(error){
            res.status(400).json({ message: error.message });
        }
    } else {
        res.status(400).json('Invalid');
    }
}

export const deleteSprint = async (req, res) => {
    const { projectId, sprintId } = req.params;
    const {sprintTitle} = req.body;
    let token = req.headers.authorization;
    if (!mongoose.Types.ObjectId.isValid(sprintId)) return res.status(404).send(`No bug with id: ${sprintId}`);
    if(validateAdmin(token)){ 
        try {
            await ProjectModel.findOneAndUpdate(
                { _id: projectId },
                { $set: { lastUpdate: currentDate }},
                { $pull: { 'sprints': { _id: sprintId } }},
                { multi: true }
            )
            await ProjectModel.updateMany(
                { _id: projectId, 'bugs.sprint': sprintTitle}, 
                { $set:{ 
                    'bugs.$.sprint': ''
                }},
                { multi: true }
            )
        res.json("Sprint Deleted");
        } catch(error){
            res.status(400).json({ message: error.message });
        }
    } else {
        res.status(400).json('Invalid');
    }
}