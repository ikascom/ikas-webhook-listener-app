import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Section, Button, Input, Switch, Text, Card } from '@ikas/components';

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

const InfoCard = styled(Card)`
  margin-bottom: 24px;
`;

interface AppSettingsProps {
  token: string | null;
}

export default function AppSettings({ token }: AppSettingsProps) {
  const [settings, setSettings] = useState({
    enableNotifications: true,
    autoRetry: true,
    debugMode: false,
    logLevel: 'info',
  });

  const [appInfo, setAppInfo] = useState({
    appName: 'İkas Webhook Listener',
    version: '1.0.0',
    clientId: '',
    authorizedAppId: '',
  });

  useEffect(() => {
    // Load saved settings
    const savedSettings = localStorage.getItem('app_settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }

    // Load app info from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const authorizedAppId = urlParams.get('authorizedAppId') || '';
    const clientId = process.env.NEXT_PUBLIC_CLIENT_ID || '';

    setAppInfo(prev => ({
      ...prev,
      clientId,
      authorizedAppId,
    }));
  }, []);

  const handleSettingChange = (key: string, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('app_settings', JSON.stringify(newSettings));
  };

  const handleSave = async () => {
    try {
      // Here you would typically make an API call to update app settings
      console.log('Saving app settings:', settings);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Ayarlar başarıyla kaydedildi!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Ayarlar kaydedilirken hata oluştu!');
    }
  };

  const handleDisconnect = async () => {
    if (confirm('Uygulamayı devre dışı bırakmak istediğinizden emin misiniz?')) {
      try {
        // Here you would typically make an API call to disconnect the app
        console.log('Disconnecting app...');
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Redirect to home page
        window.location.href = '/';
      } catch (error) {
        console.error('Error disconnecting app:', error);
        alert('Uygulama devre dışı bırakılırken hata oluştu!');
      }
    }
  };

  const appSettings = [
    {
      key: 'enableNotifications',
      title: 'Bildirimler',
      description: 'Webhook olayları için bildirim göster',
    },
    {
      key: 'autoRetry',
      title: 'Otomatik Yeniden Deneme',
      description: 'Başarısız webhook'ları otomatik olarak yeniden dene',
    },
    {
      key: 'debugMode',
      title: 'Debug Modu',
      description: 'Detaylı log kayıtları tut',
    },
  ];

  return (
    <Section customContent>
      <SettingsContainer>
        <Text variant="h4" style={{ marginBottom: '24px' }}>
          Uygulama Ayarları
        </Text>

        <InfoCard>
          <Text variant="h6" style={{ marginBottom: '16px' }}>
            Uygulama Bilgileri
          </Text>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <Text variant="body2" color="textSecondary">Uygulama Adı</Text>
              <Text variant="body1">{appInfo.appName}</Text>
            </div>
            <div>
              <Text variant="body2" color="textSecondary">Versiyon</Text>
              <Text variant="body1">{appInfo.version}</Text>
            </div>
            <div>
              <Text variant="body2" color="textSecondary">Client ID</Text>
              <Text variant="body1" style={{ fontFamily: 'monospace' }}>
                {appInfo.clientId || 'Belirtilmemiş'}
              </Text>
            </div>
            <div>
              <Text variant="body2" color="textSecondary">Authorized App ID</Text>
              <Text variant="body1" style={{ fontFamily: 'monospace' }}>
                {appInfo.authorizedAppId || 'Belirtilmemiş'}
              </Text>
            </div>
          </div>
        </InfoCard>

        <div style={{ marginBottom: '24px' }}>
          <SettingTitle>Genel Ayarlar</SettingTitle>
          <SettingDescription>
            Uygulama davranışını özelleştirin
          </SettingDescription>
        </div>

        {appSettings.map((setting) => (
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
          <Button onClick={handleSave}>
            Ayarları Kaydet
          </Button>
          <Button 
            variant="outlined" 
            color="error" 
            onClick={handleDisconnect}
          >
            Uygulamayı Devre Dışı Bırak
          </Button>
        </div>
      </SettingsContainer>
    </Section>
  );
} 