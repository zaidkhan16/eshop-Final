const createEmailTemplate = ({ title, name, actionUrl, buttonText, subtitle, type = "user" }) => {
  const isSeller = type === "seller";
  
  // Custom theme colors & badges based on email type
  const brandBadge = isSeller ? "🏪 ESHOP SELLER PORTAL" : "⚡ ESHOP MEMBER PORTAL";
  const headerGradient = isSeller 
    ? "linear-gradient(135deg, #059669 0%, #10b981 50%, #4f46e5 100%)" 
    : "linear-gradient(135deg, #2563eb 0%, #4f46e5 50%, #7c3aed 100%)";
  const buttonBg = isSeller
    ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
    : "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)";
  const buttonShadow = isSeller
    ? "0 8px 20px -4px rgba(16, 185, 129, 0.45)"
    : "0 8px 20px -4px rgba(37, 99, 235, 0.45)";
  
  const mainTitle = title || (isSeller ? "Activate Your Shop Storefront" : "Activate Your Account");
  const defaultBtnText = buttonText || (isSeller ? "🚀 ACTIVATE MY SHOP NOW" : "✨ VERIFY & ACTIVATE ACCOUNT");
  const welcomeHeading = name ? `Hello ${name}! 👋` : `Welcome to ${isSeller ? "Eshop Seller Portal" : "Eshop"}`;
  const bodyDescription = subtitle || (isSeller
    ? "Congratulations on registering your seller account on Eshop! Click the button below to verify your email address and activate your shop storefront."
    : "Thank you for joining Eshop! Click the button below to verify your email address and unlock full access to your account.");

  const featureChecklist = isSeller ? `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin: 24px 0; background-color: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0;">
      <tr>
        <td style="padding: 14px 18px; border-bottom: 1px solid #e2e8f0; font-size: 14px; color: #334155; font-weight: 600;">
          📦 <span style="margin-left: 8px;">List products & manage live inventory</span>
        </td>
      </tr>
      <tr>
        <td style="padding: 14px 18px; border-bottom: 1px solid #e2e8f0; font-size: 14px; color: #334155; font-weight: 600;">
          📊 <span style="margin-left: 8px;">Real-time sales analytics & customer insights</span>
        </td>
      </tr>
      <tr>
        <td style="padding: 14px 18px; font-size: 14px; color: #334155; font-weight: 600;">
          💳 <span style="margin-left: 8px;">Instant payout settlements & order management</span>
        </td>
      </tr>
    </table>
  ` : `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin: 24px 0; background-color: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0;">
      <tr>
        <td style="padding: 14px 18px; border-bottom: 1px solid #e2e8f0; font-size: 14px; color: #334155; font-weight: 600;">
          🛍️ <span style="margin-left: 8px;">Shop millions of top products at best prices</span>
        </td>
      </tr>
      <tr>
        <td style="padding: 14px 18px; border-bottom: 1px solid #e2e8f0; font-size: 14px; color: #334155; font-weight: 600;">
          ⚡ <span style="margin-left: 8px;">Fast, secure checkout & instant notifications</span>
        </td>
      </tr>
      <tr>
        <td style="padding: 14px 18px; font-size: 14px; color: #334155; font-weight: 600;">
          🚚 <span style="margin-left: 8px;">Real-time order tracking & 24/7 support</span>
        </td>
      </tr>
    </table>
  `;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${mainTitle}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f1f5f9; padding: 40px 16px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 560px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04); border: 1px solid #e2e8f0;">
          
          <!-- Gradient Top Header Banner -->
          <tr>
            <td style="background: ${headerGradient}; padding: 36px 24px; text-align: center;">
              <!-- Header Badge -->
              <div style="display: inline-block; padding: 5px 16px; background: rgba(255, 255, 255, 0.22); border-radius: 50px; font-size: 12px; font-weight: 800; color: #ffffff; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 12px; backdrop-filter: blur(4px);">
                ${brandBadge}
              </div>
              <h1 style="margin: 0; font-size: 24px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">${mainTitle}</h1>
            </td>
          </tr>
          
          <!-- Card Body Content -->
          <tr>
            <td style="padding: 36px 32px; text-align: left; background-color: #ffffff;">
              <h2 style="margin-top: 0; margin-bottom: 12px; font-size: 20px; font-weight: 700; color: #0f172a;">${welcomeHeading}</h2>
              
              <p style="margin-top: 0; margin-bottom: 20px; font-size: 15px; line-height: 1.6; color: #475569;">
                ${bodyDescription}
              </p>
              
              ${featureChecklist}
              
              <!-- Glowing CTA Button Container -->
              <div style="margin: 32px 0; text-align: center;">
                <!--[if mso]>
                <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${actionUrl}" style="height:50px;v-text-anchor:middle;width:260px;" arcsize="20%" stroke="f" fillcolor="${isSeller ? '#10b981' : '#2563eb'}">
                  <w:anchorlock/>
                  <center style="color:#ffffff;font-family:sans-serif;font-size:15px;font-weight:bold;">${defaultBtnText}</center>
                </v:roundrect>
                <![endif]-->
                <!--[if !mso]><!-->
                <a href="${actionUrl}" target="_blank" style="display: inline-block; background: ${buttonBg}; color: #ffffff !important; font-size: 15px; font-weight: 800; text-decoration: none; padding: 16px 36px; border-radius: 12px; box-shadow: ${buttonShadow}; letter-spacing: 0.5px; transition: all 0.3s ease;">
                  ${defaultBtnText}
                </a>
                <!--<![endif]-->
              </div>
              
              <!-- Security Guarantee Box -->
              <div style="margin-top: 24px; padding: 12px 16px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 13px; color: #64748b; text-align: center;">
                🔒 <strong>Security Guarantee:</strong> This activation link is valid for <strong>5 minutes</strong> only.
              </div>
              
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 28px 0;" />
              
              <!-- Fallback Link Section -->
              <div style="background-color: #f8fafc; padding: 14px 16px; border-radius: 8px; border: 1px solid #e2e8f0;">
                <p style="margin: 0 0 6px 0; font-size: 12px; font-weight: 600; color: #64748b;">
                  Having trouble with the button? Copy & paste this URL into your browser:
                </p>
                <a href="${actionUrl}" target="_blank" style="font-size: 12px; color: #2563eb; word-break: break-all; text-decoration: underline;">
                  ${actionUrl}
                </a>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 24px; text-align: center; background-color: #f8fafc; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; line-height: 1.6;">
              &copy; ${new Date().getFullYear()} <strong>ESHOP Inc.</strong> All rights reserved.<br />
              Need help? Contact support at <a href="mailto:support@eshop.com" style="color: #2563eb; text-decoration: none;">support@eshop.com</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};

module.exports = createEmailTemplate;
