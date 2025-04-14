import * as sgMail from "@sendgrid/mail";
import { getCongratulationsTemplate } from "./templates/signup";

class EmailService {
  private sgMail: any;

  constructor() {
    this.sgMail = sgMail.setApiKey("");
  }

  async signupMail(to: string, name: string) {
    const msg = {
      to,
      from: "your-email@example.com",
      subject: "Congratulations!",
      html: getCongratulationsTemplate(name),
    };

    try {
      await sgMail.send(msg);
      console.log("Email sent successfully to", to);
    } catch (error: any) {
      console.error(
        "Error sending email:",
        error.response?.body || error.message
      );
    }
  }
}

export const emailService = new EmailService();
