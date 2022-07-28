import express from 'express';
import mongoose from 'mongoose';
import { ProjectModel } from "../models/Project.js";

const router = express.Router();

export const getBug = async (req, res) => { 
    const { projectId, bugId } = req.params;

    try {
        const bug = await ProjectModel.find({ 
            bugs: {
                $elemMatch: { _id: bugId}}},
            { 
                bugs:{ 
                    $elemMatch: { _id: bugId }
                }
            }
        )
        
        res.status(200).json(bug);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const createBug = async (req, res) => {
    const { title, author, description, status, priority, thumbnail, tag, authorAvatar, images, sprint, flag } = req.body;
    const { projectId } = req.params;
    const currentDate = new Date();

    try {
        await ProjectModel.findOneAndUpdate({ _id: projectId },
            {
            '$push': {
                'bugs': {  
                    title,
                    description, 
                    date: currentDate.toLocaleString('en-US', { timeZone: 'America/New_York' }),
                    thumbnail,
                    status, 
                    author,
                    priority,
                    tag,
                    authorAvatar,
                    sprint,
                    flag,
                    images,
                    lastUpdate: currentDate.toLocaleString('en-US', { timeZone: 'America/New_York' }),
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
    const { description, status, priority, tag, sprint, flag, images } = req.body;
    const currentDate = new Date();
    
    if (!mongoose.Types.ObjectId.isValid(bugId)) return res.status(404).send(`No bug with id: ${bugId}`);

    await ProjectModel.findOneAndUpdate(
        { "_id": projectId, "bugs._id": bugId },
        {
            $set:{
                "bugs.$.description": description,
                "bugs.$.status": status,
                "bugs.$.priority": priority,
                "bugs.$.tag": tag,
                "bugs.$.sprint": sprint,
                "bugs.$.flag": flag,
                "bugs.$.images": images,
                "bugs.$.lastUpdate": currentDate.toLocaleString('en-US', { timeZone: 'America/New_York' }),
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

export const deleteImage = async (req, res) => {
    const { projectId, bugId, imageId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(bugId)) return res.status(404).send(`No bug with id: ${bugId}`);
        await ProjectModel.findOneAndUpdate(
            { _id: projectId },
            { 'bugs': { _id: bugId }  },
            { $pull: { 'images': { _id: imageId }}},
            { multi: true }
        )
    res.json("Image Deleted");
}