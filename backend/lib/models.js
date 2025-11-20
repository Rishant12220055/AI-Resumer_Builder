const { ObjectId } = require('mongodb');

class DatabaseOperations {
  constructor(db) {
    this.db = db;
    this.users = db.collection('users');
    this.resumes = db.collection('resumes');
    this.personalInfo = db.collection('personal_info');
    this.experiences = db.collection('experiences');
    this.educations = db.collection('educations');
    this.skills = db.collection('skills');
    this.projects = db.collection('projects');
    this.certifications = db.collection('certifications');
  }

  // Helper function to validate and convert ObjectId
  validateObjectId(id) {
    if (!id) return null;
    try {
      return new ObjectId(id);
    } catch (error) {
      return null;
    }
  }

  // User operations
  async createUser(userData) {
    const user = {
      ...userData,
      created_at: new Date(),
      updated_at: new Date()
    };
    const result = await this.users.insertOne(user);
    return { ...user, _id: result.insertedId };
  }

  async findUserByEmail(email) {
    return await this.users.findOne({ email });
  }

  async findUserById(id) {
    const objectId = this.validateObjectId(id);
    if (!objectId) return null;
    return await this.users.findOne({ _id: objectId });
  }

  async updateUser(id, updateData) {
    const objectId = this.validateObjectId(id);
    if (!objectId) return null;
    const update = {
      ...updateData,
      updated_at: new Date()
    };
    return await this.users.updateOne(
      { _id: objectId },
      { $set: update }
    );
  }

  // Resume operations
  async createResume(resumeData) {
    const resume = {
      ...resumeData,
      user_id: new ObjectId(resumeData.user_id),
      created_at: new Date(),
      updated_at: new Date()
    };
    const result = await this.resumes.insertOne(resume);
    return { ...resume, _id: result.insertedId };
  }

  async findResumesByUserId(userId) {
    const objectId = this.validateObjectId(userId);
    if (!objectId) return [];
    return await this.resumes.find({ user_id: objectId })
      .sort({ updated_at: -1 })
      .toArray();
  }

  async findResumeById(id) {
    const objectId = this.validateObjectId(id);
    if (!objectId) return null;
    return await this.resumes.findOne({ _id: objectId });
  }

  async updateResume(id, updateData) {
    const objectId = this.validateObjectId(id);
    if (!objectId) return null;
    const update = {
      ...updateData,
      updated_at: new Date()
    };
    return await this.resumes.updateOne(
      { _id: objectId },
      { $set: update }
    );
  }

  async deleteResume(id) {
    const objectId = this.validateObjectId(id);
    if (!objectId) return null;
    return await this.resumes.deleteOne({ _id: objectId });
  }

  // Personal Info operations
  async createPersonalInfo(personalInfoData) {
    const personalInfo = {
      ...personalInfoData,
      resume_id: this.validateObjectId(personalInfoData.resume_id),
      created_at: new Date(),
      updated_at: new Date()
    };
    if (!personalInfo.resume_id) return null;
    const result = await this.personalInfo.insertOne(personalInfo);
    return { ...personalInfo, _id: result.insertedId };
  }

  async findPersonalInfoByResumeId(resumeId) {
    const objectId = this.validateObjectId(resumeId);
    if (!objectId) return null;
    return await this.personalInfo.findOne({ resume_id: objectId });
  }

  async updatePersonalInfo(resumeId, updateData) {
    const objectId = this.validateObjectId(resumeId);
    if (!objectId) return null;
    const update = {
      ...updateData,
      updated_at: new Date()
    };
    return await this.personalInfo.updateOne(
      { resume_id: objectId },
      { $set: update },
      { upsert: true }
    );
  }

  // Experience operations
  async createExperience(experienceData) {
    const experience = {
      ...experienceData,
      resume_id: this.validateObjectId(experienceData.resume_id),
      bullets: experienceData.bullets || [],
      created_at: new Date(),
      updated_at: new Date()
    };
    if (!experience.resume_id) return null;
    const result = await this.experiences.insertOne(experience);
    return { ...experience, _id: result.insertedId };
  }

  async findExperiencesByResumeId(resumeId) {
    const objectId = this.validateObjectId(resumeId);
    if (!objectId) return [];
    return await this.experiences.find({ resume_id: objectId })
      .sort({ order_index: 1 })
      .toArray();
  }

  async updateExperience(id, updateData) {
    const objectId = this.validateObjectId(id);
    if (!objectId) return null;
    const update = {
      ...updateData,
      updated_at: new Date()
    };
    return await this.experiences.updateOne(
      { _id: objectId },
      { $set: update }
    );
  }

  async deleteExperience(id) {
    const objectId = this.validateObjectId(id);
    if (!objectId) return null;
    return await this.experiences.deleteOne({ _id: objectId });
  }

  // Education operations
  async createEducation(educationData) {
    const education = {
      ...educationData,
      resume_id: this.validateObjectId(educationData.resume_id),
      achievements: educationData.achievements || [],
      created_at: new Date(),
      updated_at: new Date()
    };
    if (!education.resume_id) return null;
    const result = await this.educations.insertOne(education);
    return { ...education, _id: result.insertedId };
  }

