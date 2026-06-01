import prisma from '../../config/db.js';
import ApiError from '../../utils/ApiError.js';
import { notDeleted, softDeleteData } from '../../utils/softDelete.js';

export const listTasks = async ({ status, assigned_to, lead_id, student_id, application_id }) => {
  return prisma.tasks.findMany({
    where: {
      ...notDeleted,
      ...(status ? { status } : {}),
      ...(assigned_to ? { assigned_to } : {}),
      ...(lead_id ? { lead_id } : {}),
      ...(student_id ? { student_id } : {}),
      ...(application_id ? { application_id } : {}),
    },
    include: {
      users: {
        select: {
          id: true,
          full_name: true,
          email: true,
        },
      },
    },
    orderBy: { due_date: 'asc' },
  });
};

export const getTaskById = async (id) => {
  const task = await prisma.tasks.findFirst({
    where: { id, ...notDeleted },
  });

  if (!task) {
    throw new ApiError(404, 'Task not found.');
  }

  return task;
};

export const createTask = async (data) => {
  if (!data.title) {
    throw new ApiError(400, 'Task title is required.');
  }

  return prisma.tasks.create({
    data: {
      title: data.title,
      description: data.description,
      assigned_to: data.assigned_to,
      lead_id: data.lead_id,
      student_id: data.student_id,
      application_id: data.application_id,
      due_date: data.due_date ? new Date(data.due_date) : null,
      status: data.status || 'pending',
    },
  });
};

export const updateTask = async (id, data) => {
  await getTaskById(id);

  return prisma.tasks.update({
    where: { id },
    data: {
      ...data,
      due_date: data.due_date ? new Date(data.due_date) : undefined,
    },
  });
};

export const completeTask = async (id) => {
  await getTaskById(id);

  return prisma.tasks.update({
    where: { id },
    data: { status: 'completed' },
  });
};

export const softDeleteTask = async (id) => {
  await getTaskById(id);

  return prisma.tasks.update({
    where: { id },
    data: softDeleteData,
  });
};
