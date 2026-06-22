import prisma from "../config/db.js";
export const getLeads = async (req, res) => {
  try {
    const leads = await prisma.leads.findMany({
      where: {
        deleted_at: null,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    res.status(200).json(leads);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch leads",
    });
  }
};

export const getLeadById = async (req, res) => {
  try {
    const lead = await prisma.leads.findUnique({
      where: {
        id: req.params.id,
        deleted_at: null,
      },
    });
    if (!lead) {
      return res.status(404).json({
        message: "Lead not found",
      });
    }
    res.status(200).json(lead);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch lead",
    });
  }
};

export const createLead = async (req, res) => {
  try {
    const {
      first_name,
      middle_name,
      last_name,
      email,
      phone,
      country_interest,
      course_interest,
      source,
      assigned_to,
    } = req.body;

    if (!first_name || !last_name) {
      return res.status(400).json({
        message: "First name and last name are required",
      });
    }

    const lead = await prisma.leads.create({
      data: {
        first_name,
        middle_name,
        last_name,
        email,
        phone,
        country_interest,
        course_interest,
        source,
        assigned_to,
      },
    });
    await logActivity({
      user_id: req.user.id,
      entity_type: "lead",
      entity_id: lead.id,
      action: "create",
      description: `Lead ${lead.first_name} ${lead.last_name} created`,
    });
    await createNotification({
      user_id: lead.assigned_to,
      title: "Lead Assigned",
      message: `A new lead has been assigned to you.`,
      type: "lead",
      entity_id: lead.id,
      entity_type: "lead",
      action_url: "/leads",
    });

    return res.status(201).json(lead);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create lead",
      error: error.message,
    });
  }
};

export const updateLead = async (req, res) => {
  try {
    const lead = await prisma.leads.update({
      where: {
        id: req.params.id,
      },
      data: req.body,
    });
    await logActivity({
      user_id: req.user?.id,
      entity_type: "lead",
      entity_id: lead.id,
      action: "update",
      description: `Lead ${lead.first_name} ${lead.last_name} updated`,
    });

    res.status(200).json(lead);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({
        message: "Lead not found",
      });
    }

    console.error(error);

    res.status(500).json({
      message: "Failed to update lead",
    });
  }
};

export const deleteLead = async (req, res) => {
  try {
    await prisma.leads.update({
      where: {
        id: req.params.id,
      },
      data: {
        deleted_at: new Date(),
      },
    });
    await logActivity({
      user_id: req.user?.id,
      entity_type: "lead",
      entity_id: lead.id,
      action: "delete",
      description: `Lead ${lead.first_name} ${lead.last_name} deleted`,
    });
    res.status(200).json({
      message: "Lead deleted successfully",
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({
        message: "Lead not found",
      });
    }

    console.error(error);

    res.status(500).json({
      message: "Failed to delete lead",
    });
  }
};
