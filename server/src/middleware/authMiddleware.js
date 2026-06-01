import jwt from 'jsonwebtoken';
import prisma from "../config/db.js";

export const protect = async (
    req,
    res,
    next
) => {
    try{
        let token;
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ){
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) {
            return res.status(401).json({
                message: "Not authorized, no token",
            });
        }
        const decoded = jwt.verify(
            token, 
            process.env.JWT_SECRET
        );
        req.user = await prisma.users.findUnique({
            where: {
                id: decoded.id
            },
            include: {
                roles: true,
            }
        });
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Not authorized, token failed",
        });
    }
}