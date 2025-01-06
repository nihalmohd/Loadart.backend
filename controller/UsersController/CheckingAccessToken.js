import { generateAccessToken, verifyRefreshToken } from "../../Utils/JwtGenerator.js";


export const Refresh = (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json({ error: 'Refresh token missing' });

    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) return res.status(403).json({ error: 'Invalid refresh token' });

    const userPayload = { id: decoded.id, username: decoded.username };
    const newAccessToken = generateAccessToken(userPayload);

    res.cookie('accessToken', newAccessToken, {
        httpOnly: true,
        secure: false, 
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000, 
    });

    res.status(200).json({ message: 'Token refreshed' });
};