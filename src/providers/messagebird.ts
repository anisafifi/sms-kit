import {
  MessageBirdConfig,
  ProviderAdapter,
  ProviderSendOptions,
  SmsResponse,
} from "../type";
import { readEnv } from "../utils/env";

function resolveConfig(config?: MessageBirdConfig): MessageBirdConfig {
  return {
    accessKey: config?.accessKey ?? readEnv("MESSAGEBIRD_API_KEY"),
    originator: config?.originator ?? readEnv("MESSAGEBIRD_ORIGINATOR"),
    apiBaseUrl: config?.apiBaseUrl ?? readEnv("MESSAGEBIRD_API_BASE_URL"),
  };
}

export const messageBirdAdapter: ProviderAdapter<MessageBirdConfig> = {
  id: "messagebird",
  async send(options: ProviderSendOptions<MessageBirdConfig>): Promise<SmsResponse> {
    const config = resolveConfig(options.config);

    if (!config.accessKey) {
      return {
        success: false,
        provider: "messagebird",
        error:
          "MessageBird access key is missing. Provide accessKey or set MESSAGEBIRD_API_KEY.",
      };
    }

    return {
      success: false,
      provider: "messagebird",
      error:
        "MessageBird adapter is scaffolded. Add request details in src/providers/messagebird.ts.",
    };
  },
};
