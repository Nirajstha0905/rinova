import prisma from "../config/db.js";

export const logActivity = async  ({
    data,
    user_id,
    student_id = null,
    entity_type,
    entity_id,
    action,
    description,
}) => {
    try {

        await prisma.activity_logs.create({
            data:{
                user_id,
                student_id,
                entity_type,
                entity_id,
                action,
                description,
            },
        });

    }
    catch (error){
        console.error("Activity Log Error: ", error);
        
    }
};