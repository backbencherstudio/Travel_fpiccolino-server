const nodemailer = require("nodemailer");
const { emailForgotPasswordOTP, emailMessage, emailUpdateOTP, resendRegistrationOTPEmail, paymentSuccessEmailNotification } = require("../constants/email_message");
require("dotenv").config();

// const generateOTP = () => {
//   return Math.floor(1000 + Math.random() * 9000).toString();
// };

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendEmail = async (to, subject, htmlContent) => {
  const mailTransporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    service: "gmail",
    auth: {
      user: process.env.node_mailer_user,
      pass: process.env.NODE_MAILER_PASSWORD,
    },
  });
 
  const mailOptions = {
    from: `"LA TUA FUGA"<tqmhosain@gmail.com>`,
    to,
    subject,
    html: htmlContent,
  };

  await mailTransporter.sendMail(mailOptions);
};

// Different email templates can be passed here
const sendRegistrationOTPEmail = async (userName, email, otp) => {
  await sendEmail(email, "Your OTP Code for SocialApp", emailMessage(userName, email, otp)); 
};

const sendUpdateEmailOTP = async (userName, email, otp) => {
  await sendEmail(email, "Your OTP Code for SocialApp", emailUpdateOTP(userName, email, otp));
};

const sendForgotPasswordOTP = async (userName, email, otp) => {
  await sendEmail(email, "Your OTP Code for SocialApp", emailForgotPasswordOTP(userName, email, otp));
};

const resendRegistrationOTP = async (userName, email, otp) => {
  await sendEmail(email, "Your OTP Code for SocialApp", resendRegistrationOTPEmail(userName, email, otp));
};

const paymentSuccessEmail = async (email) => {
  await sendEmail(email, "Payment successfull", paymentSuccessEmailNotification(email) )
}

module.exports = {
  generateOTP,
  sendEmail,
  sendRegistrationOTPEmail,
  sendUpdateEmailOTP,
  sendForgotPasswordOTP,
  resendRegistrationOTP,
  paymentSuccessEmail
};

