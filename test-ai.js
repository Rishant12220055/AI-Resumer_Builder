const axios = require('axios');

async function testAISkills() {
  try {
    console.log('Testing AI skills generation...');
    
    const response = await axios.post('http://localhost:5000/api/ai-suggest', {
      context: 'skills_suggestion',
      position: 'Software Engineer',
      industry: 'Technology'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Response status:', response.status);
    console.log('Response data:', response.data);
    console.log('Suggestions count:', response.data.suggestions?.length || 0);
    console.log('First few suggestions:', response.data.suggestions?.slice(0, 5) || []);
    
  } catch (error) {
    console.error('Error testing AI skills:', error.response?.data || error.message);
  }
}

testAISkills(); 