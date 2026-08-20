export type EmailValidationResult = {
  deliverable: boolean;
  checked: boolean;
  reason?: string;
};

type ZeroBounceResponse = {
  status?: string;
  sub_status?: string;
  error?: string;
};

const REJECTED_STATUSES = new Set(["invalid", "spamtrap", "abuse", "do_not_mail"]);

export function interpretEmailValidation(response: ZeroBounceResponse): EmailValidationResult {
  const status = response.status?.trim().toLowerCase();

  if (!status) {
    return { deliverable: true, checked: false, reason: response.error ?? "missing_status" };
  }

  if (REJECTED_STATUSES.has(status)) {
    return {
      deliverable: false,
      checked: true,
      reason: response.sub_status?.trim().toLowerCase() || status,
    };
  }

  // Valid, catch-all, and unknown addresses may still belong to a real user.
  // The verification-link flow is the final proof of mailbox ownership.
  return { deliverable: true, checked: true, reason: status };
}

export async function validateEmailAddress(email: string): Promise<EmailValidationResult> {
  const apiKey = process.env.ZEROBOUNCE_API_KEY;
  if (!apiKey) return { deliverable: true, checked: false, reason: "not_configured" };

  const baseUrl = process.env.ZEROBOUNCE_API_URL ?? "https://api.zerobounce.net/v2/validate";
  const url = new URL(baseUrl);
  url.searchParams.set("api_key", apiKey);
  url.searchParams.set("email", email);
  url.searchParams.set("timeout", "8");

  try {
    const response = await fetch(url, {
      method: "GET",
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      console.warn(`[email-validation] Provider returned HTTP ${response.status}; allowing signup`);
      return { deliverable: true, checked: false, reason: `http_${response.status}` };
    }

    return interpretEmailValidation((await response.json()) as ZeroBounceResponse);
  } catch (error) {
    console.warn("[email-validation] Provider unavailable; allowing signup", error);
    return { deliverable: true, checked: false, reason: "provider_unavailable" };
  }
}

