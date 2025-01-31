export type SmsSenderOptions = {
  recipientNumbers: string[];
  message: string;
  apiKey?: string;
  apiUrl?: string;
  senderId?: string;
}

export type SmsResponse = {
  success: boolean;
  data?: any;
  error?: string;
}