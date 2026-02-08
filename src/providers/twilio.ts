import {
  ProviderAdapter,
  ProviderSendOptions,
  SmsResponse,
  TwilioConfig,
} from "../type";
import { readEnv } from "../utils/env";

const DEFAULT_API_BASE_URL = "https://api.twilio.com";

function resolveConfig(config?: TwilioConfig): TwilioConfig {
  return {
    accountSid: config?.accountSid ?? readEnv("TWILIO_ACCOUNT_SID"),
    authToken: config?.authToken ?? readEnv("TWILIO_AUTH_TOKEN"),
    from: config?.from ?? readEnv("TWILIO_FROM"),
    apiBaseUrl:
      config?.apiBaseUrl ?? readEnv("TWILIO_API_BASE_URL") ?? DEFAULT_API_BASE_URL,
  };
}

function buildAuthHeader(accountSid: string, authToken: string): string {
  return `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`;
}

async function sendSingleMessage(
  config: Required<Pick<TwilioConfig, "accountSid" | "authToken" | "from" | "apiBaseUrl">>,
  to: string,
  body: string
): Promise<{ ok: boolean; status: number; data: unknown }>
{
  const url = new URL(
    `/2010-04-01/Accounts/${config.accountSid}/Messages.json`,
    config.apiBaseUrl
  );

  const form = new URLSearchParams({
    To: to,
    From: config.from,
    Body: body,
  });

  const response = await fetch(url.toString(), {
    method: "POST",
    headers: {
      Authorization: buildAuthHeader(config.accountSid, config.authToken),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: form.toString(),
  });

  let data: unknown;
  try {
    data = await response.json();
  } catch {
    data = await response.text();
  }

  return { ok: response.ok, status: response.status, data };
}

export const twilioAdapter: ProviderAdapter<TwilioConfig> = {
  id: "twilio",
  async send(options: ProviderSendOptions<TwilioConfig>): Promise<SmsResponse> {
    const config = resolveConfig(options.config);

    if (!config.accountSid || !config.authToken) {
      return {
        success: false,
        provider: "twilio",
        error:
          "Twilio credentials are missing. Provide accountSid/authToken or set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN.",
      };
    }

    if (!config.from) {
      return {
        success: false,
        provider: "twilio",
        error:
          "Twilio sender is missing. Provide from or set TWILIO_FROM.",
      };
    }

    const recipients = options.message.to;
    if (recipients.length === 0) {
      return {
        success: false,
        provider: "twilio",
        error: "At least one recipient is required.",
      };
    }

    const resolvedConfig = {
      accountSid: config.accountSid,
      authToken: config.authToken,
      from: config.from,
      apiBaseUrl: config.apiBaseUrl ?? DEFAULT_API_BASE_URL,
    };

    if (recipients.length === 1) {
      const result = await sendSingleMessage(
        resolvedConfig,
        recipients[0],
        options.message.message
      );

      if (!result.ok) {
        return {
          success: false,
          provider: "twilio",
          statusCode: result.status,
          error: "Twilio request failed.",
          data: result.data,
        };
      }

      return {
        success: true,
        provider: "twilio",
        statusCode: result.status,
        data: result.data,
      };
    }

    const results = [] as Array<{ to: string; ok: boolean; status: number; data: unknown }>;
    let hasFailure = false;

    for (const to of recipients) {
      const result = await sendSingleMessage(
        resolvedConfig,
        to,
        options.message.message
      );
      results.push({ to, ok: result.ok, status: result.status, data: result.data });
      if (!result.ok) {
        hasFailure = true;
      }
    }

    return {
      success: !hasFailure,
      provider: "twilio",
      statusCode: hasFailure ? 207 : 200,
      data: results,
      error: hasFailure ? "One or more Twilio requests failed." : undefined,
    };

  },
};
