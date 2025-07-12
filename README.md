# AI Resume Builder

A modern, AI-powered resume builder with beautiful templates and intelligent suggestions.

## Features

- 🤖 AI-powered resume suggestions
- 🎨 Multiple beautiful resume templates
- 📱 Responsive design
- 🔐 User authentication with OAuth
- 💾 Save and manage multiple resumes
- 📤 Export to PDF, DOCX, and TXT formats
- 🌙 Dark/Light theme support

## Tech Stack

### Frontend
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Radix UI Components
- Lucide React Icons

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Google/GitHub OAuth
- Gemini AI Integration

## Quick Start

### Prerequisites
- Node.js 18+
- npm 8+
- MongoDB (local or cloud)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-resume-builder
   ```

2. **Setup environment variables**
   ```bash
   # Backend
   cp backend/env.production.example backend/.env
   # Edit backend/.env with your configuration
   
   # Frontend
   cp frontend/env.production.example frontend/.env.local
   # Edit frontend/.env.local with your configuration
   ```

3. **Install dependencies**
   ```bash
   # Backend
   cd backend
   npm install
   
   # Frontend
   cd ../frontend
   npm install
   ```

4. **Setup database**
   ```bash
   cd ../backend
   npm run setup-db
   ```

5. **Start development servers**
   ```bash
   # Backend (Terminal 1)
   cd backend
   npm run dev
   
   # Frontend (Terminal 2)
   cd frontend
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

## Deployment

### Quick Deployment

#### Using PowerShell (Windows)
```powershell
.\deploy.ps1 all
```

#### Using Bash (Linux/Mac)
```bash
chmod +x deploy.sh
./deploy.sh all
```

### Manual Deployment

#### Option 1: Vercel + Railway
1. **Frontend (Vercel)**
   ```bash
   cd frontend
   npm install -g vercel
   vercel --prod
   ```

2. **Backend (Railway)**
   - Connect GitHub repository to Railway
   - Configure environment variables
   - Deploy automatically

#### Option 2: Docker
```bash
docker-compose up -d --build
```

#### Option 3: PM2
```bash
# Backend
cd backend
npm install -g pm2
pm2 start ecosystem.config.js --env production

# Frontend
cd frontend
npm run build
pm2 start npm --name "resume-builder-frontend" -- start
```

### Environment Variables

#### Backend (.env)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/resume_builder
DB_NAME=resume_builder
JWT_SECRET=your-super-secret-jwt-key
GEMINI_API_KEY=your-gemini-api-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
PORT=5000
NODE_ENV=production
ALLOWED_ORIGINS=https://your-frontend-domain.com
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=https://your-backend-domain.com
NEXT_PUBLIC_APP_URL=https://your-frontend-domain.com
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/google` - Google OAuth
- `GET /api/auth/github` - GitHub OAuth
- `GET /api/auth/callback/google` - Google OAuth callback
- `GET /api/auth/callback/github` - GitHub OAuth callback

### Resumes
- `GET /api/resumes` - Get user resumes
- `POST /api/resumes` - Create new resume
- `GET /api/resumes/:id` - Get specific resume
- `PUT /api/resumes/:id` - Update resume
- `DELETE /api/resumes/:id` - Delete resume

### AI Suggestions
- `POST /api/ai-suggest` - Get AI suggestions for resume content

### Health Checks
- `GET /health` - Backend health check
- `GET /mongo-health` - MongoDB health check

## Templates

The application includes multiple resume templates:

- **Minimal** - Clean and simple design
- **Creative** - Modern and visually appealing
- **Executive** - Professional and formal
- **Marketing** - Sales and marketing focused
- **Healthcare** - Medical and healthcare specific
- **Academic** - Research and academic focused
- **Tech** - Technology and engineering focused
- **Startup** - Entrepreneurial and innovative
- **Freelancer** - Freelance and contract work

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
1. Check the [Deployment Guide](DEPLOYMENT.md)
2. Review the [OAuth Setup Guide](backend/OAUTH_SETUP.md)
3. Check the [MongoDB Setup Guide](backend/MONGODB_SETUP.md)

## Health Checks

After deployment, verify everything is working:

```bash
# Backend health
curl http://your-backend-domain.com/health

# MongoDB health
curl http://your-backend-domain.com/mongo-health

# Frontend
curl http://your-frontend-domain.com
```

## Security Checklist

- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] Rate limiting configured
- [ ] CORS properly configured
- [ ] JWT secret changed
- [ ] Database credentials secured
- [ ] OAuth redirect URIs updated
- [ ] Firewall configured
- [ ] Regular backups scheduled 