import prisma from '../config/db.js';
export const getUsers = async (req, res) => {
    try {
        const users = await prisma.users.findMany({
            include:{
                roles: true,
            },
            orderBy:{
                created_at: 'desc',
            },
        });
        res.status(200).json(users);
    
    }
    catch (error){
        console.error(error);
        res.status(500).json({
            message: "Failed to fetch users",
        });
    }
}