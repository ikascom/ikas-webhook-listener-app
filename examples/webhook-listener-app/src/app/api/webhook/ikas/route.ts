import { NextRequest, NextResponse } from 'next/server';
import { config } from '@/globals/config';
import { IkasWebhook } from '@ikas/admin-api-client';
import { validateRequest, validateWebhookSignature, } from '@/lib/validation';
import z from 'zod';

const ikasWebhookSchema = z.object({
  id: z.string().min(1, 'id is required'),
  createdAt: z.string().min(1, 'createdAt is required'),
  scope: z.string().min(1, 'scope is required'),
  merchantId: z.string().min(1, 'merchantId is required'),
  signature: z.string().min(1, 'signature is required'),
  data: z.string(),
  authorizedAppId: z.string().min(1, 'authorizedAppId is required'),
});

export async function POST(request: NextRequest) {
  try {
    // Get webhook data from request body
    const webhookData: IkasWebhook = await request.json();

    // Validate request data structure
    const validation = validateRequest(ikasWebhookSchema, webhookData);
    if (!validation.success) {
      console.error('Webhook validation failed:', validation.error);
      return NextResponse.json({ statusCode: 400, message: `Validation error: ${validation.error}` }, { status: 400 });
    }

    const webhook = validation.data;

    // Validate webhook signature
    const clientSecret = config.oauth.clientSecret;
    if (!clientSecret) {
      console.error('CLIENT_SECRET is not configured');
      return NextResponse.json({ statusCode: 500, message: 'Server configuration error' }, { status: 500 });
    }

    if (!validateWebhookSignature(webhookData.data, webhook.signature, clientSecret)) {
      console.error('Invalid webhook signature for webhook:', webhook.id);
      return NextResponse.json({ statusCode: 401, message: 'Invalid webhook signature' }, { status: 401 });
    }

    console.log('Received valid webhook:', JSON.stringify({
      id: webhook.id,
      scope: webhook.scope,
      merchantId: webhook.merchantId,
      data: JSON.parse(webhook.data),
    }, null, 2));


    return NextResponse.json({ success: true, message: 'Webhook processed successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ statusCode: 500, message: error?.message || 'Internal server error' }, { status: 500 });
  }
}
