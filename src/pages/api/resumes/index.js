import pool from '../../../../lib/db';

// GET /api/resumes - Get all resumes for a user
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return new Response(JSON.stringify({ error: 'User ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const result = await pool.query(
      'SELECT * FROM resumes WHERE user_id = $1 ORDER BY updated_at DESC',
      [userId]
    );

    return new Response(JSON.stringify(result.rows), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching resumes:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// POST /api/resumes - Create a new resume
export async function POST(req) {
  try {
    const { userId, title, template } = await req.json();

    if (!userId) {
      return new Response(JSON.stringify({ error: 'User ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const result = await pool.query(
      'INSERT INTO resumes (user_id, title, template) VALUES ($1, $2, $3) RETURNING *',
      [userId, title || 'Untitled Resume', template || 'professional']
    );

    const newResume = result.rows[0];

    // Create default personal info
    await pool.query(
      'INSERT INTO personal_info (resume_id) VALUES ($1)',
      [newResume.id]
    );

    // Create default experience
    const expResult = await pool.query(
      'INSERT INTO experiences (resume_id, company, position, duration) VALUES ($1, $2, $3, $4) RETURNING *',
      [newResume.id, '', '', '']
    );

    // Create default bullet for experience
    await pool.query(
      'INSERT INTO experience_bullets (experience_id, content) VALUES ($1, $2)',
      [expResult.rows[0].id, '']
    );

    // Create default education
    const eduResult = await pool.query(
      'INSERT INTO educations (resume_id, institution, degree, duration) VALUES ($1, $2, $3, $4) RETURNING *',
      [newResume.id, '', '', '']
    );

    // Create default achievement for education
    await pool.query(
      'INSERT INTO education_achievements (education_id, content) VALUES ($1, $2)',
      [eduResult.rows[0].id, '']
    );

    return new Response(JSON.stringify(newResume), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error creating resume:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 