import mongoose from 'mongoose';

// children
const ImagesSchema = new mongoose.Schema({
    image: String,
    caption: String,
})

const SubtaskSchema = new mongoose.Schema({
    description: String,
    title: String,
    status: String,
    author: String,
    avatar: String,
    priority: String,
})

const BugSchema = new mongoose.Schema({
    title:  String,
    description: String,
    date: String,
    lastUpdate: String,
    thumbnail: String,
    images: [ ImagesSchema ],
    status: String,
    author: String,
    priority: String,
    tag: String,
    flag: Boolean,
    sprint: String,
    subtasks: [ SubtaskSchema ],
})

const CommentSchema = new mongoose.Schema({
    comment: String,
    date: String,
    author: String,
    avatar: String,
})

const ScheduleSchema = new mongoose.Schema({
    title: String,
    date: String,
    endDate: String,
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
    projectLead: String,
    projectImage: String,
    projectLink: String,
    projectType: String,
    description: String,
    projectKey: String,
    repository: String,
    schedule: [ ScheduleSchema],
    bugs: [{ type: BugSchema, ref: "bugs" }],
    comments: [{ type: CommentSchema, ref: "comments" }],
    sprints: [{type: SprintSchema, ref: "sprints"}]
})

export const ProjectModel = mongoose.model("Project", ProjectSchema);
