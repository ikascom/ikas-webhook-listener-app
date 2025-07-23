# İkas Webhook Listener Template

Modern Next.js 15 App Router-based İkas webhook management template application.

## 🚀 Features

- **Modern Next.js 15**: Built with App Router architecture
- **TypeScript**: Full TypeScript support
- **Styled Components**: Modern and responsive design with styled-components
- **İkas OAuth**: Store authorization system
- **Webhook Management**: Create, list, update, and delete webhooks via İkas API
- **Webhook Event Handling**: Listen and process İkas webhook events
- **Admin API Client**: Uses İkas admin API client library
- **Frontend-Backend Bridge**: API requests for frontend-backend communication
- **Session Management**: Modern session management
- **GraphQL Integration**: Uses GraphQL queries and mutations for webhook operations

## 📁 Project Structure

```
webhook-listener-app/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── ikas/          # İkas API endpoints
│   │   │   ├── list-webhook/      # Webhook listing endpoint
│   │   │   ├── save-webhook/      # Webhook creation/update endpoint
│   │   │   ├── delete-webhook/    # Webhook deletion endpoint
│   │   │   ├── list-sales-channel/ # Sales channel listing endpoint
│   │   │   └── get-merchant/      # Merchant info endpoint
│   │   └── oauth/         # OAuth endpoints
│   ├── dashboard/         # Dashboard page
│   ├── authorize-store/   # Store authorization
│   ├── callback/          # OAuth callback
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── lib/                   # Backend utilities
│   ├── api-requests.ts    # Frontend-backend API bridge
│   ├── auth-helpers.ts    # Authentication helpers
│   ├── ikas-client/       # İkas GraphQL client
│   │   ├── used-gql.ts    # GraphQL queries and mutations
│   │   ├── generated/     # Generated GraphQL types
│   │   └── codegen.ts     # GraphQL codegen config
│   ├── session.ts         # Session management
│   └── validation.ts      # Input validation
├── helpers/               # Helper functions
├── components/            # React components
│   ├── webhook-page/      # Webhook management component
│   └── loading/           # Loading component
├── models/                # Data models
└── public/                # Static files
```

## 🛠️ Setup

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Create environment file:**
   ```bash
   cp env.example .env.local
   ```

3. **Configure environment variables:**
   - `IKAS_CLIENT_ID`: İkas application client ID
   - `IKAS_CLIENT_SECRET`: İkas application client secret
   - `IKAS_REDIRECT_URI`: OAuth callback URL
   - `SESSION_SECRET`: Session security key

4. **Generate GraphQL types (optional):**
   ```bash
   pnpm codegen
   ```

5. **Start development server:**
   ```bash
   pnpm dev
   ```

## 🔧 Usage

### OAuth Authorization

1. Navigate to `/authorize-store` page
2. Enter store credentials
3. Complete İkas OAuth flow
4. After successful authorization, you'll be redirected to the dashboard

### Webhook Management

The application provides the following webhook management features:

- **List Webhooks**: View all registered webhooks with endpoint URLs and scopes
- **Create Webhook**: Add new webhook endpoints with specific event scopes
- **Update Webhook**: Edit existing webhook configurations
- **Delete Webhook**: Remove webhook endpoints
- **Sales Channel Selection**: Configure webhooks for specific sales channels

### Available Webhook Scopes

The app supports these webhook event types:

- `order_created`: Order creation events
- `order_updated`: Order update events
- `order_deleted`: Order deletion events
- `product_created`: Product creation events
- `product_updated`: Product update events
- `product_deleted`: Product deletion events
- `customer_created`: Customer creation events
- `customer_updated`: Customer update events
- `customer_deleted`: Customer deletion events

### API Endpoints

The app provides these API endpoints:

- `GET /api/ikas/list-webhook`: List all webhooks
- `POST /api/ikas/save-webhook`: Create/update a webhook
- `POST /api/ikas/delete-webhook`: Delete a webhook
- `GET /api/ikas/list-sales-channel`: List sales channels
- `GET /api/ikas/get-merchant`: Get merchant information

### Dashboard

The dashboard page includes:

- Webhook listing table with endpoint URLs and scopes
- Add new webhook button with scope selection
- Edit webhook functionality
- Delete webhook with confirmation
- Sales channel selection for webhook targeting
- Store information display
- Loading states and error handling

## 🏗️ Backend Architecture

### API Requests (Frontend-Backend Bridge)

`lib/api-requests.ts` file manages API calls between frontend and backend:

```typescript
import { ApiRequests } from '@/lib/api-requests';

// Get merchant information
const response = await ApiRequests.ikas.getMerchant(token);
const merchantInfo = response.data?.merchantInfo;

// List webhooks
const webhooksResponse = await ApiRequests.ikas.listWebhook(token);
const webhooks = webhooksResponse.data?.webhooks;

// Save webhook
const saveResponse = await ApiRequests.ikas.saveWebhook({ 
  webhookInput: { 
    endpoint: 'https://your-app.com/webhook',
    scopes: ['order_created', 'order_updated'],
    salesChannelIds: ['channel-id']
  } 
}, token);

// Delete webhook
const deleteResponse = await ApiRequests.ikas.deleteWebhook({ 
  scopes: 'order_created' 
}, token);

// List sales channels
const channelsResponse = await ApiRequests.ikas.listSalesChannel(token);
const channels = channelsResponse.data?.salesChannels;
```

