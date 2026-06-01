import asyncHandler from '../../utils/asyncHandler.js';
import { sendSuccess } from '../../utils/response.js';
import * as noteService from './notes.service.js';

export const listNotes = asyncHandler(async (req, res) => {
  const notes = await noteService.listNotes(req.query);
  sendSuccess(res, notes);
});

export const createNote = asyncHandler(async (req, res) => {
  const note = await noteService.createNote(req.body, req.user.id);
  sendSuccess(res, note, 201);
});

export const updateNote = asyncHandler(async (req, res) => {
  const note = await noteService.updateNote(req.params.id, req.body);
  sendSuccess(res, note);
});

export const deleteNote = asyncHandler(async (req, res) => {
  const note = await noteService.softDeleteNote(req.params.id);
  sendSuccess(res, note);
});
