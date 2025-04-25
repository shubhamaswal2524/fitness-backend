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

interface S3File extends Express.Multer.File {
  location: string; // S3 file URL
  key: string; // S3 key (filename)
}

class UserController {
  // Create a new user
  public async createUser(req: Request, res: Response): Promise<any> {
    try {
      const { firstName, lastName, email, phoneNumber, password } = req.body;

      // Check if user exists
      const user = await Users.findOne({
        where: {
          [Op.or]: [{ email }, { phoneNumber }],
        },
      });

      if (user) {
        return MessageUtil.error(res, {
          message: "Invalid User or User already exists",
          status: statusCodes.BAD_REQUEST,
        });
      }

      // const password = generateRandomPassword(10);
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const newUser = await Users.create({
        name: `${firstName} ${lastName}`,
        email,
        password: hashedPassword, // You should hash the password before storing it
        phoneNumber,
        phone_code: 91,
        is_active: true,
      });

      // whatsappService.sendWhatsAppMessage(
      //   phone_number  ,
      //   "Hello! This is a test WhatsApp message 🎉"
      // );

      const responsePayload: IReturnResponsePayload<typeof newUser> = {
        message: "User created successfully",
        status: 201,
        data: newUser,
      };

      return MessageUtil.success(res, responsePayload);
    } catch (error: any) {
      const errorPayload: IReturnResponsePayload = {
        message: "Failed to create user",
        status: 500,
        data: error.message,
      };

      return MessageUtil.error(res, errorPayload);
    }
  }

  public async loginUser(req: Request, res: Response): Promise<any> {
    try {
      const { email, password } = req.body;

      // Check if user exists
      const user = await Users.findOne({ where: { email } });
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
        { id: user.id, email: user.email },
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
}

// Export an instance of the class
export default new UserController();
