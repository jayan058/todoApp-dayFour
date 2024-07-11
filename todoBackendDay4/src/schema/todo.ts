import Joi from "joi";

export const createTodoSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  isDone: Joi.boolean().required(),
});

export const updateTodoSchema = Joi.object({
  name: Joi.string().min(3).max(30),
  isDone: Joi.boolean(),
});

export const todoIdSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});
