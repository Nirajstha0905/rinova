import path from 'path';
import prisma from '../../config/db.js';
import ApiError from '../../utils/ApiError.js';
import { notDeleted, softDeleteData } from '../../utils/softDelete.js';

export const listFiles = async ({ student_id, application_id, doc_type }) => {
  return prisma.documents.findMany({
    where: {
      ...notDeleted,
      ...(student_id ? { student_id } : {}),
      ...(application_id ? { application_id } : {}),
      ...(doc_type ? { doc_type } : {}),
    },
    orderBy: { created_at: 'desc' },
  });
};

export const createFileRecord = async ({ file, body, userId }) => {
  if (!file) {
    throw new ApiError(400, 'A file is required.');
  }

  return prisma.documents.create({
    data: {
      student_id: body.student_id || null,
      application_id: body.application_id || null,
      file_name: file.originalname,
      file_url: path.join('uploads', file.filename).replace(/\\/g, '/'),
      doc_type: body.doc_type || 'supporting',
      uploaded_by: userId,
    },
  });
};

export const softDeleteFile = async (id) => {
  const file = await prisma.documents.findFirst({
    where: { id, ...notDeleted },
  });

  if (!file) {
    throw new ApiError(404, 'File not found.');
  }

  return prisma.documents.update({
    where: { id },
    data: softDeleteData,
  });
};
