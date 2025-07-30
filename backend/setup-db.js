const { getDatabase } = require('./lib/db');
const { DatabaseOperations } = require('./lib/models');

async function setupDatabase() {
  try {
    console.log('Setting up MongoDB database...');
    
    const db = await getDatabase();
    const dbOps = new DatabaseOperations(db);

    // Create indexes for better performance
    console.log('Creating indexes...');
    
    // Users collection indexes
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    
    // Resumes collection indexes
    await db.collection('resumes').createIndex({ user_id: 1 });
    await db.collection('resumes').createIndex({ updated_at: -1 });
    
    // Personal info collection indexes
    await db.collection('personal_info').createIndex({ resume_id: 1 });
    
    // Experiences collection indexes
    await db.collection('experiences').createIndex({ resume_id: 1 });
    await db.collection('experiences').createIndex({ order_index: 1 });
    
    // Educations collection indexes
    await db.collection('educations').createIndex({ resume_id: 1 });
    await db.collection('educations').createIndex({ order_index: 1 });
    
    // Skills collection indexes
    await db.collection('skills').createIndex({ resume_id: 1 });
    await db.collection('skills').createIndex({ order_index: 1 });
    
    // Projects collection indexes
    await db.collection('projects').createIndex({ resume_id: 1 });
    await db.collection('projects').createIndex({ order_index: 1 });
    
    // Certifications collection indexes
    await db.collection('certifications').createIndex({ resume_id: 1 });
    await db.collection('certifications').createIndex({ order_index: 1 });

    console.log('Database setup completed successfully!');
    console.log('Collections created:');
    console.log('- users');
    console.log('- resumes');
    console.log('- personal_info');
    console.log('- experiences');
    console.log('- educations');
    console.log('- skills');
    console.log('- projects');
    console.log('- certifications');
    
    process.exit(0);
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  }
}

setupDatabase(); 