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

const MemberSchema = new mongoose.Schema({
    userId: { type: String, unique: true },
})

const ActivitySchema = new mongoose.Schema({
    activity: String, 
    date: String,
    user: String,
})

// parent
const ProjectSchema = new mongoose.Schema({
    owner: String,
    title: String,
    startDate: String,   
    lastUpdate: String,
    lead: String,
    image: String,
    link: String,
    type: String,
    description: String,
    key: String,
    repository: String,
    members: [{ type: MemberSchema, ref: "members" }],
    bugs: [{ type: BugSchema, ref: "bugs" }],
    comments: [{ type: CommentSchema, ref: "comments" }],
    sprints: [{type: SprintSchema, ref: "sprints"}],
    activity: [{ type: ActivitySchema, ref: "activities"}]
})

export const ProjectModel = mongoose.model("Project", ProjectSchema);
