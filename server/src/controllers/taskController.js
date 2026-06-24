import prisma from "../config/db.js";
import { logActivity } from "../utils/activityLogger.js";
import { createNotification } from "../utils/notificationHelper.js";

const buildName = (...parts) => parts.filter(Boolean).join(" ").trim();

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
    const formatted = tasks.map((t) => ({
      id: t.id,
      title: t.title,
      description: t.description,
      priority: t.priority,
      category: t.category,
      status: t.status,
      dueDate: t.due_date,
      createdAt: t.created_at,

      assignedTo: t.users
        ? {
            id: t.users.id,
            name:
              buildName(t.users.first_name, t.users.last_name) ||
              t.users.email ||
              "Assigned user",
          }
        : null,

      relatedTo:
        buildName(
          t.students?.first_name,
          t.students?.middle_name,
          t.students?.last_name,
        ) ||
        t.students?.email ||
        buildName(t.leads?.first_name, t.leads?.middle_name, t.leads?.last_name) ||
        t.leads?.email ||
        "Internal",

      tags: [],
    }));

    res.status(200).json(formatted);
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
      category,
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
        category,
      },
    });
    if (task.assigned_to) {
      await createNotification({
        user_id: task.assigned_to,
        title: "Task Due Soon",
        message: task.title,
        type: "task",
        entity_id: task.id,
        entity_type: "task",
        action_url: "/tasks",
      });
    }

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
