import pool from '../../../../lib/db';

// GET /api/resumes/[id] - Get a specific resume with all its data
export async function GET(req, { params }) {
  try {
    const { id } = params;

    // Get resume basic info
    const resumeResult = await pool.query(
      'SELECT * FROM resumes WHERE id = $1',
      [id]
    );

    if (resumeResult.rows.length === 0) {
      return new Response(JSON.stringify({ error: 'Resume not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const resume = resumeResult.rows[0];

    // Get personal info
    const personalInfoResult = await pool.query(
      'SELECT * FROM personal_info WHERE resume_id = $1',
      [id]
    );

    // Get experiences with bullets
    const experiencesResult = await pool.query(
      'SELECT * FROM experiences WHERE resume_id = $1 ORDER BY order_index',
      [id]
    );

    const experiences = [];
    for (const exp of experiencesResult.rows) {
      const bulletsResult = await pool.query(
        'SELECT * FROM experience_bullets WHERE experience_id = $1 ORDER BY order_index',
        [exp.id]
      );
      experiences.push({
        ...exp,
        bullets: bulletsResult.rows.map(b => b.content)
      });
    }

    // Get educations with achievements
    const educationsResult = await pool.query(
      'SELECT * FROM educations WHERE resume_id = $1 ORDER BY order_index',
      [id]
    );

    const educations = [];
    for (const edu of educationsResult.rows) {
      const achievementsResult = await pool.query(
        'SELECT * FROM education_achievements WHERE education_id = $1 ORDER BY order_index',
        [edu.id]
      );
      educations.push({
        ...edu,
        achievements: achievementsResult.rows.map(a => a.content)
      });
    }

    // Get skills
    const skillsResult = await pool.query(
      'SELECT * FROM skills WHERE resume_id = $1 ORDER BY order_index',
      [id]
    );

    // Get projects
    const projectsResult = await pool.query(
      'SELECT * FROM projects WHERE resume_id = $1 ORDER BY order_index',
      [id]
    );

    // Get certifications
    const certificationsResult = await pool.query(
      'SELECT * FROM certifications WHERE resume_id = $1 ORDER BY order_index',
      [id]
    );

    const fullResume = {
      ...resume,
      personalInfo: personalInfoResult.rows[0] || {},
      experiences,
      educations,
      skills: skillsResult.rows,
      projects: projectsResult.rows,
      certifications: certificationsResult.rows
    };

    return new Response(JSON.stringify(fullResume), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching resume:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// PUT /api/resumes/[id] - Update a resume
export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const updateData = await req.json();

    // Update resume basic info
    if (updateData.title || updateData.template) {
      await pool.query(
        'UPDATE resumes SET title = COALESCE($1, title), template = COALESCE($2, template), updated_at = CURRENT_TIMESTAMP WHERE id = $3',
        [updateData.title, updateData.template, id]
      );
    }

    // Update personal info
    if (updateData.personalInfo) {
      const { personalInfo } = updateData;
      await pool.query(
        `UPDATE personal_info SET 
          name = COALESCE($1, name),
          title = COALESCE($2, title),
          email = COALESCE($3, email),
          phone = COALESCE($4, phone),
          location = COALESCE($5, location),
          linkedin = COALESCE($6, linkedin),
          github = COALESCE($7, github),
          website = COALESCE($8, website),
          updated_at = CURRENT_TIMESTAMP
        WHERE resume_id = $9`,
        [
          personalInfo.name, personalInfo.title, personalInfo.email,
          personalInfo.phone, personalInfo.location, personalInfo.linkedin,
          personalInfo.github, personalInfo.website, id
        ]
      );
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error updating resume:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// DELETE /api/resumes/[id] - Delete a resume
export async function DELETE(req, { params }) {
  try {
    const { id } = params;

    const result = await pool.query(
      'DELETE FROM resumes WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return new Response(JSON.stringify({ error: 'Resume not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error deleting resume:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 