import express from "express";
import userController from "../controllers/user/user.controller";
import { validateRequest } from "../services/common.service";
import {
  forgotPasswordSchema,
  loginSchema,
  userSchema,
} from "../services/validation.service";
import jwtAuth from "../middlewares/jwt.middleware";
import { upload } from "../middlewares/upload.middleware";
import { authorizeRoles } from "../middlewares/authorization.model";

export default express
  .Router()
  .post("/create", validateRequest(userSchema), userController.createUser)
  .post("/login", validateRequest(loginSchema), userController.loginUser)
  .post("/contactUs", userController.contactUs)
  .post(
    "/forgot-password",
    validateRequest(forgotPasswordSchema),
    userController.forgotPassword
  )
  .post("/reset-password", userController.resetPassword)
  .all("/*", jwtAuth)
  .post("/logout", authorizeRoles("user"), userController.logoutUser)
  .post(
    "/change-password",
    authorizeRoles("user"),
    userController.changePassword
  )
  .patch(
    "/update-profile",
    authorizeRoles("user"),
    (req, res, next) => {
      upload(req as any, res as any, (err: any) => {
        if (err) {
          return res.status(400).json({ error: err.message });
        }
        next();
      });
    },
    userController.updateProfile
  )
  .get("/get-profile", authorizeRoles("user"), userController.getProfile)
  .patch(
    "/update-workout-status",
    authorizeRoles("user"),
    userController.updateWorkoutStatus
  )
  .get(
    "/notifications",
    authorizeRoles("user", "admin"),
    userController.getUserNotifications
  );
