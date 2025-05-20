import { verifyAccessToken } from '../Utils/JwtGenerator.js';

export const authenticateToken = (req, res, next) => {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
        return res.status(401).json({ error: 'Access token is missing' });
    }

    const decoded = verifyAccessToken(accessToken);
    if (!decoded) {
        return res.status(403).json({ error: 'Invalid or expired access token' });
    }

    // req.user = decoded; 
    next(); 
};