const createEmailTemplate = ({ title, name, actionUrl, buttonText, subtitle, type = "user" }) => {
  const isSeller = type === "seller";
  
  // Color tokens & badges based on email type
  const brandBadge = isSeller ? "🏪 ESHOP SELLER PORTAL" : "⚡ ESHOP MEMBER PORTAL";
  const headerGradient = isSeller 
    ? "linear-gradient(135deg, #059669 0%, #10b981 50%, #6366f1 100%)" 
    : "linear-gradient(135deg, #4f46e5 0%, #3b82f6 50%, #06b6d4 100%)";
  const buttonGradient = isSeller
    ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
    : "linear-gradient(135deg, #4f46e5 0%, #2563eb 100%)";
  const buttonShadow = isSeller
    ? "0 10px 25px -5px rgba(16, 185, 129, 0.4)"
    : "0 10px 25px -5px rgba(79, 70, 229, 0.4)";
  
  const defaultButtonText = buttonText || (isSeller ? "🚀 ACTIVATE MY SHOP NOW" : "VERIFY & ACTIVATE ACCOUNT");
  const mainTitle = title || (isSeller ? "Activate Your Shop Storefront" : "Activate Your Account");
  
  const featureList = isSeller ? `
    <table cellpadding="0" cellspacing="0" width="100%" style="margin-top: 24px; margin-bottom: 28px; background-color: #1e293b; border-radius: 12px; border: 1px solid #334155; text-align: left;">
      <tr>
        <td style="padding: 14px 18px; border-bottom: 1px solid #334155; color: #f8fafc; font-size: 14px; font-weight: 600;">
          📦 <span style="margin-left: 8px;">Manage products & live inventory</span>
        </td>
      </tr>
      <tr>
        <td style="padding: 14px 18px; border-bottom: 1px solid #334155; color: #f8fafc; font-size: 14px; font-weight: 600;">
          📊 <span style="margin-left: 8px;">Real-time sales analytics & reporting</span>
        </td>
      </tr>
      <tr>
        <td style="padding: 14px 18px; color: #f8fafc; font-size: 14px; font-weight: 600;">
          💳 <span style="margin-left: 8px;">Instant payout settlements & order management</span>
        </td>
      </tr>
    </table>
  ` : `
    <table cellpadding="0" cellspacing="0" width="100%" style="margin-top: 24px; margin-bottom: 28px; background-color: #1e293b; border-radius: 12px; border: 1px solid #334155; text-align: left;">
      <tr>
        <td style="padding: 14px 18px; border-bottom: 1px solid #334155; color: #f8fafc; font-size: 14px; font-weight: 600;">
          🛍️ <span style="margin-left: 8px;">Shop millions of trending products</span>
        </td>
      </tr>
      <tr>
        <td style="padding: 14px 18px; border-bottom: 1px solid #334155; color: #f8fafc; font-size: 14px; font-weight: 600;">
          ⚡ <span style="margin-left: 8px;">Fast, secure checkout & instant notifications</span>
        </td>
      </tr>
      <tr>
        <td style="padding: 14px 18px; color: #f8fafc; font-size: 14px; font-weight: 600;">
          📦 <span style="margin-left: 8px;">Real-time order tracking & 24/7 support</span>
        </td>
      </tr>
    </table>
  `;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${mainTitle}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #0b0f19;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #e2e8f0;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      table-layout: fixed;
      background-color: #0b0f19;
      padding: 40px 16px;
    }
    .main-table {
      max-width: 580px;
      margin: 0 auto;
      background-color: #0f172a;
      border-radius: 20px;
      border: 1px solid #1e293b;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
      overflow: hidden;
    }
    .header-bar {
      background: ${headerGradient};
      padding: 36px 24px;
      text-align: center;
    }
    .badge {
      display: inline-block;
      padding: 6px 16px;
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(8px);
      border-radius: 50px;
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 1px;
      color: #ffffff;
      text-transform: uppercase;
      margin-bottom: 12px;
    }
    .header-title {
      margin: 0;
      font-size: 26px;
      font-weight: 800;
      letter-spacing: -0.5px;
      color: #ffffff;
      text-shadow: 0 2px 8px rgba(0,0,0,0.3);
    }
    .body-content {
      padding: 40px 32px;
      text-align: center;
    }
    .greeting {
      font-size: 22px;
      font-weight: 700;
      color: #f8fafc;
      margin-top: 0;
      margin-bottom: 12px;
    }
    .subtext {
      font-size: 15px;
      line-height: 1.6;
      color: #94a3b8;
      margin-bottom: 24px;
    }
    .cta-container {
      margin: 32px 0;
      text-align: center;
    }
    .cta-button {
      display: inline-block;
      padding: 18px 40px;
      font-size: 16px;
      font-weight: 800;
      color: #ffffff !important;
      text-decoration: none;
      background: ${buttonGradient};
      border-radius: 14px;
      box-shadow: ${buttonShadow};
      letter-spacing: 0.5px;
      transition: all 0.3s ease;
    }
    .security-box {
      margin-top: 28px;
      padding: 12px 18px;
      background: rgba(30, 41, 59, 0.7);
      border: 1px solid #334155;
      border-radius: 10px;
      font-size: 13px;
      color: #cbd5e1;
      display: inline-block;
    }
    .divider {
      border: none;
      height: 1px;
      background: #1e293b;
      margin: 32px 0;
    }
    .fallback-box {
      background-color: #0b0f19;
      padding: 16px;
      border-radius: 10px;
      border: 1px solid #1e293b;
      text-align: left;
    }
    .fallback-title {
      font-size: 12px;
      font-weight: 600;
      color: #64748b;
      margin: 0 0 8px 0;
    }
    .fallback-url {
      font-size: 13px;
      color: #38bdf8;
      word-break: break-all;
      text-decoration: none;
    }
    .footer {
      padding: 24px;
      text-align: center;
      background-color: #080c14;
      font-size: 12px;
      color: #64748b;
      border-top: 1px solid #1e293b;
      line-height: 1.5;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <table class="main-table" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td class="header-bar">
          <div class="badge">${brandBadge}</div>
          <h1 class="header-title">${mainTitle}</h1>
        </td>
      </tr>
      <tr>
        <td class="body-content">
          <h2 class="greeting">Hello ${name}! 👋</h2>
          <p class="subtext">${subtitle}</p>

          ${featureList}

          <!-- CALL TO ACTION BUTTON -->
          <div class="cta-container">
            <!--[if mso]>
            <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${actionUrl}" style="height:54px;v-text-anchor:middle;width:260px;" arcsize="26%" stroke="f" fillcolor="${isSeller ? '#10b981' : '#4f46e5'}">
              <w:anchorlock/>
              <center style="color:#ffffff;font-family:sans-serif;font-size:16px;font-weight:bold;">${defaultButtonText}</center>
            </v:roundrect>
            <![endif]-->
            <!--[if !mso]><!-->
            <a href="${actionUrl}" class="cta-button" target="_blank" style="display: inline-block; padding: 18px 40px; font-size: 16px; font-weight: 800; color: #ffffff !important; text-decoration: none; background: ${buttonGradient}; border-radius: 14px; box-shadow: ${buttonShadow}; letter-spacing: 0.5px;">${defaultButtonText}</a>
            <!--<![endif]-->
          </div>

          <div class="security-box">
            🔒 <strong>Security Guarantee:</strong> This activation link will expire in <strong>5 minutes</strong>.
          </div>

          <hr class="divider" />

          <div class="fallback-box">
            <p class="fallback-title">Having trouble clicking the button? Copy and paste this link into your browser:</p>
            <a href="${actionUrl}" class="fallback-url" target="_blank">${actionUrl}</a>
          </div>
        </td>
      </tr>
      <tr>
        <td class="footer">
          &copy; ${new Date().getFullYear()} <strong>ESHOP Inc.</strong> All rights reserved.<br/>
          This is an automated security message. If you did not request this, please ignore it or contact security support.
        </td>
      </tr>
    </table>
  </div>
</body>
</html>
  `;
};

module.exports = createEmailTemplate;
