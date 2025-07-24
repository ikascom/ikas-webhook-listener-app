import { z } from 'zod';
import crypto from 'crypto';

// Validation schemas
export const authorizeSchema = z.object({
  storeName: z.string().min(1, 'storeName is required'),
});

export const callbackSchema = z.object({
  code: z.string().min(1, 'Authorization code is required'),
  state: z.string().optional(),
});

export const getTokenWithSignatureSchema = z.object({
  storeName: z.string().min(1, 'storeName is required'),
  merchantId: z.string().min(1, 'merchantId is required'),
  timestamp: z.string().min(1, 'timestamp is required'),
  signature: z.string().min(1, 'signature is required'),
  authorizedAppId: z.string().min(1, 'authorizedAppId is required'),
});

// Webhook validation schema
export const ikasWebhookSchema = z.object({
  id: z.string().min(1, 'id is required'),
  createdAt: z.string().min(1, 'createdAt is required'),
  scope: z.string().min(1, 'scope is required'),
  merchantId: z.string().min(1, 'merchantId is required'),
  signature: z.string().min(1, 'signature is required'),
  data: z.any(), // Can be any object based on webhook type
  authorizedAppId: z.string().min(1, 'authorizedAppId is required'),
});

// Validation helper functions
export function validateRequest<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; error: string } {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  return {
    success: false,
    error: result.error.errors.map((e) => e.message).join(', '),
  };
}

/**
 * Validates the webhook signature using HMAC SHA256
 */
export function validateWebhookSignature(body: string, signature: string, secret: string): boolean {
  try {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body, 'utf8')
      .digest('hex');
    
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );
  } catch (error) {
    console.error('Error validating webhook signature:', error);
    return false;
  }
}

// Type exports for convenience
export type GetTokenWithSignatureRequest = z.infer<typeof getTokenWithSignatureSchema>;
export type IkasWebhook = z.infer<typeof ikasWebhookSchema>; 