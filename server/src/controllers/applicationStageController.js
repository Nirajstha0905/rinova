import prisma from "../config/db.js"
import { createNotification } from "../utils/notificationHelper.js";

export const getStages = async (req, res)=> {
    try {
        const stages = await prisma.application_stages.findMany({
            orderBy:{
                sort_order: "asc",
            },
        });

        res.status(200).json(stages);
    }
    catch(error){
        console.error(error);
        
        res.status(500).json({
            message: "Failed to fetch stages",
        });
    }
};

export const createStage = async (req, res)=> {
    try {
        const {name, sort_order} = req.body;

        const stage = await prisma.application_stages.create({
            data: {
                name,
                sort_order,
            },
        });

        res.status(201).json(stage);
    }
    catch(error)
    {
        console.log(error);

        res.status(500).json({
            message: "Failed to create stage",
        });
    }
};

export const updateStage = async (req, res) => {
    try {
        const stage = await prisma.application_stages.update({
            where:{
                id: req.params.id,
            },
            data: req.body,
        });
        await createNotification({
            user_id: req.user.id,
            title: "Application Updated",
            message: `Application moved to ${stage.name}`,
        });

        res.status(200).json(stage);
    }
    catch(error){
        console.error(error);

        res.status(500).json({
            message: "Failed to update stage",
        });
    }
};

export const deleteStage = async (req, res) => {
  try {
    await prisma.application_stages.delete({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).json({
      message: "Stage deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete stage",
    });
  }
};