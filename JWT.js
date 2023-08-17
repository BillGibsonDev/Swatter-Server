import pkg from 'jsonwebtoken';
const { sign, verify } = pkg;

export const createTokens = (user) => {
  const accessToken = sign(
    { 
      username: user.username, 
      id: user._id, 
    },
    `${process.env.NODE_ENV_JWT_SECRET}`,
    { expiresIn: '12h' }
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
  } catch (err) {
    console.log(err);
    res.status(403).json('Token invalid');
  }
};

export const validateUser = ( token ) => {
  const validToken = verify(token, `${process.env.NODE_ENV_JWT_SECRET}`);
  if(validToken){
    return validToken;
  } else {
    return false;
  }
}