import express from 'express';
import mongoose from 'mongoose';
import { ProjectModel } from "../models/Project.js";

const router = express.Router();

export const getBug = async (req, res) => { 
    const { projectId, bugId } = req.params;

    try {
        const bug = await ProjectModel.find({ bugs: {$elemMatch: { _id: bugId}}},
            { bugs: {$elemMatch: { _id: bugId}}})
        
        res.status(200).json(bug);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const createBug = async (req, res) => {
    const { title, date, author, description, status, priority, thumbnail, tag, lastUpdate } = req.body;
    const { projectId } = req.params;

        const newBug = new ProjectModel({ title, date, author, description, status, priority, thumbnail, tag, lastUpdate })
        try {
            await ProjectModel.findOneAndUpdate({ _id: projectId },
                {
                '$push': {
                    'bugs': {  
                        title,
                        description, 
                        date,
                        thumbnail,
                        status, 
                        author,
                        priority,
                        tag,
                        lastUpdate
                    }
                }
            })

            res.status(201).json("Bug Created");
        } catch (error) {
            res.status(409).json({ message: error.message });
        }
}

export const updateBug = async (req, res) => {
    const { projectId, bugId } = req.params;
    const { description, status, priority, tag, lastUpdate } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(bugId)) return res.status(404).send(`No bug with id: ${bugId}`);

    const updatedBug = { description, status, priority, tag, lastUpdate };

    await ProjectModel.findOneAndUpdate(
        { "_id": projectId, "bugs._id": bugId },
        {
            $set:{
                "bugs.$.description": description,
                "bugs.$.status": status,
                "bugs.$.priority": priority,
                "bugs.$.tag": tag,
                "bugs.$.lastUpdate": lastUpdate,
            }
        },
    );
    res.json("Bug Updated");
}


export const deleteBug = async (req, res) => {

    const { projectId, bugId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(bugId)) return res.status(404).send(`No bug with id: ${bugId}`);
        await ProjectModel.findOneAndUpdate(
            { _id: projectId },
            { $pull: { 'bugs': { _id: bugId } } },
            { multi: true }
        )
    res.json("Bug Deleted");
}