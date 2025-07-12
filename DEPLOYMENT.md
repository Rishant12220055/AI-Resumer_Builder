# Deployment Guide

This guide covers deploying the AI Resume Builder application to various platforms.

## Prerequisites

- Node.js 18+ and npm 8+
- MongoDB (local or cloud)
- Git repository access
- Domain name (for production)

## Environment Setup

### 1. Backend Environment Variables

Create `.env` file in the `backend` directory:

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/resume_builder
DB_NAME=resume_builder

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Gemini API Key
GEMINI_API_KEY=your-gemini-api-key-here

# OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
GITHUB_CLIENT_ID=your-github-client-id-here
GITHUB_CLIENT_SECRET=your-github-client-secret-here

# Server Configuration
PORT=5000
NODE_ENV=production

# CORS Configuration
ALLOWED_ORIGINS=https://your-frontend-domain.com,https://www.your-frontend-domain.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 2. Frontend Environment Variables

Create `.env.local` file in the `frontend` directory:

```env
NEXT_PUBLIC_API_URL=https://your-backend-domain.com
NEXT_PUBLIC_APP_URL=https://your-frontend-domain.com
```

## Deployment Options

### Option 1: Vercel (Frontend) + Railway/Render (Backend)

#### Frontend Deployment (Vercel)

1. **Connect to Vercel:**
   ```bash
   npm install -g vercel
   cd frontend
   vercel login
   ```

2. **Deploy:**
   ```bash
   vercel --prod
   ```

3. **Configure Environment Variables:**
   - Go to Vercel Dashboard
   - Add environment variables:
     - `NEXT_PUBLIC_API_URL`
     - `NEXT_PUBLIC_APP_URL`

#### Backend Deployment (Railway)

1. **Connect to Railway:**
   - Go to [Railway](https://railway.app/)
   - Connect your GitHub repository

2. **Configure Environment Variables:**
   - Add all backend environment variables
   - Set `NODE_ENV=production`

3. **Deploy:**
   - Railway will automatically deploy on push

### Option 2: Docker Deployment

#### Local Docker Setup

1. **Build and run:**
   ```bash
   docker-compose up -d
   ```

2. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000
   - MongoDB: localhost:27017

#### Production Docker Deployment

1. **Build images:**
   ```bash
   docker build -t resume-builder-backend ./backend
   docker build -t resume-builder-frontend ./frontend
   ```

2. **Run containers:**
   ```bash
   docker run -d --name backend -p 5000:5000 resume-builder-backend
   docker run -d --name frontend -p 3000:3000 resume-builder-frontend
   ```

### Option 3: PM2 Deployment

#### Backend with PM2

1. **Install PM2:**
   ```bash
   npm install -g pm2
   ```

2. **Deploy:**
   ```bash
   cd backend
   pm2 start ecosystem.config.js --env production
   ```

3. **Monitor:**
   ```bash
   pm2 status
   pm2 logs resume-builder-backend
   ```

### Option 4: Manual Server Deployment

#### Backend Deployment

1. **Upload files:**
   ```bash
   scp -r backend/ user@your-server:/var/www/resume-builder/
   ```

2. **Install dependencies:**
   ```bash
   cd /var/www/resume-builder/backend
   npm install --production
   ```

3. **Start with PM2:**
   ```bash
   pm2 start ecosystem.config.js --env production
   ```

#### Frontend Deployment

1. **Build:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Upload:**
   ```bash
   scp -r .next/ user@your-server:/var/www/resume-builder/frontend/
   ```

3. **Configure Nginx:**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## SSL/HTTPS Setup

### Using Let's Encrypt

1. **Install Certbot:**
   ```bash
   sudo apt-get install certbot python3-certbot-nginx
   ```

2. **Get SSL certificate:**
   ```bash
   sudo certbot --nginx -d your-domain.com
   ```

3. **Auto-renewal:**
   ```bash
   sudo crontab -e
   # Add: 0 12 * * * /usr/bin/certbot renew --quiet
   ```

## Database Setup

### MongoDB Atlas (Recommended)

1. **Create cluster:**
   - Go to [MongoDB Atlas](https://cloud.mongodb.com/)
   - Create new cluster

2. **Configure network access:**
   - Add your server IP or `0.0.0.0/0` for all

3. **Create database user:**
   - Username and password for application

4. **Get connection string:**
   - Copy the connection string
   - Update `MONGODB_URI` in environment variables

### Local MongoDB

1. **Install MongoDB:**
   ```bash
   sudo apt-get install mongodb
   ```

2. **Start service:**
   ```bash
   sudo systemctl start mongod
   sudo systemctl enable mongod
   ```

## Monitoring and Logs

### PM2 Monitoring

```bash
# View logs
pm2 logs resume-builder-backend

# Monitor resources
pm2 monit

# Restart application
pm2 restart resume-builder-backend
```

### Docker Logs

```bash
# View logs
docker logs resume-builder-backend
docker logs resume-builder-frontend

# Follow logs
docker logs -f resume-builder-backend
```

## Health Checks

### Backend Health Check

```bash
curl http://your-backend-domain.com/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456,
  "environment": "production"
}
```

### MongoDB Health Check

```bash
curl http://your-backend-domain.com/mongo-health
```

## Troubleshooting

### Common Issues

1. **CORS Errors:**
   - Check `ALLOWED_ORIGINS` in backend environment
   - Ensure frontend URL is included

2. **Database Connection:**
   - Verify MongoDB connection string
   - Check network access for cloud databases

3. **OAuth Issues:**
   - Update redirect URIs in OAuth apps
   - Verify environment variables

4. **Build Errors:**
   - Check Node.js version (18+)
   - Clear `.next` folder and rebuild

### Debug Commands

```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Check PM2 status
pm2 status

# Check Docker containers
docker ps

# Check logs
pm2 logs
docker logs
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

## Performance Optimization

### Backend

1. **Enable compression:**
   ```javascript
   const compression = require('compression');
   app.use(compression());
   ```

2. **Add caching headers:**
   ```javascript
   app.use('/api/static', express.static('public', {
     maxAge: '1d'
   }));
   ```

### Frontend

1. **Optimize images:**
   - Use WebP format
   - Implement lazy loading

2. **Enable caching:**
   - Configure CDN
   - Set cache headers

## Backup Strategy

### Database Backup

```bash
# MongoDB backup
mongodump --uri="mongodb+srv://username:password@cluster.mongodb.net/resume_builder"

# Restore
mongorestore --uri="mongodb+srv://username:password@cluster.mongodb.net/resume_builder" dump/
```

### Application Backup

```bash
# Backup application files
tar -czf backup-$(date +%Y%m%d).tar.gz /var/www/resume-builder/

# Backup environment variables
cp .env backup-env-$(date +%Y%m%d)
```

## Support

For deployment issues:

1. Check application logs
2. Verify environment variables
3. Test health endpoints
4. Review security configuration
5. Monitor resource usage 