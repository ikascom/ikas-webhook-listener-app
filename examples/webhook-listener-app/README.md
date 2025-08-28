# İkas Webhook Listener Template

Modern Next.js 15 App Router-based İkas webhook management template application.

## 🚀 Features

- **Modern Next.js 15**: Built with App Router architecture
- **TypeScript**: Full TypeScript support
- **shadcn/ui + Tailwind CSS**: Modern, accessible UI components and utility-first styling
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
│   └── globals.css        # Global styles (Tailwind + theme variables)
├── components/            # React components
│   ├── ui/                # shadcn/ui components
│   └── webhook-page/      # Webhook management component
├── lib/                   # Backend utilities
│   ├── api-requests.ts    # Frontend-backend API bridge
│   ├── auth-helpers.ts    # Authentication helpers
│   ├── ikas-client/       # İkas GraphQL client
│   │   ├── generated/     # Generated GraphQL types
│   │   └── codegen.ts     # GraphQL codegen config
│   ├── session.ts         # Session management
│   └── validation.ts      # Input validation
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

## 🔗 Dependencies

- **Next.js 15**: React framework
- **React 19**: UI library
- **TypeScript**: Type safety
- **shadcn/ui + Tailwind CSS**: UI components and styling
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