### GraphQL Integration

GraphQL queries and mutations are defined in `lib/ikas-client/used-gql.ts`:

```typescript
import { gql } from 'graphql-request';

// List webhooks query
export const LIST_WEBHOOKS = gql`
  query ListWebhook {
    listWebhook {
      createdAt
      endpoint
      deleted
      id
      scope
      updatedAt
    }
  }
`;

// Save webhook mutation
export const SAVE_WEBHOOKS = gql`
  mutation SaveWebhooks($input: WebhookInput!) {
    saveWebhooks(input: $input) {
      createdAt
      deleted
      endpoint
      id
      scope
      updatedAt
    }
  }
`;

// Delete webhook mutation
export const DELETE_WEBHOOK = gql`
  mutation DeleteWebhook($scopes: [String!]!) {
    deleteWebhook(scopes: $scopes)
  }
`;
```

### Session Management

Session management in `lib/session.ts`:

```typescript
import { getIronSession } from 'iron-session';

// Get session data
const session = await getIronSession(req, res, sessionOptions);

// Set session data
session.user = userData;
await session.save();
```

### Authentication Helpers

Authentication utilities in `lib/auth-helpers.ts`:

```typescript
import { getUserFromRequest } from '@/lib/auth-helpers';

// Get authenticated user from request
const user = getUserFromRequest(request);
if (!user) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
```

## 🏗️ Development

### Adding New API Route

```typescript
// app/api/example/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth-helpers';

export async function GET(request: NextRequest) {
  const user = getUserFromRequest(request);
  
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  return NextResponse.json({ message: 'Hello World' });
}
```

### Adding New API Request

```typescript
// lib/api-requests.ts
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

### Adding New GraphQL Query

```typescript
// lib/ikas-client/used-gql.ts
export const GET_WEBHOOK_LOGS = gql`
  query GetWebhookLogs($input: WebhookLogsInput) {
    getWebhookLogs(input: $input) {
      id
      endpoint
      status
      createdAt
    }
  }
`;
```

### Adding New Webhook Scope

To add a new webhook scope, update the `WEBHOOK_SCOPES` array:

```typescript
// components/webhook-page/index.tsx
const WEBHOOK_SCOPES = [
  'order_created',
  'order_updated',
  'order_deleted',
  'product_created',
  'product_updated',
  'product_deleted',
  'customer_created',
  'customer_updated',
  'customer_deleted',
  'inventory_updated', // New scope
];
```

### Adding New Page

```typescript
// app/example/page.tsx
'use client';

import { useState, useEffect } from 'react';
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

## 🎨 UI Components

The app uses styled-components for styling:

```typescript
// components/webhook-page/index.tsx
import styled from 'styled-components';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
`;

const AddButton = styled.button`
  background: #28a745;
  color: #fff;
  border: none;
  padding: 14px 28px;
  border-radius: 8px;
  cursor: pointer;
  
  &:hover {
    background: #218838;
  }
`;

const ScopeCheckbox = styled.label<{ selected?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: 2px solid ${props => props.selected ? '#007bff' : '#dee2e6'};
  background: ${props => props.selected ? '#007bff' : '#fff'};
  color: ${props => props.selected ? '#fff' : '#495057'};
  border-radius: 8px;
  cursor: pointer;
  
  &:hover {
    border-color: #007bff;
  }
`;
```

## 🎯 Webhook Event Handling

When webhooks are triggered by İkas, they'll be sent to your configured endpoint. Here's how to handle them:

```typescript
// app/api/webhook/ikas/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const webhookData = await request.json();
    
    // Handle different webhook events
    switch (webhookData.event) {
      case 'order_created':
        await handleOrderCreated(webhookData.data);
        break;
      case 'product_updated':
        await handleProductUpdated(webhookData.data);
        break;
      default:
        console.log('Unhandled webhook event:', webhookData.event);
    }
    
    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('Webhook handling error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
```

## 📦 Build and Deploy

### Production Build

```bash
pnpm build
```

### Production Server

```bash
pnpm start
```

### Vercel Deploy

This project is ready to be deployed to Vercel. Just configure the environment variables in the Vercel dashboard and ensure your webhook endpoints are publicly accessible.

### Webhook Endpoint Setup

Make sure your webhook endpoints are accessible:

```bash
# Your webhook endpoint should be publicly accessible
https://your-domain.com/api/webhook/ikas
```

## 🔗 Dependencies

- **Next.js 15**: React framework
- **React 19**: UI library
- **TypeScript**: Type safety
- **Styled Components**: CSS-in-JS styling
- **@ikas/admin-api-client**: İkas admin API client
- **@ikas/app-helpers**: İkas app helpers
- **GraphQL Request**: GraphQL client for API calls
- **Iron Session**: Session management
- **Axios**: HTTP client
- **UUID**: Unique identifier generation

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the project
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For support and questions:
- Check the İkas API documentation
- Review the GraphQL schema at https://api.myikas.com/api/v2/admin/graphql
- Open an issue in this repository
