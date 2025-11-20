const express = require('express');
const router = express.Router();
const { getDatabase } = require('../lib/db');
const { DatabaseOperations } = require('../lib/models');
const { authenticateJWT } = require('./auth');
const { ObjectId } = require('mongodb'); // Added ObjectId import

// GET /api/resumes - Get all resumes for the logged-in user
router.get('/', authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.id;
    const db = await getDatabase();
    const dbOps = new DatabaseOperations(db);
    const resumes = await dbOps.findResumesByUserId(userId);
    res.json(resumes);
  } catch (error) {
    console.error('Error fetching resumes:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/resumes - Create a new resume for the logged-in user
router.post('/', authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, template } = req.body;
    const db = await getDatabase();
    const dbOps = new DatabaseOperations(db);
    // Create new resume
    const newResume = await dbOps.createResume({
      user_id: userId,
      title: title || 'Untitled Resume',
      template: template || 'professional'
    });
    // Create default personal info
    await dbOps.createPersonalInfo({
      resume_id: newResume._id.toString()
    });
    // Create default experience
    await dbOps.createExperience({
      resume_id: newResume._id.toString(),
      company: '',
      position: '',
      duration: '',
      bullets: ['']
    });
    // Create default education
    await dbOps.createEducation({
      resume_id: newResume._id.toString(),
      institution: '',
      degree: '',
      duration: '',
      achievements: ['']
    });
    res.status(201).json(newResume);
  } catch (error) {
    console.error('Error creating resume:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/resumes/:id - Get a specific resume for the logged-in user
router.get('/:id', authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    // Validate ObjectId format
    if (!id || id.length !== 24) {
      return res.status(400).json({ error: 'Invalid resume ID format' });
    }
    
    const db = await getDatabase();
    const dbOps = new DatabaseOperations(db);
    const fullResume = await dbOps.getFullResume(id);
    
    if (!fullResume) {
      return res.status(404).json({ error: 'Resume not found' });
    }
    
    if (fullResume.user_id.toString() !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    res.json(fullResume);
  } catch (error) {
    console.error('Error fetching resume:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/resumes/:id - Update a resume for the logged-in user
router.put('/:id', authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const updateData = req.body;
    
    console.log('📝 Update Resume Request:', { id, userId, hasPersonalInfo: !!updateData.personalInfo });
    if (updateData.personalInfo) {
      console.log('Personal Info to update:', updateData.personalInfo);
    }
    
    // Validate ObjectId format
    if (!id || id.length !== 24) {
      return res.status(400).json({ error: 'Invalid resume ID format' });
    }
    
    const db = await getDatabase();
    const dbOps = new DatabaseOperations(db);
    const fullResume = await dbOps.getFullResume(id);
    
    if (!fullResume) {
      return res.status(404).json({ error: 'Resume not found' });
    }
    
    if (fullResume.user_id.toString() !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // Update resume basic info
    if (updateData.title || updateData.template) {
      await dbOps.updateResume(id, {
        title: updateData.title,
        template: updateData.template
      });
    }
    
    // Update personal info
    if (updateData.personalInfo) {
      // Filter out _id field to prevent MongoDB immutable field error
      const { _id, ...personalInfoData } = updateData.personalInfo;
      console.log('Updating personal info with:', personalInfoData);
      const result = await dbOps.updatePersonalInfo(id, personalInfoData);
      console.log('Personal info update result:', result);
    }
    
    // Update experiences
    if (updateData.experiences) {
      // Clear existing experiences and create new ones
      await dbOps.experiences.deleteMany({ resume_id: new ObjectId(id) });
      for (const experience of updateData.experiences) {
        if (experience.company || experience.position) {
          await dbOps.createExperience({
            resume_id: id,
            company: experience.company || '',
            position: experience.position || '',
            duration: experience.duration || '',
            bullets: experience.bullets || ['']
          });
        }
      }
    }
    
    // Update education
    if (updateData.educations) {
      // Clear existing education and create new ones
      await dbOps.educations.deleteMany({ resume_id: new ObjectId(id) });
      for (const education of updateData.educations) {
        if (education.institution || education.degree) {
          await dbOps.createEducation({
            resume_id: id,
            institution: education.institution || '',
            degree: education.degree || '',
            duration: education.duration || '',
            achievements: education.achievements || ['']
          });
        }
      }
    }
    
    // Update skills
    if (updateData.skills) {
      // Clear existing skills and create new ones
      await dbOps.skills.deleteMany({ resume_id: new ObjectId(id) });
      for (const skill of updateData.skills) {
        if (skill.name) {
          await dbOps.createSkill({
            resume_id: id,
            name: skill.name,
            level: skill.level || 'Intermediate'
          });
        }
      }
    }
    
    // Update projects
    if (updateData.projects) {
      // Clear existing projects and create new ones
      await dbOps.projects.deleteMany({ resume_id: new ObjectId(id) });
      for (const project of updateData.projects) {
        if (project.name) {
          await dbOps.createProject({
            resume_id: id,
            name: project.name,
            description: project.description || '',
            technologies: project.technologies || '',
            link: project.link || ''
          });
        }
      }
    }
    
    // Update certifications
    if (updateData.certifications) {
      // Clear existing certifications and create new ones
      await dbOps.certifications.deleteMany({ resume_id: new ObjectId(id) });
      for (const certification of updateData.certifications) {
        if (certification.name) {
          await dbOps.createCertification({
            resume_id: id,
            name: certification.name,
            issuer: certification.issuer || '',
            date: certification.date || '',
            link: certification.link || ''
          });
        }
      }
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating resume:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/resumes/:id - Delete a resume for the logged-in user
router.delete('/:id', authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    // Validate ObjectId format
    if (!id || id.length !== 24) {
      return res.status(400).json({ error: 'Invalid resume ID format' });
    }
    
    const db = await getDatabase();
    const dbOps = new DatabaseOperations(db);
    const fullResume = await dbOps.getFullResume(id);
    
    if (!fullResume) {
      return res.status(404).json({ error: 'Resume not found' });
    }
    
    if (fullResume.user_id.toString() !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const result = await dbOps.deleteResume(id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting resume:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 