import {
  MimSmsConfig,
  ProviderAdapter,
  ProviderSendOptions,
  SmsResponse,
} from "../type";
import { readEnv } from "../utils/env";

const DEFAULT_API_BASE_URL = "https://api.mimsms.com";
const DEFAULT_SINGLE_ENDPOINT = "/api/SmsSending/SMS";
const DEFAULT_ONE_TO_MANY_ENDPOINT = "/api/SmsSending/OneToMany";

function resolveConfig(config?: MimSmsConfig): MimSmsConfig {
  return {
    username: config?.username ?? readEnv("MIMSMS_USERNAME"),
    apiKey: config?.apiKey ?? readEnv("MIMSMS_API_KEY"),
    senderName:
      config?.senderName ??
      config?.senderId ??
      readEnv("MIMSMS_SENDER_NAME") ??
      readEnv("MIMSMS_SENDER_ID"),
    senderId: config?.senderId ?? readEnv("MIMSMS_SENDER_ID"),
    transactionType:
      config?.transactionType ??
      (readEnv("MIMSMS_TRANSACTION_TYPE") as "T" | "P" | "D" | undefined),
    campaignId:
      config?.campaignId ??
      (readEnv("MIMSMS_CAMPAIGN_ID") ?? null),
    apiBaseUrl:
      config?.apiBaseUrl ??
      readEnv("MIMSMS_API_BASE_URL") ??
      DEFAULT_API_BASE_URL,
    singleEndpoint:
      config?.singleEndpoint ??
      readEnv("MIMSMS_SINGLE_ENDPOINT") ??
      DEFAULT_SINGLE_ENDPOINT,
    oneToManyEndpoint:
      config?.oneToManyEndpoint ??
      readEnv("MIMSMS_ONE_TO_MANY_ENDPOINT") ??
      DEFAULT_ONE_TO_MANY_ENDPOINT,
  };
}

export const mimSmsAdapter: ProviderAdapter<MimSmsConfig> = {
  id: "mimsms",
  async send(options: ProviderSendOptions<MimSmsConfig>): Promise<SmsResponse> {
    const config = resolveConfig(options.config);

    if (!config.username) {
      return {
        success: false,
        provider: "mimsms",
        error:
          "MiMSMS username is missing. Provide username or set MIMSMS_USERNAME.",
      };
    }

    if (!config.apiKey) {
      return {
        success: false,
        provider: "mimsms",
        error: "MiMSMS API key is missing. Provide apiKey or set MIMSMS_API_KEY.",
      };
    }

    const senderName =
      options.message.senderId ?? config.senderName ?? config.senderId;
    if (!senderName) {
      return {
        success: false,
        provider: "mimsms",
        error:
          "MiMSMS sender name is missing. Provide senderName or set MIMSMS_SENDER_NAME.",
      };
    }

    const recipients = options.message.to.join(",");
    const transactionType = config.transactionType ?? "T";
    const endpointPath =
      options.message.to.length > 1
        ? config.oneToManyEndpoint ?? DEFAULT_ONE_TO_MANY_ENDPOINT
        : config.singleEndpoint ?? DEFAULT_SINGLE_ENDPOINT;
    const url = new URL(endpointPath, config.apiBaseUrl ?? DEFAULT_API_BASE_URL);

    const response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Basic ${Buffer.from(
          `${config.username}:${config.apiKey}`
        ).toString("base64")}`,
      },
      body: JSON.stringify({
        UserName: config.username,
        Apikey: config.apiKey,
        MobileNumber: recipients,
        CampaignId: config.campaignId ?? null,
        SenderName: senderName,
        TransactionType: transactionType,
        Message: options.message.message,
      }),
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
        provider: "mimsms",
        statusCode: response.status,
        error: "MiMSMS request failed.",
        data,
      };
    }

    return {
      success: true,
      provider: "mimsms",
      statusCode: response.status,
      data,
    };
  },
};
