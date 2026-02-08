import {
  BulkSmsBdConfig,
  ProviderAdapter,
  ProviderSendOptions,
  SmsResponse,
} from "../type";
import { readEnv } from "../utils/env";

const DEFAULT_API_BASE_URL = "http://bulksmsbd.net/api/smsapi";

function resolveConfig(config?: BulkSmsBdConfig): BulkSmsBdConfig {
  return {
    apiKey: config?.apiKey ?? readEnv("BULKSMSBD_API_KEY"),
    senderId: config?.senderId ?? readEnv("BULKSMSBD_SENDER_ID"),
    apiBaseUrl:
      config?.apiBaseUrl ??
      readEnv("BULKSMSBD_API_BASE_URL") ??
      DEFAULT_API_BASE_URL,
  };
}

export const bulksmsbdAdapter: ProviderAdapter<BulkSmsBdConfig> = {
  id: "bulksmsbd",
  async send(options: ProviderSendOptions<BulkSmsBdConfig>): Promise<SmsResponse> {
    const config = resolveConfig(options.config);

    if (!config.apiKey) {
      return {
        success: false,
        provider: "bulksmsbd",
        error:
          "BulkSMSBD API key is missing. Provide apiKey or set BULKSMSBD_API_KEY.",
      };
    }

    if (!config.senderId && !options.message.senderId) {
      return {
        success: false,
        provider: "bulksmsbd",
        error:
          "BulkSMSBD sender ID is missing. Provide senderId or set BULKSMSBD_SENDER_ID.",
      };
    }

    const recipients = options.message.to.join(",");
    const senderId = options.message.senderId ?? config.senderId ?? "";
    const params = new URLSearchParams({
      api_key: config.apiKey,
      type: "text",
      number: recipients,
      senderid: senderId,
      message: options.message.message,
    });

    const response = await fetch(config.apiBaseUrl ?? DEFAULT_API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
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
        provider: "bulksmsbd",
        statusCode: response.status,
        error: "BulkSMSBD request failed.",
        data,
      };
    }

    return {
      success: true,
      provider: "bulksmsbd",
      statusCode: response.status,
      data,
    };
  },
};
