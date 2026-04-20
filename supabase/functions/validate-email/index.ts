// Email validation edge function
// - Strict format check
// - Disposable-domain blocklist
// - DNS MX lookup
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com', 'tempmail.com', 'temp-mail.org', 'guerrillamail.com',
  'guerrillamail.net', 'guerrillamail.org', 'sharklasers.com', '10minutemail.com',
  'yopmail.com', 'trashmail.com', 'getnada.com', 'maildrop.cc', 'fakeinbox.com',
  'throwawaymail.com', 'mailnesia.com', 'mintemail.com', 'mohmal.com',
  'spambox.us', 'dispostable.com', 'mytemp.email', 'tempinbox.com',
  'fakemail.net', 'tempmailo.com', 'temp-mail.io', 'inboxbear.com',
  'emailondeck.com', 'moakt.com', 'mvrht.com', 'spam4.me',
]);

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

interface ValidationResult {
  valid: boolean;
  reason?: string;
  code?: 'invalid_format' | 'disposable' | 'no_mx' | 'dns_error';
}

async function validateEmail(email: string): Promise<ValidationResult> {
  const trimmed = email.trim().toLowerCase();

  if (!trimmed || trimmed.length > 254 || !EMAIL_REGEX.test(trimmed)) {
    return { valid: false, reason: 'Invalid email format', code: 'invalid_format' };
  }

  const domain = trimmed.split('@')[1];
  if (!domain) {
    return { valid: false, reason: 'Invalid email format', code: 'invalid_format' };
  }

  if (DISPOSABLE_DOMAINS.has(domain)) {
    return { valid: false, reason: 'Disposable email addresses are not allowed', code: 'disposable' };
  }

  try {
    const records = await Deno.resolveDns(domain, 'MX');
    if (!records || records.length === 0) {
      return { valid: false, reason: 'Email domain cannot receive mail', code: 'no_mx' };
    }
    return { valid: true };
  } catch (err) {
    // Some domains have only A records — accept as fallback
    try {
      const a = await Deno.resolveDns(domain, 'A');
      if (a && a.length > 0) return { valid: true };
    } catch (_) { /* ignore */ }
    console.warn('[validate-email] DNS lookup failed for', domain, err);
    return { valid: false, reason: 'Email domain not found', code: 'dns_error' };
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();
    if (typeof email !== 'string') {
      return new Response(
        JSON.stringify({ valid: false, reason: 'Email is required', code: 'invalid_format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }
    const result = await validateEmail(email);
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('[validate-email] error', err);
    return new Response(
      JSON.stringify({ valid: false, reason: 'Validation failed', code: 'dns_error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
