import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import cookieParser from "cookie-parser";
import { UserModel } from "../models/User.js";
import { createTokens, validateUser } from "../JWT.js";

const router = express.Router();

export const createUser = async (req, res) => {
  const { username, password, role, userRole } = req.body;
  let token = req.headers.authorization;
  if(validateUser(token)){
    bcrypt.hash(password, 10).then((hash) => {
      UserModel.create({
        username: username,
        password: hash,
        role: userRole,
      })
      .then(() => {
        res.json("USER REGISTERED");
      })
      .catch((err) => {
        if (err) {
          res.status(400).json({ error: err });
        }
      });
    });
  } else {
    res.status(400).json('Invalid');
  }
};

export const loginUser = async (req, res) =>{
  const { username, password } = req.body;
  const currentDate = new Date();
  const user = await UserModel.findOneAndUpdate({username: username },{lastLogin: currentDate.toLocaleString('en-US', { timeZone: 'America/New_York' })});
  const accessToken = createTokens(user);
  const updateUser = await UserModel.findOneAndUpdate({ username: username }, {token: accessToken}, { new: true })
  if (!user) res.status(400).json({ error: "Wrong Username or Password!" });
  const userPassword = user.password;
  try {
    bcrypt.compare(password, userPassword).then((match) => {
      if (!match) {
        res
          .status(400)
          .json({ error: "Wrong Username or Password!" });
      } else {
        res.send(accessToken);
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// not tested \0/
export const updateUser = async (req, res) =>{
  const { username, password, newpassword} = req.body;
  const userPassword = user.password;
  bcrypt.compare(password, userPassword).then((match) => {
    if (!match) {
      res
        .status(400)
        .json({ error: "Wrong Username or Password!" });
    } else {
      UserModel.findOneAndUpdate({username: username },{password: newpassword});
      res.json("User Updated");
    }
  });
};