  async findEducationsByResumeId(resumeId) {
    const objectId = this.validateObjectId(resumeId);
    if (!objectId) return [];
    return await this.educations.find({ resume_id: objectId })
      .sort({ order_index: 1 })
      .toArray();
  }

  async updateEducation(id, updateData) {
    const objectId = this.validateObjectId(id);
    if (!objectId) return null;
    const update = {
      ...updateData,
      updated_at: new Date()
    };
    return await this.educations.updateOne(
      { _id: objectId },
      { $set: update }
    );
  }

  async deleteEducation(id) {
    const objectId = this.validateObjectId(id);
    if (!objectId) return null;
    return await this.educations.deleteOne({ _id: objectId });
  }

  // Skill operations
  async createSkill(skillData) {
    const skill = {
      ...skillData,
      resume_id: this.validateObjectId(skillData.resume_id),
      created_at: new Date(),
      updated_at: new Date()
    };
    if (!skill.resume_id) return null;
    const result = await this.skills.insertOne(skill);
    return { ...skill, _id: result.insertedId };
  }

  async findSkillsByResumeId(resumeId) {
    const objectId = this.validateObjectId(resumeId);
    if (!objectId) return [];
    return await this.skills.find({ resume_id: objectId })
      .sort({ order_index: 1 })
      .toArray();
  }

  async updateSkill(id, updateData) {
    const objectId = this.validateObjectId(id);
    if (!objectId) return null;
    const update = {
      ...updateData,
      updated_at: new Date()
    };
    return await this.skills.updateOne(
      { _id: objectId },
      { $set: update }
    );
  }

  async deleteSkill(id) {
    const objectId = this.validateObjectId(id);
    if (!objectId) return null;
    return await this.skills.deleteOne({ _id: objectId });
  }

  // Project operations
  async createProject(projectData) {
    const project = {
      ...projectData,
      resume_id: this.validateObjectId(projectData.resume_id),
      created_at: new Date(),
      updated_at: new Date()
    };
    if (!project.resume_id) return null;
    const result = await this.projects.insertOne(project);
    return { ...project, _id: result.insertedId };
  }

  async findProjectsByResumeId(resumeId) {
    const objectId = this.validateObjectId(resumeId);
    if (!objectId) return [];
    return await this.projects.find({ resume_id: objectId })
      .sort({ order_index: 1 })
      .toArray();
  }

  async updateProject(id, updateData) {
    const objectId = this.validateObjectId(id);
    if (!objectId) return null;
    const update = {
      ...updateData,
      updated_at: new Date()
    };
    return await this.projects.updateOne(
      { _id: objectId },
      { $set: update }
    );
  }

  async deleteProject(id) {
    const objectId = this.validateObjectId(id);
    if (!objectId) return null;
    return await this.projects.deleteOne({ _id: objectId });
  }

  // Certification operations
  async createCertification(certificationData) {
    const certification = {
      ...certificationData,
      resume_id: this.validateObjectId(certificationData.resume_id),
      created_at: new Date(),
      updated_at: new Date()
    };
    if (!certification.resume_id) return null;
    const result = await this.certifications.insertOne(certification);
    return { ...certification, _id: result.insertedId };
  }

  async findCertificationsByResumeId(resumeId) {
    const objectId = this.validateObjectId(resumeId);
    if (!objectId) return [];
    return await this.certifications.find({ resume_id: objectId })
      .sort({ order_index: 1 })
      .toArray();
  }

  async updateCertification(id, updateData) {
    const objectId = this.validateObjectId(id);
    if (!objectId) return null;
    const update = {
      ...updateData,
      updated_at: new Date()
    };
    return await this.certifications.updateOne(
      { _id: objectId },
      { $set: update }
    );
  }

  async deleteCertification(id) {
    const objectId = this.validateObjectId(id);
    if (!objectId) return null;
    return await this.certifications.deleteOne({ _id: objectId });
  }

  // Get full resume with all related data
  async getFullResume(resumeId) {
    const objectId = this.validateObjectId(resumeId);
    if (!objectId) return null;
    
    const resume = await this.resumes.findOne({ _id: objectId });
    if (!resume) return null;

    const [personalInfo, experiences, educations, skills, projects, certifications] = await Promise.all([
      this.findPersonalInfoByResumeId(resumeId),
      this.findExperiencesByResumeId(resumeId),
      this.findEducationsByResumeId(resumeId),
      this.findSkillsByResumeId(resumeId),
      this.findProjectsByResumeId(resumeId),
      this.findCertificationsByResumeId(resumeId)
    ]);

    return {
      ...resume,
      personalInfo: personalInfo || {},
      experiences: experiences || [],
      educations: educations || [],
      skills: skills || [],
      projects: projects || [],
      certifications: certifications || []
    };
  }
}

module.exports = { DatabaseOperations }; 