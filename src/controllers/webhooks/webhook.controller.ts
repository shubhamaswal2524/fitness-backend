import { Request, Response } from "express";
import { whatsappService } from "../../services/whatsapp.service.ts/whatsapp.service";

class webhookController {
  public async whatsappWebhook(req: Request, res: Response): Promise<any> {
    try {
      const incomingMsg = req.body.Body?.trim()?.toLowerCase();
      const from = req.body.From;

      console.log("Incoming WhatsApp message:", incomingMsg, "From:", from);

      let reply: string;

      switch (incomingMsg) {
        case "package-1":
          reply =
            "✅ You have selected *package-1*. We will contact you shortly.";
          break;
        case "package-2":
          reply =
            "✅ You have selected *package-2*. We will contact you shortly.";
          break;
        case "package-3":
          reply =
            "✅ You have selected *package-3*. We will contact you shortly.";
          break;
        default:
          reply =
            "❌ Invalid option. Please reply with: package-1, package-2, or package-3.";
      }

      await whatsappService.sendWhatsAppMessage(
        from.replace("whatsapp:", ""),
        reply
      );

      // Return success without data
      return res.sendStatus(200);
    } catch (error) {
      console.error("Error processing WhatsApp message:", error);

      return res.sendStatus(500);
    }
  }
}

// ✅ Export an instance of the class
export default new webhookController();
