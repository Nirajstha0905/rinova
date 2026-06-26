import prisma from "../config/db.js";
import { logActivity } from "../utils/activityLogger.js";

const parseDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const parseYear = (value) => {
  if (value === undefined || value === null || value === "") return null;
  const year = Number.parseInt(value, 10);
  return Number.isNaN(year) ? null : year;
};

const buildRecordData = (body = {}) => ({
  student_id: body.student_id ?? null,
  document_id: body.document_id ?? null,
  level: body.level ?? null,
  qualification: body.qualification ?? null,
  school_name: body.school_name ?? null,
  college_name: body.college_name ?? null,
  university_name: body.university_name ?? null,
  affiliated_college: body.affiliated_college ?? null,
  institution_name: body.institution_name ?? null,
  country: body.country ?? null,
  stream_faculty: body.stream_faculty ?? null,
  board_university: body.board_university ?? null,
  degree_program: body.degree_program ?? null,
  major_specialization: body.major_specialization ?? null,
  major_subjects: body.major_subjects ?? null,
  thesis_title: body.thesis_title ?? null,
  semester_wise_gpa: body.semester_wise_gpa ?? null,
  final_cgpa_percentage: body.final_cgpa_percentage ?? null,
  gpa_percentage: body.gpa_percentage ?? null,
  division_grade: body.division_grade ?? null,
  start_year: parseYear(body.start_year),
  completion_year: parseYear(body.completion_year),
  enrollment_date: parseDate(body.enrollment_date),
  graduation_date: parseDate(body.graduation_date),
  grade: body.grade ?? null,
});

export const getAcademicRecords = async (req, res) => {
    try {
        const records = await prisma.academic_records.findMany({
            include:{
                students: true,
                documents: true,
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
            include:{
                students: true,
                documents: true,
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
        const data = buildRecordData(req.body);
        const { student_id, qualification } = data;

        if(!student_id || !qualification)
        {
            return res.status(400).json({
                message: "Student_id and qualification required",
            });
        }

        const record = await prisma.academic_records.create({
            data,
        });

        await logActivity({
            user_id: req.user?.id,
            student_id,
            entity_type: "academic_record",
            entity_id: record.id,
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
            data: buildRecordData(req.body),
        });
        await logActivity({
            user_id: req.user?.id,
            student_id: record.student_id,
            entity_type: "academic_record",
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
