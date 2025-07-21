# Webhook Listener App - Deploy Guide

This project is configured to be deployed to Vercel.

## Deploy Scripts

### Development Deploy
```bash
npm run deploy:dev
```

### Production Deploy
```bash
npm run deploy:prod
```

## Deploy Structure

The project manages deploy operations under the `src/lib/vercel/` folder:

- `deploy.ts` - Main deploy function
- `webhook-vercel-manager.ts` - Custom VercelManager for webhook project
- `envGlobals.ts` - Environment variables (dev/prod)
- `helpers.ts` - Environment helper functions
- `prepare.ts` - Pre-deploy preparation operations

## Environment Variables

Environment variables are automatically set during deploy:

- **Development**: `ikas-webhook-listener-dev.ikasapps.com`
- **Production**: `ikas-webhook-listener.ikasapps.com`

## Features

- Single package deploy (no turbo)
- MongoDB database support
- Next.js App Router structure
- Custom function configuration for API routes

## Vercel Credentials Setup

Before deploying, you need to set up your Vercel credentials:

1. **Get Vercel Auth Token**:
   - Go to [Vercel Dashboard](https://vercel.com/account/tokens)
   - Create a new token with appropriate permissions
   - Copy the token

2. **Get Vercel Team ID**:
   - Go to [Vercel Dashboard](https://vercel.com/teams)
   - Select your team or create one
   - Copy the Team ID from the URL or team settings

3. **Update Environment Variables**:
   - Open `src/lib/vercel/envGlobals.ts`
   - Replace `your_vercel_auth_token_here` with your actual Vercel auth token
   - Replace `your_vercel_team_id_here` with your actual Vercel team ID

## Notes

- `.env.production` file is automatically created during deploy
- Build folder is automatically cleaned after deploy
- Vercel project is automatically created and configured
- Make sure to keep your Vercel credentials secure and never commit them to version control

## Troubleshooting

If you encounter `Protocol "https:" not supported. Expected "http:"` error:
- This is fixed by explicitly setting `apiUrl: 'https://api.vercel.com'` in createDeployment options
- This issue occurs with newer Node.js versions (22+) and @vercel/client v14+ 