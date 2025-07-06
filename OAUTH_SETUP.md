# OAuth Authentication Setup Guide

This guide explains how to set up real OAuth authentication for Google and GitHub in your AI Resume Builder application.

## Current Implementation

The current implementation uses mock authentication for demonstration purposes. The Google and GitHub login buttons simulate the authentication process and create mock user data.

## Setting Up Real OAuth Authentication

### 1. Google OAuth Setup

#### Step 1: Create Google OAuth Credentials
1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Configure the OAuth consent screen
6. Set the application type to "Web application"
7. Add authorized redirect URIs:
   - `http://localhost:3000/auth/callback/google` (for development)
   - `https://yourdomain.com/auth/callback/google` (for production)
8. Copy the Client ID and Client Secret

#### Step 2: Update the Frontend
Replace `YOUR_GOOGLE_CLIENT_ID` in the login and signup pages with your actual Google Client ID:

```javascript
// In src/pages/auth/login.js and src/pages/auth/signup.js
const clientId = 'your-actual-google-client-id';
```

#### Step 3: Update the Backend
Add Google OAuth handling to your Python backend (`server.py`):

```python
import requests
from flask import request, jsonify

# Google OAuth endpoints
GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token'
GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v2/userinfo'

@app.route('/auth/google/callback', methods=['POST'])
def google_callback():
    try:
        data = request.get_json()
        code = data.get('code')
        
        # Exchange code for access token
        token_response = requests.post(GOOGLE_TOKEN_URL, data={
            'client_id': 'YOUR_GOOGLE_CLIENT_ID',
            'client_secret': 'YOUR_GOOGLE_CLIENT_SECRET',
            'code': code,
            'grant_type': 'authorization_code',
            'redirect_uri': 'http://localhost:3000/auth/callback/google'
        })
        
        token_data = token_response.json()
        access_token = token_data.get('access_token')
        
        # Get user info from Google
        user_response = requests.get(GOOGLE_USERINFO_URL, headers={
            'Authorization': f'Bearer {access_token}'
        })
        
        user_data = user_response.json()
        
        # Create or update user in your database
        user = {
            'email': user_data['email'],
            'name': user_data['name'],
            'picture': user_data.get('picture'),
            'provider': 'google'
        }
        
        # Store user in database and return session
        return jsonify({'success': True, 'user': user})
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400
```

### 2. GitHub OAuth Setup

#### Step 1: Create GitHub OAuth App
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in the application details:
   - Application name: "AI Resume Builder"
   - Homepage URL: `http://localhost:3000` (development)
   - Authorization callback URL: `http://localhost:3000/auth/callback/github`
4. Copy the Client ID and Client Secret

#### Step 2: Update the Frontend
Replace `YOUR_GITHUB_CLIENT_ID` in the login and signup pages with your actual GitHub Client ID:

```javascript
// In src/pages/auth/login.js and src/pages/auth/signup.js
const clientId = 'your-actual-github-client-id';
```

#### Step 3: Update the Backend
Add GitHub OAuth handling to your Python backend (`server.py`):

```python
import requests
from flask import request, jsonify

# GitHub OAuth endpoints
GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token'
GITHUB_USERINFO_URL = 'https://api.github.com/user'

@app.route('/auth/github/callback', methods=['POST'])
def github_callback():
    try:
        data = request.get_json()
        code = data.get('code')
        
        # Exchange code for access token
        token_response = requests.post(GITHUB_TOKEN_URL, data={
            'client_id': 'YOUR_GITHUB_CLIENT_ID',
            'client_secret': 'YOUR_GITHUB_CLIENT_SECRET',
            'code': code
        }, headers={
            'Accept': 'application/json'
        })
        
        token_data = token_response.json()
        access_token = token_data.get('access_token')
        
        # Get user info from GitHub
        user_response = requests.get(GITHUB_USERINFO_URL, headers={
            'Authorization': f'token {access_token}',
            'Accept': 'application/vnd.github.v3+json'
        })
        
        user_data = user_response.json()
        
        # Get user email
        email_response = requests.get('https://api.github.com/user/emails', headers={
            'Authorization': f'token {access_token}',
            'Accept': 'application/vnd.github.v3+json'
        })
        
        emails = email_response.json()
        primary_email = next((email['email'] for email in emails if email['primary']), None)
        
        # Create or update user in your database
        user = {
            'email': primary_email or user_data.get('email'),
            'name': user_data['name'] or user_data['login'],
            'picture': user_data.get('avatar_url'),
            'provider': 'github'
        }
        
        # Store user in database and return session
        return jsonify({'success': True, 'user': user})
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400
```

### 3. Update Frontend Callback Pages

Update the callback pages to make API calls to your backend:

```javascript
// In src/pages/auth/callback/google.js and github.js
const handleCallback = async () => {
  try {
    const { code } = router.query;
    
    if (!code) {
      setError('No authorization code received');
      return;
    }
    
    setStatus('Exchanging code for token...');
    
    // Call your backend API
    const response = await fetch('/api/auth/google/callback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code })
    });
    
    const data = await response.json();
    
    if (data.success) {
      localStorage.setItem('user', JSON.stringify(data.user));
      setStatus('Success! Redirecting...');
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    } else {
      setError(data.error || 'Authentication failed');
    }
    
  } catch (error) {
    setError('Authentication failed. Please try again.');
  }
};
```

### 4. Environment Variables

Create a `.env.local` file in your project root:

```env
# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# GitHub OAuth
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Backend URL
BACKEND_URL=http://localhost:8000
```

### 5. Security Considerations

1. **Never expose client secrets in frontend code**
2. **Use HTTPS in production**
3. **Implement CSRF protection**
4. **Validate and sanitize all user data**
5. **Use secure session management**
6. **Implement proper error handling**

### 6. Database Integration

You'll need to create user tables in your database:

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    provider VARCHAR(50) NOT NULL,
    picture_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 7. Testing

1. Test the OAuth flow in development
2. Verify user data is stored correctly
3. Test error handling scenarios
4. Test logout functionality
5. Test session persistence

## Current Demo Mode

The current implementation works in demo mode, allowing you to:
- Click Google/GitHub buttons to simulate login
- See loading states and error handling
- Experience the full user flow
- Test the application without setting up OAuth

To switch to real OAuth:
1. Follow the setup steps above
2. Replace the mock authentication with real API calls
3. Update the callback pages to use your backend
4. Test thoroughly before deploying

## Troubleshooting

### Common Issues:
1. **Redirect URI mismatch**: Ensure the redirect URI in your OAuth app matches exactly
2. **CORS errors**: Configure your backend to allow requests from your frontend domain
3. **Invalid client ID**: Double-check your client ID and secret
4. **Scope issues**: Ensure you're requesting the correct scopes for the data you need

### Debug Tips:
1. Check browser console for errors
2. Verify network requests in browser dev tools
3. Check backend logs for API errors
4. Test OAuth flow step by step

This setup will give you a fully functional OAuth authentication system for your AI Resume Builder application. 