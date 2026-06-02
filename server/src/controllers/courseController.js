import prisma from '../config/db.js';

export const getCourses = async (req, res)=> {
    try {
        const courses = await prisma.courses.findMany({
            include: {
                institutions: true,
            },
            orderBy:{
                created_at: "desc",
            },
        });

        res.status(200).json(courses);
    }
    catch (error)
    {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch courses",
        });
    }
};

export const getCourseById = async (req, res) => {
    try {
        const course = await prisma.courses.findUnique({
            where: {
                id: req.params.id,
            },
            include: {
                institutions: true,
            },
        });

        if(!course){
            return res.status(404).json({
                message: "Course not found",
            });
        }

        res.status(200).json(course);
    }
    catch (error)
    {
        console.error(error);

        res.status(500).json ({
            message: "Failed to fetch course",
        });
    }
};

export const createCourse = async (req, res) => {
    try {
        const {
            institution_id,
            name,
            level,
            duration,
            tuition_fee,
            requirements,
        } = req.body;
        console.log(req.body);
        if(!institution_id || !name){
            return res.status(400).json({
                message: "Institution and course name are required",
            });
        }
        const course = await prisma.courses.create({
            data: {
                institution_id,
                name,
                level,
                duration,
                tuition_fee,
                requirements,
            },
        });
        res.status(201).json(course);
    }
    catch (error){
        console.error(error);

        res.status(500).json({
            message: "Failed to create course",
        });
    }
};

export const updateCourse = async (req,res) => {
    try {
        const course = await prisma.courses.update({
            where:{
                id: req.params.id,
            },
            data: req.body,
        });

        res.status(200).json(course);
    }
    catch (error){
        if (error.code === "P2025"){
            return res.status(404).json({
                message: "Course not found",
            });
        }
        console.error(error);

        res.status(500).json({
            message: "Failed to update course",
        });
    }
};

export const deleteCourse = async (req, res) => {
  try {
    await prisma.courses.delete({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).json({
      message: "Course deleted successfully",
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    console.error(error);

    res.status(500).json({
      message: "Failed to delete course",
    });
  }
};