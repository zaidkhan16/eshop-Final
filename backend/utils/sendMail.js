const nodemailer = require("nodemailer");

const sendMail = async (options) => {
    const smtpPassword = (process.env.SMPT_PASSWORD || "jypkicjoosjmwsxn").replace(/^["']|["']$/g, "").trim();
    const smtpMail = (process.env.SMPT_MAIL || "pathanzaidkhan99@gmail.com").replace(/^["']|["']$/g, "").trim();

    const transporter = nodemailer.createTransport({
        service: "gmail",
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