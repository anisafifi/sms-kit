import {
  ProviderAdapter,
  ProviderSendOptions,
  SmsNetBdConfig,
  SmsResponse,
} from "../type";
import { readEnv } from "../utils/env";

function resolveConfig(config?: SmsNetBdConfig): SmsNetBdConfig {
  return {
    apiKey: config?.apiKey ?? readEnv("SMSNETBD_API_KEY"),
    senderId: config?.senderId ?? readEnv("SMSNETBD_SENDER_ID"),
    apiBaseUrl: config?.apiBaseUrl ?? readEnv("SMSNETBD_API_BASE_URL"),
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

    return {
      success: false,
      provider: "smsnetbd",
      error:
        "sms.net.bd adapter is scaffolded. Add request details in src/providers/smsnetbd.ts.",
    };
  },
};
