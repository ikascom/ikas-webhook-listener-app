'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ApiRequests } from '@/lib/api-requests';
import type { GetMerchantApiResponse, GetWebhookLogsApiResponse, GetWebhookSettingsApiResponse } from '@/lib/api-requests';

export default function DashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [merchantData, setMerchantData] = useState<any>(null);
  const [webhookLogs, setWebhookLogs] = useState<any[]>([]);
  const [webhookSettings, setWebhookSettings] = useState<any>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Auth check
        const authResponse = await ApiRequests.auth.checkToken('dummy-token');
        
        if (!authResponse.success) {
          router.push('/authorize-store');
          return;
        }

        // Load merchant data
        const merchantResponse = await ApiRequests.ikas.getMerchant('dummy-token');
        if (merchantResponse.success) {
          setMerchantData(merchantResponse.data?.merchantInfo);
        }

        // Load webhook logs
        const logsResponse = await ApiRequests.webhook.getLogs('dummy-token');
        if (logsResponse.success) {
          setWebhookLogs(logsResponse.data?.logs || []);
        }

        // Load webhook settings
        const settingsResponse = await ApiRequests.webhook.getSettings('dummy-token');
        if (settingsResponse.success) {
          setWebhookSettings(settingsResponse.data?.settings);
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Dashboard load error:', error);
        router.push('/authorize-store');
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          {merchantData && (
            <p className="text-gray-600 mt-2">
              Mağaza: {merchantData.storeName} ({merchantData.domain})
            </p>
          )}
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Toplam Webhook</h3>
            <p className="text-3xl font-bold text-blue-600">{webhookLogs.length}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Başarılı</h3>
            <p className="text-3xl font-bold text-green-600">
              {webhookLogs.filter(log => log.status === 'success').length}
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Hatalı</h3>
            <p className="text-3xl font-bold text-red-600">
              {webhookLogs.filter(log => log.status === 'error').length}
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Webhook Settings */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Webhook Ayarları</h2>
            {webhookSettings ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Endpoint</label>
                  <p className="text-sm text-gray-900 mt-1">{webhookSettings.endpoint}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Event'ler</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {webhookSettings.events.map((event: string) => (
                      <span key={event} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        {event}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Durum</label>
                  <span className={`inline-flex px-2 py-1 text-xs rounded mt-1 ${
                    webhookSettings.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {webhookSettings.isActive ? 'Aktif' : 'Pasif'}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">Webhook ayarları yüklenemedi</p>
            )}
            <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
              Ayarları Düzenle
            </button>
          </div>

          {/* Recent Webhook Logs */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Son Webhook Logları</h2>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {webhookLogs.slice(0, 5).map((log) => (
                <div key={log.id} className="border-l-4 border-gray-200 pl-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{log.eventType}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(log.timestamp).toLocaleString('tr-TR')}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded ${
                      log.status === 'success' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {log.status}
                    </span>
                  </div>
                  {log.errorMessage && (
                    <p className="text-xs text-red-600 mt-1">{log.errorMessage}</p>
                  )}
                </div>
              ))}
            </div>
            <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors">
              Tüm Logları Görüntüle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 