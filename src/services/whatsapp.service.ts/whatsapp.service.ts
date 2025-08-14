import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

class WhatsAppService {
  private client: twilio.Twilio;
  private fromNumber: string;

  constructor() {
    this.client = twilio(accountSid, authToken);
    this.fromNumber = process.env.TWILIO_WHATSAPP_NUMBER || "";
  }

  async sendWhatsAppMessage(to: string, message: string) {
    try {
      const cleanedNumber = to.replace(/^\+/, "").replace(/\s+/g, "");
      console.log("=======>>>>>>", `whatsapp:+91${cleanedNumber}`);
      const response = await this.client.messages.create({
        from: this.fromNumber, // Twilio sandbox number
        to: `whatsapp:+91${cleanedNumber}`, // e.g., 'whatsapp:+917878787878'
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
