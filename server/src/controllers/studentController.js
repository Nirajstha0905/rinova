import prisma from "../config/db.js";

import { logActivity } from "../utils/activityLogger.js";
import { createNotification } from "../utils/notificationHelper.js";

const toNullableDate = (value) => {
  if (!value) return null;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};
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
        first_name: first_name.trim(),
        middle_name: middle_name || null,
        last_name: last_name.trim(),
        email: email.trim(),
        phone: phone || null,
        date_of_birth: toNullableDate(date_of_birth),
        address: address || null,
        gender: gender || null,
        nationality: nationality || null,
        passport_number: passport_number || null,
        passport_expiry: toNullableDate(passport_expiry),
        preferred_country: preferred_country || null,
        preferred_course: preferred_course || null,
        status: status || "pending",
      },
    });

    await Promise.allSettled([
      logActivity({
        user_id: req.user?.id,
        student_id: student.id,
        entity_type: "student",
        entity_id: student.id,
        action: "create",
        description: `Student ${student.first_name} ${student.last_name} created`,
      }),
      createNotification({
        user_id: req.user?.id,
        title: "Student Added",
        message: `${student.first_name} ${student.last_name} added successfully`,
      }),
    ]);

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

