import crypto from "crypto";

const PAYSUITE_BASE_URL = "https://api.paysuite.co.mz/v1";

interface PaySuitePaymentRequest {
  amount: number;
  phone: string;
  reference: string;
  method: "mpesa" | "emola";
}

interface PaySuitePaymentResponse {
  success: boolean;
  transactionId: string;
  status: string;
  message?: string;
}

interface PaySuiteStatusResponse {
  success: boolean;
  transactionId: string;
  status: "pending" | "completed" | "failed";
  amount?: number;
  reference?: string;
}

interface PaySuiteWebhookPayload {
  transactionId: string;
  status: "completed" | "failed";
  amount: number;
  reference: string;
  method: string;
  timestamp: string;
}

/**
 * PaySuite API Client for M-Pesa and e-Mola mobile money payments in Mozambique.
 */
class PaySuiteClient {
  private apiKey: string;
  private merchantId: string;
  private webhookSecret: string;

  constructor() {
    const apiKey = process.env.PAYSUITE_API_KEY;
    const merchantId = process.env.PAYSUITE_MERCHANT_ID;
    const webhookSecret = process.env.PAYSUITE_WEBHOOK_SECRET;

    if (!apiKey) {
      throw new Error("PAYSUITE_API_KEY environment variable is not set");
    }
    if (!merchantId) {
      throw new Error("PAYSUITE_MERCHANT_ID environment variable is not set");
    }
    if (!webhookSecret) {
      throw new Error("PAYSUITE_WEBHOOK_SECRET environment variable is not set");
    }

    this.apiKey = apiKey;
    this.merchantId = merchantId;
    this.webhookSecret = webhookSecret;
  }

  /**
   * Create a mobile money payment via M-Pesa or e-Mola.
   * Initiates an STK push to the customer's phone.
   */
  async createPayment(
    amount: number,
    phone: string,
    reference: string,
    method: "mpesa" | "emola"
  ): Promise<PaySuitePaymentResponse> {
    const response = await fetch(`${PAYSUITE_BASE_URL}/payments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
        "X-Merchant-ID": this.merchantId,
      },
      body: JSON.stringify({
        amount,
        phone,
        reference,
        method,
        currency: "MZN",
        merchant_id: this.merchantId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `PaySuite API error: ${response.status} - ${errorData.message || response.statusText}`
      );
    }

    const data = await response.json();

    return {
      success: true,
      transactionId: data.transaction_id || data.transactionId,
      status: data.status || "pending",
      message: data.message,
    };
  }

  /**
   * Check the status of an existing payment by transaction ID.
   */
  async checkPaymentStatus(transactionId: string): Promise<PaySuiteStatusResponse> {
    const response = await fetch(
      `${PAYSUITE_BASE_URL}/payments/${transactionId}/status`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "X-Merchant-ID": this.merchantId,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `PaySuite API error: ${response.status} - ${errorData.message || response.statusText}`
      );
    }

    const data = await response.json();

    return {
      success: true,
      transactionId: data.transaction_id || data.transactionId,
      status: data.status,
      amount: data.amount,
      reference: data.reference,
    };
  }

  /**
   * Verify the authenticity of a webhook payload from PaySuite.
   * Uses HMAC-SHA256 signature verification.
   */
  verifyWebhook(payload: string, signature: string): boolean {
    const expectedSignature = crypto
      .createHmac("sha256", this.webhookSecret)
      .update(payload)
      .digest("hex");

    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  }
}

// Singleton instance
let paysuiteClient: PaySuiteClient | null = null;

export function getPaySuiteClient(): PaySuiteClient {
  if (!paysuiteClient) {
    paysuiteClient = new PaySuiteClient();
  }
  return paysuiteClient;
}

export type {
  PaySuitePaymentRequest,
  PaySuitePaymentResponse,
  PaySuiteStatusResponse,
  PaySuiteWebhookPayload,
};

export default PaySuiteClient;
