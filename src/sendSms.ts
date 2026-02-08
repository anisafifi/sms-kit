import {
  ProviderConfigMap,
  ProviderSendOptions,
  SendSmsOptions,
  SmsMessage,
  SmsProviderId,
  SmsResponse,
} from "./type";
import { getProviderAdapter } from "./providers";
import { normalizeRecipients, validateMessage } from "./utils/validation";

export async function sendSms<TProvider extends SmsProviderId>(
  options: SendSmsOptions<TProvider>
): Promise<SmsResponse> {
  const providerId = options?.provider;
  if (!providerId) {
    return {
      success: false,
      provider: "unknown",
      error: "Provider is required.",
    };
  }

  const validationError = validateMessage(options.message);
  if (validationError) {
    return {
      success: false,
      provider: providerId,
      error: validationError,
    };
  }

  const adapter = getProviderAdapter(providerId);
  if (!adapter) {
    return {
      success: false,
      provider: providerId,
      error: `Provider "${providerId}" is not supported.`,
    };
  }

  const normalizedMessage: SmsMessage = {
    ...options.message,
    to: normalizeRecipients(options.message.to),
  };

  const sendOptions: ProviderSendOptions<ProviderConfigMap[TProvider]> = {
    message: normalizedMessage,
    config: options.config,
  };

  try {
    return await adapter.send(sendOptions);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error.";
    return {
      success: false,
      provider: providerId,
      error: message,
    };
  }
}
