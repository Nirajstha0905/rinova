import prisma from "../config/db.js";
import {logActivity} from "../utils/activityLogger.js";

export const getWorkExperiences = async (req, res)=> {
    try{
        const experiences = await prisma.work_experiences.findMany({
            include: {
                students: true,
            },
        });

        res.status(200).json(experiences);
    }
    catch(error){
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch work eperiences",
        });
    }
};

export const getWorkExperienceById = async (req, res)=> {
    try {
        const experience = await prisma.work_experiences.findUnique({
            where:{
                id: req.params.id,
            },
            include: {
                students: true,
            },
        });
        if(!experience){
            return res.status(404).json({
                message: "Work experience not found",
            });
        }

        res.status(200).json(experience);
    } catch(error){
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch work experience",
        })
        
    }
};

export const createWorkExperience = async (req, res)=> {
    try {
        const {
            student_id,
            company_name,
            position,
            start_date,
            end_date,
            responsibilities,
        } = req.body;

        if(!student_id || !company_name){
            return res.status(400).json({
                message: "student_id and company_name are required",
            });
        }
        const experience = await prisma.work_experiences.create({
            data: {
                student_id,
                company_name,
                position,
                start_date: start_date ? new Date(start_date): null,
                end_date: end_date ? new Date(end_date) : null,
                responsibilities,
            },
        });
        await logActivity({
            user_id: req.user.id,
            student_id,
            entity_type: "Work_experience",
            entity_id: experience.id,
            action: "create",
            description: `${company_name} work experience added`,
        });
        res.status(201).json(experience);
    }
    catch(error){
        console.error(error);

        res.status(500).json({
            message:"Failed to create work experience",
        });
    }
};

export const updateWorkExperience = async (req, res)=> {
    try {
        const experience = await prisma.work_experiences.update({
            where:{
                id: req.params.id,
            },
            data: req.body,
        });

            await logActivity({
                user_id: req.user.id,
                student_id: experience.student_id,
                entity_type: "work_experience",
                entity_id: experience.id,
                action: "update",
                description: `${experience.company_name} work experience updated`,
    });
    res.status(200).json(experience);
    }
    catch (error){
        if(error.code === "P2025"){
            return res.status(404).json({
                message: "Work experience not found",
            });
        }
        console.error(error);

        res.status(500).json({
            message: "Failed to update work experience",
        });
        
    }
};

export const deleteWorkExperience = async (req, res) => {
    try{
        const experience = await prisma.work_experiences.delete({
            where: {
                id: req.params.id,
            },
        });
            await logActivity({
                user_id: req.user.id,
                student_id: experience.student_id,
                entity_type: "work_experience",
                entity_id: experience.id,
                action: "delete",
                description: `${experience.company_name} work experience deleted`,
    });

    res.status(200).json({
        message: "Work experience deleted successfully",
    });
    } catch(error){
        if(error.code === "P2025"){
            return res.status(404).json({
                message:"Work experience not found.",
            });
        }
        console.error(error);
        res.status(500).json({
            message: "Failed to delete work experience",
        });
        
    }
};