import Joi from "joi";

export const createUserSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const updateUserSchema = Joi.object({
  email: Joi.string().email(),
  password: Joi.string().min(6),
});

export const userIdSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});
