import { Application, Request, Response } from "express";
import userRouter from "./user.router";
import adminRouter from "./admin.router";
import { paymentController } from "../controllers/payment/payment.controller";
import paymentRouter from "./payment.router";

export default function routes(app: Application): void {
  // Healthcheck route
  app.get("/api/v1/healthcheck", (req: Request, res: Response) => {
    res.status(200).json({ status: "ok", message: "Server is healthy" });
  });
  app.use("/api/v1/user", userRouter);
  app.use("/api/v1/admin", adminRouter);
  app.use("/api/v1/payment", paymentRouter);
}
