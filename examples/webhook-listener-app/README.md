# ikas Webhook Listener Template

Modern Next.js 15 App Router-based ikas webhook management template application.

## 🚀 Features

- **Modern Next.js 15**: Built with App Router architecture
- **TypeScript**: Full TypeScript support
- **shadcn/ui + Tailwind CSS**: Modern, accessible UI components and utility-first styling
- **ikas OAuth**: Store authorization system
- **Webhook Management**: Create, list, update, and delete webhooks via ikas API
- **Webhook Event Handling**: Listen and process ikas webhook events
- **Admin API Client**: Uses ikas admin API client library
- **Frontend-Backend Bridge**: API requests for frontend-backend communication
- **Session Management**: Modern session management
- **GraphQL Integration**: Uses GraphQL queries and mutations for webhook operations

## 📁 Project Structure

```
webhook-listener-app/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── ikas/          # ikas API endpoints
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
│   ├── ikas-client/       # ikas GraphQL client
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

   - `NEXT_PUBLIC_GRAPH_API_URL`: ikas Admin GraphQL endpoint
   - `NEXT_PUBLIC_ADMIN_URL`: ikas Admin base URL (optional for UI)
   - `NEXT_PUBLIC_CLIENT_ID`: ikas application client ID
   - `CLIENT_SECRET`: ikas application client secret
   - `NEXT_PUBLIC_DEPLOY_URL`: public base URL of this app
   - `SECRET_COOKIE_PASSWORD`: session cookie encryption password

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
3. Complete ikas OAuth flow
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

### Working with GraphQL and ikas client

- Queries and mutations are defined in `src/lib/ikas-client/graphql-requests.ts` using the `gql` tag.
- Types and lightweight client wrappers are generated into `src/lib/ikas-client/generated/graphql.ts` via codegen.
- Create an ikas client instance with `getIkas(token)` from `src/helpers/api-helpers.ts`. This handles token refresh via `onCheckToken`.
- Execute queries with `ikasClient.queries.<Name>()` and mutations with `ikasClient.mutations.<Name>(variables)`.

### Adding a new API request (procedure)

1. Add your GraphQL query or mutation to `src/lib/ikas-client/graphql-requests.ts`.
2. Run `pnpm codegen` to regenerate types and client methods.
3. Use `getIkas` to construct the client in your API route (under `src/app/api/*`).
4. For queries, call `ikasClient.queries.<YourQuery>()`; for mutations, call `ikasClient.mutations.<YourMutation>(variables)`.

### MCP helpers

- Use the "shadcn-ui" MCP to scaffold UI components and view usage demos when adding new UI. Place components under `src/components/ui/*` following existing patterns.
- Use the "ikas" MCP list and introspect tools to discover available ikas GraphQL operations and shapes before implementing new requests.

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
- **@ikas/admin-api-client**: ikas admin API client
- **@ikas/app-helpers**: ikas app helpers
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

- Check the ikas API documentation
- Review the GraphQL schema at https://api.myikas.com/api/v2/admin/graphql
- Open an issue in this repository
