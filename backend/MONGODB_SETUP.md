# MongoDB Setup Guide

This guide will help you set up MongoDB for the AI Resume Builder application.

## Prerequisites

1. **Install MongoDB Community Server**
   - Download from: https://www.mongodb.com/try/download/community
   - Follow the installation instructions for your operating system
   - Make sure MongoDB service is running

2. **Install MongoDB Compass (Optional but Recommended)**
   - Download from: https://www.mongodb.com/try/download/compass
   - This is a GUI tool for managing MongoDB databases

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
MONGODB_URI=mongodb://localhost:27017
DB_NAME=resume_builder
MONGODB_USER=
MONGODB_PASSWORD=
```

**Note:** If you're using MongoDB Atlas (cloud), your connection string will look like:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/resume_builder
```

### 3. Setup Database

Run the database setup script:

```bash
npm run setup-db
```

This will:
- Connect to MongoDB
- Create the necessary collections
- Set up indexes for optimal performance

### 4. Verify Installation

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open your browser and navigate to `http://localhost:3000`

3. Try creating a new resume to test the database connection

## Database Structure

The application uses the following MongoDB collections:

### Users Collection
```javascript
{
  _id: ObjectId,
  email: String (unique),
  name: String,
  password_hash: String,
  created_at: Date,
  updated_at: Date
}
```

### Resumes Collection
```javascript
{
  _id: ObjectId,
  user_id: ObjectId (ref: users),
  title: String,
  template: String,
  created_at: Date,
  updated_at: Date
}
```

### Personal Info Collection
```javascript
{
  _id: ObjectId,
  resume_id: ObjectId (ref: resumes),
  name: String,
  title: String,
  email: String,
  phone: String,
  location: String,
  linkedin: String,
  github: String,
  website: String,
  created_at: Date,
  updated_at: Date
}
```

### Experiences Collection
```javascript
{
  _id: ObjectId,
  resume_id: ObjectId (ref: resumes),
  company: String,
  position: String,
  duration: String,
  bullets: [String],
  order_index: Number,
  created_at: Date,
  updated_at: Date
}
```

### Educations Collection
```javascript
{
  _id: ObjectId,
  resume_id: ObjectId (ref: resumes),
  institution: String,
  degree: String,
  duration: String,
  achievements: [String],
  order_index: Number,
  created_at: Date,
  updated_at: Date
}
```

### Skills Collection
```javascript
{
  _id: ObjectId,
  resume_id: ObjectId (ref: resumes),
  name: String,
  category: String,
  order_index: Number,
  created_at: Date,
  updated_at: Date
}
```

### Projects Collection
```javascript
{
  _id: ObjectId,
  resume_id: ObjectId (ref: resumes),
  title: String,
  description: String,
  technologies: String,
  url: String,
  order_index: Number,
  created_at: Date,
  updated_at: Date
}
```

### Certifications Collection
```javascript
{
  _id: ObjectId,
  resume_id: ObjectId (ref: resumes),
  name: String,
  issuer: String,
  date_obtained: Date,
  expiry_date: Date,
  url: String,
  order_index: Number,
  created_at: Date,
  updated_at: Date
}
```

## Troubleshooting

### Connection Issues

1. **MongoDB not running**
   - Start MongoDB service: `sudo systemctl start mongod` (Linux) or start MongoDB service from Windows Services
   - Check if MongoDB is running: `mongo` or `mongosh`

2. **Authentication issues**
   - If using MongoDB Atlas, make sure your IP is whitelisted
   - Check username/password in connection string

3. **Port issues**
   - Default MongoDB port is 27017
   - Make sure no firewall is blocking the connection

### Performance Issues

1. **Slow queries**
   - Check if indexes are created properly
   - Run `npm run setup-db` again to recreate indexes

2. **Memory issues**
   - MongoDB uses memory-mapped files
   - Ensure sufficient RAM is available

## Migration from PostgreSQL

If you're migrating from PostgreSQL:

1. Export your data from PostgreSQL (if needed)
2. Follow the setup instructions above
3. The application will automatically create new MongoDB collections
4. Old PostgreSQL data will need to be manually migrated if required

## Production Deployment

For production deployment:

1. Use MongoDB Atlas or a managed MongoDB service
2. Set up proper authentication and network security
3. Configure environment variables for production
4. Set up database backups
5. Monitor database performance

## Support

If you encounter issues:

1. Check MongoDB logs: `/var/log/mongodb/mongod.log`
2. Verify connection string format
3. Test connection using MongoDB Compass
4. Check application logs for detailed error messages 