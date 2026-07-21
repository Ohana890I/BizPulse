

import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
export const hasResendApiKey = Boolean(resendApiKey);

let cachedClient = null;

export function getResendClient() {
	if (!hasResendApiKey) {
		return null;
	}

	if (!cachedClient) {
		cachedClient = new Resend(resendApiKey);
	}

	return cachedClient;
}

