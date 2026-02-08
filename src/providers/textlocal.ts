import {
  ProviderAdapter,
  ProviderSendOptions,
  SmsResponse,
  TextlocalConfig,
} from "../type";
import { readEnv } from "../utils/env";

function resolveConfig(config?: TextlocalConfig): TextlocalConfig {
  return {
    apiKey: config?.apiKey ?? readEnv("TEXTLOCAL_API_KEY"),
    sender: config?.sender ?? readEnv("TEXTLOCAL_SENDER"),
    apiBaseUrl: config?.apiBaseUrl ?? readEnv("TEXTLOCAL_API_BASE_URL"),
  };
}

export const textlocalAdapter: ProviderAdapter<TextlocalConfig> = {
  id: "textlocal",
  async send(options: ProviderSendOptions<TextlocalConfig>): Promise<SmsResponse> {
    const config = resolveConfig(options.config);

    if (!config.apiKey) {
      return {
        success: false,
        provider: "textlocal",
        error:
          "Textlocal API key is missing. Provide apiKey or set TEXTLOCAL_API_KEY.",
      };
    }

    return {
      success: false,
      provider: "textlocal",
      error:
        "Textlocal adapter is scaffolded. Add request details in src/providers/textlocal.ts.",
    };
  },
};
