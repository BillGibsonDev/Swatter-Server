import mongoose from 'mongoose';

// children
const BugSchema = new mongoose.Schema({
    title:  String,
    description: String,
    date: String,
    lastUpdate: String,
    thumbnail: String,
    status: String,
    author: String,
    priority: String,
    tag: String,
})

export const BugModel = mongoose.model("Bug", BugSchema)

const CommentSchema = new mongoose.Schema({
    comment: String,
    date: String,
    author: String,
})

export const CommentModel = mongoose.model("Comment", CommentSchema);


// parent
const ProjectSchema = new mongoose.Schema({
    projectTitle: String,
    startDate: String,
    author: String,
    projectImage: String,
    projectLink: String,
    
   bugs: [{ type: BugSchema, ref: "bugs" }],
   comments: [{ type: CommentSchema, ref: "comments" }],
})

export const ProjectModel = mongoose.model("Project", ProjectSchema);
