import { Request, Response } from "express";
import { Users } from "../../models/user.model";
import bcrypt from "bcryptjs"; // Import bcryptjs
import {
  IReturnResponsePayload,
  MessageUtil,
} from "../../utils/messageResponse";
import jwt from "jsonwebtoken";
import statusCodes from "../../utils/helperConstants";
import { Op } from "sequelize";
import { whatsappService } from "../../services/whatsapp.service.ts/whatsapp.service";
import { generateRandomPassword } from "../../services/global.services";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { uploadFileToS3 } from "../../middlewares/upload.middleware";
import { Workouts } from "../../models/workouts.model";
import { UserWorkoutSessions } from "../../models/user_workout_sessions.model";
import { Notifications } from "../../models/notification.model";

interface S3File extends Express.Multer.File {
  location: string; // S3 file URL
  key: string; // S3 key (filename)
}

class AdminController {
  public async loginUser(req: Request, res: Response): Promise<any> {
    try {
      const { email, password } = req.body;

      // Check if user exists
      const user = await Users.findOne({ where: { email, role: "admin" } });
      if (!user) {
        return MessageUtil.error(res, {
          message: "Invalid email or password1",
          status: statusCodes.UNAUTHORIZED,
        });
      }

      // Compare passwords
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return MessageUtil.error(res, {
          message: "Invalid email or password",
          status: 401,
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET as string,
        { expiresIn: "1h" } // Token expires in 1 hour
      );
      // await whatsappService.sendWhatsAppMessage(
      //   "+917895270806",
      //   "Hello how are you"
      // );

      const responsePayload: IReturnResponsePayload<{ token: string }> = {
        message: "Login successful",
        status: 200,
        data: { token },
      };

      return MessageUtil.success(res, responsePayload);
    } catch (error: any) {
      return MessageUtil.error(res, {
        message: "Login failed",
        status: 500,
        data: error.message,
      });
    }
  }

  public async logoutUser(req: Request, res: Response): Promise<any> {
    try {
      // Optionally, you could invalidate the token via a blacklist (not covered here)
      const responsePayload: IReturnResponsePayload<null> = {
        message: "Logout successful",
        status: 200,
        data: null,
      };

      return MessageUtil.success(res, responsePayload);
    } catch (error: any) {
      return MessageUtil.error(res, {
        message: "Logout failed",
        status: 500,
        data: error.message,
      });
    }
  }

  // Forgot Password - Send Reset Token
  public async forgotPassword(req: Request, res: Response): Promise<any> {
    try {
      const { email } = req.body;

      // Check if user exists
      const user = await Users.findOne({ where: { email } });
      if (!user) {
        return MessageUtil.error(res, {
          message: "User with this email does not exist",
          status: statusCodes.BAD_REQUEST,
        });
      }

      // Generate reset token
      const resetToken = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET as string,
        { expiresIn: "15m" } // Token valid for 15 minutes
      );

      // Here, you can send an email to the user with this resetToken (Email sending logic needed)

      return MessageUtil.success(res, {
        message: "Password reset token generated successfully",
        status: 200,
        data: { resetToken },
      });
    } catch (error: any) {
      return MessageUtil.error(res, {
        message: "Failed to generate reset token",
        status: 500,
        data: error.message,
      });
    }
  }

  // Reset Password - Using Reset Token
  public async resetPassword(req: Request, res: Response): Promise<any> {
    try {
      const { token, newPassword } = req.body;

      // Verify token
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);

      // Find user
      const user = await Users.findOne({ where: { id: decoded.id } });
      if (!user) {
        return MessageUtil.error(res, {
          message: "Invalid or expired token",
          status: statusCodes.UNAUTHORIZED,
        });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();

      return MessageUtil.success(res, {
        message: "Password reset successfully",
        status: 200,
      });
    } catch (error: any) {
      return MessageUtil.error(res, {
        message: "Failed to reset password",
        status: 500,
        data: error.message,
      });
    }
  }

