import prisma from "../config/db.js";

export const getActivities = async (req, res) => {
    try {
        const activities = await prisma.activity_logs.findMany({
            include:{
                users:{
                    select: {
                        id: true,
                        first_name: true,
                        last_name: true,
                    },
                },
            },
            orderBy: {
                created_at: "desc",
            },
            take: 100,
        });

    res.status(200).json(activities);
    }
    catch (error){
            console.error(error);

            res.status(500).json({
                message: " Failed to fetch activities",
            });   
    }
};