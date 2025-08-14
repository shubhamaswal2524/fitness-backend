import { readFileSync } from "fs";
import path from "path";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

const getCongratulationsTemplate = (data: {
  name: string;
  email: string;
  mobile: string;
  age: string;
  height: string;
  weight: string;
  bio: string;
}) => {
  const filePath = path.join(__dirname, "OTP-template.html");
  let template = readFileSync(filePath, "utf-8");

  // Replace placeholders in the HTML
  template = template
    .replace(/{{name}}/g, data.name)
    .replace(/{{email}}/g, data.email)
    .replace(/{{mobile}}/g, data.mobile)
    .replace(/{{age}}/g, data.age)
    .replace(/{{height}}/g, data.height)
    .replace(/{{weight}}/g, data.weight)
    .replace(/{{bio}}/g, data.bio);

  return template;
};

export const sendCongratulationsEmail = async ({
  email,
  name,
  mobile,
  age,
  height,
  weight,
  bio,
}: {
  email: string;
  name: string;
  mobile: string;
  age: string;
  height: string;
  weight: string;
  bio: string;
}) => {
  try {
    const htmlTemplate = getCongratulationsTemplate({
      name,
      email,
      mobile,
      age,
      height,
      weight,
      bio,
    });
    console.log("email=========", email);
    const msg = {
      to: email,
      from: "arshsandhufitness160@gmail.com", // must be verified in SendGrid
      subject: `🎉 Congratulations, ${name}!`,
      text: `Hi ${name}, congratulations on your achievement!`,
      html: htmlTemplate,
    };

    const response = await sgMail.send(msg);
    console.log("first", response);
  } catch (error) {
    console.log("error", error);
    return false;
  }
};
