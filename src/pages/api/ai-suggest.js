import { pipeline } from '@xenova/transformers';

// Cache for the model to avoid reloading
let textGenerator = null;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { company, position, duration, context } = req.body;

    if (!company || !position) {
      return res.status(400).json({ error: 'Company and position are required' });
    }

    // Create a detailed prompt for the AI model
    const prompt = `Generate 3 professional resume bullet points for a ${position} position at ${company}${duration ? ` from ${duration}` : ''}. 

Requirements:
- Each bullet point should start with a strong action verb
- Include specific achievements or responsibilities
- Be concise and impactful (max 120 characters each)
- Focus on quantifiable results when possible
- Make them relevant to the position and company

Context: ${context || 'General professional experience'}

Format: Return only the 3 bullet points, one per line, without numbering or extra formatting.

Example format:
Developed and maintained React applications, improving system performance by 30%
Led cross-functional teams to deliver high-impact projects, increasing user satisfaction by 25%
Implemented automated testing and CI/CD pipelines, reducing deployment time by 60%`;

    // Initialize the AI model if not already loaded
    if (!textGenerator) {
      console.log('Loading AI model...');
      textGenerator = await pipeline('text-generation', 'microsoft/DialoGPT-medium');
      console.log('AI model loaded successfully');
    }

    // Generate AI suggestions
    const result = await textGenerator(prompt, {
      max_length: 200,
      temperature: 0.7,
      do_sample: true,
      top_p: 0.9,
      num_return_sequences: 1
    });

    // Extract and clean the generated text
    let generatedText = result[0].generated_text;
    
    // Remove the original prompt from the response
    generatedText = generatedText.replace(prompt, '').trim();
    
    // Split into individual bullet points and clean them
    const suggestions = generatedText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0 && line.length < 150)
      .slice(0, 3);

    // If AI didn't generate enough suggestions, fall back to smart templates
    if (suggestions.length < 3) {
      const fallbackSuggestions = generateFallbackSuggestions(company, position, duration, context);
      suggestions.push(...fallbackSuggestions.slice(suggestions.length));
    }

    res.status(200).json({ suggestions });
  } catch (error) {
    console.error('AI suggestion error:', error);
    
    // Fallback to template-based suggestions if AI fails
    try {
      const { company, position, duration, context } = req.body;
      const fallbackSuggestions = generateFallbackSuggestions(company, position, duration, context);
      res.status(200).json({ suggestions: fallbackSuggestions });
    } catch (fallbackError) {
      res.status(500).json({ error: 'Failed to generate AI suggestions' });
    }
  }
}

function generateFallbackSuggestions(company, position, duration, context) {
  // Fallback template-based suggestions
  const actionVerbs = [
    'Developed', 'Implemented', 'Managed', 'Led', 'Created', 'Designed',
    'Optimized', 'Streamlined', 'Coordinated', 'Facilitated', 'Delivered',
    'Improved', 'Established', 'Maintained', 'Enhanced', 'Generated'
  ];

  const metrics = [
    'by 25%', 'by 30%', 'by 40%', 'by 50%', 'by 60%',
    'for 100+ users', 'for 500+ customers', 'for 1000+ users',
    'reducing costs by 20%', 'increasing efficiency by 35%'
  ];

  const technologies = [
    'React', 'Node.js', 'Python', 'JavaScript', 'TypeScript',
    'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes',
    'SQL', 'MongoDB', 'PostgreSQL', 'Redis', 'Elasticsearch'
  ];

  const randomVerb = actionVerbs[Math.floor(Math.random() * actionVerbs.length)];
  const randomMetric = metrics[Math.floor(Math.random() * metrics.length)];
  const randomTech = technologies[Math.floor(Math.random() * technologies.length)];

  const suggestions = [
    `${randomVerb} and maintained ${randomTech} applications, improving system performance ${randomMetric}`,
    `Led cross-functional teams to deliver high-impact projects, resulting in ${randomMetric} improvement in user satisfaction`,
    `Collaborated with stakeholders to identify and implement process improvements, reducing operational costs ${randomMetric}`
  ];

  // Customize based on position
  if (position.toLowerCase().includes('manager') || position.toLowerCase().includes('lead')) {
    suggestions[0] = `Managed a team of 5+ developers, leading successful delivery of 10+ projects within deadlines`;
    suggestions[1] = `Established best practices and coding standards, improving team productivity by 40%`;
    suggestions[2] = `Mentored junior developers and conducted technical interviews, building a high-performing team`;
  } else if (position.toLowerCase().includes('developer') || position.toLowerCase().includes('engineer')) {
    suggestions[0] = `Developed and maintained ${randomTech} applications, improving system performance ${randomMetric}`;
    suggestions[1] = `Collaborated with cross-functional teams to deliver user-centric solutions, increasing user engagement by 35%`;
    suggestions[2] = `Implemented automated testing and CI/CD pipelines, reducing deployment time by 60%`;
  } else if (position.toLowerCase().includes('designer')) {
    suggestions[0] = `Designed user interfaces and user experiences for web and mobile applications, improving user satisfaction by 45%`;
    suggestions[1] = `Created design systems and component libraries, ensuring consistency across 20+ products`;
    suggestions[2] = `Conducted user research and usability testing, leading to 30% improvement in conversion rates`;
  }

  return suggestions;
} 