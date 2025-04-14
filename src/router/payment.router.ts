import express from "express";
import { paymentController } from "../controllers/payment/payment.controller";

export default express
  .Router()
  .post("/create-order", paymentController.createOrder)
  .post("/verify-payment", paymentController.verifyPayment)
  .get("/fetch-packages", paymentController.fetchPackages)
  .post("/create-package", paymentController.createPackages)
  .patch("/update-package", paymentController.updatePackages)
  .delete("/delete-package", paymentController.deletePackages);
