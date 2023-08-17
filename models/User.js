import mongoose from 'mongoose';

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
    lastLogin: String,
})

export const UserModel = mongoose.model("User", UserSchema)