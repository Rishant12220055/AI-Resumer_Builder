# Resume Builder Backend

This is the backend API server for the AI Resume Builder application.

## Features

- **Authentication**: User login and signup endpoints
- **Resume Management**: CRUD operations for resumes
- **AI Suggestions**: AI-powered resume bullet point suggestions using Gemini 1.5 Flash via Google AI
- **MongoDB Integration**: NoSQL database for flexible data storage

## Prerequisites

1. **Node.js** (v14 or higher)
2. **MongoDB** (local or cloud)
3. **Gemini API Key** (required for AI suggestions using Gemini 1.5 Flash)
4. **npm** or **yarn**

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create environment file:**
   Create a `.env` file in the backend directory:
   ```env
   # MongoDB connection string
   MONGODB_URI=mongodb://localhost:27017
   
   # Database name
   DB_NAME=resume_builder
   
   # Server port (optional)
   PORT=5000
   
   # MongoDB authentication (optional)
   MONGODB_USER=
   MONGODB_PASSWORD=
   
   # Gemini API Key (required for AI suggestions using Gemini 1.5 Flash)
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. **Setup database:**
   ```bash
   npm run setup-db
   ```

## Getting Gemini API Key

1. **Sign up for Google AI Studio**: Go to [Google AI Studio](https://aistudio.google.com/)
2. **Create an account**: Sign up with your Google account
3. **Get API Key**: Go to API Keys section and create a new key
4. **Add to .env**: Copy the key to your `.env` file

**Important**: The AI suggestions feature requires a valid Gemini API key. Without it, the API will return an error.

## Running the Server

### Development Mode
```bash
npm run dev
```
This starts the server with nodemon for automatic restarts on file changes.

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000` (or the port specified in your `.env` file).

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration

### Resumes
- `GET /api/resumes?userId=<id>` - Get all resumes for a user
- `POST /api/resumes` - Create a new resume
- `GET /api/resumes/:id` - Get a specific resume
- `PUT /api/resumes/:id` - Update a resume
- `DELETE /api/resumes/:id` - Delete a resume

### AI Suggestions
- `POST /api/ai-suggest` - Get AI-powered resume suggestions using Gemini 1.5 Flash

**AI Suggestions Request Body:**
```json
{
  "company": "Google",
  "position": "Software Engineer",
  "duration": "2020-2023",
  "context": "Full-stack development with React and Node.js"
}
```

**Success Response:**
```json
{
  "suggestions": [
    "Developed and maintained React applications, improving system performance by 30%",
    "Led cross-functional teams to deliver high-impact projects, increasing user satisfaction by 25%",
    "Implemented automated testing and CI/CD pipelines, reducing deployment time by 60%"
  ]
}
```

**Error Responses:**
```json
{
  "error": "Gemini API key not configured. Please add GEMINI_API_KEY to your environment variables."
}
```

```json
{
  "error": "Invalid Gemini API key. Please check your API key."
}
```

```json
{
  "error": "Rate limit exceeded. Please try again later."
}
```

### Health Check
- `GET /health` - Server health check

## Database Structure

The application uses MongoDB with the following collections:

- **users** - User accounts
- **resumes** - Resume metadata
- **personal_info** - Personal information
- **experiences** - Work experience with bullets
- **educations** - Education with achievements
- **skills** - Skills and competencies
- **projects** - Project portfolio
- **certifications** - Professional certifications

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017` |
| `DB_NAME` | Database name | `resume_builder` |
| `PORT` | Server port | `5000` |
| `MONGODB_USER` | MongoDB username | (empty) |
| `MONGODB_PASSWORD` | MongoDB password | (empty) |
| `GEMINI_API_KEY` | Gemini API key for AI suggestions | (required) |

## Development

### Project Structure
```
backend/
├── api/                    # API route handlers
│   ├── auth.js            # Authentication routes
│   ├── resumes.js         # Resume management routes
│   └── ai-suggest.js      # AI suggestions route (Gemini 1.5 Flash)
├── lib/                    # Database utilities
│   ├── db.js              # Database connection
│   └── models.js          # Database operations
├── server.js              # Express server setup
├── setup-db.js            # Database initialization
├── db-config.js           # Database configuration
├── package.json           # Dependencies and scripts
└── README.md              # This file
```

### Adding New Endpoints

1. Create a new route file in the `api/` directory
2. Export an Express router
3. Import and use the router in `server.js`

Example:
```javascript
// api/new-feature.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'New feature endpoint' });
});

module.exports = router;
```

Then in `server.js`:
```javascript
const newFeatureRoutes = require('./api/new-feature');
app.use('/api/new-feature', newFeatureRoutes);
```

## Troubleshooting

### Connection Issues
- Ensure MongoDB is running
- Check your connection string in `.env`
- Verify network connectivity for cloud MongoDB

### Gemini API Issues
- Verify your API key is correct
- Check your Google AI Studio account has sufficient quota
- Ensure the API key has proper permissions
- Check if the Qwen 3 model is available in your region
- Monitor your API usage and rate limits

### Port Issues
- Make sure port 5000 (or your chosen port) is available
- Check if another service is using the same port

### Database Issues
- Run `npm run setup-db` to recreate indexes
- Check MongoDB logs for errors
- Verify database permissions

## Production Deployment

1. **Environment Variables**: Set all required environment variables
2. **MongoDB**: Use a production MongoDB instance (Atlas recommended)
3. **OpenRouter API**: Ensure API key is properly configured
4. **Process Manager**: Use PM2 or similar for process management
5. **Reverse Proxy**: Use Nginx or Apache as a reverse proxy
6. **SSL**: Configure HTTPS for production

Example PM2 configuration:
```json
{
  "name": "resume-builder-backend",
  "script": "server.js",
  "instances": "max",
  "exec_mode": "cluster",
  "env": {
    "NODE_ENV": "production",
    "PORT": 5000
  }
}
```

## License

This project is part of the AI Resume Builder application. 