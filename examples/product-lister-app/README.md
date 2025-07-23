# İkas Product Lister Template

Modern Next.js 15 App Router-based İkas product management template application.

## 🚀 Features

- **Modern Next.js 15**: Built with App Router architecture
- **TypeScript**: Full TypeScript support
- **Styled Components**: Modern and responsive design with styled-components
- **İkas OAuth**: Store authorization system
- **Product Management**: List, create, and update products via İkas API
- **Admin API Client**: Uses İkas admin API client library
- **Frontend-Backend Bridge**: API requests for frontend-backend communication
- **Session Management**: Modern session management
- **GraphQL Integration**: Uses GraphQL queries and mutations for product operations

## 📁 Project Structure

```
product-lister-app/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── ikas/          # İkas API endpoints
│   │   │   ├── list-product/      # Product listing endpoint
│   │   │   ├── create-product/    # Product creation endpoint
│   │   │   ├── update-product/    # Product update endpoint
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
│   ├── product-page/      # Product management component
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

### Product Management

The application provides the following product management features:

- **List Products**: View all products with name, brand, and stock information
- **Create Product**: Add new products with name, description, and type
- **Update Product**: Edit existing product information
- **Search & Filter**: Search products by name or filter by criteria

### API Endpoints

The app provides these API endpoints:

- `GET /api/ikas/list-product`: List all products
- `POST /api/ikas/create-product`: Create a new product
- `POST /api/ikas/update-product`: Update an existing product
- `GET /api/ikas/get-merchant`: Get merchant information

### Dashboard

The dashboard page includes:

- Product listing table
- Add new product button
- Edit product functionality
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

// List products
const productsResponse = await ApiRequests.ikas.listProduct(token);
const products = productsResponse.data?.products;

// Create product
const createResponse = await ApiRequests.ikas.createProduct({ 
  productInput: { 
    name: 'New Product', 
    description: 'Product description',
    type: 'PHYSICAL'
  } 
}, token);

// Update product
const updateResponse = await ApiRequests.ikas.updateProduct({ 
  productInput: { 
    id: 'product-id',
    name: 'Updated Product',
    description: 'Updated description'
  } 
}, token);
```

### GraphQL Integration

GraphQL queries and mutations are defined in `lib/ikas-client/used-gql.ts`:

```typescript
import { gql } from 'graphql-request';

// List products query
export const LIST_PRODUCTS = gql`
  query ListProducts($input: ListProductsInput) {
    listProducts(input: $input) {
      data {
        id
        name
        description
        price
        stockQuantity
        # ... more fields
      }
      totalCount
      hasMore
    }
  }
`;

// Save product mutation (create/update)
export const SAVE_PRODUCT = gql`
  mutation SaveProduct($input: ProductInput!) {
    saveProduct(input: $input) {
      id
      name
      description
      # ... more fields
    }
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
export const GET_CATEGORIES = gql`
  query GetCategories {
    getCategories {
      id
      name
      description
    }
  }
`;
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
// components/product-page/index.tsx
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

This project is ready to be deployed to Vercel. Just configure the environment variables in the Vercel dashboard.

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

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the project
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
