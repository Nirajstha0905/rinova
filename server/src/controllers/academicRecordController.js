import prisma from "../config/db.js";
import { logActivity } from "../utils/activityLogger.js";

export const getAcademicRecords = async (req, res) => {
    try {
        const records = await prisma.academic_records.findMany({
            include:{
                students: true,
            },
            orderBy:{
                created_at: "desc",
            },
        });

        res.status(200).json(records);

    }
    catch (error)
    {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch academic records",
        });
        
    }
};

export const getAcademicRecordById = async (req, res) => {
    try {
        const record = await prisma.academic_records.findUnique({
            where:{
                id: req.params.id,
            },
            inclde:{
                students: true,
            },
        });

        if(!record)
        {
            return res.status(404).json({
                message: "Academic record not found"
            });
        }

        res.status(200).json(record);
    } catch (error)
    {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch academic record",
        });
        
    }
};

export const createAcademicRecord = async (req, res)=> 
{
    try{
        const {
            student_id,
            qualification,
            institution_name,
            country,
            start_year,
            completion_year,
            grade,
        } = req.body;

        if(!student_id || !qualification)
        {
            return res.status(400).json({
                message: "Student_id and qualification required",
            });
        }

        const record = await prisma.academic_records.create({
            data:{
                student_id,
                qualification,
                institution_name,
                country,
                start_year,
                completion_year,
                grade,
            },
        });

        await logActivity({
            user_id: req.user_id,
            student_id,
            entity_id: "academic_record",
            entity_type: record.id,
            action: "create",
            description: `Academic record added`,
        });

        res.status(201).json(record);
    }
    catch(error){
        console.error(error);

        res.status(500).json({
            message: "Failed to create academic record",
        });
        
    }
};

export const updateAcademicRecord = async (req, res) => {
    try {
        const record = await prisma.academic_records.update({
            where:{
                id: req.params.id,
            },
            data: req.body,
        });
        console.log("Launching: ")
        await logActivity({
            user_id: req.user_id,
            student_id: record.student_id,
            entity_id: "academic_record",
            entity_id: record.id,
            action: "update",
            description: `Academic record updated`,
        });
        res.status(200).json(record);
    }
    catch (error){
        console.error(error);

        res.status(500).json({
            message: "Failed to update academic record",
        });
        
    }
};

export const deleteAcademicRecord = async (req, res) => {
  try {
    const record = await prisma.academic_records.delete({
      where: {
        id: req.params.id,
      },
    });

    await logActivity({
      user_id: req.user.id,
      student_id: record.student_id,
      entity_type: "academic_record",
      entity_id: record.id,
      action: "delete",
      description: `Academic record deleted`,
    });

    res.status(200).json({
      message: "Academic record deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete academic record",
    });
  }
};