import mongoose from "mongoose";
import { ProjectModel } from "../models/Project.js";

const BackupModel = mongoose.model('Backup Projects', new mongoose.Schema({}, { strict: false }));

export const backupProjects = async () => {
    
    try {
        const projectCount = await ProjectModel.countDocuments();

        if (projectCount === 0) {
            console.log('No projects to back up.');
            return; 
        }
        
        const projects = await ProjectModel.find();

        await BackupModel.deleteMany();
        await BackupModel.insertMany(projects);

        console.log('Projects backed up successfully');

    } catch (error) {
        console.log('Error saving projects', error);
    }
};