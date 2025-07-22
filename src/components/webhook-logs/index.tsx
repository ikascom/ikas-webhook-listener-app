import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';

// Props for the WebhookLogs component
interface WebhookLogsProps {
  storeName: string;
  token: string | null;
}

// Webhook log entry interface
interface WebhookLog {
  id: string;
  type: string;
  timestamp: string;
  data: any;
  status: 'success' | 'error';
  error?: string;
}

// Styled Components for UI
const Container = styled.div`
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 24px;
  margin: 20px 0;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const Title = styled.h2`
  margin: 0;
  color: #333;
  font-size: 24px;
  font-weight: 600;
`;

const RefreshButton = styled.button`
  background: #007bff;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.2s;

  &:hover {
    background: #0056b3;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid #fff;
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const Content = styled.div`
  min-height: 200px;
`;

const EmptyState = styled.div`
  text-align: center;
  color: #666;
  font-size: 16px;
  padding: 40px;
`;

const LogsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const LogItem = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 16px;
  background: #fafafa;
`;

const LogHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const LogInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const LogType = styled.span<{ variant: string }>`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  background: ${props => {
    switch (props.variant) {
      case 'order_created': return '#e3f2fd';
      case 'order_updated': return '#fff3e0';
      case 'product_created': return '#e8f5e8';
      case 'product_updated': return '#f3e5f5';
      default: return '#f5f5f5';
    }
  }};
  color: ${props => {
    switch (props.variant) {
      case 'order_created': return '#1976d2';
      case 'order_updated': return '#f57c00';
      case 'product_created': return '#388e3c';
      case 'product_updated': return '#7b1fa2';
      default: return '#666';
    }
  }};
`;

const StatusBadge = styled.span<{ status: 'success' | 'error' }>`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  background: ${props => props.status === 'success' ? '#e8f5e8' : '#ffebee'};
  color: ${props => props.status === 'success' ? '#388e3c' : '#d32f2f'};
`;

const LogTime = styled.span`
  color: #666;
  font-size: 12px;
`;

const LogBody = styled.div`
  margin-top: 12px;
`;

const ErrorMessage = styled.div`
  background: #ffebee;
  color: #d32f2f;
  padding: 8px 12px;
  border-radius: 4px;
  margin-bottom: 8px;
  font-size: 14px;
`;

const LogData = styled.pre`
  background: #f5f5f5;
  padding: 12px;
  border-radius: 4px;
  font-size: 12px;
  overflow-x: auto;
  margin: 0;
  color: #333;
`;

/**
 * WebhookLogs component displays a list of webhook logs for a store.
 */
const WebhookLogs: React.FC<WebhookLogsProps> = ({ storeName, token }) => {
  // State for logs, loading status
  const [logs, setLogs] = useState<WebhookLog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Fetch logs on mount
  useEffect(() => {
    loadLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Loads webhook logs (mocked for now)
   */
  const loadLogs = useCallback(async () => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mocked log data
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
      // Log error to console
      console.error('Failed to load webhook logs:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Returns a human-readable label for a webhook type
   */
  const getTypeLabel = (type: string): string => {
    switch (type) {
      case 'order_created': return 'Order Created';
      case 'order_updated': return 'Order Updated';
      case 'product_created': return 'Product Created';
      case 'product_updated': return 'Product Updated';
      default: return type;
    }
  };

  /**
   * Formats a timestamp string to a readable date/time
   */
  const formatTimestamp = (timestamp: string): string => {
    return new Date(timestamp).toLocaleString('en-US');
  };

  return (
    <Container>
      <Header>
        <Title>Webhook Logs</Title>
        <RefreshButton onClick={loadLogs} disabled={isLoading}>
          {isLoading && <LoadingSpinner />}
          Refresh
        </RefreshButton>
      </Header>

      <Content>
        {/* Show empty state if no logs and not loading */}
        {logs.length === 0 && !isLoading ? (
          <EmptyState>No webhook logs found yet.</EmptyState>
        ) : (
          <LogsContainer>
            {/* Render each log item */}
            {logs.map((log) => (
              <LogItem key={log.id}>
                <LogHeader>
                  <LogInfo>
                    <LogType variant={log.type}>
                      {getTypeLabel(log.type)}
                    </LogType>
                    <StatusBadge status={log.status}>
                      {log.status === 'success' ? 'Success' : 'Error'}
                    </StatusBadge>
                  </LogInfo>
                  <LogTime>{formatTimestamp(log.timestamp)}</LogTime>
                </LogHeader>
                <LogBody>
                  {/* Show error message if present */}
                  {log.error && (
                    <ErrorMessage>
                      Error: {log.error}
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
};

export default WebhookLogs;