# İkas Webhook Listener Template

Modern Next.js 15 App Router kullanarak geliştirilmiş İkas webhook listener template uygulaması.

## 🚀 Özellikler

- **Modern Next.js 15**: App Router yapısı ile geliştirilmiş
- **TypeScript**: Tam TypeScript desteği
- **Tailwind CSS**: Modern ve responsive tasarım
- **İkas OAuth**: Mağaza yetkilendirme sistemi
- **Webhook Handling**: İkas webhook'larını dinleme ve işleme
- **Admin API Client**: İkas admin API client kütüphanesi kullanımı
- **Frontend-Backend Bridge**: API requests ile frontend-backend bağlantısı
- **Session Management**: Modern session yönetimi
- **Dummy Data Support**: Geliştirme için dummy data desteği

## 📁 Proje Yapısı

```
ikas-webhook-listener-app/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── ikas/          # İkas API endpoints
│   │   ├── oauth/         # OAuth endpoints
│   │   └── webhook/       # Webhook endpoints
│   ├── dashboard/         # Dashboard sayfası
│   ├── authorize-store/   # Mağaza yetkilendirme
│   ├── callback/          # OAuth callback
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Ana sayfa
│   └── globals.css        # Global stiller
├── lib/                   # Backend utilities
│   ├── api-requests/      # Frontend-backend API bridge
│   ├── auth/              # Authentication management
│   ├── database/          # Database connection (dummy)
│   ├── session/           # Session management
│   └── config.ts          # Uygulama konfigürasyonu
├── types/                 # TypeScript type definitions
│   ├── api/               # API types
│   └── models/            # Data model types
├── utils/                 # Utility functions
├── components/            # React component'leri
└── public/                # Statik dosyalar
```

## 🛠️ Kurulum

1. **Bağımlılıkları yükleyin:**
   ```bash
   pnpm install
   ```

2. **Environment dosyasını oluşturun:**
   ```bash
   cp env.example .env.local
   ```

3. **Environment değişkenlerini düzenleyin:**
   - `IKAS_CLIENT_ID`: İkas uygulama client ID'si
   - `IKAS_CLIENT_SECRET`: İkas uygulama client secret'ı
   - `IKAS_REDIRECT_URI`: OAuth callback URL'i
   - `SESSION_SECRET`: Session güvenlik anahtarı

4. **Geliştirme sunucusunu başlatın:**
   ```bash
   pnpm dev
   ```

## 🔧 Kullanım

### OAuth Yetkilendirme

1. `/authorize-store` sayfasına gidin
2. Mağaza bilgilerini girin
3. İkas OAuth akışını tamamlayın
4. Başarılı yetkilendirme sonrası dashboard'a yönlendirilirsiniz

### Webhook Endpoint

Webhook endpoint'i `/api/webhook/ikas` adresinde bulunur ve şu event'leri destekler:

- `order.created`: Sipariş oluşturuldu
- `order.updated`: Sipariş güncellendi

### Dashboard

Dashboard sayfasında şu özellikler bulunur:

- Webhook ayarları yönetimi
- Webhook logları görüntüleme
- Uygulama konfigürasyonu
- İstatistikler

## 🏗️ Backend Yapısı

### API Requests (Frontend-Backend Bridge)

`lib/api-requests/index.ts` dosyası frontend ve backend arasındaki API çağrılarını yönetir:

```typescript
import { ApiRequests } from '@/lib/api-requests';

// Merchant bilgilerini al
const response = await ApiRequests.ikas.getMerchant(token);
const merchantInfo = response.data?.merchantInfo;

// Webhook loglarını al
const logsResponse = await ApiRequests.webhook.getLogs(token);
const logs = logsResponse.data?.logs;
```

### Session Management

Modern session yönetimi `lib/session/session-manager.ts` dosyasında:

```typescript
import { sessionManager } from '@/lib/session/session-manager';

// Session oluştur
const sessionId = await sessionManager.setSession(request, sessionData);

// Session al
const session = await sessionManager.getSession(request);
```

### Token Management

Auth token yönetimi `lib/auth/token-manager.ts` dosyasında:

```typescript
import { authTokenManager } from '@/lib/auth/token-manager';

// Token oluştur
const token = await authTokenManager.createToken(tokenData);

// Token al
const token = await authTokenManager.getTokenByMerchantId(merchantId);
```

### Database Interface

Gelecekte MongoDB veya PostgreSQL ile değiştirilecek database interface:

```typescript
import { DB, ensureDBConnect } from '@/lib/database';

// Database bağlantısını sağla
await ensureDBConnect();
```

## 🏗️ Geliştirme

### Yeni API Route Ekleme

```typescript
// app/api/example/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { sessionManager } from '@/lib/session/session-manager';

export async function GET(request: NextRequest) {
  const session = await sessionManager.getSession(request);
  
  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  return NextResponse.json({ message: 'Hello World' });
}
```

### Yeni API Request Ekleme

```typescript
// lib/api-requests/index.ts
export const ApiRequests = {
  example: {
    getData: (token: string) => 
      makeGetRequest<ExampleResponse>({ 
        url: '/api/example', 
        token 
      }),
  },
};
```

### Yeni Sayfa Ekleme

```typescript
// app/example/page.tsx
'use client';

import { ApiRequests } from '@/lib/api-requests';

export default function ExamplePage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const response = await ApiRequests.example.getData('token');
      setData(response.data);
    };
    loadData();
  }, []);

  return (
    <div>
      <h1>Example Page</h1>
    </div>
  );
}
```

## 🔄 Database Geçişi

Şu anda dummy data kullanılıyor. Gerçek database'e geçmek için:

### MongoDB Geçişi

```bash
pnpm add mongoose @types/mongoose
```

```typescript
// lib/database/mongodb.ts
import mongoose from 'mongoose';

export class MongoDBDatabase implements Database {
  async connect(): Promise<void> {
    await mongoose.connect(process.env.MONGODB_URI!);
  }
}
```

### PostgreSQL Geçişi

```bash
pnpm add pg @types/pg
```

```typescript
// lib/database/postgresql.ts
import { Pool } from 'pg';

export class PostgreSQLDatabase implements Database {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
  }
}
```

## 📦 Build ve Deploy

### Production Build

```bash
pnpm build
```

### Production Sunucu

```bash
pnpm start
```

### Vercel Deploy

Bu proje Vercel'e deploy edilmeye hazırdır. Sadece environment değişkenlerini Vercel dashboard'ında ayarlayın.

## 🔗 Bağımlılıklar

- **Next.js 15**: React framework
- **React 19**: UI library
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **@ikas/admin-api-client**: İkas admin API client
- **@ikas/app-helpers**: İkas app helper'ları
- **@ikas/components**: İkas UI component'leri

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun
