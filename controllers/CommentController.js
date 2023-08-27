import mongoose from 'mongoose';
import { ProjectModel } from "../models/Project.js";
import { validateUser } from '../JWT.js';

export const createComment = async (req, res) => {
    const { projectId } = req.params;
    const { comment } = req.body;

    const currentDate = new Date();

    const token = req.headers.authorization;
    const user = validateUser(token);
    if (!user) { return res.status(400).json('No valid token providied'); };
    try {
        const project = await ProjectModel.findOne({ _id: projectId });
        if(!project){ return res.status(400).json('No Project Found')};
         const memberIds = project.members.map(member => member.memberId);
        if(!memberIds.includes(user.id) && user.id !== project.owner ){ return res.status(400).json('Not a member of project'); };


        let commentData = { user: user.username, comment: comment, date: currentDate };

        project.comments.unshift(commentData);

        await project.save();

        res.status(200).json(project.comments.reverse());
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

export const deleteComment = async (req, res) => {
    const { projectId, commentId } = req.params;

    const token = req.headers.authorization;
    const user = validateUser(token);
    if (!user) { return res.status(400).json('No valid token providied'); };
    try {
        const project = await ProjectModel.findOne({ _id: projectId });
        if(!project){ return res.status(400).json('No project found')};
         const memberIds = project.members.map(member => member.memberId);
        if(!memberIds.includes(user.id) && user.id !== project.owner ){ return res.status(400).json('Not a member of project'); };


        const comment = project.comments.find(comment => comment._id.toString() === commentId);
        if(!comment){ return res.status(400).json('No comment found')};
        if(comment.user !== user.username && project.owner !== user.id ){ return res.status(403).json('Not authorized')};

        project.comments = project.comments.filter(comment => comment._id.toString() !== commentId);

        await project.save();

        res.status(200).json(project.comments.reverse());
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};