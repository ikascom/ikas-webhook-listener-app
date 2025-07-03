import { z } from 'zod';

// Validation schemas
export const authorizeSchema = z.object({
  storeName: z.string().min(1, 'storeName is required'),
});

export const callbackSchema = z.object({
  code: z.string().min(1, 'Authorization code is required'),
  state: z.string().optional(),
});

export const webhookSchema = z.object({
  topic: z.string().min(1, 'Webhook topic is required'),
  data: z.record(z.any()).optional(),
});

export const getTokenWithSignatureSchema = z.object({
  storeName: z.string().min(1, 'storeName is required'),
  merchantId: z.string().min(1, 'merchantId is required'),
  timestamp: z.string().min(1, 'timestamp is required'),
  signature: z.string().min(1, 'signature is required'),
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
    error: result.error.errors.map(e => e.message).join(', ') 
  };
}

// Type exports for convenience
export type AuthorizeRequest = z.infer<typeof authorizeSchema>;
export type CallbackRequest = z.infer<typeof callbackSchema>;
export type WebhookRequest = z.infer<typeof webhookSchema>;
export type GetTokenWithSignatureRequest = z.infer<typeof getTokenWithSignatureSchema>; 