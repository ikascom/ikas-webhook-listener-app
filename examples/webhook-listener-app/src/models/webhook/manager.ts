import { IkasWebhook } from '@ikas/admin-api-client';

export class WebhookManager {
  /**
   * Handles incoming Ikas webhooks based on their scope
   */
  static async handleIkasWebhook(webhook: IkasWebhook): Promise<void> {
    try {
      console.log('Processing webhook:', {
        id: webhook.id,
        scope: webhook.scope,
        merchantId: webhook.merchantId,
        authorizedAppId: webhook.authorizedAppId,
      });

      // Process webhook based on scope
      switch (webhook.scope) {
        case 'order.created':
          await this.handleOrderCreated(webhook);
          break;
        
        case 'order.updated':
          await this.handleOrderUpdated(webhook);
          break;
        
        case 'order.cancelled':
          await this.handleOrderCancelled(webhook);
          break;
        
        case 'product.created':
          await this.handleProductCreated(webhook);
          break;
        
        case 'product.updated':
          await this.handleProductUpdated(webhook);
          break;
        
        case 'product.deleted':
          await this.handleProductDeleted(webhook);
          break;
        
        case 'inventory.updated':
          await this.handleInventoryUpdated(webhook);
          break;
        
        default:
          console.log('Unknown webhook scope:', webhook.scope);
          // Still log the webhook for debugging
          console.log('Webhook data:', JSON.stringify(webhook.data));
          break;
      }

      console.log('Webhook processed successfully:', webhook.id);
    } catch (error) {
      console.error('Error processing webhook:', webhook.id, error);
      throw error;
    }
  }

  /**
   * Handle order created webhook
   */
  private static async handleOrderCreated(webhook: IkasWebhook): Promise<void> {
    console.log('Processing new order:', webhook.data);
    
    // TODO: Implement order creation logic
    // Example: Send notification, update inventory, create shipping label, etc.
    
    try {
      // Parse webhook data if it's a string
      const data = typeof webhook.data === 'string' ? JSON.parse(webhook.data) : webhook.data;
      
      if (data && data.order) {
        const order = data.order;
        console.log(`New order created: ${order.id} for merchant: ${webhook.merchantId}`);
        
        // Example: You could send this to a queue, database, or external service
        // await this.sendToQueue('order.created', data);
        // await this.updateInventory(order.items);
        // await this.createShippingLabel(order);
      }
    } catch (error) {
      console.error('Error parsing order webhook data:', error);
    }
  }

  /**
   * Handle order updated webhook
   */
  private static async handleOrderUpdated(webhook: IkasWebhook): Promise<void> {
    console.log('Processing order update:', webhook.data);
    
    // TODO: Implement order update logic
    // Example: Update order status, notify customer, etc.
    
    try {
      const data = typeof webhook.data === 'string' ? JSON.parse(webhook.data) : webhook.data;
      
      if (data && data.order) {
        const order = data.order;
        console.log(`Order updated: ${order.id} for merchant: ${webhook.merchantId}`);
      }
    } catch (error) {
      console.error('Error parsing order update webhook data:', error);
    }
  }

  /**
   * Handle order cancelled webhook
   */
  private static async handleOrderCancelled(webhook: IkasWebhook): Promise<void> {
    console.log('Processing order cancellation:', webhook.data);
    
    // TODO: Implement order cancellation logic
    // Example: Refund payment, restock inventory, cancel shipping, etc.
    
    try {
      const data = typeof webhook.data === 'string' ? JSON.parse(webhook.data) : webhook.data;
      
      if (data && data.order) {
        const order = data.order;
        console.log(`Order cancelled: ${order.id} for merchant: ${webhook.merchantId}`);
      }
    } catch (error) {
      console.error('Error parsing order cancellation webhook data:', error);
    }
  }

  /**
   * Handle product created webhook
   */
  private static async handleProductCreated(webhook: IkasWebhook): Promise<void> {
    console.log('Processing new product:', webhook.data);
    
    // TODO: Implement product creation logic
    // Example: Sync with external systems, update search index, etc.
    
    try {
      const data = typeof webhook.data === 'string' ? JSON.parse(webhook.data) : webhook.data;
      
      if (data && data.product) {
        const product = data.product;
        console.log(`New product created: ${product.id} for merchant: ${webhook.merchantId}`);
      }
    } catch (error) {
      console.error('Error parsing product webhook data:', error);
    }
  }

  /**
   * Handle product updated webhook
   */
  private static async handleProductUpdated(webhook: IkasWebhook): Promise<void> {
    console.log('Processing product update:', webhook.data);
    
    // TODO: Implement product update logic
    // Example: Update search index, sync with external systems, etc.
    
    try {
      const data = typeof webhook.data === 'string' ? JSON.parse(webhook.data) : webhook.data;
      
      if (data && data.product) {
        const product = data.product;
        console.log(`Product updated: ${product.id} for merchant: ${webhook.merchantId}`);
      }
    } catch (error) {
      console.error('Error parsing product update webhook data:', error);
    }
  }

  /**
   * Handle product deleted webhook
   */
  private static async handleProductDeleted(webhook: IkasWebhook): Promise<void> {
    console.log('Processing product deletion:', webhook.data);
    
    // TODO: Implement product deletion logic
    // Example: Remove from search index, clean up related data, etc.
    
    try {
      const data = typeof webhook.data === 'string' ? JSON.parse(webhook.data) : webhook.data;
      
      if (data && data.product) {
        const product = data.product;
        console.log(`Product deleted: ${product.id} for merchant: ${webhook.merchantId}`);
      }
    } catch (error) {
      console.error('Error parsing product deletion webhook data:', error);
    }
  }

  /**
   * Handle inventory updated webhook
   */
  private static async handleInventoryUpdated(webhook: IkasWebhook): Promise<void> {
    console.log('Processing inventory update:', webhook.data);
    
    // TODO: Implement inventory update logic
    // Example: Update external inventory systems, check low stock alerts, etc.
    
    try {
      const data = typeof webhook.data === 'string' ? JSON.parse(webhook.data) : webhook.data;
      
      if (data && data.inventory) {
        const inventory = data.inventory;
        console.log(`Inventory updated for merchant: ${webhook.merchantId}`);
      }
    } catch (error) {
      console.error('Error parsing inventory webhook data:', error);
    }
  }
}
