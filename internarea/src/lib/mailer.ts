import nodemailer from "nodemailer";

const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;

export const createMailer = () => {
  if (!emailUser || !emailPass) {
    throw new Error("Email credentials are not configured.");
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });
};

export const fromEmail = emailUser || "";
