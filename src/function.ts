import { SmsResponse, SmsSenderOptions } from "./type";

export async function sendSms({
  recipientNumbers,
  message,
  apiKey = process.env.SMS_API_KEY,
  apiUrl = process.env.SMS_API_URL,
  senderId = process.env.SMS_API_SENDER_ID,
}: SmsSenderOptions): Promise<SmsResponse> {
  try {
    if (!apiKey || !apiUrl) {
      throw new Error("API key or URL is missing.");
    }

    const recipients = recipientNumbers.join(",");

    const url = new URL(apiUrl);
    url.searchParams.append("api_key", apiKey);
    url.searchParams.append("senderid", senderId || "");
    url.searchParams.append("number", recipients);
    url.searchParams.append("message", message);

    const response = await fetch(url.toString(), { method: "POST" });

    if (!response.ok) {
      throw new Error(`Failed to send SMS. Status: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error: any) {
    console.error("Error sending SMS:", error.message);
    return { success: false, error: error.message };
  }
}
