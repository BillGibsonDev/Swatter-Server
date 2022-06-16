import mongoose from 'mongoose';

// children
const ImagesSchema = new mongoose.Schema({
    image: String,
    label: String,
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
    startDate: String,
    endDate: String,
})

// parent
const ProjectSchema = new mongoose.Schema({
    projectTitle: String,
    startDate: String,
    author: String,
    projectImage: String,
    projectLink: String,

    schedule: [ ScheduleSchema],

    bugs: [{ type: BugSchema, ref: "bugs" }],

    comments: [{ type: CommentSchema, ref: "comments" }],
})

export const ProjectModel = mongoose.model("Project", ProjectSchema);
