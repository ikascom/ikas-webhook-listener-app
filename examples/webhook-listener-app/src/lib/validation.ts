import { z } from 'zod';
import crypto from 'crypto';

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
    const expectedSignature = crypto.createHmac('sha256', secret).update(body, 'utf8').digest('hex');

    return crypto.timingSafeEqual(Buffer.from(signature, 'hex'), Buffer.from(expectedSignature, 'hex'));
  } catch (error) {
    console.error('Error validating webhook signature:', error);
    return false;
  }
}
