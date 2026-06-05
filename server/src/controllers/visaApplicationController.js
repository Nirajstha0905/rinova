import prisma from "../config/db.js";
import {logActivity} from "../utils/activityLogger.js";

export const getVisaApplications = async (req, res) => {
    try {
        const visas = await prisma.visa_applications.findMany({
            include: {
                students: true,
                applications: true,
            },
            orderBy: {
                created_at: "desc",
            },
        });
        res.status(200).json(visas);
    }
    catch (error){
        console.error(error);
        
        res.status(500).json({
            message: "Failed to fetch visa applications",
        });
    }
};

export const getVisaApplicationById = async (req,res) => {
  try {
    const visa =
      await prisma.visa_applications.findUnique({
        where: {
          id: req.params.id,
        },
        include: {
          students: true,
          applications: true,
        },
      });

    if (!visa) {
      return res.status(404).json({
        message: "Visa application not found",
      });
    }

    res.status(200).json(visa);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch visa application",
    });
  }
};

export const createVisaApplication = async (
  req,
  res
) => {
  try {
    const {
      student_id,
      application_id,
      visa_type,
      status,
      lodged_date,
      decision_date,
      remarks,
    } = req.body;

    if (!student_id) {
      return res.status(400).json({
        message: "student_id is required",
      });
    }

    const visa =
      await prisma.visa_applications.create({
        data: {
          student_id,
          application_id,
          visa_type,
          status,
          lodged_date: lodged_date
            ? new Date(lodged_date)
            : null,
          decision_date: decision_date
            ? new Date(decision_date)
            : null,
          remarks,
        },
      });

    await logActivity({
      user_id: req.user.id,
      student_id,
      entity_type: "visa_application",
      entity_id: visa.id,
      action: "create",
      description: `Visa application created`,
    });

    res.status(201).json(visa);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create visa application",
    });
  }
};

export const updateVisaApplication = async (
  req,
  res
) => {
  try {
    const visa =
      await prisma.visa_applications.update({
        where: {
          id: req.params.id,
        },
        data: req.body,
      });

    await logActivity({
      user_id: req.user.id,
      student_id: visa.student_id,
      entity_type: "visa_application",
      entity_id: visa.id,
      action: "update",
      description: `Visa application updated`,
    });

    res.status(200).json(visa);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({
        message: "Visa application not found",
      });
    }

    console.error(error);

    res.status(500).json({
      message: "Failed to update visa application",
    });
  }
};

export const deleteVisaApplication = async (
  req,
  res
) => {
  try {
    const visa =
      await prisma.visa_applications.delete({
        where: {
          id: req.params.id,
        },
      });

    await logActivity({
      user_id: req.user.id,
      student_id: visa.student_id,
      entity_type: "visa_application",
      entity_id: visa.id,
      action: "delete",
      description: `Visa application deleted`,
    });

    res.status(200).json({
      message: "Visa application deleted successfully",
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({
        message: "Visa application not found",
      });
    }

    console.error(error);

    res.status(500).json({
      message: "Failed to delete visa application",
    });
  }
};