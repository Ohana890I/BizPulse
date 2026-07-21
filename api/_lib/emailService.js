import { getResendClient, hasResendApiKey } from "./emailClient.js";
import {
  buildFounderWelcomeHtml,
  WELCOME_FOUNDER_SUBJECT,
} from "./emailTemplates.js";

export const FROM_EMAIL = "team@bizpulse.space";

export function isValidEmail(email) {
  const normalized = String(email || "").trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized);
}

export function isValidFromAddress() {
  return isValidEmail(FROM_EMAIL);
}

export async function sendFounderWelcomeEmail({ to }) {
  if (!isValidEmail(to)) {
    const error = new Error("Invalid email address.");
    error.code = "INVALID_RECIPIENT_EMAIL";
    throw error;
  }

  if (!hasResendApiKey) {
    const error = new Error("Missing RESEND_API_KEY.");
    error.code = "MISSING_RESEND_API_KEY";
    throw error;
  }

  if (!isValidFromAddress()) {
    const error = new Error("Invalid FROM_EMAIL address configuration.");
    error.code = "INVALID_FROM_EMAIL";
    throw error;
  }

  const resendClient = getResendClient();

  if (!resendClient) {
    const error = new Error("Unable to initialize Resend client.");
    error.code = "RESEND_CLIENT_INIT_FAILED";
    throw error;
  }

  const html = buildFounderWelcomeHtml();

  const result = await resendClient.emails.send({
    from: FROM_EMAIL,
    to,
    subject: WELCOME_FOUNDER_SUBJECT,
    html,
  });

  if (result?.error) {
    const resendError = new Error(result.error.message || "Resend API returned an error.");
    resendError.code = "RESEND_API_ERROR";
    resendError.details = result.error;
    throw resendError;
  }

  return result;
}
