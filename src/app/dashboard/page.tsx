'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState, useCallback } from 'react';
import styled from 'styled-components';
import { TokenHelpers } from '../../helpers/token-helpers';
import { ApiRequests } from '../../lib/api-requests';

// Styled container for the dashboard background
const DashboardContainer = styled.div`
  min-height: 100vh;
  background: var(--gray-50);
`;

// Section wrapper for cards and tab area
const Section = styled.div<{ $customContent?: boolean; $marginTop?: boolean }>`
  background: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  margin: ${props => props.$marginTop !== false ? 'var(--spacing-6) 0' : '0 0 var(--spacing-6) 0'};
  overflow: hidden;
`;

// Tabs container
const Tabs = styled.div`
  padding: var(--spacing-4) var(--spacing-6);
  border-bottom: 1px solid var(--gray-200);
  background: var(--gray-50);
`;

// Tab button styling
const TabButton = styled.button<{ $selected?: boolean }>`
  padding: var(--spacing-2) var(--spacing-3);
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  border: none;
  background: transparent;
  color: ${props => props.$selected ? 'var(--primary-600)' : 'var(--gray-600)'};
  border-bottom: 2px solid ${props => props.$selected ? 'var(--primary-600)' : 'transparent'};
  transition: var(--transition-normal);

  &:not(:last-child) {
    margin-right: var(--spacing-3);
  }

  &:hover {
    color: var(--primary-600);
    background: var(--primary-50);
  }
`;

// Main content container
const ContentContainer = styled.div`
  padding: var(--spacing-6);
`;

// Card for tab content
const ContentCard = styled.div`
  background: white;
  border-radius: var(--radius-md);
  padding: var(--spacing-6);
  border: 1px solid var(--gray-200);
  box-shadow: var(--shadow-sm);
`;

// Empty state message
const EmptyState = styled.div`
  text-align: center;
  padding: var(--spacing-12);
  color: var(--gray-500);
  font-size: 1rem;
`;

// Tab keys for navigation
type TabKey = 'settings' | 'orders' | 'prices';

/**
 * DashboardPage
 * - Main dashboard component with tab navigation and content.
 */
export default function DashboardPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [storeName, setStoreName] = useState('');
  const [activeTab, setActiveTab] = useState<TabKey>('settings');
  const [tabsVisible] = useState(true); // Always true, can be removed if not needed

  /**
   * Fetches and sets the store name using the provided token.
   */
  const fetchStoreName = useCallback(async (currentToken: string) => {
    try {
      const res = await ApiRequests.ikas.getMerchant(currentToken);
      if (res.status === 200 && res.data?.data?.merchantInfo?.storeName) {
        setStoreName(res.data.data.merchantInfo.storeName);
      }
    } catch (error) {
      console.error('Error fetching store name:', error);
    }
  }, []);

  /**
   * Initializes the dashboard by fetching the token and store name.
   */
  const initializeDashboard = useCallback(async () => {
    try {
      const fetchedToken = await TokenHelpers.getTokenForIframeApp(router);
      setToken(fetchedToken || null);

      if (fetchedToken) {
        await fetchStoreName(fetchedToken);
      }

      // Example: Listen for messages from iframe parent (if needed)
      // window.onmessage = (event) => {
      //   // Handle iframe messages here
      // };
    } catch (error) {
      console.error('Error initializing dashboard:', error);
    }
  }, [router, fetchStoreName]);

  // Run initialization on mount
  useEffect(() => {
    initializeDashboard();
  }, [initializeDashboard]);

  /**
   * Tab items with English labels.
   */
  const tabItems = useMemo(() => {
    if (!token) return [];
    return [
      { key: 'settings', tab: 'Settings' },
      { key: 'orders', tab: 'Orders' },
      { key: 'prices', tab: 'Prices' },
    ];
  }, [token]);

  /**
   * Renders the content for the currently active tab.
   */
  const renderTabContent = () => {
    switch (activeTab) {
      case 'settings':
        return (
          <ContentCard>
            <h2>Settings</h2>
            <p>You can manage your webhook settings here.</p>
            {storeName && <p>Store: {storeName}</p>}
          </ContentCard>
        );
      case 'orders':
        return (
          <ContentCard>
            <h2>Orders</h2>
            <p>You can view your order webhook logs here.</p>
          </ContentCard>
        );
      case 'prices':
        return (
          <ContentCard>
            <h2>Prices</h2>
            <p>You can view your price webhook logs here.</p>
          </ContentCard>
        );
      default:
        return <EmptyState>No content found.</EmptyState>;
    }
  };

  return (
    <DashboardContainer>
      {tabsVisible && (
        <Section $customContent $marginTop={false}>
          <Tabs>
            {tabItems.map((tab) => (
              <TabButton
                key={tab.key}
                $selected={tab.key === activeTab}
                onClick={() => setActiveTab(tab.key as TabKey)}
              >
                {tab.tab}
              </TabButton>
            ))}
          </Tabs>
        </Section>
      )}

      <ContentContainer>
        {renderTabContent()}
      </ContentContainer>
    </DashboardContainer>
  );
}
