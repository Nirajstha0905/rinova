import prisma from "../config/db.js";

import { logActivity } from "../utils/activityLogger.js";

export const getStudent = async (req, res) => {
  try {
    const students = await prisma.students.findMany({
      where: {
        deleted_at: null,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    res.status(200).json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error, Failed to fetch students" });
  }
};

export const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await prisma.students.findUnique({
      where: {
        id: id,
      },
    });

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    res.status(200).json(student);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch student",
    });
  }
};

export const createStudent = async (req, res) => {
  try {
    const {
      first_name,
      middle_name,
      last_name,
      email,
      phone,
      date_of_birth,
      address,
      gender,
      nationality,
      passport_number,
      passport_expiry,
      preferred_country,
      preferred_course,
      status,
    } = req.body;
    if (!first_name || !last_name || !email) {
      return res.status(400).json({
        message: "First name, last name and email are required",
      });
    }
    const student = await prisma.students.create({
      data: {
        first_name,
        middle_name,
        last_name,
        email,
        phone,
        date_of_birth : req.body.date_of_birth 
        ? new Date(req.body.date_of_birth)
        : null,
        address,
        gender,
        nationality,
        passport_number,
        passport_expiry,
        preferred_country,
        preferred_course,
        status,
      },
    });

    //------Activity Logger -----------------//
    await logActivity({
  user_id: req.user?.id,
  student_id: student.id,
  entity_type: "student",
  entity_id: student.id,
  action: "create",
  description: `Student ${student.first_name} ${student.last_name} created`,
});
    return res.status(201).json(student);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create student",
    });
  }
};

export const updateStudent = async (req, res) => {
  try {
    const data = {...req.body};
    if(data.date_of_birth){
      data.date_of_birth = new Date(data.date_of_birth);
    }
    const student = await prisma.students.update({
      where: {
        id: req.params.id,
      },
      data: req.body,
    });

    //--------------Activity Logger--------------//
    await logActivity({
  user_id: req.user?.id,
  student_id: student.id,
  entity_type: "student",
  entity_id: student.id,
  action: "update",
  description: `Student ${student.first_name} ${student.last_name} updated`,
});


    res.status(200).json(student);
  } catch (error) {
        if (error.code === "P2025") {
      return res.status(404).json({
        message: "Student not found",
      });
    }
    console.error(error);

    res.status(500).json({
      message: "Failed to update student",
    });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await prisma.students.update({
      where: {
        id: req.params.id,
      },
      data: {
        deleted_at: new Date(),
      },
    });
    //--------------ACTIVITY LOGGER----------//
      await logActivity({
  user_id: req.user?.id,
  student_id: student.id,
  entity_type: "student",
  entity_id: student.id,
  action: "delete",
  description: `Student ${student.first_name} ${student.last_name} archived`,
});
    res.status(200).json({
      message: "Student deleted successfully",
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    console.error(error);

    res.status(500).json({
      message: "Failed to delete student",
    });
  }
};
