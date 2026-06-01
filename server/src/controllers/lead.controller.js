import prisma from "../config/db.js";

export const createLead = async (req, res) => {
  try {
    const lead = await prisma.leads.create({
      data: req.body,
    });

    res.status(201).json(lead);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getLeads = async (req, res) => {
  try {
    const leads = await prisma.leads.findMany({
      where: {
        deleted_at: null,
      },
    });

    res.json(leads);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};