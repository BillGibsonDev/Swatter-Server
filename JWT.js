import jwt from 'jsonwebtoken';
const { sign, verify } = jwt;

export const createTokens = (user) => {
  const accessToken = sign(
    { 
      username: user.username, 
      id: user._id, 
    },
    `${process.env.NODE_ENV_JWT_SECRET}`,
    { expiresIn: '16h' }
  );
  return accessToken;
};

export const validateToken = (req, res) => {
  const { token } = req.body;
  try {
    const validToken = verify(token, `${process.env.NODE_ENV_JWT_SECRET}`);
    if(validToken) {
      res.status(200).json(validToken);
    } else {
      res.status(403).json('Token invalid');
    }
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return 'Token expired:', error.message;
    }
    res.status(403).json('Token invalid');
  }
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