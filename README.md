# Ikas Webhook Listener Template

This project is a template for developing webhook listener applications for the Ikas platform.

## Features

- Modern React app with Next.js 15 (Pages Router)
- TypeScript support
- OAuth integration (Ikas API)
- JSON-based data storage (default)
- Webhook listener structure
- Optional Redis cache support
- JWT token management
- Flexible database support
- Ikas API integration (getMerchant, etc.)
- Frontend-Backend API bridge structure

## Getting Started

1. Clone the project:
```bash
git clone <repository-url>
cd ikas-webhook-listener-template
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp env.example .env.local
```

4. Start the development server:
```bash
pnpm dev
```

## Environment Variables

Define the following environment variables in your `.env.local` file:

```env
# Ikas OAuth
NEXT_PUBLIC_OAUTH_URL=https://api.ikas.com/oauth
NEXT_PUBLIC_CLIENT_ID=your_client_id
CLIENT_SECRET=your_client_secret
NEXT_PUBLIC_DEPLOY_URL=http://localhost:3000
NEXT_PUBLIC_STORE_DOMAIN=https://api.ikas.com

# Redis (Optional)
REDIS_URL=redis://localhost:6379

# Cookie
SECRET_COOKIE_PASSWORD=your_cookie_secret

# Storage
DATA_PATH=./data
```

## Data Storage

This template uses JSON files for data storage by default. This provides:

- **Quick start**: No database setup required
- **Flexibility**: You can use any database you want
- **Simplicity**: Ideal for development and testing

### Changing the Database

If you want to use your own database:

1. Edit `src/models/auth-token/manager.ts`
2. Update `src/lib/database.ts`
3. Add the necessary database dependencies

#### PostgreSQL Example:
```bash
pnpm add pg @types/pg
```

#### MySQL Example:
```bash
pnpm add mysql2 @types/mysql
```

#### MongoDB Example:
```bash
pnpm add mongoose @typegoose/typegoose
```

## Project Structure

```
src/
├── pages/                   # Next.js Pages Router
│   ├── api/                # API routes
│   │   ├── oauth/          # OAuth endpoints
│   │   ├── ikas/           # İkas API endpoints
│   │   │   └── get-merchant/  # Get merchant info
│   │   └── webhooks/       # Webhook endpoints
│   ├── dashboard/          # Dashboard pages
│   ├── _app.tsx            # App wrapper
│   ├── _document.tsx       # Document wrapper
│   └── index.tsx           # Home page
├── components/             # React components
├── globals/                # Global configurations
├── lib/                    # Utility libraries
│   ├── api-requests.ts     # Frontend-Backend API bridge
│   └── ikas-client.ts      # İkas API client
├── models/                 # Data models
└── types/                  # TypeScript types
data/                       # JSON data files (auto-created)
└── auth-tokens.json        # Auth tokens storage
```

## API Structure

### Frontend-Backend Bridge

`src/lib/api-requests.ts` dosyası frontend ve backend arasındaki API çağrılarını yönetir:

```typescript
import { ApiRequests } from '@/lib/api-requests';

// Merchant bilgilerini al
const response = await ApiRequests.ikas.getMerchant(token);
const merchantInfo = response.data.data.merchantInfo;
```

### İkas API Endpoints

- `GET /api/ikas/get-merchant` - Mağaza bilgilerini al
- `GET /api/oauth/authorize/ikas` - OAuth authorization
- `GET /api/oauth/callback/ikas` - OAuth callback
- `GET /api/oauth/check-for-reauthorize` - Reauthorization check
- `POST /api/oauth/get-token-with-signature` - Token with signature

### Webhook Endpoints

- `POST /api/webhooks/order-created` - Order created webhook
- `POST /api/webhooks/order-updated` - Order updated webhook

## İkas API Usage

### 1. Token Alma

Önce OAuth ile token alın:

```typescript
// OAuth callback'ten sonra token alınır
const token = "your_jwt_token";
```

### 2. Merchant Bilgilerini Alma

```typescript
import { ApiRequests } from '@/lib/api-requests';

try {
  const response = await ApiRequests.ikas.getMerchant(token);
  if (response.status === 200) {
    const merchantInfo = response.data.data.merchantInfo;
    console.log('Mağaza adı:', merchantInfo.storeName);
    console.log('Mağaza ID:', merchantInfo.id);
  }
} catch (error) {
  console.error('API hatası:', error);
}
```

### 3. Yeni API Endpoint Ekleme

Yeni bir İkas API endpoint'i eklemek için:

1. **API Route oluşturun** (`src/pages/api/ikas/your-endpoint/index.ts`):
```typescript
import type { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import { AuthTokenManager } from '@/models/auth-token/manager';
import { getIkas } from '@/lib/ikas-client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // API logic here
}
```

2. **API request fonksiyonu ekleyin** (`src/lib/api-requests.ts`):
```typescript
export const ApiRequests = {
  ikas: {
    getMerchant: (token: string) => makeGetRequest<{ data: GetMerchantApiResponse }>({
      url: '/api/ikas/get-merchant',
      token
    }),
    yourEndpoint: (token: string) => makeGetRequest<{ data: YourResponseType }>({
      url: '/api/ikas/your-endpoint',
      token
    }),
  },
};
```

## Test Pages

- `/test-api` - API test sayfası
- `/dashboard` - Dashboard ana sayfası
- `/authorize-store` - OAuth authorization sayfası
- `/callback` - OAuth callback sayfası

## Development

You can develop your own Ikas application using this template:

1. Update the project name and description
2. Set up your OAuth client ID and secret
3. Customize the webhook endpoints as needed
4. Develop the dashboard pages
5. Optionally change your database
6. Add new Ikas API endpoints

## Data Backup

If you're using JSON-based storage, make sure to backup the `data/` folder regularly:

```bash
# Veri yedekleme örneği
cp -r data/ backup/data-$(date +%Y%m%d)
```

## License

MIT
