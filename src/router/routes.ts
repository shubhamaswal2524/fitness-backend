import { Application } from "express";
import userRouter from "./user.router";
import { paymentController } from "../controllers/payment/payment.controller";
import paymentRouter from "./payment.router";

export default function routes(app: Application): void {
  app.use("/api/v1/user", userRouter);
  app.use("/api/v1/payment", paymentRouter);
}
