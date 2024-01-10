const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

const siteURL = process.env.NODE_ENV === 'production' ? 'https://vezi.store' : 'http://localhost:3000';

const generateToken = () => {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let token = '';

  for (let i = 0; i < 10; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      token += charset[randomIndex];
  }

  return token;
}
exports.generateToken = generateToken;

const createActivationEmail = (token) => {
  const templatePath = path.join(__dirname, './email_verify_template.html');
  let emailTemplate = fs.readFileSync(templatePath, 'utf-8');
  const html = emailTemplate.replace(/{{token}}/g, token).replace(/{{siteURL}}/g, siteURL);
  return html;
}

const sendActivationEmail = (email, token) => {
  const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASSWORD,
		}
  });

  const html = createActivationEmail(token);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Activate Your Account at Vezi Store',
    html: html,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};
exports.sendActivationEmail = sendActivationEmail;

const createResetPasswordEmail = (token) => {
  const templatePath = path.join(__dirname, './reset_password_template.html');
  let emailTemplate = fs.readFileSync(templatePath, 'utf-8');
  const html = emailTemplate.replace(/{{token}}/g, token).replace(/{{siteURL}}/g, siteURL);
  return html;
}

const sendResetPasswordEmail = (email, token) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    }
  });

  const html = createResetPasswordEmail(token);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Reset Your Password at Vezi Store',
    html: html,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};
exports.sendResetPasswordEmail = sendResetPasswordEmail;
