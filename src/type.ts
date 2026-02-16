export type SmsProviderId =
  | "twilio"
  | "messagebird"
  | "smsto"
  | "textlocal"
  | "bulksms"
  | "mimsms"
  | "smsnetbd"
  | "bulksmsbd"
  | "automas";

export type SmsResponseProvider = SmsProviderId | "unknown";

export type SmsMessage = {
  to: string[];
  message: string;
  senderId?: string;
};

export type TwilioConfig = {
  accountSid?: string;
  authToken?: string;
  from?: string;
  apiBaseUrl?: string;
};

export type MessageBirdConfig = {
  accessKey?: string;
  originator?: string;
  apiBaseUrl?: string;
};

export type SmsToConfig = {
  apiKey?: string;
  senderId?: string;
  apiBaseUrl?: string;
};

export type TextlocalConfig = {
  apiKey?: string;
  sender?: string;
  apiBaseUrl?: string;
};

export type BulkSmsConfig = {
  tokenId?: string;
  tokenSecret?: string;
  apiBaseUrl?: string;
};

export type MimSmsConfig = {
  username?: string;
  apiKey?: string;
  senderName?: string;
  senderId?: string;
  transactionType?: "T" | "P" | "D";
  campaignId?: string | null;
  apiBaseUrl?: string;
  singleEndpoint?: string;
  oneToManyEndpoint?: string;
};

export type SmsNetBdConfig = {
  apiKey?: string;
  senderId?: string;
  schedule?: string;
  contentId?: string;
  apiBaseUrl?: string;
};

export type BulkSmsBdConfig = {
  apiKey?: string;
  senderId?: string;
  apiBaseUrl?: string;
};

export type AutomasConfig = {
  apiKey?: string;
  senderId?: string;
  apiBaseUrl?: string;
};

export type ProviderConfigMap = {
  twilio: TwilioConfig;
  messagebird: MessageBirdConfig;
  smsto: SmsToConfig;
  textlocal: TextlocalConfig;
  bulksms: BulkSmsConfig;
  mimsms: MimSmsConfig;
  smsnetbd: SmsNetBdConfig;
  bulksmsbd: BulkSmsBdConfig;
  automas: AutomasConfig;
};

export type SendSmsOptions<TProvider extends SmsProviderId = SmsProviderId> = {
  provider: TProvider;
  message: SmsMessage;
  config?: ProviderConfigMap[TProvider];
};

export type SmsResponse = {
  success: boolean;
  provider: SmsResponseProvider;
  data?: unknown;
  error?: string;
  statusCode?: number;
};

export type ProviderSendOptions<TConfig> = {
  message: SmsMessage;
  config?: TConfig;
};

export type ProviderAdapter<TConfig> = {
  id: SmsProviderId;
  send(options: ProviderSendOptions<TConfig>): Promise<SmsResponse>;
};