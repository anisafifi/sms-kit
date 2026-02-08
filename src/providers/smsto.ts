import {
  ProviderAdapter,
  ProviderSendOptions,
  SmsResponse,
  SmsToConfig,
} from "../type";
import { readEnv } from "../utils/env";

function resolveConfig(config?: SmsToConfig): SmsToConfig {
  return {
    apiKey: config?.apiKey ?? readEnv("SMSTO_API_KEY"),
    senderId: config?.senderId ?? readEnv("SMSTO_SENDER_ID"),
    apiBaseUrl: config?.apiBaseUrl ?? readEnv("SMSTO_API_BASE_URL"),
  };
}

export const smsToAdapter: ProviderAdapter<SmsToConfig> = {
  id: "smsto",
  async send(options: ProviderSendOptions<SmsToConfig>): Promise<SmsResponse> {
    const config = resolveConfig(options.config);

    if (!config.apiKey) {
      return {
        success: false,
        provider: "smsto",
        error:
          "SMS.to API key is missing. Provide apiKey or set SMSTO_API_KEY.",
      };
    }

    return {
      success: false,
      provider: "smsto",
      error: "SMS.to adapter is scaffolded. Add request details in src/providers/smsto.ts.",
    };
  },
};
