import mongoose from 'mongoose';

// children
const ImagesSchema = new mongoose.Schema({
    image: String,
    caption: String,
})

const BugCommentSchema = new mongoose.Schema({
    comment: String,
    date: String,
    author: String,
    avatar: String,
})

const BugSchema = new mongoose.Schema({
    title:  String,
    description: String,
    date: String,
    lastUpdate: String,
    bugKey: String,
    images: [{ type: ImagesSchema, ref: 'bugImage'}],
    status: String,
    author: String,
    priority: String,
    tag: String,
    sprint: String,
    comments: [{type: BugCommentSchema, ref: 'bugComment'}]
})

const CommentSchema = new mongoose.Schema({
    comment: String,
    date: String,
    author: String,
})

const SprintSchema = new mongoose.Schema({
    title: String,
    goal: String,
    color: String,
    endDate: String,
    updated: String,
    status: String,
})

// parent
const ProjectSchema = new mongoose.Schema({
    projectTitle: String,
    startDate: String,   
    lastUpdate: String,
    projectLead: String,
    projectImage: String,
    projectLink: String,
    projectType: String,
    description: String,
    projectKey: String,
    repository: String,
    bugs: [{ type: BugSchema, ref: "bugs" }],
    comments: [{ type: CommentSchema, ref: "comments" }],
    sprints: [{type: SprintSchema, ref: "sprints"}]
})

// parent
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        allowNull: false,
        unique: true,
    },
    password: {
        type: String,
        allowNull: false,
    },
    email: {
        type: String,
        allowNull: false,
        unique: true,
    },
    token: String,
    role: String,
    lastLogin: String,
    team: [{
        username: {
            type: String,
            unique: true,
        }
    }],
    projects: [{
        type: ProjectSchema,
        ref: 'projects'
    }]
})

export const UserModel = mongoose.model("User", UserSchema)