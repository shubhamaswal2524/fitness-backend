import express from "express";
import userController from "../controllers/user/user.controller";
import { validateRequest } from "../services/common.service";
import {
  forgotPasswordSchema,
  loginSchema,
  userSchema,
} from "../services/validation.service";

export default express
  .Router()
  .post("/create", validateRequest(userSchema), userController.createUser)
  .post("/login", validateRequest(loginSchema), userController.loginUser)

  // Forgot Password - Sends a reset token to the user's email
  .post(
    "/forgot-password",
    validateRequest(forgotPasswordSchema),
    userController.forgotPassword
  )

  // Reset Password - Resets the user's password using the token
  .post("/reset-password", userController.resetPassword)

  // Change Password - Change password for authenticated users
  .post("/change-password", userController.changePassword)
  .patch("/update-profile", userController.updateProfile);
