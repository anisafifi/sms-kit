import {
  ProviderAdapter,
  ProviderSendOptions,
  SmsResponse,
  AutomasConfig,
} from "../type";
import { readEnv } from "../utils/env";

const DEFAULT_API_BASE_URL = "https://api.automas.sms.com";

function resolveConfig(config?: AutomasConfig): AutomasConfig {
  return {
    apiKey: config?.apiKey ?? readEnv("AUTOMAS_API_KEY"),
    senderId: config?.senderId ?? readEnv("AUTOMAS_SENDER_ID"),
    apiBaseUrl: config?.apiBaseUrl ?? readEnv("AUTOMAS_API_BASE_URL") ?? DEFAULT_API_BASE_URL,
  };
}

export const automasAdapter: ProviderAdapter<AutomasConfig> = {
  id: "automas",
  async send(options: ProviderSendOptions<AutomasConfig>): Promise<SmsResponse> {
    const config = resolveConfig(options.config);

    if (!config.apiKey) {
      return {
        success: false,
        provider: "automas",
        error: "Automas apiKey is missing. Provide apiKey or set AUTOMAS_API_KEY.",
      };
    }

    const recipients = options.message.to;
    if (!recipients || recipients.length === 0) {
      return {
        success: false,
        provider: "automas",
        error: "At least one recipient is required.",
      };
    }

    // Automas accepts multiple recipients as comma-separated
    const toParam = recipients.join(",");

    const params = new URLSearchParams({
      api_key: config.apiKey,
      to: toParam,
      message: options.message.message,
    } as Record<string, string>);

    if (options.message.senderId || config.senderId) {
      params.set("sender_id", options.message.senderId ?? config.senderId ?? "");
    }

    // If message may include scheduling or campaign tracking, allow passing via message object extras
    // The library doesn't define extras on SmsMessage; users can pass schedule via message.senderId pattern or config.

    const baseUrl = config.apiBaseUrl ?? DEFAULT_API_BASE_URL;
    const url = `${baseUrl.replace(/\/$/, "")}/sms/send?${params.toString()}`;

    let res: Response;
    try {
      res = await fetch(url, { method: "GET" });
    } catch (err) {
      return {
        success: false,
        provider: "automas",
        error: "Network error when contacting Automas.",
        data: err instanceof Error ? err.message : String(err),
      };
    }

    let data: unknown;
    try {
      data = await res.json();
    } catch {
      data = await res.text();
    }

    // Automas example response contains `error: 0` when accepted
    const accepted = typeof data === "object" && data !== null && (data as any).error === 0;

    return {
      success: !!accepted && res.ok,
      provider: "automas",
      statusCode: res.status,
      data,
      error: accepted || res.ok ? undefined : "Automas request failed.",
    };
  },
};
