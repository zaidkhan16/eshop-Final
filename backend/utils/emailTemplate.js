const createEmailTemplate = ({ title, name, actionUrl, buttonText, subtitle, type = "user" }) => {
  const isSeller = type === "seller";
  
  const brandBadge = isSeller ? "🏪 NEXUS SELLER PORTAL" : "⚡ NEXUS MEMBER PORTAL";
  const headerBgColor = isSeller ? "#059669" : "#2563eb";
  const headerGradient = isSeller 
    ? "linear-gradient(135deg, #059669 0%, #10b981 50%, #4f46e5 100%)" 
    : "linear-gradient(135deg, #2563eb 0%, #4f46e5 50%, #7c3aed 100%)";
  
  const buttonBgColor = isSeller ? "#10b981" : "#2563eb";
  const buttonGradient = isSeller
    ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
    : "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)";
  
  const mainTitle = title || (isSeller ? "Activate Your Shop Storefront" : "Activate Your Account");
  const defaultBtnText = buttonText || (isSeller ? "🚀 ACTIVATE MY SHOP NOW" : "✨ VERIFY & ACTIVATE ACCOUNT");
  const welcomeHeading = name ? `Hello ${name}! 👋` : `Welcome to ${isSeller ? "Nexus Seller Portal" : "Nexus Next-Gen Market"}`;
  const bodyDescription = subtitle || (isSeller
    ? "Congratulations on registering your seller account on Nexus Next-Gen Market! Click the button below to verify your email address and activate your shop storefront."
    : "Thank you for joining Nexus Next-Gen Market! Click the button below to verify your email address and unlock full access to your account.");

  const featureChecklist = isSeller ? `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 24px 0; background-color: #f8fafc; border-radius: 10px; border: 1px solid #e2e8f0;">
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
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 24px 0; background-color: #f8fafc; border-radius: 10px; border: 1px solid #e2e8f0;">
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

  const preheaderText = isSeller
    ? "Welcome to Nexus Seller Portal! Click here to verify your email address and activate your shop storefront."
    : "Welcome to Nexus Next-Gen Market! Click here to verify your email address and activate your account.";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${mainTitle}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <!-- Inbox List Preheader Preview Text -->
  <div style="display: none; max-height: 0px; overflow: hidden; font-size: 1px; line-height: 1px; color: #ffffff; opacity: 0;">
    ${preheaderText}
  </div>
  <div style="display: none; max-height: 0px; overflow: hidden; font-size: 1px; line-height: 1px; color: #ffffff; opacity: 0;">
    &nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
  </div>

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f1f5f9; padding: 30px 12px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 560px; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #cbd5e1;">
          
          <!-- Top Banner Header -->
          <tr>
            <td bgcolor="${headerBgColor}" style="background-color: ${headerBgColor}; background: ${headerGradient}; padding: 32px 20px; text-align: center;">
              <!-- Header Badge -->
              <div style="display: inline-block; padding: 4px 14px; background-color: rgba(255, 255, 255, 0.2); border: 1px solid rgba(255, 255, 255, 0.3); border-radius: 50px; font-size: 11px; font-weight: 800; color: #ffffff; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 10px;">
                ${brandBadge}
              </div>
              <h1 style="margin: 0; font-size: 22px; font-weight: 800; color: #ffffff;">${mainTitle}</h1>
            </td>
          </tr>
          
          <!-- Card Body Content -->
          <tr>
            <td style="padding: 32px 24px; text-align: left; background-color: #ffffff;">
              <h2 style="margin-top: 0; margin-bottom: 12px; font-size: 18px; font-weight: 700; color: #0f172a;">${welcomeHeading}</h2>
              
              <p style="margin-top: 0; margin-bottom: 18px; font-size: 14px; line-height: 1.6; color: #475569;">
                ${bodyDescription}
              </p>
              
              ${featureChecklist}
              
              <!-- Bulletproof Button Container -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 28px 0;">
                <tr>
                  <td align="center">
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td align="center" bgcolor="${buttonBgColor}" style="background-color: ${buttonBgColor}; background: ${buttonGradient}; border-radius: 8px; padding: 14px 32px;">
                          <a href="${actionUrl}" target="_blank" style="font-size: 15px; font-weight: 800; color: #ffffff; text-decoration: none; display: inline-block;">
                            <span style="color: #ffffff; text-decoration: none;">${defaultBtnText}</span>
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <!-- Security Notice Box -->
              <div style="margin-top: 20px; padding: 10px 14px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 12px; color: #64748b; text-align: center;">
                🔒 <strong>Security Guarantee:</strong> This link is valid for <strong>5 days</strong>.
              </div>
              
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
              
              <!-- Fallback Link -->
              <div style="background-color: #f8fafc; padding: 12px 14px; border-radius: 6px; border: 1px solid #e2e8f0;">
                <p style="margin: 0 0 4px 0; font-size: 11px; font-weight: 600; color: #64748b;">
                  Having trouble with the button? Copy and paste this link into your browser:
                </p>
                <a href="${actionUrl}" target="_blank" style="font-size: 12px; color: #2563eb; word-break: break-all; text-decoration: underline;">
                  ${actionUrl}
                </a>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 20px; text-align: center; background-color: #f8fafc; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; line-height: 1.5;">
              &copy; ${new Date().getFullYear()} <strong>Nexus Next-Gen Market Inc.</strong> All rights reserved.<br />
              Need help? Contact support at <a href="mailto:support@nexus-market.com" style="color: #2563eb; text-decoration: none;">support@nexus-market.com</a>
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
