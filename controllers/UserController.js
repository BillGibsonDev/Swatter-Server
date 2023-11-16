import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import cookieParser from "cookie-parser";
import { UserModel } from "../models/User.js";
import { createTokens, validateUser } from "../JWT.js";
import { ProjectModel } from '../models/Project.js';

export const getUser = async ( req, res ) => {
  const { userId } = req.params;

  const token = req.headers.authorization;
  const user = await validateUser(token);

  if (!user) { return res.status(401).json('No Valid Token Provided.')};
  
  try {
    const userData = await UserModel.findById(userId);
    if(!userData){ return res.status(400).json('User Does Not Exist.')};
    if(user.id !== userId){ return res.status(400).json("Information doesn't match")};

    const usersData = { 
      username: userData.username,
      email: userData.email,
      lastLogin: userData.lastLogin,
      created: userData.created,
      avatar: userData.avatar
    };

    res.status(200).json(usersData);
  } catch (error) {
    res.status(400).json(error.message);
  }
}

export const createUser = async (req, res) => {
  const { username, password, email, avatar } = req.body;
  const regexUsername = new RegExp(username, "i");
  const regexEmail = new RegExp(email, "i");
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const usernameCheck = await UserModel.findOne({ username: { $regex: regexUsername } });
    const emailCheck = await UserModel.findOne({ email: { $regex: regexEmail } });
    
    if(usernameCheck){ return res.status(400).json('Username already exists')};
    if(emailCheck){ return res.status(400).json('Email already in use')};

    await UserModel.create({
      username,
      password: hashedPassword,
      email,
      created: new Date(),
      avatar: avatar ? avatar : 'https://i.ibb.co/DzktvF7/avatar-1577909-640.png',
    });

    res.status(200).json('Account created');
  } catch (error) {
    res.status(400).json(error.message);
  }
}

export const loginUser = async (req, res) =>{
  const { username, password } = req.body;

  const regexUsername = new RegExp(username, "i");
  const currentDate = new Date();

  try {
    const user = await UserModel.findOne({ username: { $regex: regexUsername } });
    if(!user){ return res.status(400).json('Username is incorrect')};
    
    const match = await bcrypt.compare(password, user.password);
    if(!match){ return res.status(400).json('Password is Incorrect. Try Again')};
    
    const accessToken = createTokens(user);
    
    await UserModel.findOneAndUpdate(
      { username: { $regex: regexUsername } }, 
      { 
        token: accessToken, 
        lastLogin: currentDate 
      }
    );

    res.status(200).json({token: accessToken, id: user._id, username: user.username, avatar: user.avatar });
  } catch (error) {
    res.status(400).json(error.message);
  }
}

export const updateUserPassword = async (req, res) =>{
  const { username, password, newpassword } = req.body;

  const regexUsername = new RegExp(username, "i");
  const token = req.headers.authorization;
  const user = await validateUser(token);

  if (!user) { return res.status(401).json('No Valid Token Provided.')};

  try {
    const userData = await UserModel.findOne({ username: { $regex: regexUsername } });
    if(!userData){ return res.status(400).json('User Does Not Exist.')};
    
    const match = await bcrypt.compare(password, userData.password);
    if(!match){ return res.status(400).json('Password is Incorrect. Try Again')};

    if (user.username === 'Guest') { return res.status(401).json('Nice Try.' )};

    const hashedPassword = await bcrypt.hash(newpassword, 10);

    userData.password = hashedPassword;

    await userData.save();

    res.status(200).json('Password updated');
  }
  catch(error){
    res.status(400).json(error.message);
  }
};

export const updateUserAvatar = async (req, res) =>{
  const { avatar } = req.body;

  const token = req.headers.authorization;
  const user = await validateUser(token);

  if (!user) { return res.status(401).json('No Valid Token Provided.')};

  try {
    const userData = await UserModel.findOne({ username: user.username });
    if(!userData){ return res.status(400).json('User Does Not Exist.')};

    if (user.username === 'Guest') { return res.status(401).json('Nice Try.' )};

    userData.avatar = avatar;

    await userData.save();

    const usersData = { 
      username: userData.username,
      email: userData.email,
      lastLogin: userData.lastLogin,
      created: userData.created,
      avatar: avatar
    };

    res.status(200).json(usersData);
  }
  catch(error){
    res.status(400).json(error.message);
  }
};

export const updateUserEmail = async (req, res) =>{
  const { username, password, newEmail } = req.body;

  const regexUsername = new RegExp(username, "i");
  const token = req.headers.authorization;
  const user = await validateUser(token);

  if (!user) { return res.status(400).json('No Valid Token Provided.' )};

  try {
    const userData = await UserModel.findOne({ username: { $regex: regexUsername } });
    if(!userData){ return res.status(400).json('User Does Not Exist.')};
    
    const match = await bcrypt.compare(password, userData.password);
    if(!match){ return res.status(400).json('Password is Incorrect. Try Again.')};

    if (user.username === 'Guest') { return res.status(401).json('Nice Try.')};

    userData.email = newEmail;

    await userData.save();

    const usersData = { 
      username: userData.username,
      email: newEmail,
      lastLogin: userData.lastLogin,
      created: userData.created,
      avatar: userData.avatar
    };

    res.status(200).json(usersData);
  }
  catch(error){
    res.status(400).json(error.message);
  }
};

export const updateUsername = async (req, res) =>{
  const { username, password, newUsername } = req.body;

  const regexUsername = new RegExp(username, "i");

  const token = req.headers.authorization;
  const user = await validateUser(token);

  if (!user) { return res.status(401).json('No Valid Token Provided.')};

  try {
    const userData = await UserModel.findOne({ username: { $regex: regexUsername }});
    if(!userData){ return res.status(400).json('User Does Not Exist.')};
    
    const match = await bcrypt.compare(password, userData.password);
    if(!match){ return res.status(400).json('Password is Incorrect. Try Again.')};

    if (user.username === 'Guest') { return res.status(401).json('Nice Try.' )};

    userData.username = newUsername;

    await userData.save();

    const usersData = { 
      username: newUsername,
      email: userData.email,
      lastLogin: userData.lastLogin,
      created: userData.created,
      avatar: userData.avatar
    };

    res.status(200).json(usersData);
  }
  catch(error){
    res.status(400).json(error.message);
  }
};

export const deleteAccount = async (req, res) =>{
  const { username, password} = req.body;

  const regexUsername = new RegExp(username, "i");
  const token = req.headers.authorization;
  const user = await validateUser(token);

  if (!user) { return res.status(401).json('No Valid Token Provided.')};

  try {
    const userData = await UserModel.findOne({ username: { $regex: regexUsername } });
    if(!userData){ return res.status(400).json('User Does Not Exist.')};
    
    const match = await bcrypt.compare(password, userData.password);
    if(!match){ return res.status(400).json('Password is Incorrect. Try Again')};

    if (user.username === 'Guest') { return res.status(401).json('Nice Try.')};

    await UserModel.findOneAndDelete({ username: { $regex: regexUsername } });
    await ProjectModel.deleteMany({ ownerId: user.id });

    res.status(200).json('Account Deleted.');
  }
  catch(error){
    res.status(400).json(error.message);
  }
};