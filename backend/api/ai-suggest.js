const express = require('express');
const router = express.Router();
const axios = require('axios');

// POST /api/ai-suggest
router.post('/', async (req, res) => {
  try {
    const { company, position, duration, context, institution, degree, industry, projectName, name } = req.body;
    
    // Debug logging
    console.log('AI Request received:', {
      context,
      company,
      position,
      duration,
      institution,
      degree,
      industry,
      projectName,
      name
    });

    // Validate required fields based on context
    if (context === 'resume_bullet_point' && (!company || !position)) {
      return res.status(400).json({ error: 'Company and position are required for resume bullet points' });
    }
    
    if (context === 'education_achievement' && (!institution || !degree)) {
      return res.status(400).json({ error: 'Institution and degree are required for education achievements' });
    }
    
    if (context === 'skills_suggestion' && !position) {
      console.log('Skills suggestion validation failed - position missing:', { context, position });
      return res.status(400).json({ error: 'Position is required for skills suggestions' });
    }
    
    if (context === 'project_description' && !projectName) {
      return res.status(400).json({ error: 'Project name is required for project descriptions' });
    }
    
    if (context === 'certification_suggestion' && !position) {
      return res.status(400).json({ error: 'Position is required for certification suggestions' });
    }
    
    if (context === 'about_me_description' && !position) {
      return res.status(400).json({ error: 'Position is required for about me descriptions' });
    }

    // Check if Gemini API key is configured
    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
      console.error('GEMINI_API_KEY not found in environment variables');
      return res.status(500).json({ 
        error: 'Gemini API key not configured. Please add GEMINI_API_KEY to your .env file in the backend directory.',
        details: 'Create a .env file in the backend directory with: GEMINI_API_KEY=your-api-key-here'
      });
    }

    // Create a detailed prompt based on context
    let prompt = '';
    
    switch (context) {
      case 'resume_bullet_point':
        prompt = `Generate 3 professional resume bullet points for a ${position} position at ${company}${duration ? ` from ${duration}` : ''}. 

Requirements:
- Each bullet point should start with a strong action verb
- Include specific achievements or responsibilities
- Be concise and impactful (max 120 characters each)
- Focus on quantifiable results when possible
- Make them relevant to the position and company

Format: Return only the 3 bullet points, one per line, without numbering or extra formatting.

Example format:
Developed and maintained React applications, improving system performance by 30%
Led cross-functional teams to deliver high-impact projects, increasing user satisfaction by 25%
Implemented automated testing and CI/CD pipelines, reducing deployment time by 60%`;
        break;
        
      case 'education_achievement':
        prompt = `Generate 3 academic achievements or relevant coursework for a ${degree} degree at ${institution}${duration ? ` from ${duration}` : ''}.

Requirements:
- Focus on academic achievements, research, projects, or relevant coursework
- Include GPA, honors, or academic recognition if applicable
- Be specific and relevant to the degree program
- Keep each achievement concise (max 120 characters each)

Format: Return only the 3 achievements, one per line, without numbering or extra formatting.

Example format:
Maintained 3.8 GPA while completing advanced algorithms and data structures coursework
Led research project on machine learning applications in healthcare systems
Graduated with honors and completed capstone project on scalable web applications`;
        break;
        
      case 'skills_suggestion':
        prompt = `Generate 10-15 relevant technical and soft skills for a ${position} position in the ${industry || 'technology'} industry.

Requirements:
- Mix of technical skills (programming languages, tools, frameworks)
- Soft skills (leadership, communication, problem-solving)
- Industry-specific skills relevant to the position
- Skills that would be valuable for this role
- Include both entry-level and advanced skills

IMPORTANT: Return ONLY the skills separated by commas, with no additional text, numbering, or formatting.

Example format:
JavaScript, React, Node.js, Python, AWS, Docker, Git, Agile, Leadership, Problem Solving, Communication, Team Collaboration, Data Analysis, API Development

Do not include any introductory text like "Here are the skills:" or "Skills include:". Just return the comma-separated list.`;
        break;
        
      case 'project_description':
        prompt = `Generate a professional project description for "${projectName}" project for a ${position} position.

Requirements:
- Describe the project's purpose and impact
- Include technologies used and your role
- Focus on quantifiable results or outcomes
- Keep it concise but comprehensive (max 200 characters)
- Make it relevant to the position

Format: Return only the project description, without extra formatting.

Example format:
Developed a full-stack e-commerce platform using React and Node.js, implementing user authentication, payment processing, and admin dashboard. Deployed on AWS with 99.9% uptime and 40% improvement in user engagement.`;
        break;
        
      case 'project_technologies':
        prompt = `Generate 5-8 relevant technologies for a "${projectName}" project for a ${position} position.

Requirements:
- Include frontend technologies (frameworks, libraries)
- Include backend technologies (languages, databases, servers)
- Include deployment and infrastructure tools
- Include testing and development tools
- Technologies should be relevant to the project type and position

IMPORTANT: Return ONLY the technologies separated by commas, with no additional text, numbering, or formatting.

Example format:
React, Node.js, MongoDB, Express.js, AWS, Docker, Jest, Git

Do not include any introductory text like "Technologies used:" or "Tech stack:". Just return the comma-separated list.`;
        break;
        
      case 'certification_suggestion':
        prompt = `Generate 3-5 relevant professional certifications for a ${position} position in the ${industry || 'technology'} industry.

Requirements:
- Industry-recognized certifications
- Certifications that would enhance credibility for this position
- Include both technical and professional certifications
- Focus on certifications that are currently in demand
- Include the certifying organization

Format: Return only the certifications, one per line, without numbering or extra formatting.

Example format:
AWS Certified Solutions Architect - Associate
Google Cloud Professional Developer
Certified Scrum Master (CSM)
Microsoft Certified: Azure Developer Associate
PMP (Project Management Professional)`;
        break;
        
      case 'about_me_description':
        prompt = `Generate a professional "About Me" description for ${name || 'a professional'} who is a ${position}.

Requirements:
- Write a compelling professional summary (2-3 sentences)
- Highlight key strengths and career goals
- Make it relevant to the position and industry
- Keep it concise but impactful (max 200 characters)
- Focus on what makes this person unique and valuable

Format: Return only the about me description, without extra formatting.

Example format:
Passionate software engineer with 5+ years of experience developing scalable web applications. Specialized in React, Node.js, and cloud technologies with a proven track record of delivering high-impact projects that improve user experience and business outcomes. Committed to continuous learning and staying current with emerging technologies.`;
        break;
        
      default:
        prompt = `Generate 3 professional resume bullet points for a ${position} position at ${company}${duration ? ` from ${duration}` : ''}. 

Requirements:
- Each bullet point should start with a strong action verb
- Include specific achievements or responsibilities
- Be concise and impactful (max 120 characters each)
- Focus on quantifiable results when possible
- Make them relevant to the position and company

Format: Return only the 3 bullet points, one per line, without numbering or extra formatting.`;
    }

    // Call Gemini API
    console.log('Making API call to Gemini API');
    console.log('Request payload:', {
      contents: [
        {
          parts: [
            {
              text: 'You are a professional resume writer. Generate concise, impactful bullet points for resumes.'
            },
            {
              text: prompt
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.9,
        maxOutputTokens: 300
      }
    });

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
      {
        contents: [
          {
            parts: [
              {
                text: 'You are a professional resume writer. Generate concise, impactful bullet points for resumes.'
              },
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.9,
          maxOutputTokens: 300
        }
      },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30 second timeout
      }
    );

    console.log('Gemini API response status:', response.status);
    console.log('Gemini API response data:', response.data);

    // Extract and clean the generated text
    let generatedText = response.data.candidates[0].content.parts[0].text.trim();
    
    console.log('Raw AI generated text:', generatedText);
    console.log('Context:', context);
    
    // Process suggestions based on context
    let suggestions = [];
    
    if (context === 'skills_suggestion') {
      // For skills, handle multiple possible formats
      let skillsText = generatedText;
      
      // Remove common prefixes/suffixes that AI might add
      skillsText = skillsText.replace(/^(Here are|Here's|Skills:|Technical skills:|Soft skills:|Relevant skills:)/i, '').trim();
      skillsText = skillsText.replace(/^(and|also|additionally|furthermore|moreover)/i, '').trim();
      
      // Split by comma, semicolon, or newlines
      let skills = skillsText
        .split(/[,;\n]/)
        .map(skill => skill.trim())
        .filter(skill => skill.length > 0 && skill.length < 50)
        .filter(skill => !skill.match(/^(and|also|additionally|furthermore|moreover)$/i));
      
      // If we got very few skills, try splitting by different delimiters
      if (skills.length < 3) {
        skills = skillsText
          .split(/[,\s]+/)
          .map(skill => skill.trim())
          .filter(skill => skill.length > 0 && skill.length < 50)
          .filter(skill => !skill.match(/^(and|also|additionally|furthermore|moreover)$/i));
      }
      
      suggestions = skills.slice(0, 15); // Limit to 15 skills
      
      console.log('Skills processing debug:', {
        originalText: generatedText,
        cleanedText: skillsText,
        skillsFound: skills.length,
        finalSuggestions: suggestions
      });
    } else if (context === 'project_description' || context === 'about_me_description') {
      // For project descriptions and about me descriptions, return the entire text as a single suggestion
      let summary = generatedText.trim();
      // Remove common prefixes that Gemini might add
      summary = summary.replace(/^(About\s*Me:|Summary:|Professional Summary:|Personal Summary:)/i, '').trim();
      // Optionally, limit to 2-3 sentences (split by period)
      const sentences = summary.split('.').map(s => s.trim()).filter(Boolean);
      summary = sentences.slice(0, 3).join('. ');
      if (summary && !summary.endsWith('.')) summary += '.';
      suggestions = [summary];
    } else if (context === 'project_technologies') {
      // For project technologies, handle multiple possible formats
      let techText = generatedText;
      
      // Remove common prefixes/suffixes that AI might add
      techText = techText.replace(/^(Technologies used:|Tech stack:|Technologies:|Tools used:)/i, '').trim();
      techText = techText.replace(/^(and|also|additionally|furthermore|moreover)/i, '').trim();
      
      // Split by comma, semicolon, or newlines
      let technologies = techText
        .split(/[,;\n]/)
        .map(tech => tech.trim())
        .filter(tech => tech.length > 0 && tech.length < 50)
        .filter(tech => !tech.match(/^(and|also|additionally|furthermore|moreover)$/i));
      
      // If we got very few technologies, try splitting by different delimiters
      if (technologies.length < 3) {
        technologies = techText
          .split(/[,\s]+/)
          .map(tech => tech.trim())
          .filter(tech => tech.length > 0 && tech.length < 50)
          .filter(tech => !tech.match(/^(and|also|additionally|furthermore|moreover)$/i));
      }
      
      suggestions = technologies.slice(0, 8); // Limit to 8 technologies
      
      console.log('Project technologies processing debug:', {
        originalText: generatedText,
        cleanedText: techText,
        technologiesFound: technologies.length,
        finalSuggestions: suggestions
      });
    } else {
      // For other contexts, split by newlines and clean them
      suggestions = generatedText
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0 && line.length < 150)
        .slice(0, 3);
    }

    console.log('Processed suggestions:', suggestions);
    console.log('Number of suggestions:', suggestions.length);

    // If AI didn't generate enough suggestions, return what we got
    if (suggestions.length === 0) {
      return res.status(500).json({ 
        error: 'AI generated no suggestions. Please try again.',
        suggestions: []
      });
    }

    res.json({ suggestions });
  } catch (error) {
    console.error('AI suggestion error:', error);
    
    // Return specific error messages based on the type of error
    if (error.response) {
      // API responded with error status
      const status = error.response.status;
      const data = error.response.data;
      
      console.error('Gemini API Error Details:', {
        status,
        data,
        headers: error.response.headers
      });
      
      if (status === 401) {
        return res.status(401).json({ 
          error: 'Invalid Gemini API key. Please check your API key.' 
        });
      } else if (status === 429) {
        return res.status(429).json({ 
          error: 'Rate limit exceeded. Please try again later.' 
        });
      } else if (status === 400) {
        return res.status(400).json({ 
          error: `Gemini API error: ${data.error?.message || data.error || 'Bad request - check parameters'}` 
        });
      } else {
        return res.status(status).json({ 
          error: `Gemini API error: ${data.error?.message || data.error || 'Unknown error'}` 
        });
      }
    } else if (error.request) {
      // Network error or timeout
      if (error.code === 'ECONNABORTED') {
        return res.status(408).json({ 
          error: 'Request to Gemini API timed out. Please try again.' 
        });
      } else {
        return res.status(503).json({ 
          error: 'Unable to connect to Gemini API. Please check your internet connection.' 
        });
      }
    } else {
      // Other error
      return res.status(500).json({ 
        error: 'Failed to generate AI suggestions. Please try again.' 
      });
    }
  }
});

module.exports = router; 