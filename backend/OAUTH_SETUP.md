# OAuth Setup Guide

This guide will help you set up Google and GitHub OAuth authentication for the AI Resume Builder application.

## Prerequisites

1. **Backend server running** on `http://localhost:5000`
2. **Frontend server running** on `http://localhost:3000`
3. **MongoDB** configured and running

## Google OAuth Setup

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it

### 2. Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Configure the OAuth consent screen:
   - User Type: External
   - App name: "AI Resume Builder"
   - User support email: Your email
   - Developer contact information: Your email
   - Save and continue

4. Create OAuth 2.0 Client ID:
   - Application type: Web application
   - Name: "AI Resume Builder Web Client"
   - Authorized redirect URIs: `http://localhost:5000/api/auth/google/callback`
   - Click "Create"

5. Copy the Client ID and Client Secret

### 3. Update Environment Variables

Add these to your `.env` file:
```env
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
```

## GitHub OAuth Setup

### 1. Create GitHub OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in the details:
   - Application name: "AI Resume Builder"
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:5000/api/auth/github/callback`
   - Click "Register application"

4. Copy the Client ID and Client Secret

### 2. Update Environment Variables

Add these to your `.env` file:
```env
GITHUB_CLIENT_ID=your-github-client-id-here
GITHUB_CLIENT_SECRET=your-github-client-secret-here
```

## Testing OAuth

### 1. Start the Servers

```bash
# Backend (in backend directory)
npm run dev

# Frontend (in frontend directory)
npm run dev
```

### 2. Test the Flow

1. Go to `http://localhost:3000/auth/login`
2. Click "Continue with Google" or "Continue with GitHub"
3. Complete the OAuth flow
4. You should be redirected to the dashboard

## Troubleshooting

### Common Issues

1. **"OAuth not configured" error**
   - Make sure you've added the OAuth credentials to your `.env` file
   - Restart the backend server after updating `.env`

2. **"Invalid redirect URI" error**
   - Check that the redirect URI in your OAuth app matches exactly:
     - Google: `http://localhost:5000/api/auth/google/callback`
     - GitHub: `http://localhost:5000/api/auth/github/callback`

3. **"Authentication failed" error**
   - Check the backend logs for detailed error messages
   - Verify your OAuth credentials are correct
   - Make sure the OAuth apps are properly configured

4. **CORS errors**
   - Ensure the backend is running on port 5000
   - Check that CORS is properly configured in the backend

### Debug Steps

1. **Check backend logs** for OAuth errors
2. **Verify environment variables** are loaded correctly
3. **Test OAuth endpoints** directly:
   - `GET http://localhost:5000/api/auth/google/url`
   - `GET http://localhost:5000/api/auth/github/url`

### Production Deployment

For production deployment:

1. **Update redirect URIs** to your production domain:
   - Google: `https://yourdomain.com/api/auth/google/callback`
   - GitHub: `https://yourdomain.com/api/auth/github/callback`

2. **Update environment variables** with production credentials

3. **Configure HTTPS** - OAuth requires HTTPS in production

4. **Update frontend URLs** to use your production domain

## Security Notes

1. **Never commit OAuth secrets** to version control
2. **Use environment variables** for all sensitive data
3. **Rotate secrets regularly** in production
4. **Monitor OAuth usage** for suspicious activity
5. **Implement rate limiting** on OAuth endpoints

## API Endpoints

### Google OAuth
- `GET /api/auth/google/url` - Get Google OAuth URL
- `GET /api/auth/google/callback` - Handle Google OAuth callback

### GitHub OAuth
- `GET /api/auth/github/url` - Get GitHub OAuth URL
- `GET /api/auth/github/callback` - Handle GitHub OAuth callback

## User Flow

1. User clicks "Continue with Google/GitHub"
2. Frontend calls `/api/auth/[provider]/url`
3. Backend returns OAuth URL
4. Frontend redirects to OAuth provider
5. User authenticates with provider
6. Provider redirects to `/api/auth/[provider]/callback`
7. Backend exchanges code for token
8. Backend gets user info from provider
9. Backend creates/updates user in database
10. Backend redirects to frontend with JWT token
11. Frontend stores token and redirects to dashboard

## Database Schema

OAuth users are stored in the same `users` collection with additional fields:

```javascript
{
  _id: ObjectId,
  email: String,
  name: String,
  provider: String, // "google" or "github"
  picture: String,  // Profile picture URL
  created_at: Date,
  updated_at: Date
}
```

## Support

If you encounter issues:

1. Check the backend logs for detailed error messages
2. Verify your OAuth app configuration
3. Test the OAuth flow step by step
4. Ensure all environment variables are set correctly 