import express from 'express';
import mongoose from 'mongoose';
import { ProjectModel } from "../models/Project.js";

const router = express.Router();

export const createComment = async (req, res) => {
    const { projectId, bugId } = req.params;
    const { comments } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(bugId)) return res.status(404).send(`No bug with id: ${bugId}`);

    await ProjectModel.findOneAndUpdate(
        { "_id": projectId, "bugs._id": bugId },
        {
            $push:{
                "bugs.$.comments": comments,
            }
        },
    );
    res.json("Comment Created");
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