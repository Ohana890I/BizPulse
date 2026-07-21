import {
  FROM_EMAIL,
  isValidFromAddress,
  isValidEmail,
  sendFounderWelcomeEmail,
} from "../_lib/emailService.js";
import { hasResendApiKey } from "../_lib/emailClient.js";

function sendJson(res, status, payload) {
  res.status(status).json(payload);
}

function serializeError(error) {
  return {
    name: error?.name || "Error",
    code: error?.code || null,
    message: error?.message || "Unknown error",
    stack: error?.stack || null,
    details: error?.details || error?.response || null,
  };
}

export default async function handler(req, res) {
  const requestId = req.headers["x-request-id"] || `req_${Date.now()}`;

  if (req.method !== "POST") {
    return sendJson(res, 405, {
      ok: false,
      requestId,
      error: "Method not allowed.",
      code: "METHOD_NOT_ALLOWED",
    });
  }

  let body = req.body || {};

  if (typeof req.body === "string") {
    try {
      body = JSON.parse(req.body || "{}");
    } catch {
      return sendJson(res, 400, {
        ok: false,
        requestId,
        error: "Invalid JSON body.",
        code: "INVALID_JSON",
      });
    }
  }

  const email = String(body.email || "").trim().toLowerCase();

  if (!isValidEmail(email)) {
    return sendJson(res, 400, {
      ok: false,
      requestId,
      error: "Invalid email.",
      code: "INVALID_EMAIL",
    });
  }

  if (!hasResendApiKey) {
    console.error("[welcome-founder] Missing RESEND_API_KEY", {
      requestId,
      email,
      environment: process.env.VERCEL_ENV || "local",
    });
    return sendJson(res, 500, {
      ok: false,
      requestId,
      error: "Server email configuration is missing.",
      code: "MISSING_RESEND_API_KEY",
    });
  }

  if (!isValidFromAddress()) {
    console.error("[welcome-founder] Invalid sender configuration", {
      requestId,
      from: FROM_EMAIL,
      environment: process.env.VERCEL_ENV || "local",
    });
    return sendJson(res, 500, {
      ok: false,
      requestId,
      error: "Sender email configuration is invalid.",
      code: "INVALID_FROM_EMAIL",
    });
  }

  try {
    const response = await sendFounderWelcomeEmail({ to: email });
    console.info("[welcome-founder] Email sent", {
      requestId,
      email,
      from: FROM_EMAIL,
      resendId: response?.data?.id || null,
      environment: process.env.VERCEL_ENV || "local",
    });

    return sendJson(res, 200, {
      ok: true,
      requestId,
      id: response?.data?.id || null,
    });
  } catch (error) {
    console.error("[welcome-founder] Failed to send email", {
      requestId,
      email,
      from: FROM_EMAIL,
      hasResendApiKey,
      environment: process.env.VERCEL_ENV || "local",
      error: serializeError(error),
    });

    return res.status(500).json({
      ok: false,
      requestId,
      code: error?.code || "EMAIL_SEND_FAILED",
      message: error?.message || "Unknown error",
    });
  }
}
