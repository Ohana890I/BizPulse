export const WELCOME_FOUNDER_SUBJECT = "🎉 Welcome to BizPulse Founder Pass";

export function buildFounderWelcomeHtml() {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.65; color: #0f172a; max-width: 640px; margin: 0 auto;">
      <h1 style="font-size: 28px; margin-bottom: 16px;">Welcome to BizPulse 🚀</h1>
      <p>Thank you for completing our business survey.</p>
      <p>Your Founder Pass has been successfully reserved.</p>

      <p style="margin-top: 20px; font-weight: 600;">As a Founder member you will receive:</p>
      <ul style="padding-left: 18px; margin-top: 8px;">
        <li>🚀 1 month FREE</li>
        <li>💸 50% OFF for 12 months</li>
        <li>⭐ Early Access</li>
        <li>👑 Founder Status</li>
      </ul>

      <p style="margin-top: 20px;">
        When BizPulse officially launches we will send another email containing your personal Founder Pass code and instructions to activate your benefits.
      </p>

      <p style="margin-top: 20px;">Thank you for helping us build BizPulse.</p>
      <p style="font-weight: 600;">The BizPulse Team</p>
    </div>
  `;
}
