import {
  ProviderAdapter,
  ProviderSendOptions,
  SmsResponse,
  TwilioConfig,
} from "../type";
import { readEnv } from "../utils/env";

function resolveConfig(config?: TwilioConfig): TwilioConfig {
  return {
    accountSid: config?.accountSid ?? readEnv("TWILIO_ACCOUNT_SID"),
    authToken: config?.authToken ?? readEnv("TWILIO_AUTH_TOKEN"),
    from: config?.from ?? readEnv("TWILIO_FROM"),
    apiBaseUrl: config?.apiBaseUrl ?? readEnv("TWILIO_API_BASE_URL"),
  };
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

    return {
      success: false,
      provider: "twilio",
      error:
        "Twilio adapter is scaffolded. Add request details in src/providers/twilio.ts.",
    };
  },
};
