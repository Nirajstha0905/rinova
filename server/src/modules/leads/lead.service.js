import prisma from '../../config/db.js';
import ApiError from '../../utils/ApiError.js';
import { notDeleted, softDeleteData } from '../../utils/softDelete.js';

const includeRelations = {
  users: {
    select: {
      id: true,
      full_name: true,
      email: true,
    },
  },
};

export const listLeads = async ({ status, assigned_to }) => {
  return prisma.leads.findMany({
    where: {
      ...notDeleted,
      ...(status ? { status } : {}),
      ...(assigned_to ? { assigned_to } : {}),
    },
    include: includeRelations,
    orderBy: { created_at: 'desc' },
  });
};

export const getLeadById = async (id) => {
  const lead = await prisma.leads.findFirst({
    where: { id, ...notDeleted },
    include: {
      ...includeRelations,
      notes: {
        where: { deleted_at: null },
        orderBy: { created_at: 'desc' },
      },
      tasks: {
        where: { deleted_at: null },
        orderBy: { created_at: 'desc' },
      },
    },
  });

  if (!lead) {
    throw new ApiError(404, 'Lead not found.');
  }

  return lead;
};

export const createLead = async (data) => {
  if (!data.full_name) {
    throw new ApiError(400, 'Lead full_name is required.');
  }

  return prisma.leads.create({
    data,
    include: includeRelations,
  });
};

export const updateLead = async (id, data) => {
  await getLeadById(id);

  return prisma.leads.update({
    where: { id },
    data: {
      ...data,
      updated_at: new Date(),
    },
    include: includeRelations,
  });
};

export const softDeleteLead = async (id) => {
  await getLeadById(id);

  return prisma.leads.update({
    where: { id },
    data: softDeleteData,
  });
};

export const restoreLead = async (id) => {
  return prisma.leads.update({
    where: { id },
    data: {
      deleted_at: null,
      updated_at: new Date(),
    },
  });
};
