import {
  ProviderAdapter,
  ProviderConfigMap,
  SmsProviderId,
} from "../type";
import { bulksmsAdapter } from "./bulksms";
import { bulksmsbdAdapter } from "./bulksmsbd";
import { messageBirdAdapter } from "./messagebird";
import { mimSmsAdapter } from "./mimsms";
import { smsNetBdAdapter } from "./smsnetbd";
import { smsToAdapter } from "./smsto";
import { textlocalAdapter } from "./textlocal";
import { twilioAdapter } from "./twilio";

const providers: {
  [K in SmsProviderId]: ProviderAdapter<ProviderConfigMap[K]>;
} = {
  twilio: twilioAdapter,
  messagebird: messageBirdAdapter,
  smsto: smsToAdapter,
  textlocal: textlocalAdapter,
  bulksms: bulksmsAdapter,
  mimsms: mimSmsAdapter,
  smsnetbd: smsNetBdAdapter,
  bulksmsbd: bulksmsbdAdapter,
};

export function getProviderAdapter<TProvider extends SmsProviderId>(
  providerId: TProvider
): ProviderAdapter<ProviderConfigMap[TProvider]> {
  return providers[providerId];
}

export const providerIds = Object.keys(providers) as SmsProviderId[];
