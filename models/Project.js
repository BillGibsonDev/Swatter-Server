import mongoose from 'mongoose';

// children
const ImagesSchema = new mongoose.Schema({
    image: String,
    label: String,
})

export const ImagesModel = mongoose.model("Images", ImagesSchema)

const SubtaskSchema = new mongoose.Schema({
    description: String,
    title: String,
})

export const SubtaskModel = mongoose.model("Subtask", SubtaskSchema)

const BugSchema = new mongoose.Schema({
    title:  String,
    description: String,
    date: String,
    lastUpdate: String,
    thumbnail: String,
    images: [ ImagesModel ],
    status: String,
    author: String,
    priority: String,
    tag: String,
    flag: Boolean,
    subtasks: [ SubtaskModel ],
})

export const BugModel = mongoose.model("Bug", BugSchema)

const CommentSchema = new mongoose.Schema({
    comment: String,
    date: String,
    author: String,
    avatar: String,
})

export const CommentModel = mongoose.model("Comment", CommentSchema);

const ScheduleSchema = new mongoose.Schema({
    title: String,
    startDate: String,
    endDate: String,
})

export const ScheduleModel = mongoose.model("Schedule", ScheduleSchema);

// parent
const ProjectSchema = new mongoose.Schema({
    projectTitle: String,
    startDate: String,
    author: String,
    projectImage: String,
    projectLink: String,

    schedule: [ ScheduleModel],

    bugs: [{ type: BugSchema, ref: "bugs" }],

    comments: [{ type: CommentSchema, ref: "comments" }],
})

export const ProjectModel = mongoose.model("Project", ProjectSchema);
