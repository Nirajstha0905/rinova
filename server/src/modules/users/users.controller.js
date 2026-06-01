import asyncHandler from '../../utils/asyncHandler.js';
import { sendSuccess } from '../../utils/response.js';
import * as userService from './users.service.js';

export const listUsers = asyncHandler(async (req, res) => {
  const users = await userService.listUsers();
  sendSuccess(res, users);
});

export const getUser = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  sendSuccess(res, user);
});

export const deactivateUser = asyncHandler(async (req, res) => {
  const user = await userService.deactivateUser(req.params.id);
  sendSuccess(res, user);
});
