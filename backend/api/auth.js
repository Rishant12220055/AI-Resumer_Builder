const express = require('express');
const router = express.Router();
const { getDatabase } = require('../lib/db');
const { DatabaseOperations } = require('../lib/models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';
const JWT_EXPIRES_IN = '2h';
const tokenBlacklist = new Set(); // In-memory blacklist for demonstration

// OAuth Configuration
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

// Middleware to protect routes
function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }
  const token = authHeader.split(' ')[1];
  if (tokenBlacklist.has(token)) {
    return res.status(401).json({ error: 'Token has been logged out' });
  }
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    req.user = user;
    next();
  });
}

// Disable caching for all auth routes
router.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const db = await getDatabase();
    const dbOps = new DatabaseOperations(db);
    const existingUser = await dbOps.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    const password_hash = await bcrypt.hash(password, 10);
    const user = await dbOps.createUser({
      email,
      name: `${firstName} ${lastName}`,
      password_hash
    });
    const token = jwt.sign({ id: user._id.toString(), email: user.email, name: user.name }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    res.status(201).json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email
      },
      token
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('Login attempt for:', email);
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    const db = await getDatabase();
    const dbOps = new DatabaseOperations(db);
    const user = await dbOps.findUserByEmail(email);
    
    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    console.log('User found:', { email: user.email, hasPasswordHash: !!user.password_hash, provider: user.provider });
    
    // Check if user was created via OAuth and has no password
    if (!user.password_hash || user.password_hash === null) {
      console.log('User has no password (OAuth user)');
      return res.status(401).json({ 
        error: 'This account was created using OAuth. Please use Google or GitHub to sign in.' 
      });
    }
    
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      console.log('Password validation failed');
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    console.log('Login successful for:', email);
    const token = jwt.sign({ id: user._id.toString(), email: user.email, name: user.name }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    res.status(200).json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Utility function to get the correct protocol and frontend URL
function getUrls(req) {
  const isLocal = req.get('host').includes('localhost');
  const protocol = isLocal ? req.protocol : 'https';
  const backendUrl = `${protocol}://${req.get('host')}`;
  const frontendUrl = isLocal ? 'http://localhost:3000' : process.env.FRONTEND_URL || 'https://ai-resumer-builder.vercel.app';
  
  return { backendUrl, frontendUrl };
}

// GET /api/auth/google/url - Generate Google OAuth URL
router.get('/google/url', (req, res) => {
  try {
    if (!GOOGLE_CLIENT_ID) {
      return res.status(500).json({ error: 'Google OAuth not configured' });
    }
    
    const { backendUrl } = getUrls(req);
    const redirectUri = `${backendUrl}/api/auth/google/callback`;
    
    const googleAuthUrl = 'https://accounts.google.com/o/oauth2/v2/auth?' + 
      `client_id=${GOOGLE_CLIENT_ID}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `response_type=code&` +
      `scope=openid email profile&` +
      `access_type=offline`;
    
    console.log('Google OAuth URL generated:', googleAuthUrl);
    res.json({ url: googleAuthUrl });
  } catch (error) {
    console.error('Error generating Google OAuth URL:', error);
    res.status(500).json({ error: 'Failed to generate OAuth URL' });
  }
});

// GET /api/auth/google/callback - Handle Google OAuth callback
router.get('/google/callback', async (req, res) => {
  try {
    const { code, error: oauthError } = req.query;
    const { backendUrl, frontendUrl } = getUrls(req);
    
    console.log('Google OAuth callback received:', { code: !!code, error: oauthError });
    
    if (oauthError) {
      console.error('Google OAuth error:', oauthError);
      return res.redirect(`${frontendUrl}/auth/login?error=Google authentication failed`);
    }
    
    if (!code) {
      console.error('No authorization code received');
      return res.redirect(`${frontendUrl}/auth/login?error=No authorization code received`);
    }
    
    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
      console.error('Google OAuth not configured');
      return res.redirect(`${frontendUrl}/auth/login?error=Google OAuth not configured`);
    }
    
    const redirectUri = `${backendUrl}/api/auth/google/callback`;
    
    // Exchange code for access token
    console.log('Exchanging code for token...');
    const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri
    }, {
      headers: { 'Accept': 'application/json' }
    });
    
    const { access_token } = tokenResponse.data;
    console.log('Access token received');
    
    // Get user info from Google
    const userResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { 
        Authorization: `Bearer ${access_token}`,
        Accept: 'application/json'
      }
    });
    
    const { email, name, picture } = userResponse.data;
    console.log('User info received:', { email, name });
    
    // Create or update user in database
    const db = await getDatabase();
    const dbOps = new DatabaseOperations(db);
    
    let user = await dbOps.findUserByEmail(email);
    
    if (!user) {
      console.log('Creating new user for:', email);
      const [firstName, ...lastNameParts] = name.split(' ');
      user = await dbOps.createUser({
        firstName: firstName || '',
        lastName: lastNameParts.join(' ') || '',
        email,
        password: null, // OAuth users don't have passwords
        provider: 'google',
        picture
      });
    } else {
      console.log('User found:', email);
      // Update user info if needed
      if (user.picture !== picture) {
        await dbOps.updateUser(user._id, { picture });
        user.picture = picture;
      }
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user._id.toString(), 
        email: user.email, 
        name: user.firstName + ' ' + user.lastName,
        provider: 'google'
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
    
    console.log('JWT token generated, redirecting to frontend');
    
    // Redirect to frontend with token and user data
    const userData = {
      id: user._id.toString(),
      name: user.firstName + ' ' + user.lastName,
      email: user.email,
      picture: user.picture
    };
    
    const callbackUrl = `${frontendUrl}/auth/callback?` +
      `token=${encodeURIComponent(token)}&` +
      `user=${encodeURIComponent(JSON.stringify(userData))}`;
    
    res.redirect(callbackUrl);
    
  } catch (error) {
    console.error('Google OAuth callback error:', error);
    const { frontendUrl } = getUrls(req);
    res.redirect(`${frontendUrl}/auth/login?error=Google authentication failed`);
  }
});

// GET /api/auth/github/url - Generate GitHub OAuth URL
router.get('/github/url', (req, res) => {
  try {
    if (!GITHUB_CLIENT_ID) {
      return res.status(500).json({ error: 'GitHub OAuth not configured' });
    }
    
    const { backendUrl } = getUrls(req);
    const redirectUri = `${backendUrl}/api/auth/github/callback`;
    
    const githubAuthUrl = 'https://github.com/login/oauth/authorize?' +
      `client_id=${GITHUB_CLIENT_ID}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `scope=user:email`;
    
    console.log('GitHub OAuth URL generated:', githubAuthUrl);
    res.json({ url: githubAuthUrl });
  } catch (error) {
    console.error('Error generating GitHub OAuth URL:', error);
    res.status(500).json({ error: 'Failed to generate OAuth URL' });
  }
});

// GET /api/auth/github/callback - Handle GitHub OAuth callback
router.get('/github/callback', async (req, res) => {
  try {
    const { code, error: oauthError } = req.query;
    const { backendUrl, frontendUrl } = getUrls(req);
    
    console.log('GitHub OAuth callback received:', { code: !!code, error: oauthError });
    
    if (oauthError) {
      console.error('GitHub OAuth error:', oauthError);
      return res.redirect(`${frontendUrl}/auth/login?error=GitHub authentication failed`);
    }
    
    if (!code) {
      console.error('No authorization code received');
      return res.redirect(`${frontendUrl}/auth/login?error=No authorization code received`);
    }
    
    if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
      console.error('GitHub OAuth not configured');
      return res.redirect(`${frontendUrl}/auth/login?error=GitHub OAuth not configured`);
    }
    
    const redirectUri = `${backendUrl}/api/auth/github/callback`;
    
    // Exchange code for access token
    console.log('Exchanging code for token...');
    const tokenResponse = await axios.post('https://github.com/login/oauth/access_token', {
      client_id: GITHUB_CLIENT_ID,
      client_secret: GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: redirectUri
    }, {
      headers: { 
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    const { access_token } = tokenResponse.data;
    console.log('Access token received');
    
    // Get user info from GitHub
    const userResponse = await axios.get('https://api.github.com/user', {
      headers: { 
        Authorization: `Bearer ${access_token}`,
        Accept: 'application/vnd.github.v3+json'
      }
    });
    
    // Get user email from GitHub (might be private)
    const emailResponse = await axios.get('https://api.github.com/user/emails', {
      headers: { 
        Authorization: `Bearer ${access_token}`,
        Accept: 'application/vnd.github.v3+json'
      }
    });
    
    const { login, name, avatar_url } = userResponse.data;
    const primaryEmail = emailResponse.data.find(email => email.primary)?.email || 
                        emailResponse.data[0]?.email;
    
    if (!primaryEmail) {
      console.error('No email found in GitHub account');
      return res.redirect(`${frontendUrl}/auth/login?error=No email found in GitHub account`);
    }
    
    console.log('User info received:', { email: primaryEmail, name: name || login });
    
    // Create or update user in database
    const db = await getDatabase();
    const dbOps = new DatabaseOperations(db);
    
    let user = await dbOps.findUserByEmail(primaryEmail);
    
    if (!user) {
      console.log('Creating new user for:', primaryEmail);
      const [firstName, ...lastNameParts] = (name || login).split(' ');
      user = await dbOps.createUser({
        firstName: firstName || login,
        lastName: lastNameParts.join(' ') || '',
        email: primaryEmail,
        password: null, // OAuth users don't have passwords
        provider: 'github',
        picture: avatar_url
      });
    } else {
      console.log('User found:', primaryEmail);
      // Update user info if needed
      if (user.picture !== avatar_url) {
        await dbOps.updateUser(user._id, { picture: avatar_url });
        user.picture = avatar_url;
      }
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user._id.toString(), 
        email: user.email, 
        name: user.firstName + ' ' + user.lastName,
        provider: 'github'
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
    
    console.log('JWT token generated, redirecting to frontend');
    
    // Redirect to frontend with token and user data
    const userData = {
      id: user._id.toString(),
      name: user.firstName + ' ' + user.lastName,
      email: user.email,
      picture: user.picture
    };
    
    const callbackUrl = `${frontendUrl}/auth/callback?` +
      `token=${encodeURIComponent(token)}&` +
      `user=${encodeURIComponent(JSON.stringify(userData))}`;
    
    res.redirect(callbackUrl);
    
  } catch (error) {
    console.error('GitHub OAuth callback error:', error);
    const { frontendUrl } = getUrls(req);
    res.redirect(`${frontendUrl}/auth/login?error=GitHub authentication failed`);
  }
});

// GET /api/auth/google/callback
router.get('/google/callback', async (req, res) => {
  try {
    const { code, error } = req.query;
    
    if (error) {
      return res.redirect(`/auth/login?error=Google authentication failed`);
    }
    
    if (!code) {
      return res.redirect(`/auth/login?error=No authorization code received`);
    }
    
    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
      return res.redirect(`/auth/login?error=Google OAuth not configured`);
    }
    
    // Detect if we're running locally (localhost) or in production (Vercel)
    const isLocal = req.get('host').includes('localhost');
    const protocol = isLocal ? req.protocol : 'https';
    const redirectUri = `${protocol}://${req.get('host')}/api/auth/google/callback`;
    
    // Exchange code for access token
    const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri
    });
    
    const { access_token } = tokenResponse.data;
    
    // Get user info from Google
    const userResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` }
    });
    
    const { email, name, picture } = userResponse.data;
    
    // Create or update user in database
    const db = await getDatabase();
    const dbOps = new DatabaseOperations(db);
    
    let user = await dbOps.findUserByEmail(email);
    
    if (!user) {
      // Create new user
      user = await dbOps.createUser({
        email,
        name,
        provider: 'google',
        picture
      });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id.toString(), email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
    
    // Redirect to frontend with token
    res.redirect(`/auth/callback?token=${token}&user=${encodeURIComponent(JSON.stringify({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      picture
    }))}`);
    
  } catch (error) {
    console.error('Google OAuth error:', error);
    res.redirect(`/auth/login?error=Google authentication failed`);
    res.redirect(`/auth/login?error=Google authentication failed`);
  }
});

// GET /api/auth/github/url
router.get('/github/url', (req, res) => {
  if (!GITHUB_CLIENT_ID) {
    return res.status(500).json({ error: 'GitHub OAuth not configured' });
  }
  
  // Detect if we're running locally (localhost) or in production (Vercel)
  const isLocal = req.get('host').includes('localhost');
  const protocol = isLocal ? req.protocol : 'https';
  const redirectUri = `${protocol}://${req.get('host')}/api/auth/github/callback`;
  const githubAuthUrl = `https://github.com/login/oauth/authorize?` +
    `client_id=${GITHUB_CLIENT_ID}&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}&` +
    `scope=user:email`;
  
  res.json({ url: githubAuthUrl });
});

// GET /api/auth/github/callback
router.get('/github/callback', async (req, res) => {
  try {
    const { code, error } = req.query;
    
    if (error) {
      return res.redirect(`/auth/login?error=GitHub authentication failed`);
    }
    
    if (!code) {
      return res.redirect(`/auth/login?error=No authorization code received`);
    }
    
    if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
      return res.redirect(`/auth/login?error=GitHub OAuth not configured`);
    }
    
    // Detect if we're running locally (localhost) or in production (Vercel)
    const isLocal = req.get('host').includes('localhost');
    const protocol = isLocal ? req.protocol : 'https';
    const redirectUri = `${protocol}://${req.get('host')}/api/auth/github/callback`;
    
    // Exchange code for access token
    const tokenResponse = await axios.post('https://github.com/login/oauth/access_token', {
      client_id: GITHUB_CLIENT_ID,
      client_secret: GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: redirectUri
    }, {
      headers: { Accept: 'application/json' }
    });
    
    const { access_token } = tokenResponse.data;
    
    if (!access_token) {
      return res.redirect(`/auth/login?error=Failed to get access token`);
    }
    
    // Get user info from GitHub
    const userResponse = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${access_token}` }
    });
    
    const { email, name, avatar_url, login } = userResponse.data;
    
    // If email is not public, get it from GitHub API
    let userEmail = email;
    if (!userEmail) {
      const emailsResponse = await axios.get('https://api.github.com/user/emails', {
        headers: { Authorization: `Bearer ${access_token}` }
      });
      const primaryEmail = emailsResponse.data.find(email => email.primary);
      userEmail = primaryEmail ? primaryEmail.email : `${login}@users.noreply.github.com`;
    }
    
    // Create or update user in database
    const db = await getDatabase();
    const dbOps = new DatabaseOperations(db);
    
    let user = await dbOps.findUserByEmail(userEmail);
    
    if (!user) {
      // Create new user
      user = await dbOps.createUser({
        email: userEmail,
        name: name || login,
        provider: 'github',
        picture: avatar_url
      });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id.toString(), email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
    
    // Redirect to frontend with token
    res.redirect(`/auth/callback?token=${token}&user=${encodeURIComponent(JSON.stringify({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      picture: avatar_url
    }))}`);
    
  } catch (error) {
    console.error('GitHub OAuth error:', error);
    res.redirect(`/auth/login?error=GitHub authentication failed`);
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }
  const token = authHeader.split(' ')[1];
  tokenBlacklist.add(token);
  res.status(200).json({ message: 'Logged out successfully' });
});

// GET /api/auth/test - Test endpoint for CORS and connectivity
router.get('/test', (req, res) => {
  res.status(200).json({
    status: 'API Working',
    endpoint: '/api/auth/test',
    timestamp: new Date().toISOString(),
    origin: req.headers.origin,
    userAgent: req.headers['user-agent'],
    message: 'Auth API is accessible'
  });
});

module.exports = router;
module.exports.authenticateJWT = authenticateJWT;