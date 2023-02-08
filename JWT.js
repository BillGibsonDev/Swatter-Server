import pkg from 'jsonwebtoken';
const { sign, verify } = pkg;

export const createTokens = (user) => {
  const accessToken = sign(
    { 
      username: user.username, 
      id: user._id, 
      role: user.role 
    },
    `${process.env.NODE_ENV_JWT_SECRET}`,
    { expiresIn: '16h' }
  );
  return accessToken;
};

export const validateToken = (req, res, next) => {
  const { token } = req.body;
  try {
    const validToken = verify(token, `${process.env.NODE_ENV_JWT_SECRET}`);
    if (validToken) {
      req.authenticated = true;
      res.json(`${validToken.role}`);
      return next();
    } else {
      res.json('Token Not Valid');
    }
  } catch (err) {
    console.log(err);
    res.json('Token Not Valid');
  }
};

export const validateUser = ( token ) => {
  const validToken = verify(token, `${process.env.NODE_ENV_JWT_SECRET}`);
  if(validToken.role === process.env.NODE_ENV_ADMIN_SECRET ){
    return true;
  } else if (validToken.role === process.env.NODE_ENV_USER_SECRET) {
    return true;
  } else {
    return false;
  }
}

export const validateAdmin = ( token ) => {
  const validToken = verify(token, `${process.env.NODE_ENV_JWT_SECRET}`);
  if(validToken.role === process.env.NODE_ENV_ADMIN_SECRET ){
    return true;
  } else {
    return false;
  }
}