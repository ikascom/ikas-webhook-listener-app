import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Section, Button, Text, Table } from '@ikas/components';

const LogsContainer = styled.div`
  padding: 20px;
`;

const LogItem = styled.div`
  padding: 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 12px;
  background: #fafafa;
`;

const LogHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const LogType = styled.span<{ type: string }>`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  background: ${props => {
    switch (props.type) {
      case 'order_created': return '#e3f2fd';
      case 'order_updated': return '#fff3e0';
      case 'product_created': return '#e8f5e8';
      case 'product_updated': return '#f3e5f5';
      default: return '#f5f5f5';
    }
  }};
  color: ${props => {
    switch (props.type) {
      case 'order_created': return '#1976d2';
      case 'order_updated': return '#f57c00';
      case 'product_created': return '#388e3c';
      case 'product_updated': return '#7b1fa2';
      default: return '#666';
    }
  }};
`;

const LogTime = styled.span`
  font-size: 12px;
  color: #666;
`;

const LogData = styled.pre`
  background: #fff;
  padding: 12px;
  border-radius: 4px;
  font-size: 12px;
  overflow-x: auto;
  max-height: 200px;
  overflow-y: auto;
`;

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

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('tr-TR');
  };

  return (
    <Section customContent>
      <LogsContainer>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <Text variant="h4">Webhook Logları</Text>
          <Button onClick={loadLogs} loading={isLoading}>
            Yenile
          </Button>
        </div>

        {logs.length === 0 && !isLoading ? (
          <Text>Henüz webhook logu bulunmuyor.</Text>
        ) : (
          logs.map((log) => (
            <LogItem key={log.id}>
              <LogHeader>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <LogType type={log.type}>{getTypeLabel(log.type)}</LogType>
                  <span style={{ 
                    color: log.status === 'success' ? '#4caf50' : '#f44336',
                    fontWeight: 600
                  }}>
                    {log.status === 'success' ? 'Başarılı' : 'Hata'}
                  </span>
                </div>
                <LogTime>{formatTimestamp(log.timestamp)}</LogTime>
              </LogHeader>
              
              {log.error && (
                <div style={{ 
                  background: '#ffebee', 
                  color: '#c62828', 
                  padding: '8px 12px', 
                  borderRadius: '4px', 
                  marginBottom: '8px',
                  fontSize: '14px'
                }}>
                  Hata: {log.error}
                </div>
              )}
              
              <LogData>
                {JSON.stringify(log.data, null, 2)}
              </LogData>
            </LogItem>
          ))
        )}
      </LogsContainer>
    </Section>
  );
} 