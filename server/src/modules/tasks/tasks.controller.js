import asyncHandler from '../../utils/asyncHandler.js';
import { sendSuccess } from '../../utils/response.js';
import * as taskService from './tasks.service.js';

export const listTasks = asyncHandler(async (req, res) => {
  const tasks = await taskService.listTasks(req.query);
  sendSuccess(res, tasks);
});

export const createTask = asyncHandler(async (req, res) => {
  const task = await taskService.createTask(req.body);
  sendSuccess(res, task, 201);
});

export const updateTask = asyncHandler(async (req, res) => {
  const task = await taskService.updateTask(req.params.id, req.body);
  sendSuccess(res, task);
});

export const completeTask = asyncHandler(async (req, res) => {
  const task = await taskService.completeTask(req.params.id);
  sendSuccess(res, task);
});

export const deleteTask = asyncHandler(async (req, res) => {
  const task = await taskService.softDeleteTask(req.params.id);
  sendSuccess(res, task);
});
