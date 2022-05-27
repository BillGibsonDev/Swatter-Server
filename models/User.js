import mongoose from 'mongoose';

// parent
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        allowNull: false,
        unique: true,
    },
    avatar: {
        type: String,
    },
    password: {
        type: String,
        allowNull: false,
    },
    role: {
        type: String,
    },
    lastLogin: {
        type: String,
    }
})

export const UserModel = mongoose.model("User", UserSchema)