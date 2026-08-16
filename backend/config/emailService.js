const nodemailer = require("nodemailer");

let transporterPromise = null;

async function getTransporter() {
  if (!transporterPromise) {
    transporterPromise = nodemailer.createTestAccount().then((testAccount) => {
      return nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    });
  }
  return transporterPromise;
}

async function sendResetEmail(toEmail, resetToken) {
  const transporter = await getTransporter();

  const resetLink = `http://localhost:4200/reset-password?token=${resetToken}`;

  const info = await transporter.sendMail({
    from: '"ResumeFlow" <no-reply@resumeflow.com>',
    to: toEmail,
    subject: "Reset your ResumeFlow password",
    html: `
      <p>You requested a password reset.</p>
      <p><a href="${resetLink}">Click here to reset your password</a></p>
      <p>If you didn't request this, ignore this email.</p>
    `,
  });

  console.log("Reset email sent. Preview URL:", nodemailer.getTestMessageUrl(info));
}

module.exports = { sendResetEmail };