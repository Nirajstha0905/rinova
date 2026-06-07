import { access } from "node:fs";
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
        const formatted = activities.map(
            activity => ({
                id: activity.id,
                action: activity.action,
                entity_type: activity.entity_type,
                description: activity.description,
                created_at: activity.created_at,
                user: `${activity.users?.first_name || ""} ${activity.users?.middle_name || ""}  ${activity.users?.last_name || ""}`.trim(),
            })
        )

    res.status(200).json(formatted);
    }
    catch (error){
            console.error(error);

            res.status(500).json({
                message: " Failed to fetch activities",
            });   
    }
};

export const getRecentActivity = async (req, res)=> {
    try {
        const activities = await prisma.activity_logs.findMany({
            take: 20,
            orderBy:{
                created_at: "desc",
            },
            include:{
                users:{
                    select:{
                        first_name: true,
                        middle_name: true,
                        last_name: true,
                    }
                }
            }
        });
                const formatted = activities.map(
            activity => ({
                id: activity.id,
                action: activity.action,
                entity_type: activity.entity_type,
                description: activity.description,
                created_at: activity.created_at,
                user: `${activity.users?.first_name || ""} ${activity.users?.middle_name || ""}  ${activity.users?.last_name || ""}`.trim(),
            })
        )
        res.status(200).json(formatted);
    }
    catch (error){
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch recent activity",
        });
    }
};