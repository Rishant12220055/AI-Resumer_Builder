# PostgreSQL Setup Guide

This guide will help you set up PostgreSQL for the AI Resume Builder application.

## Prerequisites

1. **Install PostgreSQL** on your system:
   - **Windows**: Download from https://www.postgresql.org/download/windows/
   - **macOS**: `brew install postgresql`
   - **Linux**: `sudo apt-get install postgresql postgresql-contrib`

2. **Start PostgreSQL service**:
   - **Windows**: PostgreSQL service should start automatically
   - **macOS**: `brew services start postgresql`
   - **Linux**: `sudo systemctl start postgresql`

## Database Setup

### 1. Create Database

Connect to PostgreSQL as the postgres user:

```bash
# Windows (if using psql from installation)
psql -U postgres

# macOS/Linux
sudo -u postgres psql
```

Create the database:

```sql
CREATE DATABASE resume_builder;
CREATE USER resume_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE resume_builder TO resume_user;
\q
```

### 2. Configure Environment Variables

Create a `.env.local` file in your project root:

```env
# Database Configuration
DB_USER=resume_user
DB_HOST=localhost
DB_NAME=resume_builder
DB_PASSWORD=your_password
DB_PORT=5432

# Next.js Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### 3. Run Database Setup

Install dependencies and run the database setup:

```bash
npm install
npm run setup-db
```

This will create all the necessary tables in your PostgreSQL database.

## Database Schema

The application uses the following tables:

- **users**: User accounts and authentication
- **resumes**: Basic resume information
- **personal_info**: Personal contact information
- **experiences**: Work experience entries
- **experience_bullets**: Bullet points for work experience
- **educations**: Education entries
- **education_achievements**: Achievements for education
- **skills**: Skills and competencies
- **projects**: Project portfolio
- **certifications**: Professional certifications

## API Endpoints

The application now uses the following API endpoints:

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration

### Resumes
- `GET /api/resumes?userId={id}` - Get all resumes for a user
- `POST /api/resumes` - Create a new resume
- `GET /api/resumes/[id]` - Get a specific resume
- `PUT /api/resumes/[id]` - Update a resume
- `DELETE /api/resumes/[id]` - Delete a resume

## Migration from localStorage

The application has been updated to use PostgreSQL instead of localStorage. The frontend components will automatically use the new API endpoints.

## Troubleshooting

### Connection Issues

1. **Check PostgreSQL service**:
   ```bash
   # Windows
   services.msc  # Look for PostgreSQL service
   
   # macOS
   brew services list | grep postgresql
   
   # Linux
   sudo systemctl status postgresql
   ```

2. **Test connection**:
   ```bash
   psql -h localhost -U resume_user -d resume_builder
   ```

3. **Check firewall**: Ensure port 5432 is not blocked

### Database Errors

1. **Permission denied**: Make sure the user has proper privileges
2. **Table not found**: Run `npm run setup-db` again
3. **Connection timeout**: Check if PostgreSQL is running

## Development

To start the application with PostgreSQL:

```bash
# Terminal 1: Start the frontend
npm run dev

# Terminal 2: Start the backend (if needed)
python server.py
```

The application will now use PostgreSQL for all data persistence, providing:
- Better data integrity
- Multi-user support
- Data backup capabilities
- Scalability
- ACID compliance

## Production Considerations

For production deployment:

1. **Use environment variables** for database credentials
2. **Set up proper backups** for PostgreSQL
3. **Configure connection pooling** for better performance
4. **Use SSL connections** for security
5. **Set up monitoring** for database performance 