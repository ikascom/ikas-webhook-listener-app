import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Section, Button, Input, Switch, Text } from '@ikas/components';

const SettingsContainer = styled.div`
  padding: 20px;
`;

const SettingItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #e0e0e0;

  &:last-child {
    border-bottom: none;
  }
`;

const SettingInfo = styled.div`
  flex: 1;
`;

const SettingTitle = styled(Text)`
  font-weight: 600;
  margin-bottom: 4px;
`;

const SettingDescription = styled(Text)`
  color: #666;
  font-size: 14px;
`;

interface WebhookSettingsProps {
  token: string | null;
  toggleTabsVisibility: (visible: boolean) => void;
}

export default function WebhookSettingsPage({ token, toggleTabsVisibility }: WebhookSettingsProps) {
  const [settings, setSettings] = useState({
    orderCreated: true,
    orderUpdated: true,
    productCreated: false,
    productUpdated: false,
    inventoryUpdated: false,
  });

  const [webhookUrl, setWebhookUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load saved settings
    const savedSettings = localStorage.getItem('webhook_settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }

    const savedUrl = localStorage.getItem('webhook_url');
    if (savedUrl) {
      setWebhookUrl(savedUrl);
    }
  }, []);

  const handleSettingChange = (key: string, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('webhook_settings', JSON.stringify(newSettings));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Save webhook URL
      localStorage.setItem('webhook_url', webhookUrl);
      
      // Here you would typically make an API call to update webhook settings
      console.log('Saving webhook settings:', { settings, webhookUrl });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Ayarlar başarıyla kaydedildi!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Ayarlar kaydedilirken hata oluştu!');
    } finally {
      setIsLoading(false);
    }
  };

  const webhookSettings = [
    {
      key: 'orderCreated',
      title: 'Sipariş Oluşturuldu',
      description: 'Yeni sipariş oluşturulduğunda webhook gönder',
    },
    {
      key: 'orderUpdated',
      title: 'Sipariş Güncellendi',
      description: 'Sipariş güncellendiğinde webhook gönder',
    },
    {
      key: 'productCreated',
      title: 'Ürün Oluşturuldu',
      description: 'Yeni ürün oluşturulduğunda webhook gönder',
    },
    {
      key: 'productUpdated',
      title: 'Ürün Güncellendi',
      description: 'Ürün güncellendiğinde webhook gönder',
    },
    {
      key: 'inventoryUpdated',
      title: 'Stok Güncellendi',
      description: 'Stok güncellendiğinde webhook gönder',
    },
  ];

  return (
    <Section customContent>
      <SettingsContainer>
        <Text variant="h4" style={{ marginBottom: '24px' }}>
          Webhook Ayarları
        </Text>

        <div style={{ marginBottom: '24px' }}>
          <SettingTitle>Webhook URL</SettingTitle>
          <SettingDescription>
            Webhook'ların gönderileceği URL adresi
          </SettingDescription>
          <Input
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            placeholder="https://your-domain.com/webhook"
            style={{ marginTop: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <SettingTitle>Webhook Türleri</SettingTitle>
          <SettingDescription>
            Hangi olaylar için webhook gönderileceğini seçin
          </SettingDescription>
        </div>

        {webhookSettings.map((setting) => (
          <SettingItem key={setting.key}>
            <SettingInfo>
              <SettingTitle>{setting.title}</SettingTitle>
              <SettingDescription>{setting.description}</SettingDescription>
            </SettingInfo>
            <Switch
              checked={settings[setting.key as keyof typeof settings]}
              onChange={(checked) => handleSettingChange(setting.key, checked)}
            />
          </SettingItem>
        ))}

        <div style={{ marginTop: '32px', display: 'flex', gap: '12px' }}>
          <Button
            onClick={handleSave}
            disabled={isLoading || !webhookUrl}
            loading={isLoading}
          >
            Ayarları Kaydet
          </Button>
        </div>
      </SettingsContainer>
    </Section>
  );
} 