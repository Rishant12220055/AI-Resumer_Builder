const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');

// Check if .env file exists
if (!fs.existsSync(envPath)) {
  console.log('Creating .env file...');
  
  const envContent = `# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/resume_builder

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Gemini API Key - Get your API key from: https://makersuite.google.com/app/apikey
GEMINI_API_KEY=your-gemini-api-key-here

# OAuth Configuration
# Google OAuth - Get from: https://console.cloud.google.com/apis/credentials
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here

# GitHub OAuth - Get from: https://github.com/settings/developers
GITHUB_CLIENT_ID=your-github-client-id-here
GITHUB_CLIENT_SECRET=your-github-client-secret-here

# Server Configuration
PORT=5000
NODE_ENV=development
`;

  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env file created successfully!');
  console.log('');
  console.log('📝 Next steps:');
  console.log('1. Get your Gemini API key from: https://makersuite.google.com/app/apikey');
  console.log('2. Set up Google OAuth:');
  console.log('   - Go to: https://console.cloud.google.com/apis/credentials');
  console.log('   - Create OAuth 2.0 Client ID');
  console.log('   - Add redirect URI: http://localhost:5000/api/auth/google/callback');
  console.log('3. Set up GitHub OAuth:');
  console.log('   - Go to: https://github.com/settings/developers');
  console.log('   - Create new OAuth App');
  console.log('   - Add redirect URI: http://localhost:5000/api/auth/github/callback');
  console.log('4. Open the .env file and replace the placeholder values with your actual keys');
  console.log('5. Restart the backend server');
  console.log('');
} else {
  console.log('✅ .env file already exists');
  console.log('');
  console.log('📝 To use all features:');
  console.log('1. Make sure GEMINI_API_KEY is set for AI features');
  console.log('2. Set up Google OAuth for Google login:');
  console.log('   - GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET');
  console.log('3. Set up GitHub OAuth for GitHub login:');
  console.log('   - GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET');
  console.log('4. Get your API keys from:');
  console.log('   - Gemini: https://makersuite.google.com/app/apikey');
  console.log('   - Google OAuth: https://console.cloud.google.com/apis/credentials');
  console.log('   - GitHub OAuth: https://github.com/settings/developers');
  console.log('5. Restart the backend server if you make changes');
} 