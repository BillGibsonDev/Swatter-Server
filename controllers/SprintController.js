import express from 'express';
import mongoose from 'mongoose';
import { ProjectModel } from "../models/Project.js";

const router = express.Router();

export const getSprint = async (req, res) => { 
    const { projectId, sprintId } = req.params;
    try {
        const sprint = await ProjectModel.find({ 
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
    
    try {
        await ProjectModel.findOneAndUpdate({ _id: projectId },
            {
            '$push': {
                'sprints': {  
                    goal,
                    title,
                    endDate,
                    status,
                    color,
                    updated: currentDate.toLocaleString('en-US', { timeZone: 'America/New_York' }),
                }
            }
        })
            res.status(201).json("Sprint Created");
        } catch (error) {
            res.status(409).json({ message: error.message });
        }
}

export const updateSprint = async (req, res) => {
    const { projectId, sprintId } = req.params;
    const { goal, endDate, title, color, status } = req.body;
    const currentDate = new Date();
    
    if (!mongoose.Types.ObjectId.isValid(sprintId)) return res.status(404).send(`No sprint with id: ${sprintId}`);

    await ProjectModel.findOneAndUpdate(
        { "_id": projectId, "sprints._id": sprintId },
        {
            $set:{
                "sprints.$.goal": goal,
                "sprints.$.title": title,
                "sprints.$.endDate": endDate,
                "sprints.$.color": color,
                "sprints.$.status": status,
                "sprints.$.updated": currentDate.toLocaleString('en-US', { timeZone: 'America/New_York' }),
            }
        },
    );
    res.json("Sprint Updated");
}


export const deleteSprint = async (req, res) => {

    const { projectId, sprintId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(sprintId)) return res.status(404).send(`No bug with id: ${sprintId}`);
        await ProjectModel.findOneAndUpdate(
            { _id: projectId },
            { $pull: { 'sprints': { _id: sprintId } } },
            { multi: true }
        )
    res.json("Sprint Deleted");
}