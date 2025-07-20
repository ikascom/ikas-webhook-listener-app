export const devEnv = `
NODE_ENV = dev
NEXT_PUBLIC_GRAPH_API_URL = https://api.myikas.dev/api/v2/admin/graphql
NEXT_PUBLIC_OAUTH_URL = https://{storeName}.myikas.dev/api/admin/oauth
NEXT_PUBLIC_ADMIN_URL = https://{storeName}.myikas.dev/admin
NEXT_PUBLIC_STORE_DOMAIN = .myikas.dev
NEXT_PUBLIC_DEPLOY_URL = https://ikas-webhook-listener-dev.ikasapps.com
NEXT_PUBLIC_DASHBOARD_URL = https://{storeName}.myikas.dev/admin/order/view
IKAS_IMAGE_ADDRESS=https://cdn.myikas.dev

SECRET_COOKIE_PASSWORD= 2bA7Xe1gEvUv4MLGZsMYehkZJzVZK7FNXPBa6jwGXYc=
NEXT_PUBLIC_CLIENT_ID = 2e637712-8695-489f-a834-6f0bd3c92418
CLIENT_SECRET = s_v2qHvL1XthnRK3nj8mTYX1Haddf81c8c74254e2284aac3ffd400224t

VERCEL_AUTH_TOKEN = Pn5DIujTbAGxvsFAsC6Egbli
VERCEL_TEAM_ID = ikascom
VERCEL_REGION= fra1
`;

export const prodEnv = `
NODE_ENV = production
NEXT_PUBLIC_GRAPH_API_URL = https://api.myikas.com/api/v2/admin/graphql
NEXT_PUBLIC_OAUTH_URL = https://{storeName}.myikas.com/api/admin/oauth
NEXT_PUBLIC_ADMIN_URL = https://{storeName}.myikas.com/admin
NEXT_PUBLIC_STORE_DOMAIN = .myikas.com
NEXT_PUBLIC_DEPLOY_URL = https://ikas-webhook-listener.ikasapps.com
NEXT_PUBLIC_DASHBOARD_URL = https://{storeName}.myikas.com/admin/order/view
IKAS_IMAGE_ADDRESS=https://cdn.myikas.com

SECRET_COOKIE_PASSWORD= your_session_cookie_password_here_exp_2bA7Xe1gEvUv4MLGZsMYehkZJzVZK7FNXPBa6jwGXYc=
NEXT_PUBLIC_CLIENT_ID = your_store_app_id_here
CLIENT_SECRET = your_store_app_secret_here

VERCEL_AUTH_TOKEN = your_vercel_auth_token_here
VERCEL_TEAM_ID = your_vercel_team_id_here
VERCEL_REGION=your_vercel_region_here
`;
