# İkas Script Injector Template

Modern Next.js 15 App Router-based İkas script injection template application.

## 🚀 Features

- **Modern Next.js 15**: Built with App Router architecture
- **TypeScript**: Full TypeScript support
- **Styled Components**: Modern and responsive design with styled-components
- **İkas OAuth**: Store authorization system
- **Script Injection**: Generate and inject custom JavaScript scripts into storefronts
- **Storefront Management**: List and select storefronts for script injection
- **Admin API Client**: Uses İkas admin API client library
- **Frontend-Backend Bridge**: API requests for frontend-backend communication
- **Session Management**: Modern session management
- **GraphQL Integration**: Uses GraphQL queries and mutations for script operations

## 📁 Project Structure

```
script-injector-app/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── ikas/          # İkas API endpoints
│   │   │   ├── list-storefront/           # Storefront listing endpoint
│   │   │   ├── create-storefront-js-script/ # Script creation endpoint
│   │   │   └── get-merchant/              # Merchant info endpoint
│   │   └── oauth/         # OAuth endpoints
│   ├── dashboard/         # Main dashboard page
│   ├── success/           # Script generation success page
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
   - `NEXT_PUBLIC_CLIENT_ID`: İkas application client ID
   - `CLIENT_SECRET`: İkas application client secret
   - `NEXT_PUBLIC_DEPLOY_URL`: Application deployment URL
   - `SECRET_COOKIE_PASSWORD`: Session security key
   - `NEXT_PUBLIC_GRAPH_API_URL`: İkas GraphQL API URL
   - `NEXT_PUBLIC_ADMIN_URL`: İkas admin URL

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

### Script Injection

The application provides the following script injection features:

1. **Dashboard** (`/dashboard`):
   - View current store information
   - Select from available storefronts
   - Generate custom JavaScript scripts
   - Inject scripts into selected storefront

2. **Success Page** (`/success`):
   - View script generation results
   - Script ID and storefront details
   - Navigation back to dashboard

### Script Generation Flow

1. **Storefront Selection**: Choose the target storefront from dropdown
2. **Generate Script**: Click "Generate Script" button
3. **Script Creation**: Custom script is created and injected into the storefront
4. **Success Confirmation**: View script details and success message

### API Endpoints

The app provides these API endpoints:

- `GET /api/ikas/list-storefront`: List all available storefronts
- `POST /api/ikas/create-storefront-js-script`: Create and inject JavaScript script
- `GET /api/ikas/get-merchant`: Get merchant information

### Dashboard Features

The dashboard page includes:

- **Store Information**: Display current store name and details
- **Storefront Selection**: Dropdown list of available storefronts
- **Script Generation**: One-click script creation and injection
- **Loading States**: Real-time feedback during operations
- **Error Handling**: User-friendly error messages
- **Responsive Design**: Mobile-friendly interface

## 🏗️ Backend Architecture

### API Requests (Frontend-Backend Bridge)

`lib/api-requests.ts` file manages API calls between frontend and backend:

```typescript
import { ApiRequests } from '@/lib/api-requests';

// Get merchant information
const response = await ApiRequests.ikas.getMerchant(token);
const merchantInfo = response.data?.merchantInfo;

// List storefronts
const storefrontsResponse = await ApiRequests.ikas.listStorefront(token);
const storefronts = storefrontsResponse.data?.storefronts;

// Create and inject script
const scriptResponse = await ApiRequests.ikas.createStorefrontJsScript({ 
  scriptInput: { 
    storefrontId: 'storefront-id',
    name: 'Custom Script',
    scriptContent: '<script>console.log("Hello World");</script>',
    contentType: StorefrontJSScriptContentTypeEnum.SCRIPT
  } 
}, token);
```

### GraphQL Integration

GraphQL queries and mutations are defined in `lib/ikas-client/used-gql.ts`:

```typescript
import { gql } from 'graphql-request';

// List storefronts query
export const LIST_STOREFRONTS = gql`
  query ListStorefronts {
    listStorefront {
      id
      name
      domain
      isDefault
      # ... more fields
    }
  }
`;

// Create storefront script mutation
export const CREATE_STOREFRONT_JS_SCRIPT = gql`
  mutation CreateStorefrontJSScript($input: CreateStorefrontJSScriptInput!) {
    createStorefrontJSScript(input: $input) {
      id
      name
      scriptContent
      storefrontId
      contentType
      createdAt
      updatedAt
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
  ikas: {
    // Existing endpoints...
    customEndpoint: (token: string) => 
      makeGetRequest<CustomResponse>({ 
        url: '/api/ikas/custom-endpoint', 
        token 
      }),
  },
};
```

### Adding New GraphQL Query

```typescript
// lib/ikas-client/used-gql.ts
export const GET_STOREFRONT_SCRIPTS = gql`
  query GetStorefrontScripts($storefrontId: ID!) {
    getStorefrontScripts(storefrontId: $storefrontId) {
      id
      name
      scriptContent
      contentType
      createdAt
    }
  }
`;
```

### Custom Script Examples

You can customize the generated script content:

```typescript
// Basic tracking script
const trackingScript = `
<script>
  (function() {
    console.log('Page loaded on storefront: ${storefrontId}');
    
    // Track page views
    if (typeof gtag !== 'undefined') {
      gtag('event', 'page_view', {
        custom_parameter: 'value'
      });
    }
  })();
</script>
`;

// Custom analytics script
const analyticsScript = `
<script>
  window.customAnalytics = {
    track: function(event, data) {
      console.log('Tracking:', event, data);
      // Your analytics implementation
    },
    
    init: function() {
      this.track('storefront_loaded', {
        storefrontId: '${storefrontId}',
        timestamp: new Date().toISOString()
      });
    }
  };
  
  window.customAnalytics.init();
</script>
`;
```

## 🎨 UI Components

The app uses styled-components for styling:

```typescript
// Styled components for dashboard
import styled from 'styled-components';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 24px;
  background: #fff;
  min-height: 100vh;
`;

const GenerateButton = styled.button`
  background: #28a745;
  color: #fff;
  border: none;
  padding: 16px 32px;
  border-radius: 12px;
  cursor: pointer;
  font-size: 18px;
  font-weight: 600;
  
  &:hover {
    background: #218838;
    transform: translateY(-2px);
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
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

- **Next.js 15**: React framework with App Router
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

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# İkas App Configuration
NEXT_PUBLIC_CLIENT_ID=your_client_id
CLIENT_SECRET=your_client_secret
NEXT_PUBLIC_DEPLOY_URL=http://localhost:3000

# İkas API Configuration  
NEXT_PUBLIC_GRAPH_API_URL=https://api.myikas.com/graphql
NEXT_PUBLIC_ADMIN_URL=https://admin.myikas.com

# Session Security
SECRET_COOKIE_PASSWORD=your_secret_password_min_32_chars
```

### Script Content Customization

You can modify the generated script content in the dashboard component:

```typescript
const customScriptContent = `
<script>
  // Your custom JavaScript code here
  console.log('Custom script loaded for storefront: ${storefrontId}');
  
  // Add custom functionality
  window.myCustomApp = {
    init: function() {
      // Initialize your custom features
    }
  };
</script>
`;
```
