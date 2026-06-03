import prisma from "../config/db.js";
import { logActivity } from "../utils/activityLogger.js";

export const getTasks = async (req, res) => {
  try {
    const tasks = await prisma.tasks.findMany({
      where: {
        deleted_at: null,
      },
      include: {
        users: true,
        students: true,
        leads: true,
      },
      orderBy: {
        due_date: "asc",
      },
    });

    res.status(200).json(tasks);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch tasks",
    });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const task = await prisma.tasks.findUnique({
      where: {
        id: req.params.id,
      },
      include: {
        users: true,
        students: true,
        leads: true,
      },
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.status(200).json(task);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch task",
    });
  }
};

export const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      assigned_to,
      lead_id,
      student_id,
      application_id,
      due_date,
      priority,
    } = req.body;

    if (!title) {
      return res.status(400).json({
        message: "Task title is required",
      });
    }

    const task = await prisma.tasks.create({
      data: {
        title,
        description,
        assigned_to,
        lead_id,
        student_id,
        application_id,
        due_date: due_date ? new Date(due_date) : null,
        priority,
      },
    });

    await logActivity({
      user_id: req.user?.id,
      student_id,
      entity_type: "task",
      entity_id: task.id,
      action: "create",
      description: `Task '${title}' created`,
    });

    res.status(201).json(task);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create task",
    });
  }
};

export const updateTask = async (req, res) => {
  try {
    const task = await prisma.tasks.update({
      where: {
        id: req.params.id,
      },
      data: req.body,
    });

    await logActivity({
      user_id: req.user?.id,
      student_id: task.student_id,
      entity_type: "task",
      entity_id: task.id,
      action: "update",
      description: `Task '${task.title}' updated`,
    });

    res.status(200).json(task);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.status(500).json({
      message: "Failed to update task",
    });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await prisma.tasks.update({
      where: {
        id: req.params.id,
      },
      data: {
        deleted_at: new Date(),
      },
    });

    await logActivity({
      user_id: req.user?.id,
      student_id: task.student_id,
      entity_type: "task",
      entity_id: task.id,
      action: "delete",
      description: `Task '${task.title}' deleted`,
    });

    res.status(200).json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete task",
    });
  }
};

export const completeTask = async (req, res) => {
  try {
    const task = await prisma.tasks.update({
      where: {
        id: req.params.id,
      },
      data: {
        status: "completed",
      },
    });

    await logActivity({
      user_id: req.user?.id,
      student_id: task.student_id,
      entity_type: "task",
      entity_id: task.id,
      action: "complete",
      description: `Task '${task.title}' completed`,
    });

    res.status(200).json(task);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to complete task",
    });
  }
};

