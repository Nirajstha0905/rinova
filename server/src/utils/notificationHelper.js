import prisma from "../config/db.js";

export const createNotification = async ({
    user_id,
    title,
    message,
}) => {
    try{
        await prisma.notifications.create({
            data: {
                user_id,
                title,
                message,
            },
        });
    }
    catch(error){
        console.error("Notificatio error: ", error);
        
    }
};