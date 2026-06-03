import prisma from "../config/db.js";
import { logActivity } from "../utils/activityLogger.js";

export const changeApplicationStage = async (req, res) => {
  try {

    const { application_id, stage_id, remarks } = req.body;
    

    const history =
      await prisma.application_stage_history.create({
        data: {
          application_id,
          stage_id,
          remarks,
          changed_by: req.user.id,
        },
      });

    const stage =
      await prisma.application_stages.findUnique({
        where: {
          id: stage_id,
        },
      });

    await prisma.applications.update({
      where: {
        id: application_id,
      },
      data: {
        stage: stage.name,
      },
    });

    await logActivity({
      user_id: req.user.id,
      entity_type: "application",
      entity_id: application_id,
      action: "stage_change",
      description: `Application moved to ${stage.name}`,
    });

    res.status(201).json(history);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update stage",
    });
  }
};

export const getApplicationHistory = async (
  req,
  res
) => {
  try {
    const history =
      await prisma.application_stage_history.findMany({
        where: {
          application_id: req.params.applicationId,
        },
        include: {
          application_stages: true,
          users: {
            select: {
              first_name: true,
              last_name: true,
            },
          },
        },
        orderBy: {
          changed_at: "desc",
        },
      });

    res.status(200).json(history);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch history",
    });
  }
};