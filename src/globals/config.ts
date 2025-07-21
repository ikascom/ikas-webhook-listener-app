export const config = {
  // Graph API and Store config
  graphApiUrl: process.env.NEXT_PUBLIC_GRAPH_API_URL,
  storeDomain: process.env.NEXT_PUBLIC_STORE_DOMAIN,
  adminUrl: process.env.NEXT_PUBLIC_ADMIN_URL,
  deployUrl: process.env.NEXT_PUBLIC_DEPLOY_URL,
  imageServiceUrl: process.env.IKAS_IMAGE_ADDRESS,

  cookiePassword: process.env.SECRET_COOKIE_PASSWORD,
  dashboardUrl: process.env.NEXT_PUBLIC_DASHBOARD_URL,

  // OAuth configuration
  oauth: {
    scope: 'read_orders,write_orders,read_products,read_inventories,write_inventories',
    apiUrl: process.env.NEXT_PUBLIC_OAUTH_URL,
    clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: `${process.env.NEXT_PUBLIC_DEPLOY_URL}/api/oauth/callback/ikas`,
  }
};

export type Config = typeof config;
