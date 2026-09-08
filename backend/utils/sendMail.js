const nodemailer = require("nodemailer");

const sendMail = async (options) => {
  const smtpMail = (process.env.SMPT_MAIL || "pathanzaidkhan99@gmail.com")
    .replace(/^["']|["']$/g, "")
    .trim();
  const smtpPassword = (process.env.SMPT_PASSWORD || "jypkicjoosjmwsxn")
    .replace(/^["']|["']$/g, "")
    .trim();
  const smtpHost = (process.env.SMPT_HOST || "smtp.gmail.com")
    .replace(/^["']|["']$/g, "")
    .trim();
  const smtpPort = parseInt(
    (process.env.SMPT_PORT || "465").replace(/^["']|["']$/g, "").trim(),
    10
  );

  const isPort465 = smtpPort === 465;

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: isPort465, // true for 465, false for 587
    auth: {
      user: smtpMail,
      pass: smtpPassword,
    },
    tls: {
      rejectUnauthorized: false,
      minVersion: "TLSv1.2",
    },
    connectionTimeout: 15000,
    greetingTimeout: 10000,
    socketTimeout: 20000,
  });

  const mailOptions = {
    from: `"Nexus Next-Gen Market" <${smtpMail}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html || options.message,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendMail;