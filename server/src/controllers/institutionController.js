import prisma from "../config/db.js";

export const getInstitutions = async (req, res) => {
  try {
    const institutions = await prisma.institutions.findMany({
      orderBy: {
        created_at: "desc",
      },
    });

    res.status(200).json(institutions);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch institutions",
    });
  }
};

export const getInstitutionById = async (req, res) => {
  try {
    const institution = await prisma.institutions.findUnique({
      where: {
        id: req.params.id,
      },
    });

    if (!institution) {
      return res.status(404).json({
        message: "Institution not found",
      });
    }

    res.status(200).json(institution);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch institution",
    });
  }
};

export const createInstitution = async (req, res) => {
  try {
    const {
      name,
      country,
      city,
      ranking,
      website,
    } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Institution name is required",
      });
    }

    const institution = await prisma.institutions.create({
      data: {
        name,
        country,
        city,
        ranking,
        website,
      },
    });

    res.status(201).json(institution);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create institution",
    });
  }
};

export const updateInstitution = async (req, res) => {
  try {
    const institution = await prisma.institutions.update({
      where: {
        id: req.params.id,
      },
      data: req.body,
    });

    res.status(200).json(institution);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({
        message: "Institution not found",
      });
    }

    console.error(error);

    res.status(500).json({
      message: "Failed to update institution",
    });
  }
};

export const deleteInstitution = async (req, res) => {
  try {
    await prisma.institutions.delete({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).json({
      message: "Institution deleted successfully",
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({
        message: "Institution not found",
      });
    }

    console.error(error);

    res.status(500).json({
      message: "Failed to delete institution",
    });
  }
};