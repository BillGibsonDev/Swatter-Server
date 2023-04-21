import mongoose from 'mongoose';
import { ProjectModel } from "../models/Project.js";
import { validateUser } from '../JWT.js';

export const createComment = async (req, res) => {
    const { projectId } = req.params;
    const { comment, author } = req.body;
    const currentDate = new Date();
    let token = req.headers.authorization;
    if(validateUser(token)){
        try {
            await ProjectModel.findOneAndUpdate({ _id: projectId },
                {
                '$push': {
                    'comments': {  
                        comment, 
                        date: currentDate, 
                        author
                    }
                }
            })
            res.status(201).json("Comment created!");
        } catch (error) {
            res.status(409).json({ message: error.message });
        }
    }
}

export const deleteComment = async (req, res) => {
    const { projectId, commentId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(commentId)) return res.status(404).send(`No comment with id: ${commentId}`);
    let token = req.headers.authorization;
    if(validateUser(token)){
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
    } else {
        res.status(400).json('Invalid');
    }
}