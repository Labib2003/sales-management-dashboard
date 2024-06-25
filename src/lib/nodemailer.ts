import { createTransport } from "nodemailer";

const transporter = createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export default transporter;
