import jwt from 'jsonwebtoken';

const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET;


export const generateAccessToken = (payload) => {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: '15m' }); 
};


export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: '7d' }); 
};


export const verifyAccessToken = (token) => {
    try {
      return jwt.verify(token, ACCESS_TOKEN_SECRET);
    } catch (err) {
      console.error('Access token verification failed:', err.message);
      return null;
    }
  };

   
  export const verifyRefreshToken = (token) => {
    try {
        return jwt.verify(token, REFRESH_TOKEN_SECRET);
    } catch (error) {
        console.error('Invalid refresh token:', error.message);
        return null;
    }
};