import React, { useState, useEffect } from 'react';
import styles from './webhook-logs.module.scss';

interface WebhookLogsProps {
  storeName: string;
  token: string | null;
}

interface WebhookLog {
  id: string;
  type: string;
  timestamp: string;
  data: any;
  status: 'success' | 'error';
  error?: string;
}

export default function WebhookLogs({ storeName, token }: WebhookLogsProps) {
  const [logs, setLogs] = useState<WebhookLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLog, setSelectedLog] = useState<WebhookLog | null>(null);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    setIsLoading(true);
    try {
      // Simulate loading logs from API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      const mockLogs: WebhookLog[] = [
        {
          id: '1',
          type: 'order_created',
          timestamp: new Date().toISOString(),
          data: {
            orderId: '12345',
            orderNumber: 'ORD-001',
            customerEmail: 'test@example.com',
            totalAmount: 150.00
          },
          status: 'success'
        },
        {
          id: '2',
          type: 'order_updated',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          data: {
            orderId: '12345',
            orderNumber: 'ORD-001',
            status: 'shipped',
            trackingNumber: 'TRK123456'
          },
          status: 'success'
        },
        {
          id: '3',
          type: 'product_created',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          data: {
            productId: '67890',
            productName: 'Test Product',
            price: 29.99
          },
          status: 'error',
          error: 'Webhook URL not reachable'
        }
      ];
      
      setLogs(mockLogs);
    } catch (error) {
      console.error('Error loading logs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'order_created': return 'Sipariş Oluşturuldu';
      case 'order_updated': return 'Sipariş Güncellendi';
      case 'product_created': return 'Ürün Oluşturuldu';
      case 'product_updated': return 'Ürün Güncellendi';
      default: return type;
    }
  };

  const getTypeClass = (type: string) => {
    switch (type) {
      case 'order_created': return styles.orderCreated;
      case 'order_updated': return styles.orderUpdated;
      case 'product_created': return styles.productCreated;
      case 'product_updated': return styles.productUpdated;
      default: return styles.default;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('tr-TR');
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Webhook Logları</h2>
        <button 
          onClick={loadLogs} 
          disabled={isLoading} 
          className={styles.refreshButton}
        >
          {isLoading && <div className={styles.loadingSpinner} />}
          Yenile
        </button>
      </div>

      <div className={styles.content}>
        {logs.length === 0 && !isLoading ? (
          <div className={styles.emptyState}>Henüz webhook logu bulunmuyor.</div>
        ) : (
          <div className={styles.logsContainer}>
            {logs.map((log) => (
              <div key={log.id} className={styles.logItem}>
                <div className={styles.logHeader}>
                  <div className={styles.logInfo}>
                    <span className={`${styles.logType} ${getTypeClass(log.type)}`}>
                      {getTypeLabel(log.type)}
                    </span>
                    <span className={`${styles.statusBadge} ${styles[log.status]}`}>
                      {log.status === 'success' ? 'Başarılı' : 'Hata'}
                    </span>
                  </div>
                  <span className={styles.logTime}>{formatTimestamp(log.timestamp)}</span>
                </div>
                
                <div className={styles.logBody}>
                  {log.error && (
                    <div className={styles.errorMessage}>
                      Hata: {log.error}
                    </div>
                  )}
                  
                  <pre className={styles.logData}>
                    {JSON.stringify(log.data, null, 2)}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 