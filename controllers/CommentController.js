import mongoose from 'mongoose';
import { ProjectModel } from "../models/Project.js";

export const createComment = async (req, res) => {
    const { projectId } = req.params;
    const { comment, author } = req.body;
    const currentDate = new Date();
    try {
        await ProjectModel.findOneAndUpdate({ _id: projectId },
            {
            '$push': {
                'comments': {  
                    comment, 
                    date: currentDate.toLocaleString('en-US', { timeZone: 'America/New_York' }), 
                    author
                }
            }
        })
        res.status(201).json("Comment created!");
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

export const deleteComment = async (req, res) => {
    const { projectId, commentId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(commentId)) return res.status(404).send(`No comment with id: ${commentId}`);
    try {
        await ProjectModel.findOneAndUpdate(
            { _id: projectId },
            { $pull: { 'comments': { _id: commentId } } },
            { multi: true }
        )
        res.json("Comment Deleted");
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}