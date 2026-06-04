import prisma from "../config/db.js";
import {logActivity} from "../utils/activityLogger.js";

export const getTestScores = async (req, res)=> {
    try {
        const score = await prisma.english_test_scores.findMany({
            include:{
                students: true,
            },
            orderBy: {
                created_at: "desc",
            },
        });

        res.status(200).json(score);
    }
    catch(error){
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch test scores",
        });
        
    }
};

export const getTestScoreById = async (req, res)=> {
    try {
        const score = await prisma.english_test_scores.findUnique({
            where:{
                id: req.params.id,
            },
            include:{
                students: true,
            },
        });
        if(!score){
            return res.status(404).json({
                message: "Test score not found",
            });
        }
        res.status(200).json(score);
    }
    catch (error){
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch test score",
        });
        
    }
};

export const createTestScore = async (req, res)=> {
    try {
        const {
            student_id,
            exam_type,
            overall_score,
            listening,
            reading,
            writing,
            speaking,
            exam_date,
        } = req.body;

        if(!student_id || !exam_type)
        {
            return res.status(400).json({
                message: "student_id and exam_type are required",
                
                
            });
        }

        const score = await prisma.english_test_scores.create({
            data: {
                student_id,
                exam_type,
                overall_score,
                listening,
                reading,
                writing,
                speaking,
                exam_date : exam_date ? new Date(exam_date): null,
            },
        });

        await logActivity({
            user_id: req.user.id,
            student_id,
            entity_type: "english_test_score",
            entity_id: score.id,
            action:"create",
            description: `${exam_type} score added`,
        });
        res.status(201).json(score);
    }
    catch (error){
        console.error(error);
        
        res.status(500).json({
            message: "Failed to create test score",
        });
    }
};

export const updateTestScore = async (req, res) => {
    try{
        const score = await prisma.english_test_scores.update({
            where:{
                id: req.params.id,
            },
            data: req.body,
        });
        await logActivity({
            user_id: req.user.id,
            student_id: score.student_id,
            entity_type: "english_test_score",
            entity_id: score.id,
            action:"update",
            description: `${score.exam_type} score updated`,
        });

        res.status(200).json(score);
    }
    catch(error){
        if(error.code === "P2025") {
            return res.status(404).json({
                message: "Test score not found",
            });
        }
        console.error(error);

        res.status(500).json({
            message: "Failed to update test score",
        });
        
    }
};

export const deleteTestScore = async (req, res)=> {
    try {
        const score = await prisma.english_test_scores.delete({
            where:{
                id: req.params.id,
            },
        });

        await logActivity({
            user_id: req.user.id,
            student_id: score.student_id,
            entity_type: "english_test_score",
            entity_id: score.id,
            action: "delete",
            description: `${score.exam_type} score deleted`,
        });

        res.status(200).json({
            message: "Test score deleted successfully",
        });
    }
    catch (error){
        if(error.code === "P2025"){
            return res.status(404).json({
                message: "Test score not found",
            });
        }
        console.error(error);

        res.status(500).json({
            message: "Failed to delete test score",
        });
        
    }
};


