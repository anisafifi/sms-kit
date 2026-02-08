import {
  ProviderAdapter,
  ProviderSendOptions,
  SmsNetBdConfig,
  SmsResponse,
} from "../type";
import { readEnv } from "../utils/env";

const DEFAULT_API_BASE_URL = "https://api.sms.net.bd/sendsms";

function resolveConfig(config?: SmsNetBdConfig): SmsNetBdConfig {
  return {
    apiKey: config?.apiKey ?? readEnv("SMSNETBD_API_KEY"),
    senderId: config?.senderId ?? readEnv("SMSNETBD_SENDER_ID"),
    schedule: config?.schedule ?? readEnv("SMSNETBD_SCHEDULE"),
    contentId: config?.contentId ?? readEnv("SMSNETBD_CONTENT_ID"),
    apiBaseUrl:
      config?.apiBaseUrl ??
      readEnv("SMSNETBD_API_BASE_URL") ??
      DEFAULT_API_BASE_URL,
  };
}

export const smsNetBdAdapter: ProviderAdapter<SmsNetBdConfig> = {
  id: "smsnetbd",
  async send(options: ProviderSendOptions<SmsNetBdConfig>): Promise<SmsResponse> {
    const config = resolveConfig(options.config);

    if (!config.apiKey) {
      return {
        success: false,
        provider: "smsnetbd",
        error:
          "sms.net.bd API key is missing. Provide apiKey or set SMSNETBD_API_KEY.",
      };
    }

    const recipients = options.message.to.join(",");
    const payload: Record<string, string> = {
      api_key: config.apiKey,
      msg: options.message.message,
      to: recipients,
    };

    const senderId = options.message.senderId ?? config.senderId;
    if (senderId) {
      payload.sender_id = senderId;
    }

    if (config.schedule) {
      payload.schedule = config.schedule;
    }

    if (config.contentId) {
      payload.content_id = config.contentId;
    }

    const response = await fetch(config.apiBaseUrl ?? DEFAULT_API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    let data: unknown;
    try {
      data = await response.json();
    } catch {
      data = await response.text();
    }

    if (!response.ok) {
      return {
        success: false,
        provider: "smsnetbd",
        statusCode: response.status,
        error: "sms.net.bd request failed.",
        data,
      };
    }

    return {
      success: true,
      provider: "smsnetbd",
      statusCode: response.status,
      data,
    };
  },
};
