import express from "express";
import { paymentController } from "../controllers/payment/payment.controller";
import webhookController from "../controllers/webhooks/webhook.controller";

export default express
  .Router()
  .post("/webhook", webhookController.whatsappWebhook);
