import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import cookieParser from "cookie-parser";
import { UserModel } from "../models/User.js";
import { createTokens, validateUser } from "../JWT.js";

export const createUser = async (req, res) => {
  const { username, password, email  } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const usernameCheck = await UserModel.findOne(username);
    const emailCheck = await UserModel.findOne(email);
    if(usernameCheck){ return res.json('Username already exists')};
    if(emailCheck){ return res.json('Email already in use')};

    await UserModel.create({
      username,
      password: hashedPassword,
      email
    });

    res.status(201).json('USER REGISTERED');
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export const loginUser = async (req, res) =>{
  const { username, password } = req.body;

  const currentDate = new Date();

  try {
    const user = await UserModel.findOne({username: username});
    if(!user){ return res.status(400).json('User does not exist')};
    
    const match = await bcrypt.compare(password, user.password);
    if(!match){ return res.status(400).json('User does not exist')};
    
    const accessToken = createTokens(user);
    
    await UserModel.findOneAndUpdate(
      { username: username}, 
      { 
        token: accessToken, 
        lastLogin: currentDate 
      }
    );

    res.send(accessToken);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// not tested \0/
export const updateUserPassword = async (req, res) =>{
  const { username, password, newpassword } = req.body;

  const token = req.headers.authorization;
  const user = validateUser(token);
  if (!user) { return res.status(400).json('Invalid'); };

  try {
    const userData = await UserModel.findOne({ username: username });
    if(!userData){ return res.status(400).json('User does not exist')};
    
    const match = await bcrypt.compare(password, userData.password);
    if(!match){ return res.status(400).json('Wrong username or password')};

    const hashedPassword = await bcrypt.hash(newpassword, 10);

    userData.password = hashedPassword;

    await userData.save();

    res.status(200).json('User updated');
  }
  catch(error){
    res.status(400).json({ message: error.message });
  }
};

export const updateUserEmail = async (req, res) =>{
  const { username, password, email } = req.body;

  const token = req.headers.authorization;
  const user = validateUser(token);
  if (!user) { return res.status(400).json('Invalid'); };

  try {
    const userData = await UserModel.findOne({ username: username });
    if(!userData){ return res.status(400).json('User does not exist')};
    
    const match = await bcrypt.compare(password, userData.password);
    if(!match){ return res.status(400).json('Wrong username or password')};

    userData.email = email;

    await userData.save();

    res.status(200).json('User updated');
  }
  catch(error){
    res.status(400).json({ message: error.message });
  }
};