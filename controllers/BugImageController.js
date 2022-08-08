import express from 'express';
import mongoose from 'mongoose';
import { ProjectModel } from "../models/Project.js";

const router = express.Router();

export const deleteImage = async (req, res) => {
    const { projectId, bugId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(bugId)) return res.status(404).send(`No Bug with id: ${bugId}`);
        await ProjectModel.findOneAndUpdate(
            { _id: projectId, 'bugs._id': bugId },
            {   
                $set:{
                    "bugs.$.images": images,
                }
            }
        )
    res.json("Image Deleted");
}