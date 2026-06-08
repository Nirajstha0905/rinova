import bcrypt from "bcrypt";
import prisma from "../config/db.js";
import {generateToken} from "../utils/generateToken.js";

const safeUser = (user) => {
    const { password_hash, ...publicUser } = user;
    return publicUser;
};

export const register = async (req, res) => {
    try {
        const {
            first_name,
            middle_name,
            last_name,
            email,
            password,
            role_id,
        } = req.body;

        const existingUser = await prisma.users.findUnique({
            where: {
                email,
            },
        });

        if(existingUser) {
            return res.status(400).json({
                message: "Email already in use",
            });
        }

        const password_hash = await bcrypt.hash(password, 10);

        const user = await prisma.users.create({
                data: {
                    first_name,
                    middle_name,
                    last_name,
                    email,
                    password_hash,
                    role_id,
                },
                include: {
                    roles: true,
                },
            });
        const token = generateToken(user);

            res.status(201).json({
                token,
                user: safeUser(user)});
        }  
        catch (error){
            console.error("Error creating user:", error);
            return res.status(500).json({
                message: "Error creating user",
            });
        }
};

export const login = async (req, res) => {
    try {
        const {email, password} = req.body;

        const user = await prisma.users.findUnique({
            where: {
                email,
            },
            include: {
                roles: true,
            },
        });
        if(!user) {
            return res.status(400).json({
                message: "Invalid credentials",
            });
        }
        const isMatch = await bcrypt.compare(
            password,
            user.password_hash
        );
        if(!isMatch) {
            return res.status(400).json({
                message: "Invalid credentials",
            });
        }
        const token = generateToken(user);
        res.status(200).json({ token, user: safeUser(user) });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({
            message: "Error during login",
        });
    }
}
