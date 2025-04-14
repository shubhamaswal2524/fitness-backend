import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "joi";
import { IReturnResponsePayload, MessageUtil } from "../utils/messageResponse";
import statusCodes from "../utils/helperConstants";

export const validateRequest = (schema: ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void | any => {
    console.log("Validating request:", req.body);

    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errorPayload: IReturnResponsePayload = {
        message: "Validation error",
        status: statusCodes.BAD_REQUEST,
        data: error.details.map((detail) => detail.message),
      };

      return MessageUtil.error(res, errorPayload);
    }

    next(); // Proceed if validation passes
  };
};
