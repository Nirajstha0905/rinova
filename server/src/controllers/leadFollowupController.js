import prisma from '../config/db.js';
export const getFollowups = async (req, res) => {
    try {
        const followups = await prisma.lead_followups.findMany({
            include: {
                leads: true,
                users: true,

            },
            orderBy: {
                followup_date: 'desc',
            },
        });

        res.status(200).json(followups);
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to fetch lead followups",
        });
    }
};

export const getLeadFollowups = async (req, res) => {
    try {
        const followups = await prisma.lead_followups.findMany({
            where:{
                lead_id: req.params.leadId,
            },
            orderBy:{
                created_at: "desc",
            },
        });
        res.status(200).json(followups);
    }
    catch (error){
        console.error(error);
        res.status(500).json({
            message: "Failed to fetch lead followups",
        });
    }
};

export const createFollowup = async (req, res) => {
    try{
        const {
            lead_id,
            followup_date,
            notes,
            status,
        } = req.body;

        if(!lead_id || !followup_date) {
            return res.status(400).json({
                message: "Lead ID and follow-up date are required",
            });
        }
        const followup = await prisma.lead_followups.create({
            data: {
                lead_id,
                followup_date: new Date(followup_date),
                notes,
                status,
                created_by: req.user.id,
            },
        });
    const today = new Date();

        await prisma.lead_followups.findMany({
            where: {
             followup_date: {
                lte: today,
            },
            status: "scheduled",
  },
});
        await logActivity({
  user_id: req.user.id,
  entity_type: "followup",
  entity_id: followup.id,
  action: "create",
  description: "Lead follow-up scheduled",
});
        res.status(201).json(followup);
    }
    catch (error){
        console.error(error);
        res.status(500).json({
            message: "Failed to create lead followup",
        });
    }
};

export const updateFollowup = async (req, res) => {
    try {
        const followup = await prisma.lead_followups.update({
            where: {
                id: req.params.id,
            },
            data: req.body,
        });
        res.status(200).json(followup);
    }
    catch (error) {
        if(error.code === 'P2025') {
        res.status(404).json({
            message: "Followup not found",
        });
        }
        console.error(error);
        res.status(500).json({
            message: "Failed to update followup",
        });
    }
};

export const deleteFollowup = async (req, res) => {
    try{
        await prisma.lead_followups.delete({
            where: {
                id: req.params.id,
            },
        });
        req.status(200).json({
            message: "Followup deleted successfully",
        });
    }
    catch (error){
        if( error.code === 'P2025') {
            return res.status(404).json({
                message: "Followup not found",
            });
        }
        console.error(error);
        res.status(500).json({
            message: "Failed to delete followup",
        });
    }
};