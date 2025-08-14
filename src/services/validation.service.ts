import Joi from "joi";

export const userSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required().messages({
    "string.empty": "name is required",
    "string.min": "name must be at least 2 characters",
    "string.max": "name cannot exceed 50 characters",
  }),

  // lastName: Joi.string().trim().min(2).max(50).required().messages({
  //   "string.empty": "Last name is required",
  //   "string.min": "Last name must be at least 2 characters",
  //   "string.max": "Last name cannot exceed 50 characters",
  // }),

  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Invalid email format",
  }),

  // password: Joi.string()
  //   .min(8)
  //   .pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
  //   .required()
  //   .messages({
  //     "string.empty": "Password is required",
  //     "string.min": "Password must be at least 8 characters long",
  //     "string.pattern.base":
  //       "Password must contain at least one uppercase letter, one number, and one special character",
  //   }),

  phoneNumber: Joi.string()
    .pattern(/^[0-9]+$/)
    .min(10)
    .max(15)
    .optional()
    .messages({
      "string.pattern.base": "Phone number must contain only numbers",
      "string.min": "Phone number must be at least 10 digits",
      "string.max": "Phone number cannot exceed 15 digits",
    }),

  age: Joi.number().integer().min(1).max(120).required().messages({
    "number.base": "Age must be a number",
    "number.min": "Age must be at least 1",
    "number.max": "Age must be less than or equal to 120",
    "any.required": "Age is required",
  }),

  height: Joi.number().min(50).max(300).required().messages({
    "number.base": "Height must be a number",
    "number.min": "Height must be at least 50 cm",
    "number.max": "Height must be less than or equal to 300 cm",
    "any.required": "Height is required",
  }),

  weight: Joi.number().min(10).max(500).required().messages({
    "number.base": "Weight must be a number",
    "number.min": "Weight must be at least 10 kg",
    "number.max": "Weight must be less than or equal to 500 kg",
    "any.required": "Weight is required",
  }),

  bio: Joi.string().max(500).required().messages({
    "string.base": "Bio must be a string",
    "string.empty": "Bio is required",
    "string.max": "Bio cannot be more than 500 characters",
  }),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Invalid email format",
  }),

  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
    .required()
    .messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 8 characters long",
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one number, and one special character",
    }),
});

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Invalid email format",
  }),
});
