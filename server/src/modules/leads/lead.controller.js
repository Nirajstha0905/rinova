import asyncHandler from '../../utils/asyncHandler.js';
import { sendSuccess } from '../../utils/response.js';
import * as leadService from './lead.service.js';

export const listLeads = asyncHandler(async (req, res) => {
  const leads = await leadService.listLeads(req.query);
  sendSuccess(res, leads);
});

export const getLead = asyncHandler(async (req, res) => {
  const lead = await leadService.getLeadById(req.params.id);
  sendSuccess(res, lead);
});

export const createLead = asyncHandler(async (req, res) => {
  const lead = await leadService.createLead(req.body);
  sendSuccess(res, lead, 201);
});

export const updateLead = asyncHandler(async (req, res) => {
  const lead = await leadService.updateLead(req.params.id, req.body);
  sendSuccess(res, lead);
});

export const deleteLead = asyncHandler(async (req, res) => {
  const lead = await leadService.softDeleteLead(req.params.id);
  sendSuccess(res, lead);
});

export const restoreLead = asyncHandler(async (req, res) => {
  const lead = await leadService.restoreLead(req.params.id);
  sendSuccess(res, lead);
});
