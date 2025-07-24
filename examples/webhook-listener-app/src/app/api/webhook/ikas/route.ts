import { NextRequest, NextResponse } from 'next/server';
import { config } from '../../../../globals/config';
import { WebhookManager } from '../../../../models/webhook/manager';
import { IkasWebhook } from '@ikas/admin-api-client';
import { ikasWebhookSchema, validateRequest, validateWebhookSignature } from '../../../../lib/validation';

export async function POST(request: NextRequest) {
  try {
    // Get webhook data from request body
    const webhookData = await request.json();
    const body = JSON.stringify(webhookData);

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

    if (!validateWebhookSignature(body, webhook.signature, clientSecret)) {
      console.error('Invalid webhook signature for webhook:', webhook.id);
      return NextResponse.json({ statusCode: 401, message: 'Invalid webhook signature' }, { status: 401 });
    }

    console.log('Received valid webhook:', {
      id: webhook.id,
      scope: webhook.scope,
      merchantId: webhook.merchantId,
      data: JSON.stringify(webhook.data),
    });

    // Process the webhook
    await WebhookManager.handleIkasWebhook(webhook as IkasWebhook);

    return NextResponse.json({ success: true, message: 'Webhook processed successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ statusCode: 500, message: error?.message || 'Internal server error' }, { status: 500 });
  }
}
