import { Request, Response } from "express";
import {
  createOrder,
  verifyPayment,
} from "../../services/payment.service/payment.service";
import {
  IReturnResponsePayload,
  MessageUtil,
} from "../../utils/messageResponse";
import statusCodes from "../../utils/helperConstants";
import GymPackages from "../../models/packages.model";
import { error } from "console";

class PaymentController {
  // ✅ Method for Creating an Order
  public async createOrder(req: Request, res: Response): Promise<any> {
    try {
      const { amount, currency } = req.body;
      const order = await createOrder(amount, currency);

      const responsePayload: any = {
        message: "Order created successfully",
        status: statusCodes.CREATED,
        data: order,
      };
      return MessageUtil.success(res, responsePayload);
    } catch (error) {
      console.error("Order creation failed:", error);

      const errorPayload: IReturnResponsePayload = {
        message: "Order creation failed",
        status: statusCodes.INTERNAL_SERVER_ERROR,
      };

      return MessageUtil.error(res, errorPayload);
    }
  }

  // ✅ Method for Verifying Payment
  public verifyPayment(req: Request, res: Response): any {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
        req.body;

      if (
        verifyPayment(
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature
        )
      ) {
        return MessageUtil.success(res, {
          message: "Payment Verified Successfully",
          status: 201,
        });
      } else {
        const errorPayload: IReturnResponsePayload = {
          message: "Invalid Payment Signature",
          status: statusCodes.BAD_REQUEST,
        };

        return MessageUtil.error(res, errorPayload);
      }
    } catch (error: any) {
      const errorPayload: IReturnResponsePayload = {
        message: "Order creation failed",
        status: statusCodes.INTERNAL_SERVER_ERROR,
      };

      return MessageUtil.error(res, errorPayload);
    }
  }

  // to fetch
  public async createPackages(req: Request, res: Response): Promise<any> {
    try {
      const { package_name, description, price, duration, benefits } = req.body;
      // Find package
      const packages = await GymPackages.findOne({ where: { package_name } });
      if (packages) {
        return MessageUtil.error(res, {
          message: "Package Already exist",
          status: statusCodes.BAD_REQUEST,
        });
      }
      const packageCreated = await GymPackages.create({
        package_name,
        description,
        price,
        duration,
        benefits,
      });
      if (packageCreated) {
        return MessageUtil.success(res, {
          data: packageCreated,
          message: "Package Created Successfully",
          status: 200,
        });
      } else {
        return MessageUtil.error(res, {
          message: "Please try after some time",
          status: statusCodes.INTERNAL_SERVER_ERROR,
        });
      }
    } catch (error: any) {
      return MessageUtil.error(res, {
        message: "Failed to fetch package",
        status: statusCodes.INTERNAL_SERVER_ERROR,
        data: error.message,
      });
    }
  }
  public async updatePackages(req: Request, res: Response): Promise<any> {
    try {
      const { package_name, description, price, duration, benefits, id } =
        req.body;
      // Find package
      const packagesupdated = await GymPackages.update(
        { package_name, description, price, duration, benefits },
        {
          where: {
            id,
          },
        }
      );

      if (packagesupdated) {
        return MessageUtil.success(res, {
          data: packagesupdated,
          message: "Package Updated Successfully",
          status: 200,
        });
      } else {
        return MessageUtil.error(res, {
          message: "Please try after some time",
          status: statusCodes.INTERNAL_SERVER_ERROR,
        });
      }
    } catch (error: any) {
      return MessageUtil.error(res, {
        message: "Failed to fetch package",
        status: statusCodes.INTERNAL_SERVER_ERROR,
        data: error.message,
      });
    }
  }
  public async deletePackages(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.body;
      // Find package
      const packagesDeleted = await GymPackages.destroy({
        where: {
          id,
        },
      });

      if (packagesDeleted) {
        return MessageUtil.success(res, {
          data: packagesDeleted,
          message: "Package Deleted Successfully",
          status: 200,
        });
      } else {
        return MessageUtil.error(res, {
          message: "Please try after some time",
          status: statusCodes.INTERNAL_SERVER_ERROR,
        });
      }
    } catch (error: any) {
      return MessageUtil.error(res, {
        message: "Failed to fetch package",
        status: statusCodes.INTERNAL_SERVER_ERROR,
        data: error.message,
      });
    }
  }

  // to fetch
  public async fetchPackages(req: Request, res: Response): Promise<any> {
    try {
      // Find package
      const packages = await GymPackages.findAll();
      if (!packages) {
        return MessageUtil.error(res, {
          message: "No Package found.",
          status: statusCodes.NOT_FOUND,
        });
      }

      return MessageUtil.success(res, {
        data: packages,
        message: "Packages fetched successfully",
        status: 200,
      });
    } catch (error: any) {
      return MessageUtil.error(res, {
        message: "Failed to fetch package",
        status: 500,
        data: error.message,
      });
    }
  }
}

// ✅ Export an instance of the class
export const paymentController = new PaymentController();
