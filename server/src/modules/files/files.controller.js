import asyncHandler from '../../utils/asyncHandler.js';
import { sendSuccess } from '../../utils/response.js';
import * as fileService from './files.service.js';

export const listFiles = asyncHandler(async (req, res) => {
  const files = await fileService.listFiles(req.query);
  sendSuccess(res, files);
});

export const uploadFile = asyncHandler(async (req, res) => {
  const file = await fileService.createFileRecord({
    file: req.file,
    body: req.body,
    userId: req.user.id,
  });

  sendSuccess(res, file, 201);
});

export const deleteFile = asyncHandler(async (req, res) => {
  const file = await fileService.softDeleteFile(req.params.id);
  sendSuccess(res, file);
});
