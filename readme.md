# SMS Kit - Multi-Provider SMS Sender

An easy-to-use SMS sender with a unified API for multiple providers. This kit focuses on a clean, dependency-free core and lets you plug provider credentials via config or environment variables.

## Installation

```sh
npm install sms-kit
```

## Importing the Module

```ts
import { sendSms } from "sms-kit";
```

## Usage

You can send SMS messages by calling the `sendSms` function with a `provider` and `message` object.

### **`sendSms` function**

```typescript
sendSms({
  provider: "twilio", // Choose a provider id
  message: {
    to: ["+8801712345678"], // Recipients in international format
    message: "Hello from sms-kit!",
    senderId: "MyBrand", // Optional override
  },
  config: {
    accountSid: "your_twilio_sid",
    authToken: "your_twilio_token",
    from: "+15005550006",
  },
});
```

### Example:

```typescript
import { sendSms } from "sms-kit";

// Send an SMS message
sendSms({
  provider: "smsto",
  message: {
    to: ["+8801712345678"],
    message: "Hello from sms-kit!",
  },
  config: {
    apiKey: "your_smsto_key",
    senderId: "MyBrand",
  },
}).then((response) => {
  console.log("SMS Response:", response);
});
```

## Environment Variables

Each provider uses its own environment variables. Provide them in your runtime or a `.env` file (loaded by your app). Examples:

```env
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_FROM=+15005550006

MESSAGEBIRD_API_KEY=your_messagebird_key
MESSAGEBIRD_ORIGINATOR=MyBrand

SMSTO_API_KEY=your_smsto_key
SMSTO_SENDER_ID=MyBrand

TEXTLOCAL_API_KEY=your_textlocal_key
TEXTLOCAL_SENDER=MyBrand

BULKSMS_TOKEN_ID=your_bulksms_token_id
BULKSMS_TOKEN_SECRET=your_bulksms_token_secret

MIMSMS_USERNAME=you@example.com
MIMSMS_API_KEY=your_mimsms_key
MIMSMS_SENDER_NAME=MyBrand
MIMSMS_TRANSACTION_TYPE=T
MIMSMS_CAMPAIGN_ID=

SMSNETBD_API_KEY=your_smsnetbd_key
SMSNETBD_SENDER_ID=MyBrand
SMSNETBD_SCHEDULE=2021-10-13 16:00:52
SMSNETBD_CONTENT_ID=

BULKSMSBD_API_KEY=your_bulksmsbd_key
BULKSMSBD_SENDER_ID=MyBrand
```

## Error Handling

The `sendSms` function will return an object with the following structure:

```typescript
{
  success: boolean;
  provider: "twilio" | "messagebird" | "smsto" | "textlocal" | "bulksms" | "mimsms" | "smsnetbd" | "bulksmsbd" | "unknown";
  data?: unknown;
  error?: string;
  statusCode?: number;
}
```

- `success`: `true` if the SMS was successfully sent, `false` otherwise.
- `data`: The response data from the SMS provider if the request was successful.
- `error`: A string describing the error message if the request failed.

### Example of error response:
```typescript
{
  success: false,
  error: "Failed to send SMS. Status: 500"
}
```

## Providers

Current provider ids:

- `twilio`
- `messagebird`
- `smsto`
- `textlocal`
- `bulksms`
- `mimsms`
- `smsnetbd`
- `bulksmsbd`

## Provider Examples

```typescript
import { sendSms } from "sms-kit";

// Twilio
await sendSms({
  provider: "twilio",
  message: {
    to: ["+15005550006"],
    message: "Twilio test message",
  },
  config: {
    accountSid: "your_twilio_sid",
    authToken: "your_twilio_token",
    from: "+15005550006",
  },
});
```

```typescript
import { sendSms } from "sms-kit";

// MessageBird
await sendSms({
  provider: "messagebird",
  message: {
    to: ["+8801712345678"],
    message: "MessageBird test message",
  },
  config: {
    accessKey: "your_messagebird_key",
    originator: "MyBrand",
  },
});
```

```typescript
import { sendSms } from "sms-kit";

// SMS.to
await sendSms({
  provider: "smsto",
  message: {
    to: ["+8801712345678"],
    message: "SMS.to test message",
  },
  config: {
    apiKey: "your_smsto_key",
    senderId: "MyBrand",
  },
});
```

```typescript
import { sendSms } from "sms-kit";

// Textlocal
await sendSms({
  provider: "textlocal",
  message: {
    to: ["+447000000000"],
    message: "Textlocal test message",
  },
  config: {
    apiKey: "your_textlocal_key",
    sender: "MyBrand",
  },
});
```

```typescript
import { sendSms } from "sms-kit";

// BulkSMS
await sendSms({
  provider: "bulksms",
  message: {
    to: ["+447000000000"],
    message: "BulkSMS test message",
  },
  config: {
    tokenId: "your_bulksms_token_id",
    tokenSecret: "your_bulksms_token_secret",
  },
});
```

```typescript
import { sendSms } from "sms-kit";

// MiMSMS
await sendSms({
  provider: "mimsms",
  message: {
    to: ["88018XXXXXXXX"],
    message: "MiMSMS test message",
    senderId: "MiM SMS",
  },
  config: {
    username: "you@example.com",
    apiKey: "your_mimsms_key",
    transactionType: "T",
    campaignId: null,
  },
});
```

```typescript
import { sendSms } from "sms-kit";

// sms.net.bd (Alpha SMS)
await sendSms({
  provider: "smsnetbd",
  message: {
    to: ["8801800000000", "8801700000000"],
    message: "sms.net.bd test message",
    senderId: "MyBrand",
  },
  config: {
    apiKey: "your_smsnetbd_key",
    schedule: "2021-10-13 16:00:52",
  },
});
```

```typescript
import { sendSms } from "sms-kit";

// BulkSMSBD
await sendSms({
  provider: "bulksmsbd",
  message: {
    to: ["88017XXXXXXXX"],
    message: "BulkSMSBD test message",
    senderId: "8809617626719",
  },
  config: {
    apiKey: "your_bulksmsbd_key",
  },
});
```

## License

This package is open-source and available under the MIT License.