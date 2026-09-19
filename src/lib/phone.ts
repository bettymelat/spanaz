export type PhoneValidationResult =
  | { valid: true; normalized: string; display: string }
  | { valid: false; reason: string };

function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

export function validateAndNormalizePhone(raw: string): PhoneValidationResult {
  const input = raw.trim();
  if (!input) return { valid: false, reason: "Phone number is required." };

  let compact = input.replace(/[\s().-]/g, "");
  if (compact.startsWith("00")) compact = "+" + compact.slice(2);

  // Romanian mobile: 07xxxxxxxx / +407xxxxxxxx
  if (/^07\d{8}$/.test(compact)) {
    const normalized = "+40" + compact.slice(1);
    return { valid: true, normalized, display: compact };
  }

  if (/^\+407\d{8}$/.test(compact)) {
    const national = "0" + compact.slice(3);
    return { valid: true, normalized: compact, display: national };
  }

  // International WhatsApp/mobile numbers in E.164 form.
  if (/^\+[1-9]\d{7,14}$/.test(compact)) {
    return { valid: true, normalized: compact, display: compact };
  }

  // Be helpful when someone types a Romanian mobile without the leading zero.
  if (/^7\d{8}$/.test(compact)) {
    const normalized = "+40" + compact;
    return { valid: true, normalized, display: "0" + compact };
  }

  const digits = digitsOnly(compact);
  if (digits.length > 15) {
    return { valid: false, reason: "Phone number is too long." };
  }

  return {
    valid: false,
    reason:
      "Use a valid mobile number, for example 07xx xxx xxx or an international number starting with +.",
  };
}
