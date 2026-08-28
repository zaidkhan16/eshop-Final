const nodemailer = require("nodemailer");

const sendMail = async (options) => {
    const smtpPassword = (process.env.SMPT_PASSWORD || "").replace(/^["']|["']$/g, "").trim();
    const smtpMail = (process.env.SMPT_MAIL || "").replace(/^["']|["']$/g, "").trim();

    const transporter = nodemailer.createTransport({
        host: process.env.SMPT_HOST || "smtp.gmail.com",
        port: Number(process.env.SMPT_PORT) || 465,
        secure: true,
        service: process.env.SMPT_SERVICE || "gmail",
        auth: {
            user: smtpMail,
            pass: smtpPassword,
        },
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