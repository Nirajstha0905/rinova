import prisma from "../config/db.js";

import { logActivity } from "../utils/activityLogger.js";

export const getNotes = async (req, res)=> {
    try {
        const notes = await prisma.notes.findMany({
            include:{
                users:{
                    select:{
                        first_name: true,
                        middle_name: true,
                        last_name: true,
                    },
                },
                students: true,
                leads: true
            },
            orderBy:{
                created_at : "desc",
            },
        });
        res.status(200).json(notes);
    }
    catch (error){
        console.error(error);
        
        res.status(500).json({
            message: "Failed to fetch notes",
        });
    }
};

export const getNotesById = async (req, res) => {
    try {
        const notes = await prisma.notes.findUnique({
            where:{
                id : req.params.id,
            },
            include:{
                users:{
                    select:{
                        first_name: true,
                        middle_name: true,
                        last_name: true,
                    },
                },
            },
        });
        if(!notes){
            return res.status(404).json({
                message: "Note not found",
            });
        } 
        res.status(200).json(notes);
    } catch(error){
        console.error(error);
          if (error.code === "P2025") {
    return res.status(404).json({
      message: "Note not found",
    });
  }
        res.status(500).json({
            message: "Failed to fetch lead",
        });
    }
};



export const createNote = async (req, res) => {
    try {
        const {
            lead_id,
            student_id,
            application_id,
            content,
        } = req.body;

        if(!content) {
            return res.status(400).json({
                message: "Content is required",
            });
        }

        const note = await prisma.notes.create({
            data: {
                lead_id,
                student_id,
                application_id,
                content,
                created_by: req.user.id
            },
        });
        await createNotification({
            user_id: req.user.id,
            title: "New Note Added",
            message: "A note was added to the student profile",
        });

        await logActivity({
            user_id: req.user.id,
            student_id,
            entity_type: "note",
            entity_id: note.id,
            action: "create",
            description: "Note created",
        });
        res.status(201).json(note);
    }
    catch(error) {
        console.error(error);

           res.status(500).json({
                message: "Failed to create note",
            });
        
    }
};
export const deleteNote = async (req, res) => {
  try {
    await prisma.notes.delete({
      where: {
        id: req.params.id,
      },
    });
    await logActivity({
  user_id: req.user.id,
  student_id: note.student_id,
  entity_type: "note",
  entity_id: note.id,
  action: "delete",
  description: "Note deleted",
});

    res.status(200).json({
      message: "Note deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete note",
    });
  }
};