  // Change Password - Logged-in Users
  public async changePassword(req: Request, res: Response): Promise<any> {
    try {
      const { oldPassword, newPassword } = req.body;
      const userId = "1"; // Extract userId from the authenticated request

      // Find user
      const user = await Users.findOne({ where: { id: userId } });
      if (!user) {
        return MessageUtil.error(res, {
          message: "User not found",
          status: statusCodes.NOT_FOUND,
        });
      }

      // Check if old password matches
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return MessageUtil.error(res, {
          message: "Old password is incorrect",
          status: statusCodes.UNAUTHORIZED,
        });
      }

      // Hash and update new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();

      return MessageUtil.success(res, {
        message: "Password changed successfully",
        status: 200,
      });
    } catch (error: any) {
      return MessageUtil.error(res, {
        message: "Failed to change password",
        status: 500,
        data: error.message,
      });
    }
  }

  public async updateProfile(req: Request, res: Response): Promise<any> {
    try {
      const user = req.user;
      const formData = req.body; // Fields like name, age, etc.
      const files = req.files as { [fieldname: string]: Express.Multer.File[] }; // Multer files
      console.log("user====>>>>>", user); // Check user data here
      console.log("formData====>>>>>", formData); // Check form data here
      console.log("files====>>>>>", files); // Check files here
      const userDetail = await Users.findOne({ where: { id: user?.id } });
      if (!userDetail) {
        return MessageUtil.error(res, {
          message: "User not found",
          status: statusCodes.NOT_FOUND,
        });
      }

      const uploadedUrls: { [key: string]: string } = {};
      if (files) {
        for (const [fieldName, fileArray] of Object.entries(files)) {
          const file = fileArray[0]; // Assume single file for each field
          const url = await uploadFileToS3(file, fieldName); // Upload and get URL
          uploadedUrls[fieldName] = url;
        }
      }

      const updated = Users.update(
        {
          ...formData,
          ...uploadedUrls, // Add the S3 URLs to the data
        },
        { where: { id: user?.id } }
      );
      if (updated) {
        return MessageUtil.success(res, {
          message: "Profile Updated successfully",
          status: 200,
        });
      } else {
        return MessageUtil.error(res, {
          message: "Failed to update profile , Please try again.",
          status: 500,
        });
      }
    } catch (error: any) {
      return MessageUtil.error(res, {
        message: "Failed to update profile ",
        status: 500,
        data: error.message,
      });
    }
  }

  public async getProfile(req: Request, res: Response): Promise<any> {
    try {
      const user = req.user;
      console.log("user", user);
      const userDetail = await Users.findOne({ where: { id: user?.id } });
      if (!userDetail) {
        return MessageUtil.error(res, {
          message: "User not found",
          status: statusCodes.NOT_FOUND,
        });
      }

      const result = await Users.findOne({
        where: { id: user?.id },
        attributes: [
          "id",
          "name",
          "email",
          "phoneCode",
          "phoneNumber",
          "age",
          "gender",
          "dob",
          "height",
          "weight",
          "address",
          "fitnessGoal",
          "workoutPreferences",
          "profilePicture",
          "physiquePicture",
          "isActive",
          "created_at",
          "updated_at",
        ],
      });

      console.log("result----->>", result);
      if (result) {
        return MessageUtil.success(res, {
          message: "User data fetched successfully",
          status: 200,
          data: result,
        });
      } else {
        return MessageUtil.error(res, {
          message: "Failed to fetch profile , Please try again.",
          status: 400,
        });
      }
    } catch (error: any) {
      return MessageUtil.error(res, {
        message: "Failed to fetch profile",
        status: 500,
        data: error.message,
      });
    }
  }

  public async getUsers(req: Request, res: Response): Promise<any> {
    try {
      const result = await Users.findAndCountAll({
        where: { role: "user" },
        attributes: [
          "id",
          "name",
          "email",
          "phoneCode",
          "phoneNumber",
          "age",
          "gender",
          "dob",
          "height",
          "weight",
          "address",
          "fitnessGoal",
          "workoutPreferences",
          "profilePicture",
          "physiquePicture",
          "isActive",
          "created_at",
          "updated_at",
        ],
      });

      console.log("result----->>", result);
      if (result) {
        return MessageUtil.success(res, {
          message: "User data fetched successfully",
          status: 200,
          data: result,
        });
      } else {
        return MessageUtil.error(res, {
          message: "Failed to fetch profile , Please try again.",
          status: 400,
        });
      }
    } catch (error: any) {
      return MessageUtil.error(res, {
        message: "Failed to fetch profile",
        status: 500,
        data: error.message,
      });
    }
  }

  public async getWorkouts(req: Request, res: Response): Promise<any> {
    try {
      const result = await Workouts.findAndCountAll();

      console.log("result----->>", result);
      if (result) {
        return MessageUtil.success(res, {
          message: "User data fetched successfully",
          status: 200,
          data: result,
        });
      } else {
        return MessageUtil.error(res, {
          message: "Failed to fetch profile , Please try again.",
          status: 400,
        });
      }
    } catch (error: any) {
      return MessageUtil.error(res, {
        message: "Failed to fetch profile",
        status: 500,
        data: error.message,
      });
    }
  }

  public async createOrUpdateWorkouts(
    req: Request,
    res: Response
  ): Promise<any> {
    try {
      const {
        name,
        type,
        body_part,
        muscle_targeted,
        equipment,
        sets,
        reps,
        id,
      } = req.body;

      const result = await Workouts.findByPk(id);
      if (result) {
        const updatedResult = await Workouts.update(
          {
            name,
            type,
            body_part,
            muscle_targeted,
            equipment,
            sets,
            reps,
          },
          { where: { id: id } }
        );
        if (updatedResult) {
          return MessageUtil.success(res, {
            message: "Workout updated successfully",
            status: 200,
            data: updatedResult,
          });
        } else {
          return MessageUtil.error(res, {
            message: "Failed to update workout , Please try again.",
            status: 400,
          });
        }
      }

      const createResult = await Workouts.create({
        name,
        type,
        body_part,
        muscle_targeted,
        equipment,
        sets,
        reps,
      });

      console.log("result----->>", result);
      if (createResult) {
        return MessageUtil.success(res, {
          message: "Workout created successfully",
          status: 200,
          data: result,
        });
      } else {
        return MessageUtil.error(res, {
          message: "Failed to Create workout, Please try again.",
          status: 400,
        });
      }
    } catch (error: any) {
      return MessageUtil.error(res, {
        message: "Failed to create or update profile",
        status: 500,
        data: error.message,
      });
    }
  }

  public async deleteWorkouts(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.query;

      const workout = await Workouts.findByPk(id);
      if (!workout) {
        return MessageUtil.error(res, {
          message: "Workout not found",
          status: 404,
        });
      }
      const result = await Workouts.destroy({ where: { id: id } });

      console.log("result----->>", result);
      if (result) {
        return MessageUtil.success(res, {
          message: "Workout deleted successfully",
          status: 200,
          data: result,
        });
      } else {
        return MessageUtil.error(res, {
          message: "Failed to delete workout, Please try again.",
          status: 400,
        });
      }
    } catch (error: any) {
      return MessageUtil.error(res, {
        message: "Failed to delete workout",
        status: 500,
        data: error.message,
      });
    }
  }

  public async createUserWorkout(req: Request, res: Response): Promise<any> {
    try {
      const { workouts, userId, day } = req.body;

      if (
        !Array.isArray(workouts) ||
        workouts.length === 0 ||
        !userId ||
        !day
      ) {
        return MessageUtil.error(res, {
          message: "workouts, userId, and day are required",
          status: 400,
        });
      }

      const validWorkouts = await Workouts.findAll({ where: { id: workouts } });

      if (validWorkouts.length !== workouts.length) {
        return MessageUtil.error(res, {
          message: "One or more workouts not found",
          status: 404,
        });
      }

      const user = await Users.findByPk(userId);
      if (!user) {
        return MessageUtil.error(res, {
          message: "User not found",
          status: 404,
        });
      }

      const sessionRecords = await Promise.all(
        workouts.map((workoutId: number, index: number) =>
          UserWorkoutSessions.create({
            user_id: userId,
            workout_id: workoutId,
            day,
            order_index: index + 1,
          })
        )
      );

      return MessageUtil.success(res, {
        message: "Workout session assigned to user successfully",
        status: 201,
        data: sessionRecords,
      });
    } catch (error: any) {
      return MessageUtil.error(res, {
        message: "Failed to create user workout session",
        status: 500,
        data: error.message,
      });
    }
  }

  public async createNotification(req: Request, res: Response): Promise<any> {
    try {
      const formData = req.body; // Fields like name, age, etc.
      const files = req.files as { [fieldname: string]: Express.Multer.File[] }; // Multer files
      console.log("formData====>>>>>", formData); // Check form data here
      console.log("files====>>>>>", files); // Check files here

      const { title, message, target_user_id } = formData;

      if (!title || !message) {
        return MessageUtil.error(res, {
          message: "Title and message are required",
          status: 400,
        });
      }

      let media_url: string | null = null;
      let media_type: "image" | "video" | "pdf" | "none" = "none";

      if (files?.notificationFile && files.notificationFile[0]) {
        const file = files.notificationFile[0];
        media_url = await uploadFileToS3(file, "notificationFiles");

        const mime = file.mimetype;
        if (mime.startsWith("image/")) media_type = "image";
        else if (mime.startsWith("video/")) media_type = "video";
        else if (mime === "application/pdf") media_type = "pdf";
      }

      const is_global = !target_user_id;

      const uploadedUrls: { [key: string]: string } = {};
      if (files) {
        for (const [fieldName, fileArray] of Object.entries(files)) {
          const file = fileArray[0]; // Assume single file for each field
          const url = await uploadFileToS3(file, fieldName); // Upload and get URL
          uploadedUrls[fieldName] = url;
        }
      }

      const notification = await Notifications.create({
        title,
        message,
        media_url,
        media_type,
        is_global,
        target_user_id: target_user_id || null,
      });
      if (notification) {
        return MessageUtil.success(res, {
          message: "Notification created successfully",
          status: 201,
          data: notification,
        });
      } else {
        return MessageUtil.error(res, {
          message: "Failed to create notification, Please try again.",
          status: 500,
        });
      }
    } catch (error: any) {
      return MessageUtil.error(res, {
        message: "Failed to create notification",
        status: 500,
        data: error.message,
      });
    }
  }

  public async getRecentLogins(req: Request, res: Response): Promise<any> {
    try {
      const limitValue = parseInt(req.body?.limit);
      const limit = !isNaN(limitValue) && limitValue > 0 ? limitValue : 5;

      const recentUsers = await Users.findAll({
        where: {
          lastLogin: { [Op.ne]: null }, // Exclude users who never logged in
        },
        order: [["lastLogin", "DESC"]],
        limit,
        attributes: ["id", "name", "email", "lastLogin"], // Limit returned fields
      });

      return MessageUtil.success(res, {
        message: "Recent login users fetched successfully",
        status: 200,
        data: recentUsers,
      });
    } catch (error: any) {
      return MessageUtil.error(res, {
        message: "Failed to fetch recent logins",
        status: 500,
        data: error.message,
      });
    }
  }
}

// Export an instance of the class
export default new AdminController();
