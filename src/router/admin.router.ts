import express from "express";
import { validateRequest } from "../services/common.service";
import {
  forgotPasswordSchema,
  loginSchema,
  userSchema,
} from "../services/validation.service";
import jwtAuth from "../middlewares/jwt.middleware";
import { upload } from "../middlewares/upload.middleware";
import { authorizeRoles } from "../middlewares/authorization.model";
import adminController from "../controllers/admin/admin.controller";

export default express
  .Router()
  .post(
    "/login",
    validateRequest(loginSchema),
    // authorizeRoles("admin"),
    adminController.loginUser
  )
  .post(
    "/forgot-password",
    validateRequest(forgotPasswordSchema),
    authorizeRoles("admin"),
    adminController.forgotPassword
  )
  .post(
    "/reset-password",
    authorizeRoles("admin"),
    adminController.resetPassword
  )
  .all("/*", jwtAuth)
  .post("/logout", authorizeRoles("admin"), adminController.logoutUser)
  .post(
    "/change-password",
    authorizeRoles("admin"),
    adminController.changePassword
  )
  .patch(
    "/update-profile",
    authorizeRoles("admin"),
    (req, res, next) => {
      upload(req as any, res as any, (err: any) => {
        if (err) {
          return res.status(400).json({ error: err.message });
        }
        next();
      });
    },
    adminController.updateProfile
  )
  .get("/get-profile", authorizeRoles("admin"), adminController.getProfile)
  .get("/get-users", authorizeRoles("admin"), adminController.getUsers)
  .get("/get-workouts", authorizeRoles("admin"), adminController.getWorkouts)
  .post(
    "/create-workouts",
    authorizeRoles("admin"),
    adminController.createOrUpdateWorkouts
  )
  .delete(
    "/delete-workouts",
    authorizeRoles("admin"),
    adminController.deleteWorkouts
  )
  .post(
    "/create-user-workout",
    authorizeRoles("admin"),
    adminController.createUserWorkout
  )
  .post(
    "/create-notification",
    authorizeRoles("admin"),
    (req, res, next) => {
      upload(req as any, res as any, (err: any) => {
        if (err) {
          return res.status(400).json({ error: err.message });
        }
        next();
      });
    },
    adminController.createNotification
  )
  .get("/get-workouts", authorizeRoles("admin"), adminController.getWorkouts);
