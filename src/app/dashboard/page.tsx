'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState, useCallback } from 'react';
import styled from 'styled-components';
import { TokenHelpers } from '../../helpers/token-helpers';
import { ApiRequests } from '../../lib/api-requests';

const DashboardContainer = styled.div`
  min-height: 100vh;
  background: var(--gray-50);
`;

const Section = styled.div<{ $customContent?: boolean; $marginTop?: boolean }>`
  background: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  margin: ${props => props.$marginTop !== false ? 'var(--spacing-6) 0' : '0 0 var(--spacing-6) 0'};
  overflow: hidden;
`;

const Tabs = styled.div`
  padding: var(--spacing-4) var(--spacing-6);
  border-bottom: 1px solid var(--gray-200);
  background: var(--gray-50);
`;

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

const ContentContainer = styled.div`
  padding: var(--spacing-6);
`;

const ContentCard = styled.div`
  background: white;
  border-radius: var(--radius-md);
  padding: var(--spacing-6);
  border: 1px solid var(--gray-200);
  box-shadow: var(--shadow-sm);
`;

const EmptyState = styled.div`
  text-align: center;
  padding: var(--spacing-12);
  color: var(--gray-500);
  font-size: 1rem;
`;

type TabKey = 'settings' | 'orders' | 'prices';

export default function DashboardPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [storeName, setStoreName] = useState('');
  const [activeTab, setActiveTab] = useState<TabKey>('settings');
  const [tabsVisible, setTabsVisible] = useState(true);

  // fillStoreName fonksiyonu - store name'i doldurur
  const fillStoreName = useCallback(async (currentToken: string) => {
    try {
      console.log('fillStoreName called with token:', currentToken);
      const res = await ApiRequests.ikas.getMerchant(currentToken);
      
      if (res.status === 200 && res.data?.data && res.data?.data.merchantInfo) {
        const merchantInfo = res.data.data.merchantInfo;
        if (merchantInfo?.storeName) {
          setStoreName(merchantInfo.storeName);
          console.log('Store name set:', merchantInfo.storeName);
        }
      }
    } catch (error) {
      console.error('Error filling store name:', error);
    }
  }, []);

  // init fonksiyonu - component mount olduğunda çalışır
  const init = useCallback(async () => {
    try {
      console.log('init called');
      const fetchedToken = await TokenHelpers.getTokenForIframeApp(router);
      setToken(fetchedToken || null);
      
      console.log('fetchedToken', fetchedToken);
      
      if (fetchedToken) {
        await fillStoreName(fetchedToken);
      }

      // Dinleyici örnek
      onmessage = (event) => {
        // console.log('iframe message:', event);
      };
    } catch (error) {
      console.error('Error in init:', error);
    }
  }, [router, fillStoreName]);

  // Component mount olduğunda init çalışır
  useEffect(() => {
    init();
  }, [init]);

  const tabItems = useMemo(() => {
    if (!token) return [];

    return [
      {
        key: 'settings',
        tab: 'Ayarlar',
      },
      {
        key: 'orders',
        tab: 'Siparişler',
      },
      {
        key: 'prices',
        tab: 'Fiyatlar',
      },
    ];
  }, [token, storeName]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'settings':
        return (
          <ContentCard>
            <h2>Ayarlar</h2>
            <p>Webhook ayarlarınızı buradan yönetebilirsiniz.</p>
            {storeName && <p>Mağaza: {storeName}</p>}
          </ContentCard>
        );
      case 'orders':
        return (
          <ContentCard>
            <h2>Siparişler</h2>
            <p>Sipariş webhook loglarınızı buradan görüntüleyebilirsiniz.</p>
          </ContentCard>
        );
      case 'prices':
        return (
          <ContentCard>
            <h2>Fiyatlar</h2>
            <p>Fiyat webhook loglarınızı buradan görüntüleyebilirsiniz.</p>
          </ContentCard>
        );
      default:
        return <EmptyState>İçerik bulunamadı.</EmptyState>;
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
