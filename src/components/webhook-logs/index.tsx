import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  background: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  overflow: hidden;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-6);
  border-bottom: 1px solid var(--gray-200);
  background: var(--gray-50);
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--gray-900);
  margin: 0;
`;

const RefreshButton = styled.button<{ $loading: boolean }>`
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  background: var(--primary-600);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  padding: var(--spacing-3) var(--spacing-4);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition-normal);
  
  &:hover:not(:disabled) {
    background: var(--primary-700);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const LoadingSpinner = styled.div`
  width: 1rem;
  height: 1rem;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const Content = styled.div`
  padding: var(--spacing-6);
`;

const EmptyState = styled.div`
  text-align: center;
  padding: var(--spacing-12);
  color: var(--gray-500);
  font-size: 1rem;
`;

const LogsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
`;

const LogItem = styled.div`
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-lg);
  background: white;
  overflow: hidden;
  transition: var(--transition-normal);
  
  &:hover {
    box-shadow: var(--shadow-md);
    border-color: var(--gray-300);
  }
`;

const LogHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-4);
  background: var(--gray-50);
  border-bottom: 1px solid var(--gray-200);
`;

const LogInfo = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
`;

const LogType = styled.span<{ $type: string }>`
  padding: var(--spacing-1) var(--spacing-2);
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: ${props => {
    switch (props.$type) {
      case 'order_created': return 'var(--primary-50)';
      case 'order_updated': return 'var(--warning-50)';
      case 'product_created': return 'var(--success-50)';
      case 'product_updated': return '#f3e8ff';
      default: return 'var(--gray-100)';
    }
  }};
  color: ${props => {
    switch (props.$type) {
      case 'order_created': return 'var(--primary-700)';
      case 'order_updated': return 'var(--warning-700)';
      case 'product_created': return 'var(--success-700)';
      case 'product_updated': return '#7c3aed';
      default: return 'var(--gray-700)';
    }
  }};
`;

const StatusBadge = styled.span<{ $status: 'success' | 'error' }>`
  padding: var(--spacing-1) var(--spacing-2);
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: 600;
  background: ${props => props.$status === 'success' ? 'var(--success-50)' : 'var(--error-50)'};
  color: ${props => props.$status === 'success' ? 'var(--success-700)' : 'var(--error-700)'};
`;

const LogTime = styled.span`
  font-size: 0.875rem;
  color: var(--gray-500);
`;

const LogBody = styled.div`
  padding: var(--spacing-4);
`;

const ErrorMessage = styled.div`
  background: var(--error-50);
  color: var(--error-700);
  padding: var(--spacing-3);
  border-radius: var(--radius-md);
  margin-bottom: var(--spacing-3);
  font-size: 0.875rem;
  border-left: 4px solid var(--error-500);
`;

const LogData = styled.pre`
  background: var(--gray-50);
  padding: var(--spacing-4);
  border-radius: var(--radius-md);
  font-size: 0.75rem;
  line-height: 1.5;
  overflow-x: auto;
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid var(--gray-200);
  color: var(--gray-800);
  
  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: var(--gray-100);
    border-radius: var(--radius-sm);
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--gray-300);
    border-radius: var(--radius-sm);
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: var(--gray-400);
  }
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
    <Container>
      <Header>
        <Title>Webhook Logları</Title>
        <RefreshButton onClick={loadLogs} disabled={isLoading} $loading={isLoading}>
          {isLoading && <LoadingSpinner />}
          Yenile
        </RefreshButton>
      </Header>

      <Content>
        {logs.length === 0 && !isLoading ? (
          <EmptyState>Henüz webhook logu bulunmuyor.</EmptyState>
        ) : (
          <LogsContainer>
            {logs.map((log) => (
              <LogItem key={log.id}>
                <LogHeader>
                  <LogInfo>
                    <LogType $type={log.type}>{getTypeLabel(log.type)}</LogType>
                    <StatusBadge $status={log.status}>
                      {log.status === 'success' ? 'Başarılı' : 'Hata'}
                    </StatusBadge>
                  </LogInfo>
                  <LogTime>{formatTimestamp(log.timestamp)}</LogTime>
                </LogHeader>
                
                <LogBody>
                  {log.error && (
                    <ErrorMessage>
                      Hata: {log.error}
                    </ErrorMessage>
                  )}
                  
                  <LogData>
                    {JSON.stringify(log.data, null, 2)}
                  </LogData>
                </LogBody>
              </LogItem>
            ))}
          </LogsContainer>
        )}
      </Content>
    </Container>
  );
} 