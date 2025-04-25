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

export default express
  .Router()
  .post("/create", validateRequest(userSchema), userController.createUser)
  .post("/login", validateRequest(loginSchema), userController.loginUser)
  .post(
    "/forgot-password",
    validateRequest(forgotPasswordSchema),
    userController.forgotPassword
  )
  .post("/reset-password", userController.resetPassword)
  .all("/*", jwtAuth)
  .post("/logout", userController.logoutUser)
  .post("/change-password", userController.changePassword)
  .patch(
    "/update-profile",
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
  .get("/get-profile", userController.getProfile);
