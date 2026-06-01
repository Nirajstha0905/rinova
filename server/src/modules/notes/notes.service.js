import prisma from '../../config/db.js';
import ApiError from '../../utils/ApiError.js';
import { notDeleted, softDeleteData } from '../../utils/softDelete.js';

export const listNotes = async ({ lead_id, student_id, application_id }) => {
  return prisma.notes.findMany({
    where: {
      ...notDeleted,
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
    orderBy: { created_at: 'desc' },
  });
};

export const getNoteById = async (id) => {
  const note = await prisma.notes.findFirst({
    where: { id, ...notDeleted },
  });

  if (!note) {
    throw new ApiError(404, 'Note not found.');
  }

  return note;
};

export const createNote = async (data, userId) => {
  if (!data.content) {
    throw new ApiError(400, 'Note content is required.');
  }

  return prisma.notes.create({
    data: {
      content: data.content,
      lead_id: data.lead_id,
      student_id: data.student_id,
      application_id: data.application_id,
      created_by: userId,
    },
  });
};

export const updateNote = async (id, data) => {
  await getNoteById(id);

  return prisma.notes.update({
    where: { id },
    data: {
      content: data.content,
    },
  });
};

export const softDeleteNote = async (id) => {
  await getNoteById(id);

  return prisma.notes.update({
    where: { id },
    data: softDeleteData,
  });
};
