import Joi from "joi";

export const userSchema = Joi.object({
  first_name: Joi.string().trim().min(2).max(50).required().messages({
    "string.empty": "First name is required",
    "string.min": "First name must be at least 2 characters",
    "string.max": "First name cannot exceed 50 characters",
  }),

  last_name: Joi.string().trim().min(2).max(50).required().messages({
    "string.empty": "Last name is required",
    "string.min": "Last name must be at least 2 characters",
    "string.max": "Last name cannot exceed 50 characters",
  }),

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

  phone_number: Joi.string()
    .pattern(/^[0-9]+$/)
    .min(10)
    .max(15)
    .optional()
    .messages({
      "string.pattern.base": "Phone number must contain only numbers",
      "string.min": "Phone number must be at least 10 digits",
      "string.max": "Phone number cannot exceed 15 digits",
    }),

  // phone_code: Joi.string()
  //   .pattern(/^\+\d{1,4}$/)
  //   .required()
  //   .messages({
  //     "string.empty": "Phone code is required",
  //     "string.pattern.base":
  //       "Phone code must start with '+' followed by 1 to 4 digits",
  //   }),

  // date_of_birth: Joi.date().optional(),

  // gender: Joi.string().valid("Male", "Female", "Other").optional(),

  // address: Joi.string().max(255).optional(),

  // membership_type: Joi.string()
  //   .valid("Basic", "Standard", "Premium")
  //   .default("Basic"),

  // membership_start_date: Joi.date().optional(),
  // membership_end_date: Joi.date().optional(),

  // emergency_contact_name: Joi.string().optional(),

  // emergency_contact_phone: Joi.string()
  //   .pattern(/^[0-9]+$/)
  //   .optional()
  //   .messages({
  //     "string.pattern.base":
  //       "Emergency contact phone must contain only numbers",
  //   }),

  // profile_picture: Joi.string().uri().optional().messages({
  //   "string.uri": "Profile picture must be a valid URL",
  // }),

  // weight: Joi.number().positive().optional().messages({
  //   "number.positive": "Weight must be a positive number",
  // }),

  // height: Joi.number().positive().optional().messages({
  //   "number.positive": "Height must be a positive number",
  // }),

  // fitness_goal: Joi.string().optional(),

  // workout_preferences: Joi.string().optional(),

  // is_active: Joi.boolean().default(true),
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
