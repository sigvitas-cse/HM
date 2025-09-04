const nodemailer = require('nodemailer');

let transporter = null;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    console.log('Transporter initialized'); // Debug log
  }
  return transporter;
};

const sendEmail = async (to, subject, text) => {
  try {
    const transporter = getTransporter();
    console.log(`Attempting to send email to ${to} with subject: ${subject}`); // Debug log
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    });
    console.log(`Email sent successfully to ${to}`); // Debug log
  } catch (error) {
    console.error('Email sending failed:', error.message, error.stack);
    throw new Error(`Failed to send email to ${to}: ${error.message}`);
  }
};

module.exports = { sendEmail };