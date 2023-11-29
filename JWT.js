import jwt from 'jsonwebtoken';
import { UserModel } from './models/User.js';
const { sign, verify } = jwt;

export const createTokens = (user) => {
  const accessToken = sign(
    { 
      username: user.username, 
      id: user._id, 
      avatar: user.avatar
    },
    `${process.env.NODE_ENV_JWT_SECRET}`,
    { expiresIn: '4h' }
  );
  return accessToken;
};

export const validateUser = (token) => {
  try {
    const validToken = jwt.verify(token, process.env.NODE_ENV_JWT_SECRET);
    return validToken;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return false;
    }
    console.log('Token invalid:', error.message);
    return false;
  }
};

export const validateToken = async (req, res) => {
  const { userId } = req.params;

  const tokenAuth = req.headers.authorization;

  try {
    const validToken = jwt.verify(tokenAuth, process.env.NODE_ENV_JWT_SECRET);
    if (!validToken) { return res.status(400).json('No Valid Token Provided.'); };

    const userData = await UserModel.findById(validToken.id);
    if(!userData){ return res.status(400).json('User Does Not Exist.')};
    
    if (userData.token !== tokenAuth) { return res.status(400).json({ error: 'Token is Not Valid.' }); };

    const token = createTokens(userData);
    userData.token = token;

    await userData.save();

    res.status(200).json({ token: token, id: userData._id, username: userData.username });

  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return 'Token expired:', error.message;
    }
    console.log(error)
    res.status(403).json({ error: 'Token Invalid.'});
  }
};