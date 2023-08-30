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

  if (!user) { return res.status(400).json('No valid token providied'); };
  
  try {
    const userData = await UserModel.findById(userId);
    if(!userData){ return res.status(400).json('User does not exist')};
    if(user.id !== userId){ return res.status(400).json("Information doesn't match")};

    let usersData = { 
      username: userData.username,
      email: userData.email,
      lastLogin: userData.lastLogin,
      created: userData.created,
    };

    res.status(200).json(usersData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export const createUser = async (req, res) => {
  const { username, password, email } = req.body;
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
    });

    res.status(200).json('Account created');
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export const loginUser = async (req, res) =>{
  const { username, password } = req.body;

  const currentDate = new Date();

  try {
    const user = await UserModel.findOne({ username: username });
    if(!user){ return res.status(400).json('Username is incorrect')};
    
    const match = await bcrypt.compare(password, user.password);
    if(!match){ return res.status(400).json('Password is incorrect')};
    
    const accessToken = createTokens(user);
    
    await UserModel.findOneAndUpdate(
      { username: username }, 
      { 
        token: accessToken, 
        lastLogin: currentDate 
      }
    );

    res.status(200).json({token: accessToken, id: user._id, username: user.username });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export const updateUserPassword = async (req, res) =>{
  const { username, password, newpassword } = req.body;

  const token = req.headers.authorization;
  const user = await validateUser(token);

  if (!user) { return res.status(400).json('No valid token providied'); };

  try {
    const userData = await UserModel.findOne({ username: username });
    if(!userData){ return res.status(400).json('User does not exist')};
    
    const match = await bcrypt.compare(password, userData.password);
    if(!match){ return res.status(400).json('Wrong username or password')};

    const hashedPassword = await bcrypt.hash(newpassword, 10);

    userData.password = hashedPassword;

    await userData.save();

    res.status(200).json('Password updated');
  }
  catch(error){
    res.status(400).json({ message: error.message });
  }
};

export const updateUserEmail = async (req, res) =>{
  const { username, password, newEmail } = req.body;

  const token = req.headers.authorization;
  const user = await validateUser(token);

  if (!user) { return res.status(400).json('No valid token providied'); };

  try {
    const userData = await UserModel.findOne({ username: username });
    if(!userData){ return res.status(400).json('User does not exist')};
    
    const match = await bcrypt.compare(password, userData.password);
    if(!match){ return res.status(400).json('Wrong username or password')};

    userData.email = newEmail;

    await userData.save();

    res.status(200).json('Email updated');
  }
  catch(error){
    res.status(400).json({ message: error.message });
  }
};

export const updateUsername = async (req, res) =>{
  const { username, password, newUsername } = req.body;

  const regexUsername = new RegExp(username, "i");

  const token = req.headers.authorization;
  const user = await validateUser(token);

  if (!user) { return res.status(400).json('No valid token providied'); };

  try {
    const userData = await UserModel.findOne({ username: { $regex: regexUsername }});
    if(!userData){ return res.status(400).json('User does not exist')};
    
    const match = await bcrypt.compare(password, userData.password);
    if(!match){ return res.status(400).json('Wrong username or password')};

    userData.username = newUsername;

    await userData.save();

    res.status(200).json('User updated');
  }
  catch(error){
    res.status(400).json({ message: error.message });
  }
};

export const deleteAccount = async (req, res) =>{
  const { username, password} = req.body;

  const token = req.headers.authorization;
  const user = await validateUser(token);

  if (!user) { return res.status(400).json('No valid token providied'); };

  try {
    const userData = await UserModel.findOne({ username: username });
    if(!userData){ return res.status(400).json('User does not exist')};
    
    const match = await bcrypt.compare(password, userData.password);
    if(!match){ return res.status(400).json('Wrong username or password')};

    await UserModel.findOneAndDelete({ username: username });
    await ProjectModel.deleteMany({ ownerId: user.id });

    res.status(200).json('Account Deleted');
  }
  catch(error){
    res.status(400).json({ message: error.message });
  }
};