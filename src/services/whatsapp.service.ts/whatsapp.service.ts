import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();
const accountSid = "";
const authToken = "";

class WhatsAppService {
  private client: twilio.Twilio;
  private fromNumber: string;

  constructor() {
    this.client = twilio(accountSid, authToken);
    this.fromNumber = "whats";
  }

  async sendWhatsAppMessage(to: string, message: string) {
    try {
      const response = await this.client.messages.create({
        from: "whatsa", // Twilio sandbox number
        to: `whatsapp:${to}`, // User's WhatsApp number
        body: message,
      });

      console.log("Message sent successfully:", response.sid);
    } catch (error: any) {
      console.error("Error sending message:", error.message);
    }
  }
}

// Example Usage
export const whatsappService = new WhatsAppService();
