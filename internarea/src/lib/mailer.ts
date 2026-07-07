import nodemailer from "nodemailer";

const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;

export const createMailer = () => {
  if (!emailUser || !emailPass) {
    throw new Error("Email credentials are not configured.");
  }

  const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
};

export const fromEmail = emailUser || "";
