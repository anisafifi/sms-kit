import {
  BulkSmsConfig,
  ProviderAdapter,
  ProviderSendOptions,
  SmsResponse,
} from "../type";
import { readEnv } from "../utils/env";

function resolveConfig(config?: BulkSmsConfig): BulkSmsConfig {
  return {
    tokenId: config?.tokenId ?? readEnv("BULKSMS_TOKEN_ID"),
    tokenSecret: config?.tokenSecret ?? readEnv("BULKSMS_TOKEN_SECRET"),
    apiBaseUrl: config?.apiBaseUrl ?? readEnv("BULKSMS_API_BASE_URL"),
  };
}

export const bulksmsAdapter: ProviderAdapter<BulkSmsConfig> = {
  id: "bulksms",
  async send(options: ProviderSendOptions<BulkSmsConfig>): Promise<SmsResponse> {
    const config = resolveConfig(options.config);

    if (!config.tokenId || !config.tokenSecret) {
      return {
        success: false,
        provider: "bulksms",
        error:
          "BulkSMS credentials are missing. Provide tokenId/tokenSecret or set BULKSMS_TOKEN_ID and BULKSMS_TOKEN_SECRET.",
      };
    }

    return {
      success: false,
      provider: "bulksms",
      error:
        "BulkSMS adapter is scaffolded. Add request details in src/providers/bulksms.ts.",
    };
  },
};
