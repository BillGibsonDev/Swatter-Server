import express from 'express';
import mongoose from 'mongoose';
import { ProjectModel } from "../models/Project.js";

const router = express.Router();

export const createComment = async (req, res) => {
    const { projectId } = req.params;
    const { comment, date, author, role } = req.body;

    if(role !== process.env.NODE_ENV_ADMIN_SECRET || role !== process.env.NODE_ENV_USER_SECRET ){
      res.json("You do not have permission");
    } else {
        const newComment = new ProjectModel({ comment, date, author })
        try {
            await ProjectModel.findOneAndUpdate({ _id: projectId },
                {
                '$push': {
                    'comments': {  
                        comment, 
                        date, 
                        author
                    }
                }
            })
            res.status(201).json("Comment Created");
        } catch (error) {
            res.status(409).json({ message: error.message });
        }
    }
}

export const deleteComment = async (req, res) => {
    const { projectId, commentId } = req.params;
    const { role } = req.body;
    if (!mongoose.Types.ObjectId.isValid(commentId)) return res.status(404).send(`No comment with id: ${commentId}`);

    if(role !== process.env.NODE_ENV_ADMIN_SECRET || role !== process.env.NODE_ENV_USER_SECRET ){
      res.json("You do not have permission");
    } else {
        await ProjectModel.findOneAndUpdate(
            { _id: projectId },
            { $pull: { 'comments': { _id: commentId } } },
            { multi: true }
        )
        res.json("Comment Deleted");
    }
}