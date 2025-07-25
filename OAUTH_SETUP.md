# OAuth Provider Setup for Production

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to "APIs & Services" > "Credentials"
4. Edit your OAuth 2.0 Client ID
5. Add these Authorized redirect URIs:
   - `https://klicktools.vercel.app/api/auth/callback/google`
   - `http://localhost:3000/api/auth/callback/google` (for local development)

## GitHub OAuth Setup

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Select your OAuth App
3. Add these Authorization callback URLs:
   - `https://klicktools.vercel.app/api/auth/callback/github`
   - `http://localhost:3000/api/auth/callback/github` (for local development)

## Environment Variables

Make sure these are set in your Vercel environment:

```
NEXTAUTH_URL=https://klicktools.vercel.app
NEXTAUTH_SECRET=your-secret-key-here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_ID=your-github-id
GITHUB_SECRET=your-github-secret
JWT_SECRET=your-jwt-secret
MONGODB_URI=your-mongodb-connection-string
```

## Important Notes

- The `NEXTAUTH_URL` is now set to your stable custom domain: `https://klicktools.vercel.app`
- This URL won't change with deployments, making OAuth setup permanent
- For local development, you can override it in your `.env.local` file
- Make sure your OAuth providers have the correct callback URLs
- The callback URLs must match exactly (including the `/api/auth/callback/` path) 